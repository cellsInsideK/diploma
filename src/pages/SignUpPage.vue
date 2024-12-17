<script setup lang="ts">
  import { ref } from 'vue';
  import { toast } from 'vue-sonner';

  import UiModal from '@/components/UiModal.vue';
  import { useAuthStore } from '@/stores/auth';
  import { validateEmail } from '@/lib/validateEmail';

  const email = ref('');
  const login = ref('');
  const password = ref('');
  const confirm = ref('');

  const modalVisible = ref(false);

  const auth = useAuthStore();

  const onSubmit = async () => {
    if (email.value === '' || login.value === '' || password.value === '' || confirm.value === '')
      return toast.error('Необходимо заполнить все поля');

    if (!validateEmail(email.value))
      return toast.error('Неверно указан email')

    if (password.value.length <= 6)
      return toast.error('Пароль меньше 6 символов')

    if (password.value !== confirm.value)
      return toast.error('Пароли не совпадают')

    const success = await auth.signUp(email.value, password.value, login.value);

    if (!success)
      return toast.error('Что-то пошло не так. Попробуйте позже')

    return modalVisible.value = true;
  }
</script>

<template>
  <UiModal v-model="modalVisible">
    <div class="modal">
      <h2 class="title">Подтверждение учетной записи</h2>
      <p class="text">На адрес: <span>{{ email }}</span> была отправлена ссылка перейдите по ней
        для того
        чтобы подтвердить
        регистрацию учетной записи </p>
      <button class="submit">Закрыть</button>
    </div>
  </UiModal>
  <div class="container">
    <div class="inner">
      <form>
        <label class="label" for="email">Email:</label>
        <input v-model="email" class="input" id="email" type="email" placeholder="Введите email">

        <label class="label" for="login">Логин:</label>
        <input v-model="login" class="input" id="login" type="text" placeholder="Введите логин">

        <label class="label" for="password">Пароль:</label>
        <input v-model="password" class="input" id="password" type="password" placeholder="Введите пароль">

        <label class="label" for="confirm">Подтвердите пароль:</label>
        <input v-model="confirm" class="input" id="confirm" type="password" placeholder="Повторите пароль">

        <button @click="onSubmit" class="submit" type="button">Зарегистрироваться</button>
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
    width: 100%;
    flex-direction: column;
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

  .modal {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .title {
    font-weight: 700;
    font-size: 24px;
  }

  .text {
    text-align: justify;
  }

  .text>span {
    font-weight: 700;
  }
</style>