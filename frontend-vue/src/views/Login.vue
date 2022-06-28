<script setup lang="ts">
import { useAuthStore } from '../stores/auth';
import { useRouter } from "vue-router";

const router = useRouter()

const credentials = {
    email: '',
    password: ''
}

const store = useAuthStore()

function onLogin () {
    store.login(credentials.email, credentials.password, () => { router.push('/') })
}

</script>
<template>
        <div class="container mx-auto">
            <h1>Login</h1>

            <form class='py-2' v-on:submit.prevent="() => {}">

                <label htmlFor="email" class="block text-xs uppercase font-bold opacity-50">email</label>                
                <input name="email" id="email" class="form-select appearance-none px-3 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 w-28"
                    v-model="credentials.email"
                />
                <div class="p-1"></div>
                <label htmlFor="password" class="block text-xs uppercase font-bold opacity-50">password</label>                
                <input type="password" name="password" id="password" class="form-select appearance-none px-3 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 w-28"
                    v-model="credentials.password"
                />

                <div class="p-2 text-sm" >     
                    fake auth: any valid email and password will work                               
                </div>
                <button class="border p-2 px-4 w-28" v-on:click="onLogin">Login</button>

            </form>



        </div>
</template>