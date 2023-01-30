import { z } from 'zod'

export type Wallet = z.infer<typeof WalletSchema>

export const WalletSchema = z
  .object({
    seed: z.array(z.number()),
    keys: z.array(
      z.object({
        index: z.number(),
        publicKey: z.string(),
        metadata: z.array(
          z.object({
            key: z.string(),
            value: z.string(),
          })
        ),
      })
    ),
  })
  .required()
