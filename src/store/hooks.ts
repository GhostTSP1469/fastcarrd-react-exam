import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

export function useAppDispatch() {
  return useDispatch<AppDispatch>()
}

export function useAppSelector<T>(selector: (state: RootState) => T) {
  return useSelector(selector)
}
