import merge from 'lodash/merge'
import type { PartialDeep } from 'type-fest'
import { VegaAsset, VegaAssetStatus } from '../types/rest-api.ts'

export function generateAsset(override?: PartialDeep<VegaAsset>): VegaAsset {
  const defaultAsset: VegaAsset = {
    id: 'fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55',
    details: {
      name: 'Vega (fairground)',
      symbol: 'VEGA',
      decimals: '18',
      quantum: '1',
      erc20: {
        contractAddress: '0xdf1B0F223cb8c7aB3Ef8469e529fe81E73089BD9',
        lifetimeLimit: '0',
        withdrawThreshold: '0'
      }
    },
    status: VegaAssetStatus.ENABLED
  }
  return merge(defaultAsset, override)
}
