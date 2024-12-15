import { createRouter, createWebHistory } from 'vue-router';

import MainPage from '@/pages/MainPage.vue';
import SignUpPage from '@/pages/SignUpPage.vue';
import SignInPage from '@/pages/SignInPage.vue';
import MenuPage from '@/pages/MenuPage.vue';
import CartPage from '@/pages/CartPage.vue';
import ProfilePage from '@/pages/ProfilePage.vue';
import DeliveryPage from '@/pages/DeliveryPage.vue';
import ItemPage from '@/pages/ItemPage.vue';

//TODO 3)admin page
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainPage,
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: SignUpPage,
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      component: SignInPage,
    },
    {
      path: '/menu',
      name: 'menu',
      component: MenuPage,
    },
    {
      path: '/cart',
      name: 'cart',
      meta: {
        requireAuth: true,
      },
      component: CartPage,
    },
    {
      path: '/profile',
      name: 'profile',
      meta: {
        requireAuth: true,
      },
      component: ProfilePage,
    },
    {
      path: '/delivery',
      name: 'delivery',
      meta: {
        requireAuth: true,
      },
      component: DeliveryPage,
    },
    {
      path: '/:id',
      name: 'item',
      component: ItemPage,
    },
  ],
  scrollBehavior: (to) => {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' };
    } else {
      return { top: 0 };
    }
  },
});

export default router;
