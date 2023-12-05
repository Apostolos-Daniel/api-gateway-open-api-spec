import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { Customer } from "../types/customer";

extendZodWithOpenApi(z);

export const GetCustomerQueryParams = Customer.pick({ phoneNumber: true });

export type GetCustomerQueryParams = z.infer<typeof GetCustomerQueryParams>;