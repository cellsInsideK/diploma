<script setup lang="ts">
  import { ref } from 'vue';
  import { toast } from 'vue-sonner';
  import { getPublicImageUrl } from '@/lib/getPublicImageUrl';
  import { supabase } from '@/lib/supabaseClient';
  import { statusMap, type DeliveryItem, type LocalCartItem } from '@/stores/cartItem';
  import { useCartStore } from '@/stores/cart';
  import router from '@/router';


  const { delivery } = defineProps<{
    delivery: DeliveryItem
  }>()

  const cart = useCartStore();

  //@ts-expect-error typing error
  const items = ref<LocalCartItem[]>(delivery.items.map(i => JSON.parse(i)))

  const getDeliveryDescription = (item: LocalCartItem) => {
    const titles = [];

    if (item.type !== 'coffee') {
      return item.title
    }

    const milk = item.milk?.reduce((acc, curr) => {
      if (curr.value === item.selectedMilk) {
        return acc = curr.label
      }
      return acc;
    }, '')

    const topping = item.toppings?.reduce((acc, curr) => {
      if (curr.value === item.selectedTopping) {
        return acc = curr.label
      }
      return acc;
    }, '')

    titles.push(item.title, milk, topping);

    return titles.join(' + ');
  }

  const getDeliveryPrice = (item: LocalCartItem) => {
    const price = item.price;

    if (item.type !== 'coffee') {
      return price
    }

    const milk = item.milk!.reduce((acc, curr) => {
      if (curr.value === item.selectedMilk) {
        return acc += curr.price
      }
      return acc;
    }, 0)

    const topping = item.toppings!.reduce((acc, curr) => {
      if (curr.value === item.selectedTopping) {
        return acc += curr.price
      }
      return acc;
    }, 0)

    return price + milk + topping;
  }

  const handleCancle = async () => {
    const { error } = await supabase.from('delivery').update({ 'status': 'cancelled' }).eq('id', delivery.id);

    if (error) {
      return toast.error('Попробуйте позже')
    }

    toast.success('Заказ отменен')

    return router.go(0);
  }

  const handleRepeat = async () => {
    const res = await cart.setDelivery(delivery.tel, delivery.address, delivery.comment, items.value);

    if (!res) {
      return toast.error('Произошла ошибка');
    }

    return toast.success('Заказ создан');
  }
</script>

<template>
  <div class="delivery">
    <div class="top">
      <div class="info">
        <p class="number">Заказ #{{ delivery.id.slice(0, 6) }}</p>
        <p class="date">От {{ new Date(delivery.date).toLocaleString('ru', {
          dateStyle: 'short', timeStyle: 'short'
        }) }}</p>
        <p class="status">{{ statusMap.get(delivery.status) }} {{ delivery.status === 'cancelled' ?
          `(${delivery.reason})` : '' }}</p>
      </div>
      <img @click="handleRepeat" class="repeat" src="/repeat.svg" alt="repeat delivery">
    </div>
    <p class="mobileDate"> От {{ new Date(delivery.date).toLocaleString('ru', {
      dateStyle: 'short', timeStyle: 'short'
    }) }}</p>
    <p class="mobileReason">{{ statusMap.get(delivery.status) }} {{ delivery.status === 'cancelled' ?
      `(${delivery.reason})` : '' }}</p>
    <div class="main">
      <template v-for="item in items" :key="item.localId">
        <div class="main-inner">
          <div class="card">
            <img class="card-img" :src="getPublicImageUrl(item.image)" alt="delivery item image">
            <h2 class="card-title">{{ item.title }}</h2>
          </div>
          <div class="main-info">
            <p>{{ getDeliveryDescription(item) }}</p>
            <p>{{ item.quantity }} шт</p>
            <p>{{ getDeliveryPrice(item) }} ₽</p>
          </div>
        </div>
      </template>
    </div>
    <div class="bottom">
      <p>Сумма заказа: <span>{{ delivery.totalPrice }} ₽</span></p>
      <button v-if="delivery.status === 'process'" @click="handleCancle" class="button" type="button">Отменить
        заказ</button>
    </div>
  </div>
</template>

<style scoped>
  .delivery {
    background-color: rgb(48, 38, 28);
    border-radius: 15px;
    padding-inline: 50px;
    padding-block: 20px;
    font-size: 20px;
    color: white;
    display: flex;
    flex-direction: column;
    gap: 25px;
  }

  .card {
    background-color: white;
    color: black;
    border-top-left-radius: 25px;
    border-top-right-radius: 25px;
    font-weight: bold;
    max-width: 200px;
    padding: 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .main {
    display: flex;
    flex-direction: column;
    gap: 25px;
  }

  .main-inner {
    display: flex;
    align-items: flex-start;
    gap: 100px;
  }

  .main-info {
    display: flex;
    gap: 25px;
    color: rgb(200, 160, 119);
    font-weight: 700;
    font-size: 18px;
  }

  .bottom {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 15px
  }

  .button {
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

  .info {
    display: flex;
    gap: 20px;
    align-items: center;
  }

  .number {
    font-weight: 700;
  }

  .date {
    font-weight: 700;
    color: rgba(255, 234, 234, 0.5)
  }

  .mobileDate {
    display: none;
    font-weight: 700;
    color: rgba(255, 234, 234, 0.5);
    margin-block: -20px;
  }

  .mobileReason {
    display: none;
    font-weight: 700;
    color: rgba(255, 234, 234, 0.5);
  }

  .status {
    font-weight: 700;
  }

  .repeat {
    cursor: pointer;
  }

  @media (max-width: 1000px) {
    .delivery {
      padding-inline: 20px;
      font-size: 18px;
    }

    .repeat {
      width: 35px;
      aspect-ratio: 1;
    }

    .date {
      display: none;
    }

    .mobileDate {
      display: block;
    }

    .mobileReason {
      display: block;
    }

    .status {
      display: none;
    }

    .main-inner {
      flex-direction: column;
      gap: 15px;
      align-items: center;
    }

    .main-info {
      gap: 10px;
      flex-wrap: wrap;
      justify-content: space-between;
    }

    .bottom {
      align-items: center;
    }
  }
</style>