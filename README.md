# api-gateway-open-api-spec
An example of generating open api specs from API Gateway and types.

This repo has two apps:

- `simple-node-app` - a simple node app that is used to generate the open api spec using `@anatine/zod-openapi`
- `my-sst-app` - the app that is deployed to AWS

I started with the `simple-node-app` to demonstrate how to generate the open api spec from a zod schema. I then used this to generate the open api spec for the `my-sst-app` app.

## Simple node app

This is a simple node app that has three endpoints:

1. `/` that returns a `Server running on http://localhost:${port}` message
2. `/users/validated` that returns a single user (simply returning the user we have given it, for demo purposes)
2. `/users/not-validated` that returns a single user (simply returning the user we have given it, for demo purposes)

The `/users` endpoint uses `zod` to define a schema for the user type:

```js
const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  age: z.number().optional()
});
```

When the endpoint is called, it validates the request body against the schema before it returns the validated data to the user:

```js
const user = userSchema.parse(req.body);
```

The key thing here is that it uses the `zod` schema and `@anatine/zod-openapi` to generate the open api spec:

```js
const myOpenApiSchema = generateSchema(userSchema);
```

This node app has purposefully kept simple for demonstration purposes. Simply run the node app to see the open api spec:

```bash
cd simple-node-app
node index.js
```

Hit the users "validated" `POST` endpoint:

```bash
curl -X POST http://localhost:3000/users/validated
```

This will fail validation as we are not passing any data, although the endpoint is expecting some data. You'll get a response like below:

```json
[
    {"code":"invalid_type","expected":"string","received":"undefined","path":["name"],"message":"Required"},
    {"code":"invalid_type","expected":"string","received":"undefined","path":["email"],"message":"Required"}
]
```

Which is what we want: `name` and `email` are required fields in the schema, so the validation fails.

```ts
const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  age: z.number().optional()
});
```

Pass the user schema data to the endpoint and see what happens:

```bash
curl -X POST http://localhost:3000/users/validated / 
-H "Content-Type: application/json" /
 -d '{"name": "John", "email": "john@example.com", "age": 30}'
```

The API call succeeds and returns what we expect:

```json
{"name":"John","email":"john@example.com","age":30}
```

Going back to the first call with the validation, let's try calling the endpoint without any validation and passing no data:

```bash
curl -X POST http://localhost:3000/users/not-validated
```

The API call succeeds and simply returns the data we passed in (i.e. no data):

```json
{}
```

This is ok but as a user of the API, I don't know if I need to pass any data to the endpoint or not.

So, validation is useful in this case. However, we don't want to have to write the same schema twice: once for the validation and once for the open api spec. We can use [`@anatine/zod-openapi`](https://www.npmjs.com/package/@anatine/zod-openapi) to generate the open api spec from the schema:

```js
const myOpenApiSchema = generateSchema(userSchema);
console.log(myOpenApiSchema);
// write to file
const fs = require('fs');
fs.writeFileSync('./user-schema.json', JSON.stringify(myOpenApiSchema));
```

Which generates an "open api schema object" that looks like this:

```json
{
    "type": "object",
    "properties": {
        "name": {
            "type": "string"
        },
        "email": {
            "type": "string",
            "format": "email"
        },
        "age": {
            "type": "number"
        }
    },
    "required": [
        "name",
        "email"
    ]
}
```

But this lacks cricital elements of an open api spec, such as the `title` and `description` of the schema, the endpoints, etc. So, we can use the `generateOpenApiSpec` function to generate the full open api spec:

```js
const myOpenApiSpec = generateOpenApiSpec({
  title: 'User API',
  description: 'A simple API to demonstrate how to generate an open api spec from a zod schema',
  version: '1.0.0',
  schema: userSchema,
  endpoints: [
    {
      method: 'post',
      path: '/users/validated',
      requestBody: {
        content: {
          'application/json': {
            schema: myOpenApiSchema
          }
        }
      },
      responses: {
        200: {
          description: 'Success',
          content: {
            'application/json': {
              schema: myOpenApiSchema
            }
          }
        }
      }
    },
    {
      method: 'post',
      path: '/users/not-validated',
      responses: {
        200: {
          description: 'Success',
          content: {
            'application/json': {
              schema: myOpenApiSchema
            }
          }
        }
      }
    }
  ]
});
```

There is a better way to do generate the full open api spec, and that's by using `@asteasolutions/zod-to-openapi`. This was out of scope for my exploration but I have implemented for the `my-sst-app` app, which is more involved and deployed to AWS using `sst`.

## SST app

To run the sst app, from root, run:
    
```bash
cd my-sst-app
pnpm install
pnpm dev
```

*Note*: this will take a while the first time and you will need to be logged into AWS from your terminal.

This will deploy the app to AWS and you will see the API Gateway endpoint in the terminal:

```bash
Outputs:
MySstAppStack.MySstAppApiEndpoint = https://xxxxxxxxxx.execute-api.eu-west-2.amazonaws.com/
```

In this example, we use the concept of a `Customer` and use a simple `GET customers` endpoint to return a single customer, for demo purposes.

In summary, an API spec is created for the customer endpoint by using a combination of:

1. `@asteasolutions/zod-to-openapi`: extending the `zod` types with open api spec annotations (type, description) and to generate the open api spec from the zod schema
2.  `openapi-typescript-codegen`: used to generate the typescript types from the open api spec.
3.  The types are then used in interation tests to validate the API spec.

I like this approach for three reasons:

1. The API spec is generated from the zod schema, so there is no duplication of types
2. However, the API spec is still intentional. As a developer of the API, I still need to make conscious decisions about the Interface and codify them for other developers to use
3. I get the chance to test this out with tests due to the auto-generated API types, so I am dogfooding my own API, API spec and validation


