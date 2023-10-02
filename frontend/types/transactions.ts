import { vegaPeggedReference } from '@vegaprotocol/rest-clients/dist/trading-data'

export interface PeggedOrderOptions {
  offset: string
  reference: vegaPeggedReference
}
