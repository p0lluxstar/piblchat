import * as yup from 'yup';

export const registrationSchema = yup.object({
  username: yup
    .string()
    .min(3, 'Минимум 3 символа')
    .max(20, 'Максимум 20 символов')
    .matches(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/, 'Недопустимые символы')
    .required('Поле обязательно'),
  email: yup
    .string()
    .email('Неверный email')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Неверный email')
    .required('Поле обязательно'),
  password: yup.string().min(8, 'Минимум 8 символов').required('Поле обязательно'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Пароли не совпадают')
    .required('Поле обязательно'),
});

export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Неверный email')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Неверный email')
    .required('Поле обязательно'),
  password: yup.string().required('Поле обязательно'),
});
