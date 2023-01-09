import { z } from 'zod'

export const ConfigSchema = z
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
