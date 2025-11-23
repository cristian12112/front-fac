import { Notyf } from 'notyf';

const notyf = new Notyf({
  duration: 3000,
  position: {
    x: 'right',
    y: 'top',
  },
  types: [
    {
      type: 'success',
      background: '#10b981',
      icon: {
        className: 'notyf__icon--success',
        tagName: 'i',
      }
    },
    {
      type: 'error',
      background: '#ef4444',
      icon: {
        className: 'notyf__icon--error',
        tagName: 'i',
      }
    },
    {
      type: 'warning',
      background: '#f59e0b',
      icon: false
    },
    {
      type: 'info',
      background: '#3b82f6',
      icon: false
    }
  ]
});

export const notify = {
  success: (message) => notyf.success(message),
  error: (message) => notyf.error(message),
  warning: (message) => notyf.open({ type: 'warning', message }),
  info: (message) => notyf.open({ type: 'info', message }),
};

export const confirmDialog = (message) => {
  return window.confirm(message);
};
