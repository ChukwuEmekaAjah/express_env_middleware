# Express Env Middleware

This middleware helps you set environment variables for your running server via a HTTP post request.

## Installation
```bash
npm install --save express-envset
```

```js
    const express = require('express');
    const app = express();
    const envMiddleware = require('express-envset');
    const ENV_AUTHKEY = "XEF729_dfj@#raf";
    app.use(envMiddleware(process.env.ENV_AUTHKEY || ENV_AUTHKEY))

```
## Testing
To test the module, run `npm test` on the command line of the project folder

## Usage
```js
    const express = require('express');
    const app = express();
    const envMiddleware = require('express-envset');
    const ENV_AUTHKEY = "XEF729_dfj@#raf";
    app.use(envMiddleware(process.env.ENV_AUTHKEY || ENV_AUTHKEY))

```

The environment variable middleware can also take an object as the only argument for its setup. The object has the following fields
- `authKey` (required): string representing the authentication string to prevent unauthorized access to the endpoint
- `url` (optional): the endpoint you want to use when updating environment variables via HTTP. It defaults to `/envset`

## Update an environment variable
In other to update an environment variable via HTTP, use the following steps:

- Set the `env_authkey` request header
- The request method should be `POST`
- The request body should be JSON and should contain an `env` field that has values of the object type e.g:
```js
    const requestBody = {
        "env":{
            "STRIPE_KEY": "str_ATfld37adfjlj"
        }
    }
```

The fully formed HTTP post request is
```bash
    curl -X POST --header "env_authkey: 123" -d '{"env":{"key1":"value1", "key2":"value2"}}' "http://www.myexpressapp.com/env/setup"
```








