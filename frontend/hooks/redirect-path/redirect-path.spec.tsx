import { renderHook } from '@testing-library/react'
import { useGetRedirectPath } from '.'
import { FULL_ROUTES } from '../../routes/route-names'
import { AppGlobals, useGlobalsStore } from '../../stores/globals'

jest.mock('../../contexts/json-rpc/json-rpc-context', () => ({
  useJsonRpcClient: () => ({ client: {} })
}))

const mockLoadGlobals = jest.fn()

jest.mock('../../stores/globals', () => ({
  useGlobalsStore: jest.fn()
}))

const renderRedirectHook = (globals: AppGlobals, loading: boolean = false) => {
  ;(useGlobalsStore as unknown as jest.Mock).mockImplementationOnce((fn) => {
    const result = {
      loading,
      globals,
      loadGlobals: mockLoadGlobals
    }
    fn(result)
    return result
  })
  const {
    result: { current }
  } = renderHook(() => useGetRedirectPath(), {
    initialProps: false
  })
  return current
}

describe('RedirectPath', () => {
  it('returns the wallets page by default', async () => {
    const view = renderRedirectHook({
      passphrase: true,
      locked: false,
      wallet: true,
      version: '0.0.1',
      settings: {
        telemetry: false
      }
    })
    expect(view.loading).toBeFalsy()
    expect(view.path).toBe(FULL_ROUTES.wallets)
  })

  it('returns getting started if no password is set', async () => {
    const view = renderRedirectHook({
      passphrase: false,
      locked: false,
      wallet: true,
      version: '0.0.1',
      settings: {
        telemetry: false
      }
    })
    expect(view.loading).toBeFalsy()
    expect(view.path).toBe(FULL_ROUTES.getStarted)
  })
  it('returns login if locked', async () => {
    const view = renderRedirectHook({
      passphrase: true,
      locked: true,
      wallet: true,
      version: '0.0.1',
      settings: {
        telemetry: false
      }
    })
    expect(view.loading).toBeFalsy()
    expect(view.path).toBe(FULL_ROUTES.login)
  })

  it('returns create wallet if no wallets exist', async () => {
    const view = renderRedirectHook({
      passphrase: true,
      locked: false,
      wallet: false,
      version: '0.0.1',
      settings: {
        telemetry: false
      }
    })
    expect(view.loading).toBeFalsy()
    expect(view.path).toBe(FULL_ROUTES.createWallet)
  })

  it('returns telemetry if telemetry settings are undefined', async () => {
    const view = renderRedirectHook({
      passphrase: true,
      locked: false,
      wallet: true,
      version: '0.0.1',
      settings: {}
    })
    expect(view.loading).toBeFalsy()
    expect(view.path).toBe(FULL_ROUTES.telemetry)
  })

  it('returns no path if loading', async () => {
    const view = renderRedirectHook(
      {
        passphrase: true,
        locked: false,
        wallet: true,
        version: '0.0.1',
        settings: {
          telemetry: false
        }
      },
      true
    )
    expect(view.loading).toBeTruthy()
    expect(view.path).toBeNull()
  })
})
