import { Dispatch, SetStateAction, useCallback, useState } from "react"

type ReturnTypes<T = any> = [T, (e: any) => void, Dispatch<SetStateAction<T>>];

// 매개변수 타입 선언 필요, 보통 제너릭 사용
const useInput = <T = any>(initialData: T): ReturnTypes  => {
  const [value, setValue] = useState(initialData);
  const handler = useCallback((e: any) => {
    setValue(e.target.value);
  }, []);
  return [value, handler, setValue];
};

export default useInput;