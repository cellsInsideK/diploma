<script setup lang="ts">
  import { ref } from 'vue';
  import { toast } from 'vue-sonner';

  import { validateTel } from '@/lib/validateTel';
  import { supabase } from '@/lib/supabaseClient';

  const name = ref('');
  const tel = ref('');
  const comment = ref('');


  const onSubmit = async () => {
    if (name.value === '' || tel.value === '') {
      return toast.error('Необходимо указать имя и номер телефона')
    }

    if (!validateTel(tel.value)) {
      return toast.error('Необходимо указать номер телефона');
    }

    const { error } = await supabase.from('booking').insert({
      name: name.value,
      tel: tel.value,
      description: comment.value,
    });

    if (error) {
      return toast.error('Произошла ошибка, попробуйте позже');
    }

    return toast.success('Бронь создана');
  };
</script>

<template>
  <div class="container">
    <div class="hero">
      <h2 class="hero__title">Добро Пожаловать!</h2>
      <p class="hero__description">Мы подаём самый насыщенный<br />кофе в городе</p>
      <RouterLink to="/menu" class="hero__button">В меню</RouterLink>
    </div>
    <div class="advantages">
      <h2 class="title">Наши преимущества</h2>
      <div class="advantages__list">
        <div class="advantages__list-item">
          <img src="/coffee.svg" class="advantages__item-logo" />
          <h3 class="advantages__item-title">Виды кофе</h3>
          <p class="advantages__item-description">
            Насладитесь классическим эспрессо, ароматным капучино или мягким латте. Найдите свой
            идеальный кофе!
          </p>
        </div>
        <div class="advantages__list-item">
          <img src="/beans.svg" class="advantages__item-logo" />
          <h3 class="advantages__item-title">Множество сортов</h3>
          <p class="advantages__item-description">
            Предлагаем широкий выбор сортов кофе, от привычных до редких эксклюзивных вариантов со
            всего мира.
          </p>
        </div>
        <div class="advantages__list-item">
          <img src="/croissant.svg" class="advantages__item-logo" />
          <h3 class="advantages__item-title">Различные десерты</h3>
          <p class="advantages__item-description">
            Дополните свой кофе нежными десертами: свежая выпечка, пирожные и изысканные сладости на
            любой вкус.
          </p>
        </div>
      </div>
    </div>
    <div id="about" class="history">
      <h2 class="title">Наша история</h2>
      <div class="history__inner">
        <img src="/history.png" />
        <p class="history_inner-description">
          Мы начали свой путь с маленькой кофейни, вдохновленные страстью к качественному кофе,
          уютной атмосферой и искренним желанием делиться этим с окружающими. С первого дня мы
          стремились создать место, где каждый гость мог бы почувствовать себя как дома, наслаждаясь
          идеальной чашкой кофе, приготовленной с вниманием к каждой детали. С каждым новым днем мы
          видели, как наша идея вдохновляла и завоевывала сердца наших посетителей.
          <br /><br />
          Сегодня мы продолжаем расти и развиваться, не изменяя своим главным принципам. Наша цель —
          это не просто приготовление кофе, а создание идеальных моментов для вас. Независимо от
          того, заходите ли вы к нам за утренним эспрессо или проводите уютный вечер с чашкой латте
          и кусочком десерта, мы стремимся сделать ваше посещение особенным. Наше главное правило —
          сохранять ту теплоту и искренность, которые позволили нам вырасти, и продолжать дарить вам
          радость в каждом глотке вашего любимого напитка.
        </p>
      </div>
    </div>
    <div class="booking">
      <h2 class="title">Забронировать столик</h2>
      <form class="booking__form">
        <input v-model="name" class="booking__input" type="text" name="name" placeholder="Ваше имя" />
        <input v-model="tel" class="booking__input" type="tel" name="tel" placeholder="Ваш номер телефона" />
        <textarea v-model="comment" class="booking__textarea" name="comment" placeholder="Комментарий"></textarea>
        <button class="booking__submit" type="button" @click="onSubmit">Отправить</button>
      </form>
    </div>
    <div id="contact" class="contact">
      <h2 class="title">Связаться с нами</h2>
      <div class="contact__inner">
        <iframe
          src="https://yandex.ru/map-widget/v1/?um=constructor%3A5c19d9e2261c9b1ce8a4c2e26d2a1609ebaa68f616c2c6988c02f99a00c26f98&amp;source=constructor"
          width="550" height="300" frameborder="0"></iframe>
        <div class="contact__description">
          <p>Адрес: Б. Черкасский пер., 2/10</p>
          <p>Телефон: +7 (916) 487-72-78</p>
          <p>Email: coffeshop@example.com</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .hero {
    margin-top: 25px;
    background-image: url('/hero.png');
    background-color: rgba(0, 0, 0, 0.5);
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    background-blend-mode: color;
    color: white;
    padding-block: 190px;
    padding-left: 100px;
    margin-bottom: 100px;
  }

  .hero__title {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 15px;
  }

  .hero__description {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .hero__button {
    background-color: rgb(226, 217, 200);
    border-radius: 6px;
    padding: 8px 24px;
    color: rgb(48, 38, 28);
    text-decoration: none;
    font-size: 22px;
    font-weight: bold;
  }

  .advantages {
    padding-bottom: 100px;
  }

  .title {
    color: rgb(48, 38, 28);
    font-size: 36px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 50px;
  }

  .advantages__list {
    display: flex;
    justify-content: center;
    gap: 50px;
  }


  .advantages__list-item {
    border: 1px rgb(169, 135, 100) solid;
    display: flex;
    flex-direction: column;
    border-radius: 25px;
    padding: 42px;
    padding-bottom: 60px;
    width: 300px;
  }

  .advantages__item-logo {
    height: 64px;
    aspect-ratio: 1;
    padding-bottom: 20px;
  }

  .advantages__item-title {
    font-size: 20px;
    font-weight: bold;
    color: rgb(48, 38, 28);
    text-align: center;
    margin-bottom: 10px;
  }

  .advantages__item-description {
    font-size: 18px;
  }

  .history {
    margin-bottom: 100px;
  }

  .history__inner {
    display: flex;
    gap: 50px;
    justify-content: center;
    align-items: center;
  }

  .history_inner-description {
    font-size: 18px;
    max-width: 750px;
  }

  .booking {
    margin-bottom: 100px;
  }

  .booking__form {
    display: flex;
    gap: 25px;
    flex-direction: column;
    align-items: center;
  }

  .booking__input {
    max-height: 50px;
    min-width: 450px;
    padding-block: 16px;
    padding-inline: 20px;
    display: inline-flex;
    align-items: center;
    background-color: transparent;
    border: 1px rgb(200, 160, 119) solid;
    border-radius: 10px;
    color: rgb(48, 38, 28);
    font-size: 16px;
  }

  .booking__textarea {
    font-family: 'Gilroy';
    resize: none;
    min-height: 150px;
    min-width: 450px;
    padding-block: 16px;
    padding-inline: 20px;
    background-color: transparent;
    border: 1px rgb(200, 160, 119) solid;
    border-radius: 10px;
    color: rgb(48, 38, 28);
    font-size: 16px;
  }

  .booking__input::placeholder,
  .booking__textarea::placeholder {
    color: rgb(200, 160, 119);
  }

  .booking__submit {
    background-color: rgb(200, 160, 119);
    color: rgb(226, 217, 200);
    border: none;
    border-radius: 10px;
    padding-block: 14px;
    min-width: 450px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
  }

  .contact {
    margin-bottom: 100px;
    color: black;
    font-size: 24px;
    line-height: 1.5;
  }

  .contact__inner {
    display: flex;
    justify-content: center;
    gap: 100px;
  }

  @media (max-width: 1000px) {
    .advantages__list {
      gap: 15px;
    }

    .advantages__list-item {
      padding: 12px;
      padding-bottom: 36px;
    }

    .history {
      margin-bottom: 25px;
      text-align: justify;
    }

    .history__inner>img {
      display: none;
    }
  }

  @media (max-width: 700px) {
    .hero {
      margin-top: 0;
      margin-bottom: 25px;
      margin-inline: -20px;
      padding-block: 56px;
      padding-left: 0;
      text-align: center;
    }

    .hero__title {
      font-size: 16px;
    }

    .hero__description {
      font-size: 18px;
    }

    .hero__button {
      font-size: 18px;
    }

    .title {
      font-size: 24px;
    }

    .advantages {
      padding-bottom: 25px;
      margin-inline: -20px;
    }

    .advantages__list {
      position: relative;
      overflow-x: scroll;
      scroll-behavior: smooth;
      justify-content: flex-start;
      padding-inline: 45px;
    }

    .advantages__list::-webkit-scrollbar {
      display: none;
    }

    .advantages__list-item {
      min-width: 250px;
    }

    .booking {
      margin-bottom: 25px;
    }

    .booking__input,
    .booking__textarea,
    .booking__submit {
      min-width: 80%;
    }

    .contact {
      margin-bottom: 25px;
    }

    .contact__inner {
      flex-direction: column;
      align-items: center;
      gap: 25px;
    }

    .contact__inner>iframe {
      width: 100%;
    }

    .contact__description {
      font-size: 18px;
    }
  }
</style>
