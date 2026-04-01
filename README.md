# ECommerce API

A production-ready ASP.NET Core 8 REST API for e-commerce management, built with Clean Architecture.

## Architecture

The solution follows Clean Architecture with four layers:

| Layer | Project | Responsibility |
|---|---|---|
| **Domain** | `ECommerce.Domain` | Entities, enums, and domain logic |
| **Application** | `ECommerce.Application` | Services, interfaces, DTOs, validators |
| **Infrastructure** | `ECommerce.Infrastructure` | EF Core DbContext, repositories, external services |
| **API** | `ECommerce.Api` | Controllers, middleware, Swagger, composition root |

Key patterns and libraries:
- **CQRS-style** services with result pattern for error handling
- **FluentValidation** for request validation
- **BCrypt** for password hashing
- **JWT Bearer** authentication with refresh tokens
- **Serilog** for structured logging
- **Swagger/OpenAPI** for API documentation

## Prerequisites

- .NET 8 SDK
- SQL Server (local or Docker)

## Running Locally

### 1. Configure the database

Update `src/ECommerce.Api/appsettings.json` with your SQL Server connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=ECommerceDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
  }
}
```

### 2. Apply migrations

```bash
dotnet ef database update --project src/ECommerce.Infrastructure --startup-project src/ECommerce.Api
```

### 3. Run the API

```bash
dotnet run --project src/ECommerce.Api
```

The API starts at `http://localhost:5000` (or the configured port). On first run, the database is seeded with an admin account and sample data.

## Authentication & Authorization

### Authentication

The API uses JWT Bearer tokens. Obtain tokens via the `/api/auth/register` or `/api/auth/login` endpoints.

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePass123!","firstName":"John","lastName":"Doe"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePass123!"}'
```

### Roles

| Role | Permissions |
|---|---|
| **Admin** | Full access — create, update, delete products and categories |
| **User** | Read-only access to products and categories |

Include the token in the `Authorization` header:

```
Authorization: Bearer <your-token>
```

### Default Admin Account

Seeded on first run:

| Email | Password | Role |
|---|---|---|
| `admin@ecommerce.com` | `Admin@123` | Admin |

## Swagger

Swagger UI is available at the root URL when running in Development mode. It includes:
- Interactive endpoint documentation with descriptions and examples
- JWT authentication via the "Authorize" button (enter `Bearer <token>`)
- Request/response schemas and sample values

## Docker

### Build and run with Docker Compose

```bash
docker compose up --build
```

This starts:
- **API** on `http://localhost:8080`
- **SQL Server** on `localhost:1433`

The database is persisted via a named volume. The API waits for the database to be healthy before starting.

### Build the image only

```bash
docker build -t ecommerce-api .
docker run -p 8080:8080 ecommerce-api
```

## Health Checks

| Endpoint | Description |
|---|---|
| `/health` | Overall application health |
| `/health/ready` | Readiness check (database connectivity) |

## Running Tests

```bash
dotnet test
```

## CI

A GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push and pull request to `main`/`master`. It restores dependencies, builds the solution, and runs all tests.
