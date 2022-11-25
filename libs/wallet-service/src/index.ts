// @ts-nocheck
import type { WalletAPIRequest } from '@vegaprotocol/wallet-client'
import { VegaWallet, HARDENED, PoW } from '@vegaprotocol/crypto'

const Errors = {
  JSONRPC_PARSE_ERROR: { code: -32700, message: 'Parse error' },
  JSONRPC_INVALID_REQUEST: { code: -32600, message: 'Invalid request' },
  JSONRPC_INTERNAL_ERROR: { code: -32603, message: 'Internal error' },
  JSONRPC_METHOD_NOT_FOUND: { code: -32601, message: 'Method not found' }
}

class ServiceError extends Error {
  public code;
  public data;

  constructor(msg: string, code: number, data?: string) {
    super(msg)
    this.code = code
    this.data = data
  }
}

export class WalletService {
  private onerror;
  private networks;
  private wallets;
  private permissions;

  constructor({ onerror, networkStore, walletStore, permissionsStore }: {
    onerror?: Function;
    networkStore: Map<string, any>;
    walletStore: Map<string, any>;
    permissionsStore: Map<string, any>;
  }) {
    this.onerror = onerror ?? (() => { })

    this.networks = networkStore
    this.wallets = walletStore
    this.permissions = permissionsStore
  }

  request(str) {
    try {
      // `var` to hoist
      var req = JSON.parse(str)
    } catch (ex) {
      return JSON.stringify({ jsonrpc: '2.0', error: { ...Errors.JSONRPC_PARSE_ERROR, data: ex.message } })
    }

    if (req.jsonrpc !== '2.0' || req.method == null || req.id == null)
      return JSON.stringify({ jsonrpc: '2.0', error: Errors.JSONRPC_INVALID_REQUEST, id: req.id })

    try {
      return JSON.stringify({ jsonrpc: '2.0', id: req.id, result: this._onrequest(req) })
    } catch (ex) {
      if (ex instanceof ServiceError) return JSON.stringify({ jsonrpc: '2.0', error: ex, id: req.id })

      this.onerror(ex)
      return JSON.stringify({ jsonrpc: '2.0', error: Errors.JSONRPC_INTERNAL_ERROR, id: req.id })
    }
  }

  _onrequest(method, params): WalletAPIRequest {
    switch (method) {
      case 'client.connect_wallet': return notImplemented()
      case 'client.disconnect_wallet': return notImplemented()
      case 'client.get_permissions': return notImplemented()
      case 'client.request_permissions': return notImplemented()
      case 'client.list_keys': return notImplemented()
      case 'client.sign_transaction': return notImplemented()
      case 'client.send_transaction': return notImplemented()
      case 'client.get_chain_id': return notImplemented()

      // Wallets
      case 'admin.list_wallets': return notImplemented()
      case 'admin.create_wallet': return notImplemented()
      case 'admin.import_wallet': return notImplemented()
      case 'admin.describe_wallet': return notImplemented()
      case 'admin.rename_wallet': return notImplemented()
      case 'admin.remove_wallet': return notImplemented()

      // Network
      case 'admin.list_networks': return this.adminListNetworks()
      case 'admin.import_network': return this.adminImportNetwork(params)
      case 'admin.describe_network': return this.adminDescribeNetwork(params)
      case 'admin.update_network': return this.adminUpdateNetwork(params)
      case 'admin.remove_network': return this.adminRemoveNetwork(params)

      // Keys
      case 'admin.generate_key': return notImplemented()
      case 'admin.describe_key': return notImplemented()
      case 'admin.list_keys': return notImplemented()
      case 'admin.annotate_key': return notImplemented()
      case 'admin.isolate_key': return notImplemented()
      // case 'admin.rotate_key': return notImplemented()
      case 'admin.taint_key': return notImplemented()
      case 'admin.untain_key': return notImplemented()

      // Permissions
      case 'admin.describe_permissions': return notImplemented()
      case 'admin.list_permissions': return notImplemented()
      case 'admin.purge_permissions': return notImplemented()
      // case 'admin.sign_transaction': return notImplemented()
      case 'admin.sign_message': return notImplemented()
      // case 'admin.verify_message': return notImplemented()
      // case 'admin.send_transaction': return notImplemented()

      // Fallback
      default: return notImplemented()
    }
  }

  adminListWallets() {
    return Array.from(this.wallets.keys())
  }

  adminListNetworks() {
    return Array.from(this.networks.keys())
  }

  adminImportNetwork({ name, url, filePath, overwrite = false }) {
    // Must be strictly set to true to overwrite
    const preventOverwrite = overwrite !== true
    if (this.networks.get(name) && preventOverwrite) throw new ServiceError('Duplicate network name', 1000)

    if (typeof name !== 'string') throw new ServiceError('Invalid network name', 1000)

    return notImplemented()

    // this.networks.set(name, { url, filePath })

    // return {}
  }

  adminCreateNetwork({ name, overwrite = false, config = {} }: { name: string, overwrite?: boolean, config: any }) {
    if (!this._validateNetworkName(name)) throw new ServiceError('Invalid network name', 1000)
    if (!this._validateNetworkDefintion(config)) throw new ServiceError('Invalid network config', 1000)

    // Must be strictly set to true to overwrite
    const preventOverwrite = overwrite !== true
    if (this.networks.get(name) && preventOverwrite) throw new ServiceError('Duplicate network name', 1000)

    this.networks.set(name, config)

    return {}
  }

  adminDescribeNetwork({ network }) {
    if (!this._validateNetworkName(network)) throw new ServiceError('Invalid network', 1000)

    const nw = this.networks.get(network)
    if (nw == null) throw new ServiceError('Invalid network', 1000)

    return nw
  }

  adminUpdateNetwork(params) {
    const { name, logLevel, tokenExpiry, port, host, api } = params

    if (!this._validateNetworkName(name)) throw new ServiceError('Invalid network', 1000)
    if (!this._validateNetworkDefintion(params)) throw new ServiceError('Invalid network config', 1000)

    const nw = this.networks.get(name)
    if (nw == null) throw new ServiceError('Invalid network', 1000)

    this.networks.set(name, params)

    return {}
  }

  adminRemoveNetwork({ name }) {
    if (!this._validateNetworkName(name)) throw new ServiceError('Invalid network', 1000)

    const nw = this.networks.get(name)
    if (nw == null) throw new ServiceError('Invalid network', 1000)

    this.networks.delete(name)

    return {}
  }

  _validateNetworkName(name) {
    return typeof name === 'string'
  }
  _validateNetworkDefintion({ name, api }) {
    return typeof name === 'string' && (api?.restConfig?.hosts?.length > 0 ?? false)
  }
}

function notImplemented() {
  const e = Errors.JSONRPC_METHOD_NOT_FOUND
  throw new ServiceError(e.message, e.code)
}
