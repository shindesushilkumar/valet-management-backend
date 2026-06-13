## Why

Frontend clients and administrative tools need a controlled way to call the NestJS API from approved browser origins. Adding CORS through the `cors` Node.js package gives the backend an explicit, centralized policy instead of relying on accidental permissive behavior.

## What Changes

- Add the `cors` package as a backend dependency.
- Configure NestJS to apply a centralized CORS policy during application bootstrap.
- Load allowed origins from environment configuration so development, staging, and production can use different trusted origins.
- Keep credentials handling explicit and disabled unless a trusted origin requires authenticated cookie-based requests.

## Capabilities

### New Capabilities

- `cors-policy`: Cross-origin request policy for the HTTP API, including allowed origins, methods, headers, credentials behavior, and environment-specific configuration.

### Modified Capabilities

<!-- No existing spec-level requirements are changing. -->

## Impact

- Affected code: NestJS application bootstrap and backend configuration files.
- Dependencies: Add the `cors` package.
- APIs: Existing HTTP API behavior remains compatible; cross-origin browser access becomes controlled by the new policy.

## Non-goals

- This change does not add authentication, authorization, or token validation.
- This change does not expose any new API endpoints.
- This change does not configure reverse proxy, ingress, or firewall rules.
