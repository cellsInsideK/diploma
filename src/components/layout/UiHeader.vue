<script setup lang="ts">
    import { ref } from 'vue';
    import { RouterLink, useRouter } from 'vue-router';
    import { toast } from 'vue-sonner';

    import { useAuthStore } from '@/stores/auth';

    const auth = useAuthStore();
    const isShown = ref(false);
    const router = useRouter();

    const toggleBurgerMenu = () => {
        isShown.value = !isShown.value;
    }

    const signOut = async () => {
        const success = await auth.signOut();

        if (!success)
            return toast.error('Что-то пошло не так')

        toast.success('Вы вышли из своего аккаунта')
        return router.push('/')
    }
</script>

<template>
    <header class="header">
        <div class="container">
            <nav class="nav-list">
                <ul class="list left-menu">
                    <li>
                        <RouterLink to="/" class="link">Главная</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/menu" class="link">Меню</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/#about" class="link">О нас</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/#contact" class="link">Контакты</RouterLink>
                    </li>
                </ul>
                <div class="logo">
                    <img src="/logo.svg" alt="" />
                </div>
                <div>
                    <template v-if="!auth.isAuthenticated">
                        <ul class="list right-menu">
                            <li>
                                <RouterLink to="/sign-in" class="link">Вход</RouterLink>
                            </li>
                            <li>
                                <RouterLink to="/sign-up" class="link">Регистрация</RouterLink>
                            </li>
                        </ul>
                    </template>
                    <template v-else>
                        <ul class="auth-list right-menu">
                            <li>
                                <RouterLink to="profile" class="link">
                                    <img src="/user.svg" alt="" />
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink to="/cart" class="link">
                                    <img src="/cart.svg" alt="" />
                                </RouterLink>
                            </li>
                            <li>
                                <p @click="signOut" class="link">Выход</p>
                            </li>
                        </ul>
                    </template>
                </div>
                <img @click="toggleBurgerMenu" class="burger-menu" src="/menu.svg" alt="">
            </nav>
        </div>
    </header>
    <div v-if="isShown" @click="toggleBurgerMenu" class="overlay">
        <div class="menu">
            <ul class="burger-list">
                <li>
                    <RouterLink to="/" class="link">Главная</RouterLink>
                </li>
                <li>
                    <RouterLink to="/menu" class="link">Меню</RouterLink>
                </li>
                <li>
                    <RouterLink to="/#about" class="link">О нас</RouterLink>
                </li>
                <li>
                    <RouterLink to="/#contact" class="link">Контакты</RouterLink>
                </li>
                <template v-if="!auth.isAuthenticated">
                    <li>
                        <RouterLink to="/sign-in" class="link">Вход</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/sign-up" class="link">Регистрация</RouterLink>
                    </li>
                </template>
                <template v-else>
                    <li>
                        <RouterLink to="/profile" class="link">Личный кабинет</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/cart" class="link">Корзина</RouterLink>
                    </li>
                    <li>
                        <p @click="signOut" class="link">Выход</p>
                    </li>
                </template>
            </ul>
        </div>
    </div>
</template>

<style scoped>
    .header {
        background-color: rgb(48, 38, 28);
        padding-block: 35px;
    }

    .nav-list {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .list {
        display: flex;
        gap: 30px;
        align-items: center;
    }

    .auth-list {
        display: flex;
        gap: 15px;
        align-items: center;
    }

    .link {
        color: rgb(226, 217, 200);
        text-decoration: none;
        cursor: pointer;
    }

    .logo {
        margin-left: -140px;
    }

    .burger-menu {
        height: 32px;
        aspect-ratio: 1;
        display: none;
        cursor: pointer;
    }

    .overlay {
        z-index: 1;
        position: fixed;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.5);
    }

    .menu {
        position: fixed;
        inset-block: 0;
        right: 0;
        background-color: rgb(48, 38, 28);
        border-top-left-radius: 10px;
        padding: 25px;
        text-align: center;
    }

    .burger-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    @media (max-width: 1024px) {
        .logo {
            display: none;
        }
    }

    @media (max-width: 700px) {
        .header {
            padding-block: 12px;
        }

        .logo {
            display: block;
            margin-left: 0;
        }

        .logo img {
            height: 38px;
            aspect-ratio: 1;
        }

        .left-menu {
            display: none;
        }

        .right-menu {
            display: none;
        }

        .burger-menu {
            display: block;
        }
    }
</style>
