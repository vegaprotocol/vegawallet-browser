import { TransferRequest } from '@vegaprotocol/protos/dist/vega/TransferRequest'
import { WebDriver } from 'selenium-webdriver'
import { VoteSubmission } from '@vegaprotocol/protos/dist/vega/commands/v1/VoteSubmission'
import { DelegateSubmission } from '@vegaprotocol/protos/dist/vega/commands/v1/DelegateSubmission'
interface Key {
  index: number
  name: string
  publicKey: string
}

export class VegaAPI {
  private driver: WebDriver

  constructor(driver: WebDriver) {
    this.driver = driver
  }

  async connectWallet() {
    return await this.driver.executeScript<string>(async () => {
      if (!window.vega) {
        throw new Error('Vega wallet not found')
      }
      const connectWallet = await window.vega.connectWallet()
      return connectWallet
    })
  }

  async getConnectedNetwork() {
    return await this.driver.executeScript<string>(async () => {
      if (!window.vega) {
        throw new Error('Vega wallet not found')
      }
      const { chainID } = await window.vega.getChainId()
      return chainID
    })
  }

  async listKeys() {
    const keysString = await this.driver.executeScript<string>(async () => {
      if (!window.vega) {
        throw new Error('Vega wallet not found')
      }
      const keys = await window.vega.listKeys()
      return JSON.stringify(keys)
    })

    const keysArray = JSON.parse(keysString).keys as Key[]

    return keysArray
  }

  private async sendTransaction(publicKey: string, transaction: any) {
    return await this.driver.executeScript<string>(
      async (publicKey: string, transaction: any) => {
        if (!window.vega) {
          throw new Error('Vega wallet not found')
        }
        const { chainID } = await window.vega.sendTransaction({
          sendingMode: 'TYPE_SYNC',
          publicKey: publicKey,
          transaction: transaction
        })
        return chainID
      },
      publicKey,
      transaction
    )
  }

  async sendTransferRequestTransaction(publicKey: string, transferRequest: TransferRequest) {
    const transfer = { transfer: transferRequest }
    return await this.sendTransaction(publicKey, transfer)
  }

  async sendVoteSubmissionTransaction(publicKey: string, vote: VoteSubmission) {
    const submission = { voteSubmission: vote }
    return await this.sendTransaction(publicKey, submission)
  }

  async sendDelegateStakeTransaction(publicKey: string, delegate: DelegateSubmission) {
    const submission = { delegateSubmission: delegate }
    return await this.sendTransaction(publicKey, submission)
  }
}
