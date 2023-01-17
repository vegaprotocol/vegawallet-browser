import { z } from 'zod'

export type Wallet = z.infer<typeof WalletSchema>

export const WalletSchema = z
  .object({
    name: z.string(),
  })
  .required()
