import { listenKeys } from 'nanostores'
import * as React from 'react'

const emit = (snapshotRef, onChange) => value => {
  if (snapshotRef.current === value) return
  snapshotRef.current = value
  onChange()
}

export function useStore(store, { keys, deps = [store, keys] } = {}) {
  let snapshotRef = React.useRef()
  snapshotRef.current = store.get()

  let subscribe = React.useCallback(onChange => {
    emit(snapshotRef, onChange)(store.value)

    return keys?.length > 0
      ? listenKeys(store, keys, emit(snapshotRef, onChange))
      : store.listen(emit(snapshotRef, onChange))
  }, deps)
  let get = () => snapshotRef.current

  return React.useSyncExternalStore(subscribe, get, () => store.get())
}
