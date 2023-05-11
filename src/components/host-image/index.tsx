import { useState } from 'react'
import locators from '../locators'

export const HostImage = ({ hostname, size = 16 }: { hostname: string; size?: number }) => {
  const [imageUrl, setImageUrl] = useState<string>(`${hostname}/favicon.ico`)

  return (
    <img
      data-testid={locators.hostImage}
      style={{
        width: size * 4,
        height: size * 4
      }}
      alt={hostname}
      src={imageUrl}
      onError={() => setImageUrl('./question-mark.png')}
    />
  )
}
