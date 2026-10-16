# Student Guide

This repository is a working classroom template. It includes the application foundation through Milestone 8, but students are expected to add their own course exercises and quality checks.

## First steps

1. Install Python 3.11 or newer.
2. From the repository root, run `python -m pip install -e ./backend`.
3. Start the API with `python -m uvicorn app.main:app --reload --app-dir backend`.
4. Start the frontend with `python -m http.server 8080 --directory app`.
5. Open `http://localhost:8080/`.
6. Read [ARCHITECTURE.md](ARCHITECTURE.md) before changing a layer.

## Useful commands

Run from the repository root unless noted otherwise:

```bash
# Start the API
python -m uvicorn app.main:app --reload --app-dir backend

# Start the frontend
python -m http.server 8080 --directory app

# Reset and reseed SQLite; run this from backend/
python -m app.database
```

## Extension points

Students can extend the template by:

- adding API routes and request/response models;
- adding business rules in `backend/app/services/`;
- adding repository methods and database tables;
- replacing a local adapter with a controlled classroom double;
- adding browser behavior in `app/js/`;
- adding new deterministic catalog or scenario data; and
- adding course-specific checks, reports, and automation around the existing seams.

Keep business rules out of browser code and route handlers when they affect price, inventory, shipping, payment, or order creation.

## Deliberate limits

Use fictional names, addresses, email addresses, and payment values. Do not connect the application to real payment, email, shipping, authentication, or customer-account services. The local SQLite database is for classroom use and can be reset at any time.

