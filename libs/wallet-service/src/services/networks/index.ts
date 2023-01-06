import toml from 'toml'
import yaml from 'yamljs'
import type { WalletModel } from '@vegaprotocol/wallet-admin'

import type { Storage } from '../storage/types/storage'
import { ConfigSchema } from './schema'

export type NetworkConfig = WalletModel.DescribeNetworkResult

export class Networks {
  private store: Storage<NetworkConfig>

  constructor(store: Storage<NetworkConfig>) {
    this.store = store
  }

  private async readContent(reader: ReadableStreamDefaultReader) {
    let result = ''

    return await reader
      .read()
      .then(async function processValue({ done, value }): Promise<string> {
        if (value) {
          result += new TextDecoder().decode(value)
        }

        if (done) {
          return result
        }
        return reader.read().then(processValue)
      })
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
        const reader = response.body?.getReader()
        if (!reader) {
          throw new Error('Invalid response body')
        }
        const content = await this.readContent(reader)
        return toml.parse(content.toString())
      }
      case 'yaml': {
        const reader = response.body?.getReader()
        if (!reader) {
          throw new Error('Invalid response body')
        }
        const content = await this.readContent(reader)
        return yaml.parse(content.toString())
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
  }: {
    name: string
    url: string
    overwrite?: boolean
  }): Promise<{ name: string }> {
    const doesNetworkExist = await this.store.has(name)

    if (overwrite === false && doesNetworkExist) {
      throw new Error('Duplicate network')
    }

    const content = await this.getConfig(url)
    const fileconfig = ConfigSchema.parse(content)
    const config = {
      name,
      port: fileconfig.Port,
      host: fileconfig.Host,
      logLevel: fileconfig.Level || 'info',
      tokenExpiry: fileconfig.TokenExpiry,
      api: {
        grpcConfig: {
          hosts: fileconfig?.API?.GRPC?.Hosts || [],
          retries: fileconfig?.API?.GRPC?.Retries || 0,
        },
        graphQLConfig: {
          hosts: fileconfig.API?.GraphQL?.Hosts || [],
        },
        restConfig: {
          hosts: fileconfig.API?.REST?.Hosts || [],
        },
      },
    }

    await this.store.set(name, config)
    return config
  }

  async create({
    config,
    overwrite = false,
  }: {
    config: NetworkConfig
    overwrite?: boolean
  }): Promise<NetworkConfig> {
    const doesNetworkExist = await this.store.has(config.name)

    if (overwrite === false && doesNetworkExist) {
      throw new Error('Duplicate network')
    }

    this.store.set(config.name, config)
    return config
  }

  async list(): Promise<string[]> {
    return Array.from(await this.store.keys())
  }

  async describe({
    name,
  }: {
    name: string
  }): Promise<NetworkConfig | undefined> {
    const config = await this.store.get(name)

    if (config == null) {
      throw new Error(`Cannot find network with name "${name}".`)
    }

    return config
  }

  async update(input: NetworkConfig): Promise<void> {
    const config = await this.store.get(input.name)
    if (config == null) {
      throw new Error('Invalid network')
    }

    const newConfig = Object.assign(config, input)
    await this.store.set(input.name, newConfig)
    return
  }

  async remove({ name }: { name: string }): Promise<void> {
    if (this.store.delete(name) === false) {
      throw new Error('Invalid network')
    }
    return
  }
}
