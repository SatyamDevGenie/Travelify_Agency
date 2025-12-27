import { toast } from "react-toastify";

// Professional toast configuration
const defaultToastConfig = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  style: {
    fontFamily: "inherit",
  },
};

// Professional toast methods with consistent styling
export const showToast = {
  success: (message, options = {}) => {
    return toast.success(message, {
      ...defaultToastConfig,
      ...options,
      icon: "✅",
    });
  },

  error: (message, options = {}) => {
    return toast.error(message, {
      ...defaultToastConfig,
      autoClose: 6000, // Longer for errors
      ...options,
      icon: "❌",
    });
  },

  warning: (message, options = {}) => {
    return toast.warning(message, {
      ...defaultToastConfig,
      ...options,
      icon: "⚠️",
    });
  },

  info: (message, options = {}) => {
    return toast.info(message, {
      ...defaultToastConfig,
      ...options,
      icon: "ℹ️",
    });
  },

  loading: (message, options = {}) => {
    return toast.loading(message, {
      ...defaultToastConfig,
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      ...options,
    });
  },

  promise: (promise, messages, options = {}) => {
    return toast.promise(
      promise,
      {
        pending: {
          render: messages.pending || "Processing...",
          icon: "⏳",
        },
        success: {
          render: messages.success || "Success!",
          icon: "✅",
        },
        error: {
          render: messages.error || "Something went wrong!",
          icon: "❌",
        },
      },
      {
        ...defaultToastConfig,
        ...options,
      }
    );
  },

  // Custom toast for booking confirmations
  booking: {
    success: (tourName, options = {}) => {
      return toast.success(
        `🎉 Booking confirmed for ${tourName}! Check your email for details.`,
        {
          ...defaultToastConfig,
          autoClose: 6000,
          ...options,
        }
      );
    },

    pending: (tourName, options = {}) => {
      return toast.info(
        `⏳ Your booking for ${tourName} is pending admin approval.`,
        {
          ...defaultToastConfig,
          autoClose: 5000,
          ...options,
        }
      );
    },

    rejected: (tourName, reason, options = {}) => {
      return toast.error(
        `❌ Booking for ${tourName} was rejected. ${reason ? `Reason: ${reason}` : ''}`,
        {
          ...defaultToastConfig,
          autoClose: 8000,
          ...options,
        }
      );
    },
  },

  // Custom toast for admin actions
  admin: {
    tourCreated: (tourName, options = {}) => {
      return toast.success(
        `🚀 Tour "${tourName}" created successfully!`,
        {
          ...defaultToastConfig,
          ...options,
        }
      );
    },

    bookingConfirmed: (guestName, options = {}) => {
      return toast.success(
        `✅ Booking confirmed for ${guestName}`,
        {
          ...defaultToastConfig,
          ...options,
        }
      );
    },

    bookingRejected: (guestName, options = {}) => {
      return toast.success(
        `❌ Booking rejected for ${guestName}`,
        {
          ...defaultToastConfig,
          ...options,
        }
      );
    },
  },

  // Custom toast for authentication
  auth: {
    loginRequired: (options = {}) => {
      return toast.warning(
        `🔐 Please login first to book tours and access exclusive features`,
        {
          ...defaultToastConfig,
          autoClose: 4000,
          ...options,
        }
      );
    },

    loginSuccess: (userName, options = {}) => {
      return toast.success(
        `👋 Welcome back, ${userName}!`,
        {
          ...defaultToastConfig,
          ...options,
        }
      );
    },

    logoutSuccess: (options = {}) => {
      return toast.success(
        `👋 Logged out successfully. See you soon!`,
        {
          ...defaultToastConfig,
          ...options,
        }
      );
    },

    registerSuccess: (userName, options = {}) => {
      return toast.success(
        `🎉 Welcome to Travelify, ${userName}!`,
        {
          ...defaultToastConfig,
          ...options,
        }
      );
    },
  },

  // Dismiss all toasts
  dismissAll: () => {
    toast.dismiss();
  },

  // Update existing toast
  update: (toastId, options) => {
    toast.update(toastId, options);
  },
};

// Professional toast container configuration for App.js
export const toastContainerConfig = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  newestOnTop: true,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  theme: "light",
  limit: 5, // Maximum 5 toasts at once
  style: {
    fontFamily: "inherit",
  },
};

export default showToast;