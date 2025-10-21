<template>
    <header
        id="navbar"
        class="fixed w-full z-50 transition-all duration-300 bg-dark/80"
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
                <a href="#home" class="hover:text-primary transition-colors">首页</a>
                <a href="#artical" class="hover:text-primary transition-colors">技术博文</a>
                <a href="#production" class="hover:text-primary transition-colors">项目开发</a>
                <a href="#discussion" class="hover:text-primary transition-colors">留言</a>
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
                <a href="#home" class="py-2 hover:text-primary transition-colors">首页</a>
                <a href="#artical" class="py-2 hover:text-primary transition-colors">技术博文</a>
                <a href="#production" class="py-2 hover:text-primary transition-colors">项目开发</a>
                <a href="#discussion" class="py-2 hover:text-primary transition-colors">留言</a>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { ref} from 'vue'
import IconMenuFold from '@arco-design/web-vue/es/icon/icon-menu-fold';
import IconMenuUnfold from '@arco-design/web-vue/es/icon/icon-menu-unfold';
const isScrolled = ref(false)
const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value
}
</script>

