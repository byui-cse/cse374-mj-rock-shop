# Bearer Token Implementation Task List

## Scope

Implement a small, classroom-only bearer-token authorization scheme for the MJ Rock Shop API.

The implementation will protect `GET /api/orders/{order_id}` with a staff role while keeping the current public catalog, checkout, and contact workflows unchanged.

No automated API tests will be added as part of this work. Students will add testing later as a separate assignment.

No changes to `cse374-course/docs/week9/reading9.html` are planned. The Week 9 reading is fixed course material for this work.

## Proposed classroom credentials

| Token | Role | Use |
| --- | --- | --- |
| `student-demo-token` | student | Valid token with no staff-only access. |
| `staff-demo-token` | staff | Valid token for protected order retrieval. |

These are fictional demonstration values, not secrets.

## Milestone 1: Define the authentication contract

**Goal:** Establish the behavior and vocabulary before changing the API.

- [x] Confirm the protected endpoint: `GET /api/orders/{order_id}`.
- [x] Confirm the public endpoint list remains unchanged.
- [x] Define the accepted header format: `Authorization: Bearer <token>`.
- [x] Define the supported roles: `student` and `staff`.
- [x] Define the `401` and `403` status-code rules.
- [x] Define the error codes:
  - [x] `authentication_required` for a missing header.
  - [x] `invalid_authentication` for a malformed or unknown token.
  - [x] `forbidden` for a valid token without the required role.
- [x] Confirm that authorization occurs before protected-record lookup.

**Status: Complete.** The token values, roles, protected resource, public endpoint scope, status codes, error codes, and authorization order are defined above. This contract was completed before application implementation began.

## Milestone 2: Add the authentication module

**Goal:** Isolate token parsing and role resolution from route functions.

- [x] Add a focused authentication module under `backend/app/`.
- [x] Define the fictional token-to-role mapping.
- [x] Define a small authenticated-principal representation.
- [x] Parse the `Authorization` header.
- [x] Require the `Bearer` scheme.
- [x] Reject a missing header with the project’s standard `401` error.
- [x] Reject malformed headers with the project’s standard `401` error.
- [x] Reject unknown tokens with the project’s standard `401` error.
- [x] Avoid logging or echoing the complete authorization header.
- [x] Keep tokens out of SQLite and other persistent storage.

**Status: Complete.** `backend/app/authentication.py` now contains reusable, isolated, deterministic classroom authentication primitives. Route integration and role enforcement remain scheduled for Milestone 3.

## Milestone 3: Add reusable FastAPI authorization dependencies

**Goal:** Provide a clean way for routes to require authentication or a particular role.

- [x] Add a dependency that returns a principal for any valid token.
- [x] Add a dependency that requires the `staff` role.
- [x] Return `403 Forbidden` when a valid student token accesses a staff-only resource.
- [x] Keep authentication and role checks out of individual route bodies.
- [x] Preserve the existing shared error-response format from `backend/app/api/errors.py`.

**Status: Complete.** `backend/app/authentication.py` now provides reusable FastAPI dependencies for valid-token authentication and staff-role authorization. Endpoint protection remains scheduled for Milestone 4.

## Milestone 4: Protect order retrieval

**Goal:** Apply authorization to the selected endpoint without changing its successful response contract.

- [x] Add the staff dependency to `GET /api/orders/{order_id}`.
- [x] Confirm a valid staff token can retrieve an existing order.
- [x] Confirm a missing token receives `401`.
- [x] Confirm a malformed or unknown token receives `401`.
- [x] Confirm a valid student token receives `403`.
- [x] Confirm an authorized request for an unknown order still receives `404` with `order_not_found`.
- [x] Confirm the response still excludes customer payment data and complete card numbers.
- [x] Confirm public catalog, quote, order-creation, and contact workflows do not require a token.

