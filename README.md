# api-gateway-open-api-spec
An example of generating open api specs from API Gateway and types

Start with creating a simple hello world application [using sst](https://docs.sst.dev/start/standalone):

```bash
pnpm create sst my-sst-app
```

Then run the app:
    
```bash
cd my-sst-app
pnpm install
pnpm dev
```

This repo has two apps:

- `simple-node-app` - a simple node app that is used to generate the open api spec using `@anatine/zod-openapi`
- `my-sst-app` - the app that is deployed to AWS

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

Hit the users get endpoint:

```bash
curl -X POST http://localhost:3000/users/validated
```

This will fail validation as we are not passing any data, although the endpoint is expecting some data. You'll get a response like below:

```json
[{"code":"invalid_type","expected":"string","received":"undefined","path":["name"],"message":"Required"},{"code":"invalid_type","expected":"string","received":"undefined","path":["email"],"message":"Required"}]
```

Which is what we want: `name` and `email` are required fields in the schema, so the validation fails.

```bash
const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  age: z.number().optional()
});
```

Pass the user schema data to the endpoint and see what happens:

```bash
curl -X POST http://localhost:3000/users/validated -H "Content-Type: application/json" -d '{"name": "John", "email": "john@example.com", "age": 30}'
```

The API call succeeds and returns what we expect:

```json
"{"name":"John","email":"john@example.com","age":30}
```

Going back to the first call with the validation, let's try calling the endpoint without any validation:

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

## SST app


