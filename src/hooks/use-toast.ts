import { useCallback, useState } from 'react';

export type ToastType = 'success' | 'error';

export type ToastState = {
  visible: boolean;
  type: ToastType;
  message: string;
};

const INITIAL_TOAST: ToastState = {
  visible: false,
  type: 'success',
  message: '',
};

export function useToast(timeoutMs = 2400) {
  const [toast, setToast] = useState<ToastState>(INITIAL_TOAST);

  const hideToast = useCallback(() => {
    setToast(INITIAL_TOAST);
  }, []);

  const showToast = useCallback(
    (type: ToastType, message: string) => {
      setToast({
        visible: true,
        type,
        message,
      });

      window.setTimeout(() => {
        setToast((current) => {
          if (current.message !== message) {
            return current;
          }

          return INITIAL_TOAST;
        });
      }, timeoutMs);
    },
    [timeoutMs],
  );

  return {
    toast,
    showToast,
    hideToast,
  };
}
