<script setup lang="ts">
import { postview } from './request'

window.onload = () => {
    if (window.location.href.includes('player')) return;
    console.log(1)
    postview()
}
</script>
<template>
    <div class="w-full h-full bg-dark text-light font-inter overflow-x-hidden">
        <router-view></router-view>
    </div>
</template>
