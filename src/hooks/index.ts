import { useCallback, useRef, useEffect } from "react";

/**
 * Debounce hook for functions
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;
}

/**
 * Throttle hook for functions
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCallRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: any[]) => {
      const now = Date.now();

      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now;
        callback(...args);
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          lastCallRef.current = Date.now();
          callback(...args);
        }, delay - (now - lastCallRef.current));
      }
    },
    [callback, delay]
  ) as T;
}

/**
 * LocalStorage hook
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useLocalStorage<T>(
    key,
    initialValue
  );

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting ${key} in localStorage:`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue] as const;
}

/**
 * Clipboard hook for copying text
 */
export function useClipboard() {
  const [copied, setCopied] = useStateWithCallback(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (error) {
      console.error("Failed to copy:", error);
      return false;
    }
  }, []);

  return { copied, copy };
}

/**
 * State with callback hook
 */
function useStateWithCallback<T>(
  initialState: T
): [T, (value: T | ((prev: T) => T), callback?: (value: T) => void) => void] {
  const [state, setState] = useStateWithCallback<T>(initialState);
  const callbackRef = useRef<((value: T) => void) | undefined>();

  useEffect(() => {
    if (callbackRef.current) {
      callbackRef.current(state);
      callbackRef.current = undefined;
    }
  }, [state]);

  const setStateWithCallback = useCallback(
    (
      value: T | ((prev: T) => T),
      callback?: (value: T) => void
    ) => {
      callbackRef.current = callback;
      setState(value);
    },
    []
  );

  return [state, setStateWithCallback];
}

/**
 * Previous value hook
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

/**
 * Async state hook
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true
) {
  const [status, setStatus] = useAsync("idle");
  const [data, setData] = useAsync<T | undefined>(undefined);
  const [error, setError] = useAsync<Error | undefined>(undefined);

  const execute = useCallback(async () => {
    setStatus("pending");
    setData(undefined);
    setError(undefined);

    try {
      const response = await asyncFunction();
      setData(response);
      setStatus("success");
      return response;
    } catch (err) {
      setError(err as Error);
      setStatus("error");
      throw err;
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, data, error };
}

/**
 * useOnClickOutside hook
 */
export function useOnClickOutside(
  ref: React.RefObject<HTMLElement>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}
