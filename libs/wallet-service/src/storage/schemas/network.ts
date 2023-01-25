import { z } from 'zod'

export type Network = z.infer<typeof NetworkSchema>

export const NetworkSchema = z
  .object({
    Name: z.string(),
    API: z
      .object({
        REST: z
          .object({
            Hosts: z.array(z.string().url()),
          })
          .required(),
      })
      .required(),
  })
  .required()
