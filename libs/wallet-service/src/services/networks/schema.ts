import { z } from 'zod'

export const ConfigSchema = z
  .object({
    Name: z.string(),
    Level: z.string().optional(),
    Host: z.string(),
    Port: z.number(),
    TokenExpiry: z.string().optional(),
    API: z
      .object({
        GRPC: z
          .object({
            Hosts: z.array(z.string().url()),
            Retries: z.number().optional(),
          })
          .required(),
        GraphQL: z
          .object({
            Hosts: z.array(z.string().url()),
          })
          .required(),
        REST: z
          .object({
            Hosts: z.array(z.string().url()),
          })
          .required(),
      })
      .required(),
  })
  .required()
