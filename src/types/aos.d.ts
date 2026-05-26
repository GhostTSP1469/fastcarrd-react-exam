declare module 'aos' {
  type AosOptions = {
    duration?: number
    easing?: string
    once?: boolean
    offset?: number
  }

  const AOS: {
    init: (options?: AosOptions) => void
    refresh: () => void
    refreshHard: () => void
  }

  export default AOS
}
