/* @flow */
import { useState, useEffect } from "preact/hooks";

export function useXProps<T>(): T {
  const [xprops, setXProps] = useState(window.xprops);
  useEffect(
    () =>
      xprops.onProps((newProps) => {
        setXProps({ ...newProps });
      }),
    []
  );
  return { ...xprops };
}
