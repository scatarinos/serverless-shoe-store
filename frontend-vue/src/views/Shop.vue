<script setup lang="ts">
import { onMounted, watch } from "vue"
import { storeToRefs } from 'pinia'

import { Shoe, useShopStore } from '../stores/shop'

const shopStore =  useShopStore()
const { shoes, brands, brandFilter, cart } = storeToRefs(shopStore)
const { fetchShoes, addToCart } = shopStore
 
console.log(cart)
onMounted(() => {
    if (!shoes.value.length) {
        fetchShoes(true)
    }
})

watch(brandFilter, (currentValue, oldValue) => {
    fetchShoes()
})


function onAdd(shoe: Shoe, size: string) {
    addToCart!({shoe, size})
}
function onBrandFilterChange(event: Event) {
    console.log('currentBrand',  brandFilter)
}
</script>

<template>
        <div class="container mx-auto py-4">
            <h1 >Shoe List</h1>
            <form class='py-2'>

                <label htmlFor="brand" class="block text-xs uppercase font-bold opacity-50">Filter by Brand</label>
                <select 
                    name="brand"
                    id="brand" 
                    class="form-select appearance-none px-3 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 w-28"
                    v-on:change="onBrandFilterChange($event)"
                    v-model = "brandFilter"                    
                >
                    <option key="empty" value="">All</option>    
                    <option v-for="brand in brands" :key="brand" :value="brand">{{brand}}</option>
                </select>

            </form>


            <ul class="flex flex-col w-full py-4">
                <li class="flex flex-row justify-between">
                    <div class="w-1/4 uppercase text-sm border p-2"><span class="text-gray-400">reference</span></div>
                    <div class="w-1/4 uppercase text-sm border p-2 text-center"><span class="text-gray-400">brand</span></div>
                    <div class="w-1/4 uppercase text-sm border p-2 text-center"><span class="text-gray-400">price</span></div>
                    <div class="w-1/4 uppercase text-sm border p-2 text-center"><span class="text-gray-400">sizes</span></div>
                </li>
                <li v-for="shoe in shoes" class="flex flex-row justify-between" key={index}>
                    <div class="w-1/4 uppercase text-sm border p-2">{{ shoe.reference }}</div>
                    <div class="w-1/4 uppercase text-sm border p-2 text-center">{{ shoe.brand }}</div>
                    <div class="w-1/4 uppercase text-sm border p-2 text-center">{{ shoe.price }}</div>
                    <div class="w-1/4 uppercase text-sm border p-2 text-left ">
                        <ul class='flex flex-row flex-wrap'>
                            <li v-for="size in (shoe.sizes || [])">
                                <button key={size} class='p-2 m-1 border' v-on:click="() => onAdd(shoe, size)">{{ size }}</button>
                            </li>
                        </ul>
                    </div>
                </li>                
            </ul>

                      
        </div>
</template>