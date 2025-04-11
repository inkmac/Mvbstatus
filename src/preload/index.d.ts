export {}

declare global {
  interface Window {
    server: {
      getPort(): Promise<number>
    }
  }
}
