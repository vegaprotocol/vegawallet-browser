import { useEffect, useMemo, useState } from 'react'

const pseudoRandom = (seed: number) => {
  let value = seed
  return () => {
    value = (value * 16807) % 2147483647
    return value / 1000000000
  }
}

export const Bone = ({ width, height, baseSize = 1 }: { width: number; height: number; baseSize?: number }) => {
  const [, forceRender] = useState(false)
  const generate = useMemo(() => pseudoRandom(1), [])

  useEffect(() => {
    const interval = setInterval(() => {
      forceRender((x) => !x)
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center" data-testid="bone">
      <div className={`flex flex-wrap bg-vega-dark-150`}>
        {new Array(width).fill(null).map((_, i) => (
          <div key={`bone-row-${i}`} data-testid="bone-row">
            {new Array(height).fill(null).map((_, j) => (
              <div
                key={`bone-sqaure-${j}`}
                data-testid="bone-sqaure"
                className={`bg-white w-${baseSize} h-${baseSize}`}
                style={{
                  opacity: generate() > 1.5 ? 1 : 0
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
