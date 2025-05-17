<script setup lang="ts">
  import { toast } from 'vue-sonner';
  import { RouterLink } from 'vue-router';

  import { getPublicImageUrl } from '@/lib/getPublicImageUrl';
  import { useCartStore } from '@/stores/cart';
  import type { CartItem } from '@/stores/cartItem';

  const { item } = defineProps<{
    item: CartItem
  }>()

  const cart = useCartStore();

  const handleAddToCart = () => {
    if (item.amount === 0) {
      return toast.error('Товар закончился!')
    }

    if (!cart.addToCart(item)) {
      return toast.error('Необходимо зарегистрироваться чтобы совершать покупки');
    }

    return toast.success('Товар добавлен в корзину');
  }
</script>

<template>
  <RouterLink :to="item.id" class="card">
    <img class="card-img" :src="getPublicImageUrl(item.image)" :alt="item.title">
    <h2 class="card-title">{{ item.title }}</h2>
    <div class="card-bottom">
      <button @click.prevent="handleAddToCart" class="card-btn"><img src="/buy.svg" alt=""></button>
      <p class="card-price">{{ item.price }} ₽</p>
    </div>
  </RouterLink>
</template>

<style scoped>
  .card {
    background-color: white;
    border-top-left-radius: 25px;
    border-top-right-radius: 25px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
    font-weight: bold;
    padding: 25px;
    max-width: 200px;
    text-decoration: none;
    color: black
  }

  .card-img {
    width: 150px;
    aspect-ratio: 1;
    object-fit: contain;
  }

  .card-title {
    max-width: 150px;
    text-align: center;
  }

  .card-bottom {
    margin-top: 15px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .card-btn {
    background-color: transparent;
    border: none;
    cursor: pointer;
  }

  .card-btn>img {
    width: 32px;
    aspect-ratio: 1;
  }
</style>