<script setup lang="ts">
  import { toast } from 'vue-sonner';
  import { useRouter } from 'vue-router';
  import UiCartItem from '@/components/UiCartItem.vue';
  import { getPluralForCart } from '@/lib/getPluralForCart';
  import { useCartStore } from '@/stores/cart';

  const cart = useCartStore();
  const router = useRouter();

  const handleSumbit = () => {
    if (cart.isEmpty) {
      return toast.error('Необходимо добавить товары')
    }

    return router.push('/delivery')
  }
</script>

<template>
  <div class="container">
    <header class="header">
      <h2 class="title">Корзина</h2>
      <button v-if="!cart.isEmpty" @click="cart.clearCart" class="header-btn" type="button"><img src="/delete.svg"
          alt=""></button>
    </header>
    <div class="cart">
      <div class="items">
        <template v-for="item in cart.items" :key="item.id">
          <UiCartItem :item="item" />
        </template>
      </div>
      <div class="total">
        <div class="total-price">
          <p>Итого:</p>
          <p>{{ cart.totalPrice }} ₽</p>
        </div>
        <p>{{ getPluralForCart(cart.items.length) }}</p>
        <button @click="handleSumbit" class="submit">К оформлению</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .header {
    display: flex;
    gap: 20px;
    margin-top: 50px;
    margin-bottom: 30px;
  }

  .title {
    font-size: 28px;
    font-weight: bold;
  }

  .header-btn {
    padding: 0;
    background-color: transparent;
    border: none;
    cursor: pointer;
  }

  .header-btn>img {
    width: 40px;
    aspect-ratio: 1;
  }

  .cart {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 30px;
    margin-bottom: 25px;
  }

  .items {
    display: flex;
    flex-direction: column;
    gap: 25px;
  }

  .total {
    background-color: rgb(48, 38, 28);
    border-radius: 15px;
    padding: 25px 35px;
    min-width: 200px;
    color: rgb(200, 160, 119);
    height: fit-content;
  }

  .total-price {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    font-size: 20px;
    font-weight: bold;
  }

  .total-price p:last-child {
    font-size: 24px;
  }

  .submit {
    width: 100%;
    background-color: rgb(200, 160, 119);
    color: white;
    border: none;
    border-radius: 10px;
    padding-block: 10px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    margin-top: 20px;
  }

  @media (max-width: 1000px) {
    .cart {
      grid-template-columns: 1fr;
    }
  }
</style>