import * as yup from 'yup';

export const registrationSchema = yup.object({
  username: yup.string().required('Поле обязательно'),
  email: yup.string().email('Неверный email').required('Поле обязательно'),
  password: yup.string().min(8, 'Минимум 8 символов').required('Поле обязательно'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Пароли не совпадают')
    .required('Подтвердите пароль'),
});

export const loginSchema = yup.object({
  email: yup.string().email('Неверный email').required('Поле обязательно'),
  password: yup.string().min(1, 'Минимум 8 символов').required('Поле обязательно'),
});
