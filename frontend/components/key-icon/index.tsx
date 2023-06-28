import { useEffect, useRef } from 'react'

export const locators = {
  keyIcon: 'key-icon'
}

function getBitsFromByte(byte: number) {
  let bits = []
  for (let i = 0; i < 8; i++) {
    bits.push(byte & (1 << i))
  }
  return bits
}

const getColorList = (publicKey: string) => {
  return new Array(4).fill(null).flatMap((_, i) => {
    let color1 = '#' + publicKey.slice(i * 16, i * 16 + 6)
    let color2 = '#' + publicKey.slice(i * 16 + 6, i * 16 + 12)
    let pattern = publicKey.slice(i * 16 + 12, i * 16 + 14) // each bit represents a pixel in the 3x3 grid except the center pixel
    let centerColor = publicKey.slice(i * 16 + 14, i * 16 + 16)

    const bits = getBitsFromByte(parseInt(pattern, 16))

    // Iterate through each pixel in the 3x3 grid
    let bitIdx = 0
    return new Array(9).fill(null).map((_, gridPos) => {
      if (gridPos === 4) {
        // center pixel, it's color is determined by the first bit of the centerColor byte
        let color = color1
        if (parseInt(centerColor, 16) & 0x80) {
          color = color2
        }
        return color
      } else {
        if (bits[bitIdx]) {
          bitIdx++
          return color2
        } else {
          bitIdx++
          return color1
        }
      }
    })
  })
}

export const KeyIcon = ({ publicKey }: { publicKey: string }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!context || !canvas) return
    const colorsList = getColorList(publicKey)
    const height = 42
    const squareSize = height / 6
    canvas.width = height
    canvas.height = height
    let colorIndex = 0
    // Draw the first 2 rows
    for (let i = 0; i < 2; i++) {
      const start_x = i * 3 * squareSize
      const start_y = 0
      // Draw each horizontal line
      for (let x = 0; x < 3; x++) {
        // Draw each square in the line
        for (let y = 0; y < 3; y++) {
          context.fillStyle = colorsList[colorIndex]
          context.fillRect(start_x + x * squareSize, start_y + y * squareSize, squareSize, squareSize)
          colorIndex++
        }
      }
    }

    // Draw the last 2 rows
    for (let i = 2; i < 4; i++) {
      // Draw left to right
      const start_x = (i - 2) * 3 * squareSize
      // Offset by the height of the first 2 rows
      const start_y = 3 * squareSize

      // Draw each horizontal line
      for (let x = 0; x < 3; x++) {
        // Draw each square in the line
        for (let y = 0; y < 3; y++) {
          context.fillStyle = colorsList[colorIndex]
          context.fillRect(start_x + x * squareSize, start_y + y * squareSize, squareSize, squareSize)
          colorIndex++
        }
      }
    }
  }, [publicKey])

  return (
    <div className="rounded-sm overflow-hidden">
      <canvas data-testid={locators.keyIcon} ref={canvasRef} />
    </div>
  )
}
