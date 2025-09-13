import { createRouter, createWebHistory } from 'vue-router';
import ChatLayout from '@/layouts/ChatLayout.vue';
import HomeLayout from '@/layouts/HomeLayout.vue';
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
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      component: HomeLayout,
      children: [
        {
          path: '',
          name: RouteNames.HOME,
          component: HomeView,
        },
        {
          path: 'signup',
          name: RouteNames.SIGN_UP,
          component: SignUpView,
        },
        {
          path: 'signin',
          name: RouteNames.SIGN_IN,
          component: SignInView,
        },
      ],
    },
    {
      path: '/chat',
      component: ChatLayout,
      children: [
        {
          path: '',
          name: RouteNames.CHAT,
          component: ChatView,
        },
      ],
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  const guestOnlyRoutes: RouteNames[] = [RouteNames.HOME, RouteNames.SIGN_IN, RouteNames.SIGN_UP];

  if (authStore.isAuthenticated && to.name && guestOnlyRoutes.includes(to.name as RouteNames)) {
    return next({ name: RouteNames.CHAT });
  }

  if (!authStore.isAuthenticated && to.name === RouteNames.CHAT) {
    return next({ name: RouteNames.HOME });
  }

  next();
});

export default router;
