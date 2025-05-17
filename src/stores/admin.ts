import { onMounted, ref, type Ref } from 'vue';
import { defineStore } from 'pinia';
import { supabase } from '@/lib/supabaseClient';

export interface User {
  id: string;
  login: string;
  email: string;
  role: string;
}

export interface Booking {
  id: string;
  name: string;
  tel: string;
  description: string;
}

export interface Delivery {
  id: string;
  items: string;
  tel: string;
  address: string;
  comment: string;
  status: string;
  date: string;
  userId: string;
  totalPrice: number;
  reason: string;
}

export interface Menu {
  id: string;
  title: string;
  price: number;
  type: string;
  image: string;
  desc: string;
  amount: number;
}

export const useAdminStore = defineStore('admin', () => {
  const users = ref();
  const bookings = ref();
  const deliveries = ref();
  const menu = ref();

  // GET

  async function getUsers() {
    const { data, error } = await supabase.from('users').select();

    if (error) {
      return false;
    }

    users.value = data;
  }

  async function getMenu() {
    const { data, error } = await supabase.from('menu').select();

    if (error) {
      return false;
    }

    menu.value = data;
  }

  async function getBookings() {
    const { data, error } = await supabase.from('booking').select();

    if (error) {
      return false;
    }

    bookings.value = data;
  }

  async function getDeliveries() {
    const { data, error } = await supabase.from('delivery').select();

    if (error) {
      return false;
    }

    deliveries.value = data;
  }

  // UPDATE

  async function updateUser(user: User) {
    const { error } = await supabase
      .from('users')
      .update({ login: user.login, email: user.email, role: user.role })
      .eq('id', user.id);

    if (error) {
      return false;
    }

    await getUsers();

    return true;
  }

  async function updateBooking(booking: Booking) {
    const { error } = await supabase
      .from('booking')
      .update({ name: booking.name, tel: booking.tel, description: booking.description })
      .eq('id', booking.id);

    if (error) {
      return false;
    }

    await getBookings();

    return true;
  }

  //TODO change amount
  async function updateDelivery(delivery: Delivery) {
    console.log(delivery);
    //@ts-expect-error asdw
    const obj = delivery.items.map((i: string) => JSON.parse(i));
    const { data } = await supabase.from('delivery').select().eq('id', delivery.id);

    if (data![0].status === 'process' && delivery.status === 'cancelled') {
      //@ts-expect-error asd
      obj.forEach(async (item) => {
        const { error } = await supabase.rpc('increase_product_amount', {
          menu_id: item.id,
          increase_amount: item.quantity,
        });

        if (error) {
          console.log(error);
          return false;
        }
      });
    }

    const { error } = await supabase
      .from('delivery')
      .update({ status: delivery.status, reason: delivery.reason })
      .eq('id', delivery.id);

    if (error) {
      return false;
    }

    await getDeliveries();

    return true;
  }

  async function updateMenu(menu: Menu, image?: Ref<File | null>) {
    if (image?.value) {
      const { error } = await supabase.storage
        .from('images')
        .upload(image.value.name, image.value, { upsert: true });

      if (error) {
        return false;
      }
    }

    const { error } = await supabase
      .from('menu')
      .update({
        title: menu.title,
        price: menu.price,
        type: menu.type,
        image: menu.image,
        desc: menu.desc,
        amount: menu.amount,
      })
      .eq('id', menu.id);

    if (error) {
      return false;
    }

    await getMenu();

    return true;
  }

  // DELETE

  async function deleteBooking(booking: Booking) {
    const { error } = await supabase.from('booking').delete().eq('id', booking.id);

    if (error) {
      return false;
    }

    await getBookings();

    return true;
  }

  // TODO check status
  async function deleteDelivery(delivery: Delivery) {
    const { error } = await supabase.from('delivery').delete().eq('id', delivery.id);

    if (error) {
      return false;
    }

    await getDeliveries();

    return true;
  }

  async function deleteMenu(menu: Menu) {
    const { error } = await supabase.from('menu').delete().eq('id', menu.id);

    if (error) {
      return false;
    }

    await getMenu();

    return true;
  }

  // CREATE

  async function createBooking(booking: Booking) {
    const { error } = await supabase
      .from('booking')
      .insert({ name: booking.name, tel: booking.tel, description: booking.description });

    if (error) {
      return false;
    }

    await getBookings();

    return true;
  }

  async function createMenu(menu: Menu, image: Ref<File | null>) {
    if (!image.value) {
      return false;
    }

    const { error: imageError } = await supabase.storage
      .from('images')
      .upload(image.value.name, image.value, { upsert: true });

    if (imageError) {
      return false;
    }

    const milk = [
      { label: 'Обычное', price: 0, value: 'default' },
      { label: 'Кокосовое', price: 25, value: 'coconut' },
      { label: 'Овсяное', price: 25, value: 'oat' },
    ];
    const toppings = [
      { label: 'Без добавок', price: 0, value: 'default' },
      { label: 'Карамельный сироп', price: 45, value: 'caramel' },
      { label: 'Шоколадный сироп', price: 45, value: 'chocolate' },
    ];

    const { error } = await supabase.from('menu').insert({
      title: menu.title,
      price: menu.price,
      type: menu.type,
      image: menu.image,
      desc: menu.desc,
      amount: menu.amount,
      milk,
      toppings,
    });

    if (error) {
      return false;
    }

    await getMenu();

    return true;
  }

  onMounted(async () => {
    await getUsers();
    await getBookings();
    await getDeliveries();
    await getMenu();
  });

  return {
    users,
    bookings,
    deliveries,
    menu,
    updateUser,
    updateBooking,
    deleteBooking,
    createBooking,
    updateDelivery,
    deleteDelivery,
    updateMenu,
    deleteMenu,
    createMenu,
  };
});
