import { z } from 'zod'

export type Connection = z.infer<typeof ConnectionSchema>

export const ConnectionSchema = z
  .object({
    wallet: z.string(),
    origin: z.string(),
    permissions: z.object({
      publicKeys: z.object({
        access: z.enum(['read', 'none']),
        allowedKeys: z.array(z.string()),
      }),
    }),
  })
  .required()
