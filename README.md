# FXQL API Documentation

## Table of Contents

1. [Setup Instructions](#setup-instructions)
2. [API Documentation](#api-documentation)
   - [Endpoints](#endpoints)
   - [Swagger Documentation](#swagger-documentation)
3. [Assumptions and Design Decisions](#assumptions-and-design-decisions)
4. [Local Development Requirements](#local-development-requirements)
5. [Environmental Variables](#environmental-variables)
6. [Example Request and Response](#example-request-and-response)

---

## Setup Instructions

Follow these steps to set up the project locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/fxql-api.git
   cd fxql-api
   ```
2. **Install dependencies**: Ensure you have Node.js (v18 or later) and Yarn installed.
   ```bash
   yarn install
   ```
3. **Set up environment variables**: Create a `.env` file in the root directory and configure it based on the [Environmental Variables](#environmental-variables) section.

4. **Run migrations**: Apply database migrations to set up the schema.
   ```bash
   yarn migration:run
   ```
5. **Start the development server**:
   ```bash
   yarn start:prod
   ```
6. **Docker Deployment (Optional)**: There is an option to deploy using Docker. A docker-compose.yml file is provided to simplify deployment..
   ```bash
   docker-compose up
   ```

---

## API Documentation

```bash
  https://ios-api.optimusai.ai/api
```

### Endpoints

#### Health Check

**GET** `/api/v1/health`

- **Operation ID**: `AppController_health`
- **Parameters**: None
- **Responses**:
  - `200`: Indicates the server is healthy.

#### Debug Sentry

**GET** `/api/v1/debug-sentry`

- **Operation ID**: `AppController_getError`
- **Parameters**: None
- **Responses**:
  - `200`: Debug information sent successfully.

#### FX Bulk Creation

**POST** `/api/v1/fx`

- **Operation ID**: `FxController_create`
- **Parameters**: None
- **Request Body**:
  - **Required**: Yes
  - **Content Type**: `application/json`
  - **Schema**:
    ```json
    {
    "FXQL": "USD-GBP {
    BUY 0.85
    SELL 0.90
    CAP 10000
    }
    ```

EUR-JPY {
BUY 145.20
SELL 146.50
CAP 50000
}

NGN-USD {
BUY 0.0022
SELL 0.0023
CAP 2000000
}"
}

````

- **Responses**:
  - `200`: The list of FX bulk entries was successfully retrieved.

### Swagger Documentation

The API has Swagger documentation implemented for interactive exploration and testing. After starting the application, visit:

- **Swagger URL**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

You can view the API's OpenAPI 3.0 specification and test endpoints directly through the Swagger UI.

---

## Assumptions and Design Decisions

### Data Models

- The FX data is modeled with a hierarchical structure to handle bulk operations.
- A specialized FXQL string format is used for bulk input, making it flexible for various scenarios.

### Error Handling

- Errors are logged to a connected Sentry instance for easier debugging and monitoring.

### Scalability

- The API is designed to handle high-volume FX data with efficient schema designs and indexing.

### Validation Layer

- Peggy.js was used for the validation layer.

---

## Local Development Requirements

### Prerequisites

- **Node.js**: Version 18 or later
- **Yarn**: Package manager
- **PostgreSQL**: As the primary database

### Installation

Ensure you have the required software installed. PostgreSQL must be running locally or accessible via a configured host.

---

## Environmental Variables

The application requires the following environment variables to function:

| Variable            | Description                         | Example                             |
| ------------------- | ----------------------------------- | ----------------------------------- |
| `ENV`               | Application environment             | `production`, `development`         |
| `DATABASE_HOST`     | Hostname of the PostgreSQL database | `localhost`                         |
| `DATABASE_PORT`     | Port number of the PostgreSQL       | `5432`                              |
| `DATABASE_USER`     | Username for the database           | `postgres`                          |
| `DATABASE_PASSWORD` | Password for the database           | `password`                          |
| `DATABASE_NAME`     | Name of the database                | `fxql_api`                          |
| `SENTRY_DSN`        | Sentry DSN for error logging        | `https://<key>@sentry.io/<project>` |


### Example .env file

```env
ENV=development
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=fxql_api
SENTRY_DSN=https://<key>@sentry.io/<project>
JWT_SECRET=your-secret-key
````

---

## Example Request and Response

### Request

**POST** `/api/v1/fx`

**Body**:

```json
{
  "FXQL": "USD-GBP {
  BUY 0.85
  SELL 0.90
  CAP 10000
}

EUR-JPY {
  BUY 145.20
  SELL 146.50
  CAP 50000
}

NGN-USD {
  BUY 0.0022
  SELL 0.0023
  CAP 2000000
}"
}
```

### Response

```json
{
  "success": true,
  "message": "Success",
  "code": "FXQL-200",
  "returnStatus": "OK",
  "data": [
    {
      "entryId": 1,
      "sourceCurrency": "USD",
      "destinationCurrency": "GBP",
      "sellPrice": 0.9,
      "buyPrice": 0.85,
      "capAmount": 10000,
      "createdAt": "2024-11-20T21:26:03.431Z",
      "updatedAt": "2024-11-20T21:26:20.116Z"
    }
  ]
}
```

For more details or support, contact the API team.
