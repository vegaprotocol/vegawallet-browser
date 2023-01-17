import { z } from 'zod'

const PermissionSchema = z.object({
  access: z.enum(['read', 'none']),
  allowedKeys: z.array(z.string()),
})

export type Connection = z.infer<typeof ConnectionSchema>

export const ConnectionSchema = z
  .object({
    token: z.string().length(64),
    origin: z.string().url(),
    wallet: z.string(),
    permissions: z
      .object({
        publicKeys: PermissionSchema,
      })
      .required(),
  })
  .required()
