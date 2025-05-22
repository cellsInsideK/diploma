<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { getPublicImageUrl } from '@/lib/getPublicImageUrl';
  import type { LocalCartItem } from '@/stores/cartItem';
  import { useCartStore } from '@/stores/cart';

  const { item } = defineProps<{
    item: LocalCartItem
  }>();

  const cart = useCartStore();

  const counter = ref(item.quantity);
  const milkType = ref(item.selectedMilk);
  const toppingType = ref(item.selectedTopping);

  const milkTypeList = item.milk;
  const toppingTypeList = item.toppings;

  const handleClick = (action: '+' | '-') => {
    if (action === '+') {
      if (item.amount > counter.value) {
        return counter.value++
      }

      if (item.amount === counter.value) {
        return
      }
    }

    if (counter.value === 1) return

    return counter.value--;
  }

  watch(counter, () => {
    cart.setQuantity(item.localId, counter.value)
  })

  watch(milkType, () => {
    cart.setMilkType(item.localId, milkType.value)
  })

  watch(toppingType, () => {
    cart.setToppingType(item.localId, toppingType.value)
  })
</script>

<template>
  <div class="item">
    <div class="item-top">
      <div class="card">
        <img class="card-img" :src="getPublicImageUrl(item.image)" alt="">
        <h2 class="card-title">{{ item.title }}</h2>
      </div>
      <div class="item-btns">
        <button @click="handleClick('-')"><img src="/minus.svg" alt="add item"></button>
        <p>{{ counter }}</p>
        <button @click="handleClick('+')"><img src="/plus.svg" alt="reduce item"></button>
        <button><img @click="cart.deleteItem(item.localId)" src="/delete.svg" alt="delete item"></button>
      </div>
    </div>
    <div class="item-bottom" :style="{ 'margin-left': item.type !== 'coffee' ? 'auto' : '' }">
      <div v-if="item.type === 'coffee'" class="toppings">
        <h3>Молоко:</h3>
        <div class="list">
          <template v-for="option in milkTypeList" :key="option.value">
            <label><input type="radio" :id="option.value" :value="option.value" v-model="milkType" />
              {{ option.label }} ({{ option.price }} ₽)</label>
          </template>
        </div>
        <h3>Добавки:</h3>
        <div class="list">
          <template v-for="option in toppingTypeList" :key="option.value">
            <label><input type="radio" :id="option.value" :value="option.value" v-model="toppingType" />
              {{ option.label }} ({{ option.price }} ₽)</label>
          </template>
        </div>
      </div>
      <div class="price">
        <h3>Стоимость: <span>{{ cart.getPrice(item.localId) }} ₽</span></h3>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .item {
    background-color: rgb(48, 38, 28);
    border-radius: 15px;
    padding-inline: 50px;
    padding-block: 20px;
    display: flex;
    flex-direction: column;
    gap: 25px;
  }

  .card {
    background-color: white;
    border-radius: 16px;
    font-weight: bold;
    max-width: 200px;
    padding: 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .card-title {
    text-align: center;
    max-width: 150px;
  }

  .item-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .item-btns {
    display: flex;
    gap: 15px;
    align-items: center;
    color: white;
    font-size: 28px;
    font-weight: bold;
  }

  .item-btns button {
    background-color: transparent;
    border: none;
    cursor: pointer;
  }

  .item-bottom {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    color: white;
  }

  .toppings h3 {
    font-weight: bold;
  }

  .toppings h3:last-of-type {
    margin-top: 25px;
  }

  .list {
    display: flex;
    flex-wrap: wrap;
  }

  label {
    margin-right: 15px;
  }

  .price {
    font-size: 20px;
  }

  .price span {
    font-size: 26px;
    color: rgb(200, 160, 119)
  }

  @media (max-width: 700px) {
    .item {
      padding-inline: 25px;
    }

    .item-top {
      flex-direction: column;
      gap: 15px;
      align-items: center;
    }

    .item-bottom {
      flex-direction: column;
      gap: 15px;
      align-items: start;
    }

    .list {
      flex-direction: column;
    }
  }
</style>