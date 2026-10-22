# Bearer Token Authorization Plan

## Purpose

Add a small, classroom-only bearer-token scheme to the MJ Rock Shop API so students can practice authentication, authorization, HTTP headers, and `401` versus `403` responses.

This feature is instructional only. It must not be presented as production authentication, and it must not require real accounts, passwords, external identity providers, or persistent credential storage.

## Proposed token roles

Use two fictional tokens with different permissions:

| Token | Role | Intended permissions |
| --- | --- | --- |
| `student-demo-token` | student | Read the public catalog and submit fictional contact or interest records. |
| `staff-demo-token` | staff | Perform student permissions plus retrieve protected order or contact records. |

The tokens may be represented as clearly named constants in a small authentication module. They should not be described as secrets. The code and documentation should repeatedly identify them as local classroom values.

## Protected endpoint

Protect `GET /api/orders/{order_id}` with the staff role.

This endpoint is a good teaching example because the application already returns a safe order confirmation and does not expose complete payment data. Students can create an order through the existing checkout flow, then use a bearer token to retrieve it.

Consider protecting `GET /api/contact-messages/{message_id}` only if that endpoint is added separately. If it is added, staff-only access should be used and the response should expose only fictional classroom data.

The following endpoints should remain public:

- `GET /api/health`
- `GET /api/products`
- `GET /api/products/{product_id}`
- `POST /api/orders/quote`
- `POST /api/orders`
- `POST /api/contact-messages`

Keeping the catalog and submission flows public preserves the current customer experience while making record retrieval a clear protected-resource example.

## Request behavior

Protected requests must use the standard header format:

```text
Authorization: Bearer staff-demo-token
```

Expected outcomes:

| Request condition | Status | Error code |
| --- | ---: | --- |
| Valid staff token | 200 | Not applicable |
| Missing `Authorization` header | 401 | `authentication_required` |
| Malformed header, such as `Basic ...` | 401 | `invalid_authentication` |
| Unknown or invalid bearer token | 401 | `invalid_authentication` |
| Valid student token on a staff-only endpoint | 403 | `forbidden` |
| Valid token with an unknown order ID | 404 | `order_not_found` |

The API should keep its existing error response shape:

```json
{
  "error": {
    "code": "authentication_required",
    "message": "A bearer token is required to access this resource.",
    "fields": []
  }
}
```

Authentication failures should not reveal whether a protected record exists. Authorization should be checked before the endpoint performs the order lookup.

## Implementation approach

1. Add a small authentication module under `backend/app/`.
   - Define the classroom token values and role names.
   - Parse the `Authorization` header.
   - Return a simple authenticated-principal object containing the role.
   - Raise the project’s existing HTTP error type or a small authentication exception that maps to the existing error format.

2. Add reusable FastAPI dependencies.
   - One dependency should require any valid token if that becomes useful later.
   - One dependency should require the `staff` role.
   - Keep token parsing and role checks out of route functions.

3. Apply the staff dependency to `GET /api/orders/{order_id}`.
   - Preserve the current successful response model.
   - Preserve the current `404` behavior after authorization succeeds.
   - Do not return customer payment data or complete card numbers.

4. Keep the existing public endpoints unchanged.
   - No browser login screen is needed.
   - The frontend does not need to send a token for its current public workflows.

5. Add API documentation.
   - Describe the bearer header and the two fictional tokens.
   - Include `401` and `403` examples.
   - State that the tokens are hard-coded classroom demonstrations, not secure credentials.
   - Include a `curl` or Postman example for retrieving an order.

6. Add OpenAPI metadata if practical.
   - Define an HTTP bearer security scheme in the FastAPI application metadata.
   - Mark the protected order endpoint as requiring that scheme.
   - Ensure the interactive `/docs` page makes the authorization header easy to discover.

## Suggested classroom examples

Students should be able to compare these requests:

```text
GET /api/orders/1
```

No token: expected `401`.

```text
Authorization: Bearer student-demo-token
```

Student token: expected `403`.

```text
Authorization: Bearer staff-demo-token
```

Staff token: expected `200` for an existing order or `404` for an unknown order.

These examples make authentication and authorization visibly different concepts.

## Documentation updates

Update the following documents after implementation:

- `README.md`: list the protected endpoint and classroom tokens.
- `backend/README.md`: document the header format, token roles, status codes, and `/docs` behavior.
- `STUDENT_GUIDE.md`: explain the instructional limits and safe use of fictional tokens.
- `ARCHITECTURE.md`: show authentication between the HTTP request and protected route.

No changes to `cse374-course/docs/week9/reading9.html` are planned. The reading is treated as fixed course material for this update. Any differences between its examples and the application should be handled through application documentation or student instructions, not by editing the reading.

## Security and scope limits

- Do not store tokens in SQLite.
- Do not accept real credentials.
- Do not log the complete `Authorization` header.
- Do not add password hashing, account creation, token expiration, refresh tokens, or an external identity provider.
- Do not require authentication for the public catalog or checkout flow unless a later assignment explicitly calls for it.
- Keep all values fictional and deterministic so students can reproduce each scenario.

## Acceptance criteria

- A request without a bearer token to the protected endpoint receives `401` with the standard error shape.
- A malformed or unknown bearer token receives `401` with a safe error message.
- `student-demo-token` receives `403` on the staff-only endpoint.
- `staff-demo-token` can retrieve an existing order.
- An authorized request for an unknown order still receives the existing `404` error.
- Public catalog, quote, order creation, and contact workflows continue to work without a token.
- Complete payment data is still absent from responses, storage, and logs.
- The OpenAPI documentation identifies the bearer security scheme and protected endpoint.
- The project documentation clearly labels the tokens as classroom-only examples.

## Out of scope for this change

- Adding automated API tests to the application.
- Changing the Week 9 reading or other course reading materials.
- Building a login page or customer-account system.
- Replacing the hard-coded classroom tokens with production authentication.
- Protecting every endpoint.
- Adding real staff administration features.
