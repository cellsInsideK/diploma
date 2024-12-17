<script setup lang="ts">
  import { useAdminStore, type Booking, type Delivery, type Menu, type User } from '@/stores/admin';
  import { ref } from 'vue';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import { InputText } from 'primevue';
  import { toast } from 'vue-sonner';
  import { statusMap } from '@/stores/cartItem';
  import UiModal from './UiModal.vue';

  const adminStore = useAdminStore();

  const usersEditingRows = ref();
  const editedUser = ref<User | null>();

  const deliveriesEditingRows = ref();
  const editedDelivery = ref();
  const reason = ref();
  const reasonModal = ref(false);

  const menuEditingRows = ref();
  const editedMenu = ref();
  const menuModal = ref(false);
  const modalTitle = ref('');
  const modalPrice = ref('');
  const modalType = ref('');
  const modalDesc = ref('');
  const image = ref<File | null>(null);

  const handleReason = () => {
    reasonModal.value = true;
  }

  const handleReasonModal = () => {
    reasonModal.value = false;
  }

  const handleCreateMenu = async () => {
    const obj = { id: '', title: modalTitle.value, price: +modalPrice.value, type: modalType.value, desc: modalDesc.value, image: image.value!.name };

    const res = await adminStore.createMenu(obj, image);

    if (!res) {
      return toast.error('Что-то пошло не так')
    }

    menuModal.value = false;
    return toast.success('Позиция создана');
  }

  //@ts-expect-error asd
  const getReadableDelivery = (json) => {
    const jsonRef = ref(json);
    const obj = jsonRef.value.map((i: string) => JSON.parse(i));

    const titles: unknown[] = [];
    const title: unknown[] = [];

    //@ts-expect-error ass
    obj.map(item => {
      if (item.type !== 'coffee') {
        return title.push(item.quantity, item.title);
      }

      //@ts-expect-error asd
      const milk = item.milk?.reduce((acc, curr) => {
        if (curr.value === item.selectedMilk) {
          return acc = curr.label
        }
        return acc;
      }, '')

      //@ts-expect-error asd
      const topping = item.toppings?.reduce((acc, curr) => {
        if (curr.value === item.selectedTopping) {
          return acc = curr.label
        }
        return acc;
      }, '')

      titles.push(item.quantity, item.title, milk, topping);
    })

    const coffeeTitle = titles.length > 0 ? `${titles[0]}x${titles[1]} (${titles[2]}, ${titles[3]}) ` : '';

    const res = `${title.join('x')}` + `${coffeeTitle.length > 0 ? ', ' : ''}` + coffeeTitle;

    return res;
  }

  //@ts-expect-error asd
  const onDeliveriesRowEditSave = async (event) => {
    const { newData } = event;
    editedDelivery.value = newData;
    editedDelivery.value.reason = reason.value;

    const res = await adminStore.updateDelivery(editedDelivery.value as Delivery);
    editedDelivery.value = null;

    if (!res) {
      return toast.error('Что-то пошло не так')
    }

    return toast.success('Заказ обновлен');
  };

  //@ts-expect-error asd
  const onMenuRowEditSave = async (event) => {
    const { newData } = event;
    editedMenu.value = newData;

    if (image.value) {
      editedMenu.value.image = image.value.name
    }

    const res = await adminStore.updateMenu(editedMenu.value as Menu, image);
    editedMenu.value = null;

    if (!res) {
      return toast.error('Что-то пошло не так')
    }

    return toast.success('Позиция обновлена');
  };

  const handleDeleteDelivery = async (delivery: Delivery) => {
    const res = await adminStore.deleteDelivery(delivery)

    if (!res) {
      return toast.error('Что-то пошло не так')
    }

    return toast.success('Заказ удален');
  }

  //@ts-expect-error asd
  const onUsersRowEditSave = async (event) => {
    const { newData } = event;
    editedUser.value = newData;

    const res = await adminStore.updateUser(editedUser.value as User);
    editedUser.value = null;

    if (!res) {
      return toast.error('Что-то пошло не так')
    }

    return toast.success('Пользователь обновлен');
  };

  const handleDeleteBooking = async (booking: Booking) => {
    const res = await adminStore.deleteBooking(booking)

    if (!res) {
      return toast.error('Что-то пошло не так')
    }

    return toast.success('Бронь удалена');
  }

  const handleDeleteMenu = async (menu: Menu) => {
    const res = await adminStore.deleteMenu(menu)

    if (!res) {
      return toast.error('Что-то пошло не так')
    }

    return toast.success('Позиция удалена');
  }

  const handleMenuModal = () => {
    return menuModal.value = true;
  }

  const handleImage = (event: Event) => {
    image.value = (event.target as HTMLInputElement).files?.item(0) ?? null;
  }
</script>

