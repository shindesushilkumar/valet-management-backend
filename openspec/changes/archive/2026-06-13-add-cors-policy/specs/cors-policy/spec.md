## ADDED Requirements

### Requirement: Backend exposes a configurable trusted-origin CORS policy
The system SHALL apply a centralized CORS policy to the NestJS HTTP API using the `cors` Node.js package. The allowed origins MUST be loaded from environment configuration and MUST be represented as a list of exact trusted origins.

#### Scenario: Request from a configured allowed origin
- **WHEN** a browser request includes an `Origin` header that exactly matches one configured trusted origin
- **THEN** the response includes CORS headers that allow that origin to access the API

#### Scenario: Request from an unconfigured origin
- **WHEN** a browser request includes an `Origin` header that does not match any configured trusted origin
- **THEN** the response does not include permissive CORS headers for that origin

### Requirement: CORS policy supports standard HTTP methods and request headers
The system SHALL allow browser clients to use common API methods and headers required by the existing HTTP API. The policy MUST include `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, and `OPTIONS` methods.

#### Scenario: Browser preflight for supported method and headers
- **WHEN** a browser sends an `OPTIONS` preflight request with a supported method and allowed request headers
- **THEN** the response includes CORS headers that permit the requested method and headers

### Requirement: Credentials are disabled unless explicitly configured
The system SHALL not include credentials in the CORS response by default. Credentials MUST be enabled only through explicit backend configuration for trusted environments that require cookie-based browser authentication.

#### Scenario: Default response excludes credential sharing
- **WHEN** a browser request is processed without credentials explicitly enabled
- **THEN** the CORS response does not allow credentials to be sent cross-origin

#### Scenario: Explicitly enabled credentials response
- **WHEN** backend configuration explicitly enables credentials for a trusted environment
- **THEN** the CORS response allows credentials only with the configured trusted origins
