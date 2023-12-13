export {}

interface EventTracker {
  listener: Function
  result: any[]
  callCounter: number
}

declare global {
  interface Window {
    __events__: Record<string, EventTracker>
  }
}
