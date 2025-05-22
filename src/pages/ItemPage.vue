<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { toast } from 'vue-sonner';
  import { getPublicImageUrl } from '@/lib/getPublicImageUrl';
  import { supabase } from '@/lib/supabaseClient';
  import { useCartStore } from '@/stores/cart';
  import type { CartItem } from '@/stores/cartItem';
  import UiLoader from '@/components/UiLoader.vue';

  const item = ref<CartItem>();
  const loading = ref(true);
  const selectedMilk = ref('default');
  const selectedTopping = ref('default');
  const route = useRoute();
  const router = useRouter();
  const cart = useCartStore();

  onMounted(async () => {
    const { data, error } = await supabase.from('menu').select('*').eq('id', route.params.id);

    if (error) {
      return toast.error('Попробуйте позже');
    }

    loading.value = false;
    item.value = data![0];
  })

  const getPrice = computed(() => {
    const milkPrice =
      item.value?.milk?.reduce(
        (acc, cur) =>
          selectedMilk.value === cur.value ? (acc += cur.price) : (acc += 0),
        0,
      ) || 0;

    const toppingsPrice =
      item.value?.toppings?.reduce(
        (acc, cur) =>
          selectedTopping.value === cur.value ? (acc += cur.price) : (acc += 0),
        0,
      ) || 0;

    return (item.value?.price || 0) + milkPrice + toppingsPrice;
  })

  const handleClick = () => {
    const res = cart.addToCart(item.value!, selectedMilk.value, selectedTopping.value);

    if (!res) {
      return toast.error('Необходимо войти в аккаунт')
    }

    toast.success('Товар добавлен в корзину')
    return router.push('/cart');
  }
</script>

<template>
  <UiLoader :is-loading="loading">
    <div class="container">
      <div class="item">
        <div class="item-inner">
          <div class="card">
            <img class="card-img" :src="getPublicImageUrl(item?.image || '')" alt="item image">
          </div>
          <div>
            <h2 class="title">{{ item?.title }}</h2>
            <p class="desc">{{ item?.desc }}</p>
            <p class="price">Цена: <span>{{ getPrice }} ₽</span></p>
            <div v-if="item?.type === 'coffee'">
              <p class="topping">Молоко:</p>
              <div class="list">
                <template v-for="option in item.milk" :key="option.value">
                  <label><input type="radio" :id="option.value" :value="option.value" v-model="selectedMilk" />
                    {{ option.label }} ({{ option.price }} ₽)</label>
                </template>
              </div>
              <p class="topping">Добавки:</p>
              <div class="list">
                <template v-for="option in item.toppings" :key="option.value">
                  <label><input type="radio" :id="option.value" :value="option.value" v-model="selectedTopping" />
                    {{ option.label }} ({{ option.price }} ₽)</label>
                </template>
              </div>
            </div>
            <button @click="handleClick" class="button" type="button">В корзину</button>
          </div>
        </div>
      </div>
    </div>
  </UiLoader>
</template>

<style scoped>
  .item {
    background-color: rgb(48, 38, 28);
    border-radius: 15px;
    padding-inline: 50px;
    padding-block: 35px;
    display: flex;
    flex-direction: column;
    gap: 25px;
    color: white;
    margin-block: 20px;
  }

  .item-inner {
    display: flex;
    gap: 100px;
  }

  .card {
    height: fit-content;
    background-color: white;
    border-radius: 16px;
    font-weight: bold;
    width: 300px;
    aspect-ratio: 1;
    padding: 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .card-img {
    max-width: 300px;
    width: 100%;
    aspect-ratio: 1;
    margin-block: auto;
    object-fit: cover;
  }

  .title {
    font-weight: 700;
    font-size: 36px;
  }

  .desc {
    margin-top: 15px;
    margin-bottom: 20px;
    max-width: 500px;
  }

  .topping {
    font-weight: 700;
    font-size: 24px;
  }

  .price {
    font-weight: 700;
    font-size: 32px;
  }

  .price>span {
    color: rgb(200, 160, 119);
  }

  .list {
    display: flex;
    flex-wrap: wrap;
    margin-block: 10px;
  }

  .button {
    margin-top: 20px;
    background-color: rgb(200, 160, 119);
    color: rgb(226, 217, 200);
    border: none;
    border-radius: 10px;
    padding-block: 14px;
    padding-inline: 35px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
  }

  @media (max-width: 1000px) {
    .item-inner {
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }

    .card {
      max-width: 300px;
      width: 100%;
    }
  }
</style>