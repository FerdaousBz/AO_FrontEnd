import { toast } from 'react-toastify';

export default function handleToast(type, message) {
  toast[type](message, {
    autoClose: 5000,
    closeOnClick: true,
    draggable: true,
    hideProgressBar: false,
    pauseOnHover: true,
    position: 'top-right',
    progress: undefined,
    theme: 'light',
  });
}
