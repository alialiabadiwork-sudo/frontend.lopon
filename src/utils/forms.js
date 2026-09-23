import { Slide, toast } from 'react-toastify';

class Toasts {
  constructor() {
    this.config = {
      position: "bottom-center",
      autoClose: false,
      hideProgressBar: true,
      // closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Slide,
      draggablePercent: 60
    }
  }

  goodToast(message) {
    toast.success(message, this.config);
  }
  badToast(message) {
    toast.error(message, this.config);
  }
  infoToast(message) {
    toast.info(message, this.config);
  }
  warinigToast(message) {
    toast.warning(message, this.config);
  }
  toast(message) {
    toast(message, this.config);
  }

}

class ValidationForms extends Toasts {
  constructor() {
    super();
  }

  validatePhone(value) {
    const isValidLength =  value.length === 11;
    const isNumber = str => /^\d+$/.test(str);

    if (!isValidLength) {
      return "ارقام شماره موبایل وارد شده صحیح نمی باشد !"
    }

    if (!isNumber(value)) {
      return "شماره موبایل باید فقط شامل ارقام باشد !";
    }
    return true;
  }
}


export { ValidationForms, Toasts }