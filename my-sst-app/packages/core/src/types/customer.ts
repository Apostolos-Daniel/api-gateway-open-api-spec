import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);
export const Customer = z.object({
    appId: z.string()
    .openapi({
      description: "app id description",
      example: "123",
    }),
    customerId: z.string().uuid()
    .openapi({
      description: "customer id description",
      example: "123e4567-e89b-12d3-a456-426614174000",
    }),
    phoneNumber: z.string().openapi({ description: "phone number description", example: "1234567890" }),    
    loyaltyCardId: z.string().uuid()
    .openapi({
      description: "loyalty card id description",
      example: "123e4567-e89b-12d3-a456-426614174000",
    }),
  })
  
  export type Customer = z.infer<typeof Customer>