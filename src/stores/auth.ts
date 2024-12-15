import { ref } from 'vue';
import { defineStore } from 'pinia';

import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref<boolean>(false);
  const user = ref<User | null>();
  const username = ref('');

  async function signUp(email: string, password: string, login: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      return false;
    }

    const { error: insertError } = await supabase
      .from('users')
      .insert({ id: data.user?.id, email: email, login: login });

    if (insertError) {
      return false;
    }

    user.value = data.user;
    isAuthenticated.value = true;

    await setUsername();

    return true;
  }

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return false;

    user.value = data.user;
    isAuthenticated.value = true;

    await setUsername();

    return true;
  }

  async function trySignIn() {
    const { data, error } = await supabase.auth.getSession();

    if (error) return;

    if (data.session) {
      isAuthenticated.value = true;
      user.value = data.session?.user;

      await setUsername();
    }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) return false;

    user.value = null;
    isAuthenticated.value = false;

    return true;
  }

  async function setUsername() {
    const { data } = await supabase.from('users').select('login').eq('id', user.value?.id);

    username.value = data![0].login;
  }

  return { isAuthenticated, user, username, signUp, signIn, signOut, trySignIn };
});
