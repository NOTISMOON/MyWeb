<script setup lang="ts">
import { postview } from './request';
 window.onload=async ()=>{
    await postview()
 }
</script>
<template>
    <div class="w-full absolute h-full bg-dark text-light font-inter overflow-x-hidden">
        <router-view></router-view>
    </div>
</template>
