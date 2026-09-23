import { useMemo } from "react"
import PayItem from "./components/PayItem"

function MainPayList({ payList }) {
  const reversedPayList = useMemo(() => {
    return payList?.data ? [...payList.data].reverse() : []
  }, [payList?.data])

  return (
    <div className="px-4 py-4">
      {reversedPayList.map((e) => (
        <PayItem key={e.id} data={e} />
      ))}
    </div>
  )
}

export default MainPayList

