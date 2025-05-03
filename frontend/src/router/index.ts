import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/useAuthStore';
import ChatView from '@/views/ChatView.vue';
import HomeView from '@/views/HomeView.vue';
import SignInView from '@/views/SignInView.vue';
import SignUpView from '@/views/SignUpView.vue';

enum RouteNames {
  HOME = 'home',
  SIGN_IN = 'signin',
  SIGN_UP = 'signup',
  CHAT = 'chat',
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: RouteNames.HOME,
      component: HomeView,
    },
    {
      path: '/signup',
      name: RouteNames.SIGN_IN,
      component: SignUpView,
    },
    {
      path: '/signin',
      name: RouteNames.SIGN_UP,
      component: SignInView,
    },
    {
      path: '/chat',
      name: RouteNames.CHAT,
      component: ChatView,
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Если пользователь авторизован и пытается попасть на главную, авторизации, логина
  const guestOnlyRoutes: RouteNames[] = [RouteNames.HOME, RouteNames.SIGN_IN, RouteNames.SIGN_UP];

  if (authStore.isAuthenticated && to.name && guestOnlyRoutes.includes(to.name as RouteNames)) {
    return next({ name: RouteNames.CHAT }); // Редирект на чат
  }

  if (!authStore.isAuthenticated && to.name === 'chat') {
    return next({ name: RouteNames.HOME });
  }

  next();
});

export default router;
