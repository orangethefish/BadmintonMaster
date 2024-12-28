import toast, { Toast, ToastOptions } from 'react-hot-toast';

export class NotificationService {
  private static defaultOptions: ToastOptions = {
    duration: 3000,
    position: 'top-right',
  };

  static success(message: string, options?: ToastOptions): Toast {
    return toast.success(message, {
      ...this.defaultOptions,
      ...options,
      className: 'bg-[#39846d] text-white',
      iconTheme: {
        primary: '#fff',
        secondary: '#39846d',
      },
    });
  }

  static error(message: string, options?: ToastOptions): Toast {
    return toast.error(message, {
      ...this.defaultOptions,
      ...options,
      className: 'bg-red-500 text-white',
    });
  }

  static info(message: string, options?: ToastOptions): Toast {
    return toast(message, {
      ...this.defaultOptions,
      ...options,
      className: 'bg-blue-500 text-white',
    });
  }

  static warning(message: string, options?: ToastOptions): Toast {
    return toast(message, {
      ...this.defaultOptions,
      ...options,
      icon: '⚠️',
      className: 'bg-yellow-500 text-white',
    });
  }

  static loading(message: string, options?: ToastOptions): Toast {
    return toast.loading(message, {
      ...this.defaultOptions,
      ...options,
      className: 'bg-gray-700 text-white',
    });
  }

  static dismiss(toastId?: string | number): void {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  }

  static promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
    options?: ToastOptions
  ): Promise<T> {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        ...this.defaultOptions,
        ...options,
        success: {
          className: 'bg-[#39846d] text-white',
          iconTheme: {
            primary: '#fff',
            secondary: '#39846d',
          },
        },
        error: {
          className: 'bg-red-500 text-white',
        },
      }
    );
  }
} 