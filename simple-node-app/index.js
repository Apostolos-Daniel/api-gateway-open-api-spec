const { extendApi, generateSchema } = require('@anatine/zod-openapi');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

const { z } = require('zod');

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  age: z.number().optional()
});

const myOpenApiSchema = generateSchema(userSchema);

const extendedMyOpenApiSchema = extendApi(myOpenApiSchema, {
  title: 'User API',
  description: 'User API',
  version: '1.0.0',
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local server'
    }
  ]
});
console.log(myOpenApiSchema);
// write to file
const fs = require('fs');
fs.writeFileSync('./user-schema.json', JSON.stringify(myOpenApiSchema));

app.post('/users/validated', (req, res) => {
    try {
      const validatedData = userSchema.parse(req.body);
      // Handle validated data
      res.status(200).send(validatedData);
    } catch (error) {
      res.status(400).send(error.errors);
    }
  });

  app.post('/users/not-validated', (req, res) => {
    try {
      // Handle data
      res.status(200).send(req.body);
    } catch (error) {
      res.status(400).send(error.errors);
    }
  });
  