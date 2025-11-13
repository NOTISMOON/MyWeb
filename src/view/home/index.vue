<template>
    <Header></Header>
    <Home v-model="store.userInof"></Home>
    <Artical v-model="store.userInof.articals"></Artical>
    <Production v-model="store.userInof.productions"></Production>
    <Discussion v-model="store.userInof.discussions" />
</template>
<script setup lang="ts">
import Header from './components/header/index.vue'
import Home from './components/home/index.vue'
import Artical from './components/conetnt_arcital/index.vue'
import Production from './components/content_production/index.vue'
import Discussion from './components/content_discussion/inde.vue'
import { onMounted } from 'vue'
// import type { ArticalAPI } from '@/api.type/artical.type'
import { userstore } from '@store/user.store'
const store = userstore()
onMounted(async () => {
    await store.GetuserInof()
    console.log(store.userInof)
})
</script>
