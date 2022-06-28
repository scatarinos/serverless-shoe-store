<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRouter } from 'vue-router'
import { useShopStore } from "../stores/shop"
import { useAuthStore } from "../stores/auth"

const shopStore = useShopStore()
const { cart } = storeToRefs(shopStore)
const { removeFromCart } = shopStore


const { isAuth } =  storeToRefs(useAuthStore())

const router = useRouter()

const formData = {
    name: '',
    address: '',
    city: '',
    zip: ''
}

function setName(event: any) {
    console.log('setName:::: ', event)
}

function onFeedback() {
    router.push('/feedback')
}

function onCreateOrder() {
    console.log('create Order', formData)

        const data = {
            "client": name,
            "shipping": {
                "address": formData.address,
                "city": formData.city,
                "zip": formData.zip
            },       
            "lines": cart.value.map(l => ({
                "reference": l.shoe.reference,
                "size": l.size,
                "price": l.shoe.price

            })),
          }
    shopStore.createOrder(data, onFeedback)
}

</script>

<template>
    <div class="container mx-auto py-4">
        <h2>Shopping Cart</h2>
        
        <ul class="flex flex-col w-full py-4">
            <li class="flex flex-row justify-between">
                <div class="w-1/4 uppercase text-sm border p-2"><span class="text-gray-400">reference</span></div>
                <div class="w-1/4 uppercase text-sm border p-2 text-center"><span class="text-gray-400">brand</span></div>
                <div class="w-1/4 uppercase text-sm border p-2 text-center"><span class="text-gray-400">price</span></div>
                <div class="w-1/4 uppercase text-sm border p-2 text-center"><span class="text-gray-400">sizes</span></div>
            </li>
                <li v-for="(item, index) in cart" class="flex flex-row justify-between" key={index}>
                    <div class="w-1/4 uppercase text-sm border p-2">{{ item.shoe.reference }}</div>
                    <div class="w-1/4 uppercase text-sm border p-2 text-center">{{ item.shoe.brand }}</div>
                    <div class="w-1/4 uppercase text-sm border p-2 text-center">{{ item.shoe.price }}</div>
                    <div class="w-1/4 uppercase text-sm border p-2 text-center">
                        {{ item.size }}
                        <button class="border p-1 m-1" v-on:click="removeFromCart(index)">---</button>
                    </div>
                </li>                
        </ul>
        
        <h1 v-if="cart.length == 0" class="text-center p-2">Empty Cart</h1>

        <form v-if="cart.length && isAuth" class='py-2' v-on:submit.prevent="">

            <label htmlFor="name" class="block text-xs uppercase font-bold opacity-50">name</label>                
            <input required name="name" id="name" class="form-select appearance-none px-3 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 w-64"
                v-model="formData.name"
            />                
            <div class="p-1" ></div>
            <label htmlFor="address" class="block text-xs uppercase font-bold opacity-50">address</label>                
            <input name="address" id="address" class="form-select appearance-none px-3 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 w-64"
                v-model="formData.address"
            />                
            <div class="p-1" ></div>            

            <div class="p-1" ></div>
            <label htmlFor="city" class="block text-xs uppercase font-bold opacity-50">city</label>                
            <input name="city" id="city" class="form-select appearance-none px-3 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 w-64"
                v-model="formData.city"
            />                
            <div class="p-1" ></div>
            <label htmlFor="zip" class="block text-xs uppercase font-bold opacity-50">zip</label>                
            <input name="zip" id="zip" class="form-select appearance-none px-3 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 w-64"
                v-model="formData.zip"

            />                
            <div class="p-1" ></div>

        </form>

        <div v-if="cart.length && isAuth" class="container mx-auto">
            <button class="border p-2" 
                v-on:click="onCreateOrder()"
            >Create Order</button>
        </div>
        <div v-if="cart.length && !isAuth" class="container">
            <router-link class="border p-2" to="/login">Please login to create order</router-link>
        </div>

    </div>
</template>