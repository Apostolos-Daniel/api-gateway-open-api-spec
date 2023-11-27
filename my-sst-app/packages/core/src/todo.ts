export * as Todo from "./todo";
import { z } from "zod";
import crypto from "crypto";
import { generateSchema } from '@anatine/zod-openapi';
import fs from "fs";

import { event } from "./event";

export const Events = {
  Created: event("todo.created", {
    id: z.string(),
    date: z.date(),
  }),
};

export async function create() {
  const id = crypto.randomUUID();
  // write to database

  await Events.Created.publish({
    id,
    date: new Date(),
  });
}

export function list() {
  return Array(50)
    .fill(0)
    .map((_, index) => ({
      id: crypto.randomUUID(),
      title: "Todo #" + index,
    }));
}


const Todo = z.object({
  id: z.string(),
  date: z.date(),
});

Todo.parse({ 
  id: crypto.randomUUID(),
date: new Date() });

// extract the inferred type
type Todo = z.infer<typeof Todo>;
// { id: string }
const myOpenApiSchema = generateSchema(Todo);
// get the OpenAPI schema from API Gateway using the AWS SDK

console.log(myOpenApiSchema);
// write output to file
fs.writeFileSync("./todo.json", JSON.stringify(myOpenApiSchema, null, 2));
