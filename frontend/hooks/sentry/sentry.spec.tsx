import { renderHook } from '@testing-library/react'
import { sanitizeEvent, useSentry } from '.'
import { useGlobalsStore } from '../../stores/globals'
import { init, close, setTag } from '@sentry/react'

jest.mock('../../stores/globals')
jest.mock('@sentry/react')
jest.mock('!/config', () => ({
  ...jest.requireActual('../../../config/test').default,
  sentryDsn: 'dsn'
}))

describe('useSentry', () => {
  let initMock: jest.Mock
  let closeMock: jest.Mock
  let setTagMock: jest.Mock
  let useGlobalsStoreMock: jest.Mock
  let useWalletStoreMock: jest.Mock

  beforeEach(() => {
    initMock = jest.fn()
    closeMock = jest.fn()
    setTagMock = jest.fn()
    useGlobalsStoreMock = jest.fn()
    useWalletStoreMock = jest.fn()

    // Mocking external dependencies
    jest.mock('@sentry/react', () => ({
      init: initMock,
      close: closeMock,
      setTag: setTagMock
    }))
    jest.mock('../../stores/globals', () => ({
      useGlobalsStore: useGlobalsStoreMock
    }))
    jest.mock('../../stores/wallets', () => ({
      useWalletStore: useWalletStoreMock
    }))
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  it('should initialize Sentry when telemetry is enabled and config is available', () => {
    ;(useGlobalsStore as unknown as jest.Mock).mockImplementation((fn) =>
      fn({
        globals: {
          settings: {
            telemetry: true
          },
          version: '1.0.0'
        }
      })
    )

    useWalletStoreMock.mockReturnValue({
      wallets: []
    })

    renderHook(() => useSentry())

    expect(init).toHaveBeenCalledWith({
      dsn: expect.any(String),
      integrations: [],
      tracesSampleRate: 1.0,
      environment: expect.any(String),
      beforeSend: expect.any(Function)
    })

    expect(setTag).toHaveBeenCalledWith('version', '1.0.0')
    expect(close).not.toHaveBeenCalled()
  })

  it('should close Sentry when telemetry is disabled', () => {
    ;(useGlobalsStore as unknown as jest.Mock).mockImplementation((fn) =>
      fn({
        globals: {
          settings: {
            telemetry: false
          },
          version: '1.0.0'
        }
      })
    )

    renderHook(() => useSentry())

    expect(init).not.toHaveBeenCalled()
    expect(setTag).not.toHaveBeenCalled()
    expect(close).toHaveBeenCalled()
  })

  it('should sanitize event by replacing wallet keys with [VEGA_KEY]', () => {
    const wallets = [
      {
        name: 'name1',
        keys: [
          { index: 0, name: 'Key 1', publicKey: 'publicKey1', metadata: [] },
          { index: 1, name: 'Key 2', publicKey: 'publicKey2', metadata: [] }
        ]
      },
      { name: 'name2', keys: [{ index: 0, name: 'Key 1', publicKey: 'publicKey3', metadata: [] }] }
    ]
    const event = JSON.stringify(
      sanitizeEvent(
        {
          message: 'name1, name2, publicKey1, publicKey2, publicKey3, publicKey2, name2'
        } as any,
        wallets
      )
    )

    expect(event).not.toContain('name1')
    expect(event).not.toContain('name2')
    expect(event).not.toContain('publicKey1')
    expect(event).not.toContain('publicKey2')
    expect(event).not.toContain('publicKey3')
    expect(event).toContain('[VEGA_KEY]')
    expect(event).toContain('[WALLET_NAME]')
  })
})
