import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Toast = MySwal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

export const toast = {
  success: (message: string) => {
    Toast.fire({
      icon: 'success',
      title: message
    });
  },
  error: (message: string) => {
    Toast.fire({
      icon: 'error',
      title: message
    });
  },
  warning: (message: string) => {
    Toast.fire({
      icon: 'warning',
      title: message
    });
  },
  info: (message: string) => {
    Toast.fire({
      icon: 'info',
      title: message
    });
  },
  alert: (message: string) => {
    MySwal.fire({
      title: 'Attention',
      text: message,
      icon: 'info',
      confirmButtonColor: '#10b981'
    });
  }
};
