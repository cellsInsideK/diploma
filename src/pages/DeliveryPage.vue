<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { toast } from 'vue-sonner';
  import { useCartStore } from '@/stores/cart';

  const cart = useCartStore();
  const router = useRouter()

  const tel = ref('');
  const address = ref('');
  const comment = ref('');

  const handleSubmit = async () => {
    if (tel.value === '' || address.value === '') {
      return toast.error('Необходимо ввести номер и адрес');
    }

    if (!await cart.setDelivery(tel.value, address.value, comment.value)) {
      return toast.error('Попробуйте позже');
    }

    toast.success('Доставка создана, ожидайте');

    return router.push('/');
  }
</script>

<template>
  <div class="container">
    <h2 class="title">Оформление заказа</h2>
    <label class="label">Номер телефона:<input v-model="tel" type="tel" class="input"
        placeholder="Введите номер телефона"></label>
    <label class="label">Адрес доставки:<input v-model="address" type="text" class="input"
        placeholder="Введите адрес доставки"></label>
    <label class="label">Комментарий:<input v-model="comment" type="text" class="input"
        placeholder="Напишите пожелания к доставке"></label>
    <button @click="handleSubmit" type="button" class="submit">Подтвердить заказ</button>
  </div>
</template>

<style scoped>
  .title {
    font-weight: 700;
    font-size: 36px;
    margin-top: 25px;
    margin-bottom: 15px;
  }

  .label {
    font-weight: 500;
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 15px;
  }

  .input {
    max-height: 50px;
    max-width: 450px;
    padding-block: 16px;
    padding-inline: 20px;
    display: inline-flex;
    align-items: center;
    background-color: transparent;
    border: 1px rgb(200, 160, 119) solid;
    border-radius: 10px;
    color: rgb(48, 38, 28);
    font-size: 16px;
  }

  .input::placeholder {
    color: rgb(200, 160, 119)
  }

  .submit {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    background-color: rgb(200, 160, 119);
    color: rgb(226, 217, 200);
    border: none;
    border-radius: 10px;
    padding-block: 14px;
    max-width: 450px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
  }

  @media (max-width: 1000px) {
    .title {
      font-size: 24px;
      margin-top: 15px;
    }
  }
</style>