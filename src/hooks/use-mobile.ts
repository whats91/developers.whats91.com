import * as React from "react"

const MOBILE_BREAKPOINT = 768

function getIsMobile() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches
  )
}

export function useIsMobile() {
  const subscribe = React.useCallback((callback: () => void) => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    mql.addEventListener("change", callback)

    return () => mql.removeEventListener("change", callback)
  }, [])

  return React.useSyncExternalStore(subscribe, getIsMobile, () => false)
}
