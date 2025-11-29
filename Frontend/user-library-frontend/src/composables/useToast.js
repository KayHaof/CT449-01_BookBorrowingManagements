import { getCurrentInstance } from 'vue'

export default function useToast() {
  const app = getCurrentInstance().appContext.config.globalProperties.$toast

  return {
    toastSuccess(msg, title = 'Thành công') {
      app.addNotification({
        type: 'success',
        title,
        message: msg,
      })
    },

    toastError(msg, title = 'Lỗi') {
      app.addNotification({
        type: 'error',
        title,
        message: msg,
      })
    },

    toastWarning(msg, title = 'Cảnh báo') {
      app.addNotification({
        type: 'warning',
        title,
        message: msg,
      })
    },

    toastInfo(msg, title = 'Thông báo') {
      app.addNotification({
        type: 'info',
        title,
        message: msg,
      })
    },
  }
}
