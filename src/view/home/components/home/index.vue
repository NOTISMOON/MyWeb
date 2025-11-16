<template>
    <section id="home" class="pt-32 pb-20 md:pt-40 md:pb-32 relative">
        <div class="absolute inset-0 bg-gradient-to-br from-dark via-dark/90 to-dark/80 z-0"></div>
        <!-- 装饰元素 -->
        <div
            class="absolute top-20 right-10 w-64 h-64 bg-primary/20 rounded-full filter blur-3xl z-0"
        ></div>
        <div
            class="absolute bottom-10 left-10 w-80 h-80 bg-secondary/20 rounded-full filter blur-3xl z-0"
        ></div>

        <div class="container mx-auto px-4 relative z-10">
            <div class="flex flex-col lg:flex-row items-center gap-10">
                <!-- 左侧：介绍文字 -->
                <div class="lg:w-1/2">
                    <h1 class="text-[clamp(2.5rem,5vw,5rem)] font-bold leading-tight mb-6">
                        <span class="bg-gradient-to-r from-primary to-secondary text-gradient"
                            >前端技术</span
                        >
                        <span class="block">探索与分享</span>
                    </h1>
                    <p class="text-xl text-gray-300 mb-8">
                        欢迎来到我的技术博客！这里记录了我在前端开发道路上的学习心得、项目经验和技术探索。
                    </p>
                    <p class="text-lg text-gray-300 mb-8">
                        我专注于现代Web开发技术，包括Vue、React、TypeScript等，致力于分享高质量的技术文章和最佳实践。
                    </p>
                </div>

                <!-- 右侧：个人信息卡片 -->
                <div class="lg:w-1/2 px-4">
                    <div
                        class="card-gradient rounded-2xl shadow-xl overflow-hidden hover-lift p-4 sm:p-6 border border-gray-700"
                    >
                        <!-- 头像 -->
                        <!-- 个人信息 -->
                        <div class="text-center mb-4 sm:mb-6">
                            <h3 class="text-xl sm:text-2xl font-bold mb-1">个人简介</h3>
                            <p class="text-primary font-medium text-[7px] sm:text-[10px]">
                        
                            </p>
                        </div>
                        <div
                            class="w-15 h-15 sm:w-32 sm:h-32 rounded-xl overflow-hidden mx-auto mb-4 sm:mb-6 border-4 border-primary"
                        >
                            <img
                                :src="data.avatar.avatar"
                                alt="个人头像"
                                class="w-full h-full object-cover"
                            />
                        </div>

                        <!-- 联系方式 -->
                        <div class="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                            <div class="flex items-center space-x-3 sm:space-x-4">
                                <div
                                    class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0"
                                >
                                    <icon-moon-fill class="text-sm sm:text-base" />
                                </div>
                                <div>
                                    <p class="text-xs sm:text-sm text-gray-400">称号</p>
                                    <p class="text-sm sm:text-base">{{ data.name }}</p>
                                </div>
                            </div>

                            <div class="flex items-center space-x-3 sm:space-x-4">
                                <div
                                    class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0"
                                >
                                    <icon-github class="text-sm sm:text-base" />
                                </div>
                                <div>
                                    <p class="text-xs sm:text-sm text-gray-400">GitHub</p>
                                    <p class="text-sm sm:text-base">
                                        <a
                                            href="https://github.com/xya-0526"
                                            target="_blank"
                                            class="hover:text-primary"
                                        >
                                            https://github.com/xya-0526
                                        </a>
                                    </p>
                                </div>
                            </div>

                            <div class="flex items-center space-x-3 sm:space-x-4">
                                <div
                                    class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0"
                                >
                                    <icon-email class="text-sm sm:text-base" />
                                </div>
                                <div>
                                    <p class="text-xs sm:text-sm text-gray-400">邮箱</p>
                                    <p class="text-sm sm:text-base">{{ data.email }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 滚动指示器 -->
        <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <i class="fa fa-angle-down text-2xl text-primary"></i>
        </div>
    </section>
</template>
<script setup lang="ts">
import type { UserAPI } from '@/api.type/userInof.type'
import { IconGithub, IconEmail, IconMoonFill } from '@arco-design/web-vue/es/icon'
import { computed } from 'vue'
const props = defineProps<{ modelValue: UserAPI }>()
const data = computed(() => {
    return {
        ...props.modelValue,
        avatar: {
            avatar: import.meta.env.VITE_APP_BASE_URL + props.modelValue.avatar?.avatar
        }
    }
})
</script>
