<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';

  import UiMenuItem from '@/components/UiMenuItem.vue';
  import { supabase } from '@/lib/supabaseClient';

  const sortType = ref<null | 'coffee' | 'drinks' | 'desserts' | 'bakery'>(null);
  const search = ref('');

  const items = ref();

  const sortedItems = computed(() => {
    if (search.value !== '' && sortType.value !== null) {
      return items.value.filter((item: { type: string | null; title: string; }) => {
        const condition = item.type === sortType.value && item.title.toLowerCase().includes(search.value.toLowerCase());

        if (!condition) return false;

        return true;
      })
    }

    if (search.value !== '') {
      return items.value.filter((item: { title: string }) => item.title.toLowerCase().includes(search.value.toLowerCase())
      )
    }

    if (sortType.value !== null) {
      return items.value.filter((item: { type: string | null; }) => item.type === sortType.value)
    }

    return items.value
  })

  onMounted(async () => {
    const { data } = await supabase.from('menu').select();
    items.value = data;
  })
</script>

<template>
  <div class="container">
    <div class="inner">
      <aside class="categories">
        <h2>Категории</h2>
        <ul>
          <li @click="sortType = null" :class="{ 'active': sortType === null }">Все товары</li>
          <li @click="sortType = 'coffee'" :class="{ 'active': sortType === 'coffee' }">Кофе</li>
          <li @click="sortType = 'drinks'" :class="{ 'active': sortType === 'drinks' }">Холодные напитки</li>
          <li @click="sortType = 'desserts'" :class="{ 'active': sortType === 'desserts' }">Десерты</li>
          <li @click="sortType = 'bakery'" :class="{ 'active': sortType === 'bakery' }">Выпечка</li>
        </ul>
      </aside>
      <div class="main">
        <input class="input" type="text" v-model="search" placeholder="Поиск">
        <aside class="categories adaptive">
          <h2>Категории</h2>
          <ul>
            <li @click="sortType = null" :class="{ 'active': sortType === null }">Все товары</li>
            <li @click="sortType = 'coffee'" :class="{ 'active': sortType === 'coffee' }">Кофе</li>
            <li @click="sortType = 'drinks'" :class="{ 'active': sortType === 'drinks' }">Холодные напитки</li>
            <li @click="sortType = 'desserts'" :class="{ 'active': sortType === 'desserts' }">Десерты</li>
            <li @click="sortType = 'bakery'" :class="{ 'active': sortType === 'bakery' }">Выпечка</li>
          </ul>
        </aside>
        <div class="items">
          <template v-for="item in sortedItems" :key="item.id">
            <UiMenuItem :item="item" />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .inner {
    padding-top: 50px;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 60px;
    margin-bottom: 25px;
  }

  .categories {
    border: 2px rgb(200, 160, 119) solid;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    max-width: 300px;
    height: fit-content;
  }

  .adaptive {
    display: none;
    margin-bottom: 25px;
    max-width: 85% !important;
  }

  .categories h2 {
    padding: 15px;
    font-size: 22px;
  }

  .categories li {
    padding-bottom: 10px;
    padding-inline: 20px;
    font-size: 18px;
    cursor: pointer;
  }

  .categories li:last-child {
    margin-bottom: 0;
  }

  .active {
    background-color: rgb(200, 160, 119);
  }

  .input {
    position: relative;
    width: 90%;
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

  .items {
    display: flex;
    gap: 50px;
    flex-wrap: wrap;
  }

  @media (max-width: 800px) {
    .inner {
      grid-template-columns: 1fr;
    }

    .main {
      display: flex;
      flex-direction: column;
      place-items: center;
    }

    .categories {
      display: none;
    }

    .adaptive {
      display: block;
      max-width: 100% !important;
    }

    .items {
      justify-content: center;
    }
  }
</style>