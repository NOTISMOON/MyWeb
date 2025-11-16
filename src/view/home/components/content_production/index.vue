<template>
    <section id="production" class="py-20 bg-gradient-to-b from-dark to-dark/95 relative">
        <div
            class="absolute top-20 right-10 w-64 h-64 bg-primary/20 rounded-full filter blur-3xl z-[-1]"
        ></div>
        <div
            class="absolute bottom-10 left-10 w-80 h-80 bg-secondary/20 rounded-full filter blur-3xl z-[-1]"
        ></div>
        <div class="container mx-auto px-4">
            <div class="text-center mb-16">
                <h2 class="text-[clamp(1.8rem,3vw,2.5rem)] font-bold mb-4">
                    项目<span class="text-primary">经历</span>
                </h2>
                <p class="text-gray-400 max-w-2xl mx-auto" v-if="data.length">哈哈哈哈这个人很懒什么也没有留下</p>
            </div>
        </div>
        <div class="grid grid-cols-1 gap-8 justify-items-center">
            <!-- 项目1 -->
            <div
                v-for="item in data"
                :key="item.id"
                class="w-[90%] card-gradient rounded-2xl shadow-xl hover-lift overflow-hidden border border-gray-800"
            >
                <div class="flex flex-col md:flex-row">
                    <!-- 左侧：项目图片 -->
                    <div class="md:w-2/5 h-48 md:h-auto relative overflow-hidden">
                        <img
                            :src="item.image"
                            alt=""
                            class="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        />
                    </div>

                    <!-- 右侧：项目介绍 -->
                    <div class="p-6 md:w-3/5 flex flex-col justify-between">
                        <div>
                            <div class="flex justify-between items-start mb-2">
                                <h3 class="text-xl font-bold text-white">{{ item.name }}</h3>
                                <!-- <span class="px-3 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full">
                  Vue3 + TS
                </span> -->
                            </div>

                            <p class="text-gray-300 text-sm mb-4 line-clamp-4">
                                {{ item.desc }}
                            </p>
                        </div>

                        <div class="flex justify-between items-center">
                            <div class="text-sm text-gray-400">
                                <i class="fa fa-calendar-o mr-1"></i>
                                {{ item.createTime }}
                            </div>

                            <a
                                :href="item.link"
                                target="_blank"
                                class="inline-flex items-center text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                            >
                                查看项目
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script setup lang="ts">
import type { ProductionAPI } from '@/api.type/production.type'
import { computed, onMounted } from 'vue'
const props = defineProps<{ modelValue: ProductionAPI[] }>()
const data = computed(() =>props.modelValue)
onMounted(()=>{
    data.value.map((i)=>{
   i.image= import.meta.env.VITE_APP_BASE_URL+i.image
   return  i
    })
})
</script>
