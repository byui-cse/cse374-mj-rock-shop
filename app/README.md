# MJ's Rock Shop Prototype

This directory contains the browser-only prototype used as the baseline for the expanded application.

## Run locally

From the repository root, run:

```bash
python -m http.server 8080 --directory app
```

Then open <http://localhost:8080/> in a browser. Stop the server with `Ctrl+C`.

If `python` is not available on your system, try `python3` instead.

Serving the files locally is preferred to opening the HTML files directly because it matches the way the browser application will later communicate with an API.

For the API-backed catalog and product pages, start the backend separately from the repository root:

```bash
python -m uvicorn app.main:app --reload --app-dir backend
```

Run both servers before opening the frontend. The frontend uses port 8080 and the API uses port 8000.

## Prototype scope

- Catalog and product-detail data are loaded from the API on port 8000.
- Catalog search, filtering, sorting, and product-detail rendering use API requests.
- Checkout uses the API's quote and order endpoints with fictional payment data.
- Contact and interest submissions are fictional records stored through the local API.
- No payment, shipping, email, or other external service is contacted.
- Use fictional information only. Do not enter real personal or payment information.

## Baseline behavior

The expected prototype behavior is documented in [`BASELINE_BEHAVIOR.md`](BASELINE_BEHAVIOR.md).

