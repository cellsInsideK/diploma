<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { toast } from 'vue-sonner';

  import { useAuthStore } from '@/stores/auth';

  const email = ref('');
  const password = ref('');

  const auth = useAuthStore();
  const router = useRouter();

  const onSubmit = async () => {
    if (email.value === '' || password.value === '')
      return toast.error('Необходимо заполнить все поля');

    const success = await auth.signIn(email.value, password.value);

    if (!success)
      return toast.error('Что-то пошло не так. Попробуйте позже')

    toast.success('Вход завершен');
    return router.push('/');
  }
</script>

<template>
  <div class="container">
    <div class="inner">
      <form>
        <label class="label" for="email">Email:</label>
        <input v-model="email" class="input" id="email" type="email" placeholder="Введите email">

        <label class="label" for="password">Пароль:</label>
        <input v-model="password" class="input" id="password" type="password" placeholder="Введите пароль">

        <button @click="onSubmit" class="submit" type="button">Войти</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
  }

  .inner {
    max-width: 400px;
    width: 100%;
  }

  form {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .label {
    display: flex;
    gap: 10px;
    align-items: center;
    font-size: 20px;
    color: rgb(48, 38, 28);
    user-select: none;
  }

  .input {
    padding-block: 16px;
    padding-inline: 20px;
    display: inline-flex;
    align-items: center;
    background-color: transparent;
    border: 1px rgb(200, 160, 119) solid;
    border-radius: 10px;
    color: rgb(48, 38, 28);
    font-size: 16px;
    margin-bottom: 15px;
  }

  .input::placeholder {
    color: rgb(200, 160, 119);
  }

  .submit {
    background-color: rgb(200, 160, 119);
    color: rgb(226, 217, 200);
    border: none;
    border-radius: 10px;
    padding-block: 14px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    margin-top: 15px;
  }
</style>