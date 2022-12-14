import type { Storage } from '../storage/types/storage'

export type NetworkConfig = {
  name: string

  api?: {
    restConfig: {
      hosts: string[]
    }
  }
}

export class Networks {
  private store: Storage<NetworkConfig>

  constructor(store: Storage<NetworkConfig>) {
    this.store = store
  }

  async list(): Promise<string[]> {
    return Array.from(await this.store.keys())
  }

  async import({
    name,
    url,
    overwrite = false,
  }: {
    name: string
    url: URL | string
    overwrite?: boolean
  }): Promise<{ name: string }> {
    if (overwrite === false && (await this.store.has(name)))
      throw new Error('Duplicate network')

    throw new Error('Not implemented')

    // TODO: Potential implementation
    const _config = (await (await fetch(url)).json()) as unknown

    const config = _config as NetworkConfig

    await this.store.set(name, config)

    return { name }
  }

  async create({
    config,
    overwrite = false,
  }: {
    config: NetworkConfig
    overwrite?: boolean
  }): Promise<{ name: string }> {
    if (!this.isValidDefintion(config))
      throw new Error('Invalid network config')
    if (overwrite === false && (await this.store.has(config.name)))
      throw new Error('Duplicate network')

    this.store.set(config.name, config)

    return { name: config.name }
  }

  async describe({
    name,
  }: {
    name: string
  }): Promise<NetworkConfig | undefined> {
    const config = await this.store.get(name)

    if (config == null) throw new Error('Invalid network')

    // Add name to output only
    config.name = name

    return config
  }

  async update({ name, api }: Required<NetworkConfig>): Promise<void> {
    if (!this.isValidDefintion({ name, api }))
      throw new Error('Invalid network config')
    const config = await this.store.get(name)
    if (config == null) throw new Error('Invalid network')

    await this.store.set(name, Object.assign(config, { api }))

    return
  }

  async remove({ name }: { name: string }): Promise<void> {
    if (this.store.delete(name) === false) throw new Error('Invalid network')
    return
  }

  isValidName(name: unknown) {
    // TODO: Should this be expanded?
    return typeof name === 'string'
  }

  isValidDefintion(config: NetworkConfig): config is NetworkConfig {
    return (
      this.isValidName(config?.name) &&
      (config?.api?.restConfig?.hosts?.length ?? 0) > 1
    )
  }
}
