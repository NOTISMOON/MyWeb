<script setup lang="ts">
import { postview } from './request'

window.onload = async () => {
    if (window.location.href.includes('player')) return
    await postview()
}
</script>
<template>
    <div class="w-full h-full bg-dark text-light font-inter overflow-x-hidden">
        <router-view></router-view>
    </div>
</template>
