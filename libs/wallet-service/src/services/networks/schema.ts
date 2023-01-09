import { z } from 'zod'

export const ConfigSchema = z
  .object({
    Name: z.string(),
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
