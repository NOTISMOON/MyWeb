<template>
    <header
        id="navbar"
        class="w-full z-50 transition-all duration-300 bg-dark/80"
        :class="{ 'bg-dark/95 shadow-lg': isScrolled, 'bg-dark/80': !isScrolled }"
    >
        <div class="container mx-auto px-15 py-4 flex items-center justify-between">
            <a href="#" class="flex items-center space-x-2">
                <div
                    class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
                ></div>
                <span class="text-xl font-bold">ISNOT<span class="text-primary">MOON</span></span>
            </a>
            <!-- 桌面导航 -->
            <nav class="hidden md:flex items-center space-x-10 text-[1rem]">
                <!-- 首页：判断当前 hash 是否为 #home -->
                <router-link
                    :to="{ name: 'home', hash: '#home' }"
                    class="hover:text-primary transition-colors"
                    :class="{ 'text-primary font-bold': $route.hash === '#home' }"
                >
                    首页
                </router-link>

                <!-- 技术博文：判断当前 hash 是否为 #artical -->
                <router-link
                    :to="{ name: 'home', hash: '#artical' }"
                    class="hover:text-primary transition-colors"
                    :class="{ 'text-primary font-bold': $route.hash === '#artical' }"
                >
                    技术博文
                </router-link>

                <!-- 项目经历：判断当前 hash 是否为 #production -->
                <router-link
                    :to="{ name: 'home', hash: '#production', force: true }"
                    class="hover:text-primary transition-colors"
                    :class="{ 'text-primary font-bold': $route.hash === '#production' }"
                >
                    项目经历
                </router-link>

                <!-- 视频专区：用默认 active-class（因为路由 name 唯一） -->
                <router-link
                    :to="{ name: 'video', hash: '#video' }"
                    class="py-2 hover:text-primary transition-colors"
                    active-class="text-primary font-bold"
                >
                    视频专区
                </router-link>

                <!-- 留言：判断当前 hash 是否为 #discussion -->
                <router-link
                    :to="{ name: 'home', hash: '#discussion' }"
                    class="hover:text-primary transition-colors"
                    :class="{ 'text-primary font-bold': $route.hash === '#discussion' }"
                >
                    留言
                </router-link>
            </nav>
            <!-- 移动端菜单按钮 -->
            <button
                id="menu-toggle"
                class="md:hidden text-2xl focus:outline-none w-10"
                @click="toggleMobileMenu"
            >
                <icon-menu-fold v-if="!mobileMenuOpen" :size="32" />
                <icon-menu-unfold v-else :size="32" />
            </button>
        </div>
        <!-- 移动端导航菜单 -->
        <div
            id="mobile-menu"
            class="md:hidden bg-dark/95 bg-blur absolute w-full left-0 top-full transition-all duration-300 z-50"
            :class="{
                'opacity-0 -translate-y-full': !mobileMenuOpen,
                'pointer-events-none': !mobileMenuOpen,
                'opacity-100 translate-y-0 pointer-events-auto': mobileMenuOpen
            }"
        >
            <div class="container mx-auto px-4 py-4 flex flex-col space-y-4 z-50">
                <router-link
                    :to="{ name: 'home', hash: '#home' }"
                    :class="{ 'text-primary font-bold': $route.hash === '#home' }"
                    class="py-2 hover:text-primary transition-colors"
                    >首页</router-link
                >
                <router-link
                    :to="{ name: 'home', hash: '#artical' }"
                    :class="{ 'text-primary font-bold': $route.hash === '#artical' }"
                    class="py-2 hover:text-primary transition-colors"
                    >技术博文</router-link
                >
                <router-link
                    :to="{ name: 'home', hash: '#production' }"
                    :class="{ 'text-primary font-bold': $route.hash === '#production' }"
                    class="py-2 hover:text-primary transition-colors"
                    >项目经历</router-link
                >
                <router-link
                    :to="{ name: 'video', hash: '#video' }"
                    :class="{ 'text-primary font-bold': $route.hash === '#video' }"
                    class="py-2 hover:text-primary transition-colors"
                    >视频专区</router-link
                >
                <router-link
                    :to="{ name: 'home', hash: '#discussion' }"
                    :class="{ 'text-primary font-bold': $route.hash === '#discussion' }"
                    class="py-2 hover:text-primary transition-colors"
                    >留言</router-link
                >
            </div>
        </div>
    </header>
</template>
<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import IconMenuFold from '@arco-design/web-vue/es/icon/icon-menu-fold'
import IconMenuUnfold from '@arco-design/web-vue/es/icon/icon-menu-unfold'
import { useRoute } from 'vue-router'
const isScrolled = ref(false)
const mobileMenuOpen = ref(false)
const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value
}
const route = useRoute()
function scrollToHash(hash: string) {
    if (!hash) return
    nextTick(() => {
        const el = document.querySelector(hash)
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' })
        }
    })
}
// 页面第一次加载时，如果带 hash，就滚动过去
onMounted(() => {
    scrollToHash(route.hash)
})
// 监听路由 hash 变化，点击导航自动滚动
watch(
    () => route.hash,
    (hash) => {
        scrollToHash(hash)
    }
)
</script>
