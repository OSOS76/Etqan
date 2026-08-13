import Swal from 'sweetalert2';

export class Alerts {
  static success(title: string, text: string) {
    Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonColor: '#8B5E3C',
      customClass: {
        container: 'my-swal-container',
      },
    });
  }

  static error(title: string, text: string) {
    Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonColor: '#8B5E3C',
      customClass: {
        container: 'my-swal-container',
      },
    });
  }
}
