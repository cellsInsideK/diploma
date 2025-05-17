import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { useAuthStore } from './auth';
import type { CartItem, LocalCartItem } from './cartItem';
import { supabase } from '@/lib/supabaseClient';

export const useCartStore = defineStore('cart', () => {
  const localId = ref(0);
  const items = ref<LocalCartItem[]>([]);
  const isEmpty = computed(() => items.value.length === 0);

  const auth = useAuthStore();

  const totalPrice = computed(() => {
    let price = 0;

    items.value.forEach((item) => {
      const milk =
        item.milk?.reduce(
          (acc, cur) => (item.selectedMilk === cur.value ? (acc += cur.price) : (acc += 0)),
          0,
        ) ?? 0;
      const topping =
        item.toppings?.reduce(
          (acc, cur) => (item.selectedTopping === cur.value ? (acc += cur.price) : (acc += 0)),
          0,
        ) ?? 0;

      return (price += item.price * item.quantity + milk + topping);
    });

    return price;
  });

  const clearCart = () => {
    localId.value = 0;
    items.value = [];
  };

  const addToCart = (item: CartItem, milk?: string, topping?: string) => {
    const milkTopping = milk || 'default';
    const top = topping || 'default';

    if (!auth.isAuthenticated) {
      return false;
    }

    return items.value.push({
      ...item,
      localId: localId.value++,
      quantity: 1,
      selectedMilk: item.milk ? milkTopping : '',
      selectedTopping: item.toppings ? top : '',
    });
  };

  const deleteItem = (id: number) => {
    items.value = items.value.filter((item) => item.localId !== id);
  };

  const setMilkType = (id: number, type: string) => {
    const idx = items.value.findIndex((item) => item.localId === id);
    items.value[idx].selectedMilk = type;
  };

  const setToppingType = (id: number, type: string) => {
    const idx = items.value.findIndex((item) => item.localId === id);
    items.value[idx].selectedTopping = type;
  };

  const setQuantity = (id: number, quantity: number) => {
    const idx = items.value.findIndex((item) => item.localId === id);
    items.value[idx].quantity = quantity;
  };

  const getPrice = (id: number) => {
    const idx = items.value.findIndex((item) => item.localId === id);

    const milkPrice =
      items.value[idx].milk?.reduce(
        (acc, cur) =>
          items.value[idx].selectedMilk === cur.value ? (acc += cur.price) : (acc += 0),
        0,
      ) ?? 0;

    const toppingsPrice =
      items.value[idx].toppings?.reduce(
        (acc, cur) =>
          items.value[idx].selectedTopping === cur.value ? (acc += cur.price) : (acc += 0),
        0,
      ) ?? 0;

    return items.value[idx].price * items.value[idx].quantity + milkPrice + toppingsPrice;
  };

  const setDelivery = async (
    tel: string,
    address: string,
    comment: string,
    itemsProp?: LocalCartItem[],
  ) => {
    const date = new Date().toISOString();
    const status = 'process';
    const userId = auth.user?.id;

    if (itemsProp) {
      items.value = itemsProp;
    }

    if (isEmpty.value) {
      return false;
    }

    const itemsJSON = items.value.map((item) => JSON.stringify(item));

    items.value.forEach(async (item) => {
      const { error } = await supabase.rpc('decrease_product_amount', {
        menu_id: item.id,
        decrease_amount: item.quantity,
      });

      if (error) {
        console.log(error);
        return false;
      }
    });

    const { error } = await supabase.from('delivery').insert({
      tel,
      address,
      comment,
      date,
      userId,
      status,
      items: itemsJSON,
      totalPrice: totalPrice.value,
    });

    if (error) {
      console.log(error);
      return false;
    }

    clearCart();

    return true;
  };

  return {
    items,
    isEmpty,
    totalPrice,
    clearCart,
    addToCart,
    deleteItem,
    setMilkType,
    setToppingType,
    setQuantity,
    getPrice,
    setDelivery,
  };
});
