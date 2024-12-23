import { useEffect, useState } from 'react'

export default function useDebounce(value: number) {
  const [current, setCurrent] = useState<number>(value)
  useEffect(() => {
    if(~~(value) !== current){
      setCurrent(~~(value))
    }
  }, [value, current])
  return current
}
