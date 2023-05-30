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

  async listKeys(): Promise<Key[]> {
    const keysString = await this.driver.executeScript<string>(async () => {
      if (!window.vega) {
        throw new Error('Vega wallet not found')
      }
      const keys = await window.vega.listKeys()
      return JSON.stringify(keys)
    })

    const keysArray = JSON.parse(keysString).keys as Key[]
    console.log('publicKey', keysArray[0].publicKey)

    return keysArray
  }

  async sendTransferRequestTransaction(publicKey: string, transferRequest: TransferRequest) {
    return await this.sendTransaction(publicKey, transferRequest)
  }

  async sendVoteSubmissionTransaction(publicKey: string, voteSubmission: VoteSubmission) {
    return await this.sendTransaction(publicKey, voteSubmission)
  }

  async sendDelegateStakeTransaction(publicKey: string, delegateSubmission: DelegateSubmission) {
    const submission = {
      delegateSubmission
    }

    return await this.sendTransaction(publicKey, submission)
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
          transaction: { delegateSubmission: transaction }
        })
        return chainID
      },
      publicKey,
      transaction
    )
  }
}
