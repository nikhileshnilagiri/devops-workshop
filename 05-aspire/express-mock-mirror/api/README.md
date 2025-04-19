# Express Mock Mirror API

This is a Express.js API that provides endpoints for managing mock data and simulating error responses for testing purposes.

## Usage

1. Install Dependencies
```
npm install
```
2. Run The Server
```
npm start
```

## Endpoints

* **POST /reflect**
    * Echoes back the payload sent in the request body, enabling developers to verify their data.

* **GET, DELETE /reflect/{key}**
    * Manages mock data with unique keys for CRUD operations.
        * **GET** retrieves mock data associated with the provided key.
        * **DELETE** removes mock data associated with the provided key.

* **GET /error**
    * Simulates HTTP error responses for testing error-handling in front-end applications.

* **GET /health**
    * Returns the service's overall health status.

# Logger

!!! The Logger functionality is not yet completed.

### Logger Usage
1. Import Logger

2. Instantiate a logger object
const logger = new Logger();

3. Invoke methods

### Logger Methods

```js
1. info(payload)

    params: payload string

    description: Logs Info Payload String
```

```js
2. error(payload)

    params: payload string

    description: Logs Error Payload String
```

```js
3. debug(payload)

    params: payload string

    description: Logs Debug Payload String
```