<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { toast } from 'vue-sonner';

  import UiDeliveryItem from '@/components/UiDeliveryItem.vue';
  import UiLoader from '@/components/UiLoader.vue';
  import UiAdminPanel from '@/components/UiAdminPanel.vue';
  import { supabase } from '@/lib/supabaseClient';
  import { useAuthStore } from '@/stores/auth';
  import type { DeliveryItem } from '@/stores/cartItem';

  const deliveries = ref<DeliveryItem[]>([]);
  const loading = ref(true);
  const sortType = ref<'asc' | 'desc'>('desc');
  const user = ref();

  const auth = useAuthStore();

  const sortedDeliveries = computed(() => {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    return deliveries.value?.sort((a, b) => {
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);

      if (sortType.value === 'asc') {
        return aDate.getTime() - bDate.getTime();
      }

      return bDate.getTime() - aDate.getTime();
    })
  });

  const isAdmin = computed(() => user.value?.role === 'admin')

  onMounted(async () => {
    const { data, error } = await supabase.from('delivery').select().eq('userId', auth.user?.id);

    if (error) {
      return toast.error('Произошла ошибка');
    }

    deliveries.value = data;

    const { data: userData } = await supabase.from('users').select().eq('id', auth.user?.id);

    user.value = userData![0];

    loading.value = false;
  })

  const handleSort = () => {
    if (sortType.value === 'asc') return sortType.value = 'desc';
    return sortType.value = 'asc';
  }
</script>

<template>
  <UiLoader :is-loading="loading">
    <div v-if="!isAdmin" class="container">
      <header class="header">
        <img :src="`https://ui-avatars.com/api/?name=${auth.username}&rounded=true&size=175`" class="avatar"
          alt="user avatar">
        <h2 class="username">{{ auth.username }}</h2>
      </header>
      <section>
        <div class="top">
          <h2 class="title">Мои заказы</h2>
          <img v-if="sortedDeliveries?.length > 0" @click="handleSort" src="/sort.svg"
            alt="sort deliveries by datetime">
        </div>
        <div v-if="sortedDeliveries.length > 0" class="cards">
          <template v-for="item in sortedDeliveries" :key="item.id">
            <UiDeliveryItem :delivery="item" />
          </template>
        </div>
        <div v-else class="empty">Похоже, здесь пусто. 😢<br> Оформите доставку, чтобы увидеть свои заказы</div>
      </section>
    </div>
    <UiAdminPanel v-else />
  </UiLoader>
</template>

<style scoped>
  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 25px;
    margin-block: 25px;
  }

  .avatar {
    width: max-content;
    aspect-ratio: 1;
    border: 1px solid black;
    border-radius: 50%;
  }

  .username {
    font-weight: 700;
    font-size: 24px;
  }

  .top {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .top>img {
    cursor: pointer;
  }

  .title {
    font-size: 28px;
    font-weight: bold;
  }

  .cards {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-block: 10px;
  }

  .empty {
    display: grid;
    place-items: center;
    height: 300px;
    text-align: center;
    font-weight: 700;
    font-size: 20px;
  }

  @media (max-width: 1000px) {
    .header {
      margin-block: 15px;
    }

    .avatar {
      width: 100px
    }
  }
</style>