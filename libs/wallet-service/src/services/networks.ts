import { z } from 'zod'
import toml from 'toml'
import type { WalletModel } from '@vegaprotocol/wallet-admin'

import type { Storage } from '../storage/wrapper'
import { Network } from '../storage/schemas/network'

const FileSchema = z.object({
  Name: z.string(),
  API: z.object({
    REST: z.object({
      Hosts: z.array(z.string().url()),
    }),
  }),
})

const toResponse = (config: Network): WalletModel.DescribeNetworkResult => {
  return {
    name: config.Name,
    logLevel: 'info',
    host: '127.0.0.1',
    port: 1789,
    tokenExpiry: '1h',
    api: {
      grpcConfig: {
        hosts: [],
        retries: 0,
      },
      graphQLConfig: {
        hosts: [],
      },
      restConfig: {
        hosts: config.API.REST.Hosts,
      },
    },
  }
}

const toConfig = (config: WalletModel.DescribeNetworkResult): Network => {
  return {
    Name: config.name,
    API: {
      REST: {
        Hosts: config.api.restConfig.hosts,
      },
    },
  }
}

export class Networks {
  private store: Storage<Network>

  constructor(store: Storage<Network>) {
    this.store = store
  }

  private async getConfig(url: string): Promise<z.infer<typeof FileSchema>> {
    const response = await fetch(url)
    const ext = url.split('.').at(-1)

    switch (ext) {
      case 'toml': {
        const content = await response.text()
        const json = toml.parse(content)
        return FileSchema.parse(json)
      }
      default: {
        throw new Error(
          `Unsupported extension: "${ext}". Only ".toml" file extensions are supported for network configuration.`
        )
      }
    }
  }

  async import({
    name,
    url,
    overwrite = false,
  }: WalletModel.ImportNetworkParams): Promise<WalletModel.ImportNetworkResult> {
    const doesNetworkExist = name && (await this.store.has(name))

    if (overwrite === false && doesNetworkExist) {
      throw new Error('Duplicate network')
    }

    const content = await this.getConfig(url)

    await this.store.set(name || content.Name, content)
    return {
      name: content.Name,
      filePath: '',
    }
  }

  async list(): Promise<WalletModel.ListNetworksResult> {
    return {
      networks: Array.from(await this.store.keys()),
    }
  }

  async describe({
    name,
  }: WalletModel.DescribeNetworkParams): Promise<WalletModel.DescribeNetworkResult> {
    const config = await this.store.get(name)

    if (config == null) {
      throw new Error(`Cannot find network with name "${name}".`)
    }

    return toResponse(config)
  }

  async update(
    input: WalletModel.UpdateNetworkParams
  ): Promise<WalletModel.UpdateNetworkResult> {
    const config = await this.store.get(input.name)
    if (config == null) {
      throw new Error('Invalid network')
    }

    const newConfig = toConfig(input)
    await this.store.set(input.name, newConfig)
    return null
  }

  async remove({
    name,
  }: WalletModel.RemoveNetworkParams): Promise<WalletModel.RemoveNetworkResult> {
    if (await this.store.delete(name)) return null

    throw new Error('Invalid network')
  }
}
