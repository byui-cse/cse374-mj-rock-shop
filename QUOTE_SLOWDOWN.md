# Quote Endpoint Slowdown Implementation Plan

## Objective

Add a variable delay to `POST /api/orders/quote` that simulates a slow external shipping service for the Week 11 individual performance assignment. A request should either wait and return its normal complete quote, or reach a hardcoded timeout cutoff and return an empty `204 No Content` response. The simulation is enabled by default for this classroom project.

## Current design

The route is `backend/app/api/routes.py` (`order_quote`). It creates a product repository and calls `OrderService.quote` from `backend/app/services/orders.py`. The service calls a `ShippingGateway`; the default `LocalShippingGateway` in `backend/app/adapters/local.py` immediately returns eligible options. The latency settings are hardcoded in `backend/app/quote_delay.py`.

## Implementation steps

### 1. Define hardcoded settings

- Keep `QUOTE_DELAY_ENABLED`, `QUOTE_DELAY_MIN_MS`, `QUOTE_DELAY_MAX_MS`, and `QUOTE_DELAY_CUTOFF_MS` as named constants in `backend/app/quote_delay.py`.
- Set the feature enabled by default and retain validation for the delay range and the 30-second upper bound.
- Remove environment parsing. Change values by editing the constants and restarting the API.

### 2. Add an injectable delay simulator

- Add a focused component under `backend/app/services/` to choose a delay in the configured range and compare it with the cutoff.
- Inject the random delay source and wait function so behavior can be checked without tests sleeping in real time.
- If the chosen delay is at or below the cutoff, wait for the chosen delay and continue to generate the quote.
- If the chosen delay is above the cutoff, wait only until the cutoff and report a timeout outcome. The request must not continue to calculate or return a quote after this outcome.
- Use an asynchronous wait for the delay so concurrent requests are not held up by a blocking sleep. Keep the synchronous repository/quote work in a worker thread if the route becomes asynchronous, and create/use its SQLite connection within that same worker to respect SQLite thread ownership.

### 3. Integrate only with the quote route

- Update only `order_quote` in `backend/app/api/routes.py` to consult the simulator when enabled.
- For an on-time result, preserve the existing call to `OrderService.quote` and its response model.
- For a timeout result, return a bare `Response(status_code=204)` with no body. Do not map this injected outcome to the existing `OrderServiceError` errors.
- Keep request validation in place. Invalid request bodies should continue to receive FastAPI's current validation response.
- Leave order creation, order retrieval, catalog, contact, and health behavior untouched.

### 4. Leave test creation to students

- Keep delay selection and waiting injectable so students can create focused checks without depending on long real sleeps.
- Do not include instructor-authored test files in the project; students create their own as part of the course exercises.

### 5. Document local use and assignment interpretation

- Update `backend/README.md` with each hardcoded constant, its default value, units, valid range, and how to change the values.
- Explain that a `204` is an intentional simulated timeout with no quote, not a successful quote result. The assignment's functional assertions should count it as a failed quote while performance results capture its bounded response time.
- If the Week 11 assignment instructions need setup guidance, add only the local configuration and interpretation needed to run this scenario.
- State that the generated timings illustrate a controlled classroom workload; they do not measure a real carrier or establish production capacity.

### 6. Review the completed change

- Confirm the simulation is enabled by default and that changing its enable constant can produce a no-delay baseline.
- Run focused checks during implementation and a local Postman comparison: baseline with the feature off, then a controlled assignment run with it on.
- Confirm the enabled run includes both complete slow quotes and cutoff `204` responses, and inspect latency percentiles, throughput, status codes, and assertion failures.
- Turn the setting off after collecting assignment evidence and confirm the normal quote response returns.

## Acceptance criteria

- The feature is enabled by default; its enabled flag, delay range, and cutoff are named constants in `backend/app/quote_delay.py`.
- A sampled delay at or below the cutoff produces the usual complete quote after the selected wait.
- A sampled delay above the cutoff produces an empty `204 No Content` response after waiting only to the cutoff.
- No quote calculation or response body is produced after the timeout outcome.
- Validation and existing quote errors remain intact; unrelated endpoints are unaffected.
- Delay bounds, cutoff, and invalid-setting behavior are documented and covered by focused checks.

## Execution status

**Implemented.** The quote-only simulator, hardcoded settings, timeout response, and README instructions are in place. The simulation defaults to enabled with a 100–2000 ms selected delay and a 750 ms cutoff. Focused checks passed during implementation; the test file was then removed so students can create their own tests.

The assignment's Postman baseline and workload comparison remain a local classroom activity. For a baseline, edit `QUOTE_DELAY_ENABLED` to `False`, restart and collect the baseline, then restore it to `True` for the assignment run.
