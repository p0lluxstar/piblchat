import './assets/styles/main.scss';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './store/useAuthStore';

const app = createApp(App);
const pinia = createPinia;

app.use(pinia());
app.use(router);

// Проверка токена при загрузке
const authStore = useAuthStore();
authStore.checkAuth();

app.mount('#app');
