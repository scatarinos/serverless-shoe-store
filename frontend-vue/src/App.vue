<script setup lang="ts">

import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from "vue-router";
import { storeToRefs } from 'pinia'
import { useAuthStore } from './stores/auth';
import { useShopStore } from './stores/shop';

const apiURL = import.meta.env.VITE_API_URL

const authStore = useAuthStore()
const { isAuth, email } = storeToRefs(authStore)
const { logout } = authStore

const shopStore = useShopStore()
const { cart } = storeToRefs(shopStore)

const route = useRoute();
const currentPath = computed(() => route.path);

function onLogout() {
  logout()
}

</script>

<template>
    <div class="container mx-auto p-8">
      <header class="container mx-auto py-8">
      <nav class="text-sm uppercase flex flex-row justify-between">
          <ul class="flex flex-row">

            <li :class="['/', '/shop'].includes(currentPath) ? 'font-bold' : ''">
              <router-link to="/shop">shop</router-link>
            </li>
            
            <li class="px-1">|</li>            
            <li :class="['/cart'].includes(currentPath) ? 'font-bold' : ''">
              <router-link to="/cart">{{`Cart ${cart.length ? '(' + cart.length + ')' : ''} `}}</router-link>
            </li>
          </ul>
          <ul class="flex flex-row">
            <li class='justify-self-end' v-if="!isAuth">
              <router-link to="/login">login</router-link>
            </li>
            <li class='justify-self-end' v-if="isAuth">
              <span v-on:click="() => {onLogout()}" >logout {{ email }}</span>
            </li>

          </ul>
      </nav>    
      <hr />
    </header> 
    <router-view></router-view>
    <footer class='pt-8'>
      <hr class="p-2" />
      <p class='text-sm'>apiUrl: {{ apiURL }}</p>
    </footer>     
    </div>

  
</template>

<style>
</style>
