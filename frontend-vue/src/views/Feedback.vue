<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useShopStore } from '../stores/shop'; 


const shopStore = useShopStore()

// const feedback = useShopStore().feedback.value ?? {}
const { feedback } = storeToRefs(shopStore)

console.log('::: feedback ', shopStore.feedback.data)
</script>
<template>
    <div className="container mx-auto">
        <h1>Feedback {{ feedback?.message  }}</h1>

        <pre className="font-mono">
            {{ JSON.stringify(feedback.data, null, 2) }}
        </pre>
    </div>
</template>

