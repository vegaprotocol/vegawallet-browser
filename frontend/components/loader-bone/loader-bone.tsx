import { useEffect, useMemo, useState } from 'react'

const pseudoRandom = (seed: number) => {
  let value = seed
  return () => {
    value = (value * 16807) % 2147483647
    return value / 1000000000
  }
}

export const locators = {
  bone: 'bone',
  boneCol: 'bone-col',
  boneSquare: 'bone-square'
}

export const LoaderBone = ({ width, height, baseSize = 1 }: { width: number; height: number; baseSize?: number }) => {
  const [, forceRender] = useState(false)
  const generate = useMemo(() => pseudoRandom(1), [])

  useEffect(() => {
    const interval = setInterval(() => {
      forceRender((x) => !x)
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div data-testid={locators.bone}>
      <div className="flex flex-wrap">
        {new Array(width).fill(null).map((_, i) => (
          <div key={`bone-col-${i}`} data-testid={locators.boneCol}>
            {new Array(height).fill(null).map((_, j) => (
              <div
                key={`bone-sqaure-${j}`}
                data-testid={locators.boneSquare}
                style={{ height: baseSize, width: baseSize, opacity: generate() > 1.5 ? 1 : 0 }}
                className="bg-white"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