<template>
  <UiModal v-model="reasonModal">
    <div class="modal">
      <h2 class="title">Причина отмены заказа</h2>
      <p>Укажите причину отказа:</p>
      <textarea v-model="reason" class="textarea"></textarea>
      <button @click="handleReasonModal" class="submit" type="button">Подтвердить</button>
    </div>
  </UiModal>
  <UiModal v-model="menuModal">
    <div class="modal">
      <h2 class="title">Создание позиции</h2>
      <p>Название:</p>
      <input v-model="modalTitle" type="text" class="input" placeholder="Введите название">
      <p>Стоимость:</p>
      <input v-model="modalPrice" type="text" class="input" placeholder="Введите цену">
      <p>Выберите тип:</p>
      <select v-model="modalType">
        <option value="coffee">Кофе</option>
        <option value="drinks">Напиток</option>
        <option value="bakery">Выпечка</option>
        <option value="desserts">Десерт</option>
      </select>
      <p>Изображение:</p>
      <input @change="handleImage" type="file" accept="image/*">
      <p>Описание:</p>
      <textarea v-model="modalDesc" class="textarea"></textarea>
      <button @click="handleCreateMenu" type="button" class="submit">Добавить позицию</button>
    </div>
  </UiModal>
  <div class="container">
    <section class="admin">
      <h2 class="title">Админ панель</h2>
      <h3 class="subtitle">Пользователи</h3>
      <div class="list">
        <DataTable v-model:editingRows="usersEditingRows" data-key="id" edit-mode="row" :value="adminStore.users"
          style=" padding: 15px; border-radius: 20px;" @row-edit-save="onUsersRowEditSave">
          <Column style="padding-block: 10px; width: min-content;" field="id" header="id"></Column>
          <Column style="padding: 10px;" field="login" header="Логин"><template #editor="{ data, field }">
              <InputText style="border: 1px rgb(200, 160, 119) solid;
    border-radius: 10px; padding: 10px;" v-model="data[field]" fluid />
            </template></Column>
          <Column style="padding: 10px;" field="email" header="Email"><template #editor="{ data, field }">
              <InputText style="border: 1px rgb(200, 160, 119) solid;
    border-radius: 10px; padding: 10px;" v-model="data[field]" fluid />
            </template></Column>
          <Column style="padding: 10px;" field="role" header="Роль">
            <template #body="{ data, field }">{{ data[field] === '' ? 'Пользователь' : 'Администратор' }}</template>
            <template #editor="{ data, field }">
              <select v-model="data[field]">
                <option value="">Пользователь</option>
                <option value="admin">Администратор</option>
              </select>
            </template>
          </Column>
          <Column :rowEditor="true" header="Редактирование" style="width: 10%; min-width: 8rem"
            bodyStyle="text-align:center">
          </Column>
        </DataTable>
      </div>
      <h3 class="subtitle">Брони столиков</h3>
      <div class="list">
        <DataTable data-key="id" :value="adminStore.bookings" style=" padding: 15px; border-radius: 20px;">
          <Column style="padding-block: 10px; width: min-content;" field="id" header="id"></Column>
          <Column style="padding: 10px;" field="name" header="Имя"></Column>
          <Column style="padding: 10px;" field="tel" header="Телефон"></Column>
          <Column style="padding: 10px;" field="description" header="Примечание"></Column>
          <Column bodyStyle="text-align:center" style="padding: 10px;" header="Удаление">
            <template #body="{ index }">
              <button @click="handleDeleteBooking(adminStore.bookings[index])" class="deleteButton">
                <img src="/delete.svg" alt="">
              </button>
            </template>
          </Column>
        </DataTable>
      </div>
      <h3 class="subtitle">Доставки</h3>
      <div class="list">
        <DataTable v-model:editingRows="deliveriesEditingRows" data-key="id" edit-mode="row"
          :value="adminStore.deliveries" style=" padding: 15px; border-radius: 20px;"
          @row-edit-save="onDeliveriesRowEditSave">
          <Column style="padding-block: 10px; width: min-content;" field="id" header="id"></Column>
          <Column style="padding: 10px;" field="items" header="Заказ">
            <template #body="{ data, field }">{{ getReadableDelivery(data[field]) }}</template>
          </Column>
          <Column style="padding: 10px;" field="tel" header="Телефон"></Column>
          <Column style="padding: 10px;" field="address" header="Адрес"></Column>
          <Column style="padding: 10px;" field="comment" header="Комментарий"></Column>
          <Column style="padding: 10px;" field="status" header="Статус">
            <template #body="{ data, field }">{{ statusMap.get(data[field]) }}</template>
            <template #editor="{ data, field }">
              <select v-model="data[field]">
                <option v-for="status in statusMap" :value="status[0]" :key="status[0]">{{ status[1] }}</option>
              </select>
            </template>
          </Column>
          <Column style="padding: 10px;" field="reason" header="Причина отказа">
            <template #editor="{ data }">
              <button v-if="data.status === 'cancelled'" class="submit" @click="handleReason">Указать
                причину</button>
            </template>
          </Column>
          <Column style="padding: 10px;" field="date" header="Дата и время">
            <template #body="{ data, field }">
              {{ new Date(data[field]).toLocaleString('ru', {
                dateStyle: 'short', timeStyle: 'short'
              }) }}
            </template>
          </Column>
          <Column style="padding: 10px;" field="userId" header="id пользователя"></Column>
          <Column style="padding: 10px;" field="totalPrice" header="Цена доставки"></Column>
          <Column :rowEditor="true" header="Редактирование" style="width: 10%; min-width: 8rem"
            bodyStyle="text-align:center">
          </Column>
          <Column bodyStyle="text-align:center" style="padding: 10px;" header="Удаление">
            <template #body="{ index }">
              <button @click="handleDeleteDelivery(adminStore.deliveries[index])" class="deleteButton">
                <img src="/delete.svg" alt="">
              </button>
            </template>
          </Column>
        </DataTable>
      </div>

      <h3 class="subtitle">Меню</h3>
      <div class="list">
        <DataTable v-model:editingRows="menuEditingRows" data-key="id" edit-mode="row" :value="adminStore.menu"
          style=" padding: 15px; border-radius: 20px;" @row-edit-save="onMenuRowEditSave">
          <Column style="padding-block: 10px;" field="id" header="id"></Column>
          <Column style="padding: 10px;" field="title" header="Название">
            <template #editor="{ data, field }">
              <InputText style="border: 1px rgb(200, 160, 119) solid;
    border-radius: 10px; padding: 10px;" v-model="data[field]" fluid />
            </template>
          </Column>
          <Column style="padding: 10px;" field="price" header="Цена">
            <template #editor="{ data, field }">
              <InputText style="border: 1px rgb(200, 160, 119) solid;
    border-radius: 10px; padding: 10px;" v-model="data[field]" fluid />
            </template>
          </Column>
          <Column style="padding: 10px;" field="type" header="Тип">
            <template #editor="{ data, field }">
              <select v-model="data[field]">
                <option value="coffee">Кофе</option>
                <option value="drinks">Напиток</option>
                <option value="bakery">Выпечка</option>
                <option value="desserts">Десерт</option>
              </select>
            </template>
          </Column>
          <Column style="padding: 10px;" field="image" header="Изображение">
            <template #editor>
              <input type="file" accept="image/*" @change="handleImage">
            </template>
          </Column>
          <Column style="padding: 10px;" field="desc" header="Описание">
            <template #editor="{ data, field }">
              <InputText style="border: 1px rgb(200, 160, 119) solid;
    border-radius: 10px; padding: 10px;" v-model="data[field]" fluid />
            </template>
          </Column>
          <Column :rowEditor="true" header="Редактирование" style="width: 10%; min-width: 8rem"
            bodyStyle="text-align:center">
          </Column>
          <Column bodyStyle="text-align:center" style="padding: 10px;" header="Удаление">
            <template #body="{ index }">
              <button @click="handleDeleteMenu(adminStore.menu[index])" class="deleteButton">
                <img src="/delete.svg" alt="">
              </button>
            </template>
          </Column>
        </DataTable>
        <button class="submit" @click="handleMenuModal">Создать позицию</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
  .input {
    max-height: 50px;
    width: 100%;
    padding-block: 16px;
    padding-inline: 20px;
    display: inline-flex;
    align-items: center;
    color: rgb(200, 160, 119);
    background-color: transparent;
    border: 1px rgb(200, 160, 119) solid;
    border-radius: 10px;
    font-weight: 700;
    font-size: 18px;
  }

  .input::placeholder {
    color: rgb(200, 160, 119);
  }

  .input:focus {
    outline: none;
  }

  .modal {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .textarea {
    resize: none;
    min-height: 150px;
    width: 100%;
    padding-block: 16px;
    padding-inline: 20px;
    background-color: transparent;
    border: 1px rgb(200, 160, 119) solid;
    border-radius: 10px;
    color: rgb(48, 38, 28);
    font-size: 16px;
  }

  .admin {
    margin-block: 20px;
  }

  .title {
    font-size: 28px;
    font-weight: bold;
  }

  .subtitle {
    font-size: 24px;
    font-weight: bold;
    margin-left: 20px;
  }

  .list {
    margin-block: 20px
  }

  .deleteButton {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border: none;
    transform: scale(0.65);
  }

  .submit {
    width: 100%;
    background-color: rgb(200, 160, 119);
    color: white;
    border: none;
    border-radius: 10px;
    padding-block: 10px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    margin-top: 20px;
  }
</style>