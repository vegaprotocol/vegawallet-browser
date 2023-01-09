import { z } from 'zod'
import toml from 'toml'
import yaml from 'yamljs'
import type { WalletModel } from '@vegaprotocol/wallet-admin'

import type { Storage } from '../storage/types/storage'
import { ConfigSchema } from './schema'

export type NetworkConfig = z.infer<typeof ConfigSchema>

const transformConfig = (
  config: NetworkConfig
): WalletModel.DescribeNetworkResult => {
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

export class Networks {
  private store: Storage<NetworkConfig>

  constructor(store: Storage<NetworkConfig>) {
    this.store = store
  }

  private async getConfig(url: string) {
    const response = await fetch(url)
    const ext = url.split('.').at(-1)

    switch (ext) {
      case 'json': {
        const content = await response.json()
        return content
      }
      case 'toml': {
        const content = await response.text()
        return toml.parse(content)
      }
      case 'yml':
      case 'yaml': {
        const content = await response.text()
        return yaml.parse(content)
      }
      default: {
        throw new Error(
          `Unsupported extension: "${ext}". Only ".toml", ".yaml" or ".json" file extensions are supported for network configuration.`
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
    const config = ConfigSchema.parse(content)

    await this.store.set(name || config.Name, config)
    return {
      name: config.Name,
      filePath: '',
    }
  }

  async list(): Promise<string[]> {
    return Array.from(await this.store.keys())
  }

  async describe({
    name,
  }: WalletModel.DescribeNetworkParams): Promise<WalletModel.DescribeNetworkResult> {
    const config = await this.store.get(name)

    if (config == null) {
      throw new Error(`Cannot find network with name "${name}".`)
    }

    return transformConfig(config)
  }

  async update(
    input: WalletModel.UpdateNetworkParams
  ): Promise<WalletModel.UpdateNetworkResult> {
    const config = await this.store.get(input.name)
    if (config == null) {
      throw new Error('Invalid network')
    }

    const newConfig = Object.assign(config, input)
    await this.store.set(input.name, newConfig)
    return null
  }

  async remove({
    name,
  }: WalletModel.RemoveNetworkParams): Promise<WalletModel.RemoveNetworkResult> {
    if (this.store.delete(name) === false) {
      throw new Error('Invalid network')
    }
    return null
  }
}
