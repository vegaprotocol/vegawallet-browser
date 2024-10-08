import classnames from 'classnames'
import { useState } from 'react'
import { parse } from 'tldts'

export const locators = {
  hostImage: 'host-image',
  hostImageFallback: 'host-image-fallback'
}

function toHex(string_: string) {
  let result = ''
  for (let index = 0; index < string_.length; index++) {
    // eslint-disable-next-line unicorn/prefer-code-point
    result += string_.charCodeAt(index).toString(16)
  }
  return result
}

const getRemainder = (string_: string) => {
  const h = toHex(string_)
  return Number(BigInt('0x' + h) % BigInt(6))
}

const COLORS_MAP = [
  { backgroundColor: 'bg-pink-650', textColor: 'text-pink-500' },
  { backgroundColor: 'bg-green-650', textColor: 'text-green-500' },
  { backgroundColor: 'bg-purple-650', textColor: 'text-purple-500' },
  { backgroundColor: 'bg-blue-650', textColor: 'text-blue-500' },
  { backgroundColor: 'bg-yellow-650', textColor: 'text-yellow-500' },
  { backgroundColor: 'bg-orange-650', textColor: 'text-orange-500' }
]

export interface HostImageProperties {
  hostname: string
  size?: number
}

const FallbackImage = ({ hostname, size }: HostImageProperties) => {
  const colorIndex = getRemainder(hostname)
  let letter = '?'
  try {
    const host = new URL(hostname).host
    const parseResult = parse(host)
    letter = parseResult.domain?.charAt(0) || '?'
  } catch {}

  return (
    <div
      data-testid={locators.hostImageFallback}
      className={classnames(
        COLORS_MAP[colorIndex].textColor,
        COLORS_MAP[colorIndex].backgroundColor,
        'flex justify-center items-center rounded-md text-lg uppercase overflow-hidden'
      )}
      style={{
        width: size,
        height: size
      }}
    >
      {letter}
    </div>
  )
}

export const HostImage = ({ hostname, size = 48 }: HostImageProperties) => {
  const [useFallback, setUseFallback] = useState(false)
  return useFallback ? (
    <FallbackImage hostname={hostname} size={size} />
  ) : (
    <img
      data-testid={locators.hostImage}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size
      }}
      alt={hostname}
      src={`${hostname}/favicon.ico`}
      onError={() => setUseFallback(true)}
    />
  )
}