**Status: Complete by implementation review.** `GET /api/orders/{order_id}` now declares the reusable staff dependency. The existing route body and response model are unchanged, so authorized lookup behavior and the public endpoint scope are preserved. Runtime verification remains part of Milestone 7.

## Milestone 5: Add OpenAPI documentation support

**Goal:** Make the bearer-token contract visible in the interactive API documentation.

- [x] Define an HTTP bearer security scheme in the FastAPI application metadata.
- [x] Mark the protected order endpoint as requiring bearer authentication.
- [x] Confirm the `/docs` metadata is configured to display the security scheme.
- [x] Confirm the endpoint metadata identifies the protected operation.
- [x] Document the expected `401`, `403`, and `404` responses where practical.

**Status: Complete by implementation review.** The generated OpenAPI document now includes a `bearerAuth` HTTP security scheme, marks order retrieval as protected, and documents its expected authentication, authorization, and not-found responses. Runtime `/docs` verification remains part of Milestone 7 review.

## Milestone 6: Update project documentation

**Goal:** Explain how students should use the classroom authorization feature safely.

- [x] Update the root `README.md` with the protected endpoint and fictional tokens.
- [x] Update `backend/README.md` with:
  - [x] Header examples.
  - [x] Token roles.
  - [x] Expected `401` and `403` behavior.
  - [x] An order-retrieval example.
  - [x] `/docs` instructions.
- [x] Update `STUDENT_GUIDE.md` with the classroom-only scope and safety limits.
- [x] Update `ARCHITECTURE.md` to show authentication before the protected route reaches order lookup.
- [x] State that no Week 9 reading changes are planned.
- [x] State that no real credentials or external identity provider are involved.

**Status: Complete.** The project README, backend README, Student Guide, and Architecture document now explain the classroom tokens, protected endpoint, header format, access-control responses, OpenAPI documentation, and safety limits. No Week 9 reading changes are planned.

## Milestone 7: Manual verification and release review

**Goal:** Verify the feature without adding automated tests to the application.

- [ ] Start the API using the documented command.
- [ ] Confirm `/api/health` remains public.
- [ ] Confirm product catalog requests remain public.
- [ ] Create a fictional order through the existing flow.
- [ ] Retrieve the order without a token and record the `401` result.
- [ ] Retrieve the order with `student-demo-token` and record the `403` result.
- [ ] Retrieve the order with `staff-demo-token` and record the successful result.
- [ ] Try an unknown token and record the `401` result.
- [ ] Try a malformed authorization header and record the `401` result.
- [ ] Retrieve an unknown order with the staff token and record the `404` result.
- [ ] Confirm no complete card number appears in the response, database, or normal application logs.
- [ ] Confirm the browser’s public catalog and checkout flow still work without a token.
- [ ] Review the change for accidental scope expansion.

**Milestone complete when:** Manual evidence shows the intended access-control behavior and no regression in public functionality.

## Final definition of done

- [ ] A reusable bearer-token authentication module exists.
- [ ] Student and staff classroom tokens are defined and documented.
- [ ] `GET /api/orders/{order_id}` requires the staff role.
- [ ] Missing and invalid credentials return `401`.
- [ ] A valid student token returns `403` on the staff-only endpoint.
- [ ] A valid staff token can retrieve an existing order.
- [ ] Authorized unknown-order requests still return the existing `404` behavior.
- [ ] Public catalog, quote, order-creation, and contact workflows remain public.
- [ ] OpenAPI documentation identifies the bearer scheme and protected endpoint.
- [ ] Project documentation explains safe classroom use.
- [ ] No automated API tests were added in this implementation.
- [ ] No changes were made to the Week 9 reading.

## Explicitly out of scope

- Adding automated API tests.
- Adding a login page or customer accounts.
- Adding password hashing, token expiration, refresh tokens, or token revocation.
- Connecting to an external identity provider.
- Storing tokens or user credentials in SQLite.
- Protecting every endpoint.
- Adding real staff administration capabilities.
- Editing `cse374-course/docs/week9/reading9.html`.
