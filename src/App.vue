<script setup lang="ts">
  import { onMounted } from 'vue';
  import { toast, Toaster } from 'vue-sonner';
  import { RouterView, useRouter } from 'vue-router'

  import UiHeader from './components/layout/UiHeader.vue';
  import UiFooter from './components/layout/UiFooter.vue';
  import { useAuthStore } from './stores/auth';

  const auth = useAuthStore();
  const router = useRouter();

  router.beforeEach((to) => {
    if (to.meta.requireAuth && !auth.isAuthenticated) {
      return {
        path: '/sign-in',
        query: { redirect: to.path }
      }
    }
  })

  onMounted(async () => {
    const res = await auth.trySignIn();

    if (res.status === 'email') {
      return toast.error('Возможно, вы не подтвердили почту.')
    }
  })
</script>

<template>
  <Toaster rich-colors :toast-options="{
    style: {
      padding: '12px'
    }
  }" />
  <UiHeader />
  <main>
    <RouterView />
  </main>
  <UiFooter />
</template>

<style>
  body {
    font-family: 'Gilroy';
    font-weight: normal;
    font-size: 18px;
    line-height: 1.5;
    background-color: rgb(226, 217, 200);
    width: 100%;
  }

  body>#app {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
  }

  .container {
    margin-inline: 50px;
  }

  main {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  input {
    box-shadow: none;
    outline: none;
  }

  textarea {
    box-shadow: none;
    outline: none;
  }

  @media (max-width: 700px) {
    .container {
      margin-inline: 20px;
    }
  }
</style>
