import { useCallback, useEffect } from "react"
import { useLocation } from "react-router"

const useHideWithRoute = (setHideState , Routes) => {
  const location = useLocation()

  const setStateHeader = useCallback(() => {
    const shouldHide = Routes.some((route) => location.pathname.startsWith(route))
    setHideState(shouldHide)
  }, [location.pathname, setHideState])

  useEffect(() => {
    setStateHeader()
  }, [setStateHeader])
}

export default useHideWithRoute