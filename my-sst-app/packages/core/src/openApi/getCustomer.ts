import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { Customer } from "../types/customer";

extendZodWithOpenApi(z);

export const GetCustomer = Customer.omit({
  appId: true,
});

export type GetCustomer = z.infer<typeof GetCustomer>;