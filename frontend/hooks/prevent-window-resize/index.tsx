import { useLayoutEffect, useMemo } from 'react'

export const usePreventWindowResize = () => {
  const frameHeight = useMemo(() => window.outerHeight - window.innerHeight, [])
  useLayoutEffect(() => {
    function resetSize() {
      window.resizeTo(360, Math.max(window.outerHeight, 600 + frameHeight))
    }
    window.addEventListener('resize', resetSize)
    resetSize()
    return () => window.removeEventListener('resize', resetSize)
  }, [frameHeight])
}
