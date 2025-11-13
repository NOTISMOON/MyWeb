<template>
    <Header></Header>
    <div class="min-h-screen py-8" id="video">
        <!-- 视频分类标题 -->
        <div
            class="ml-[5%] mt-[3.5%] text-2xl font-bold border-b-2 border-blue-500 pb-2 inline-block mb-6"
        >
            视频分类
        </div>
        <!-- 分类标签栏 -->
        <div class="ml-[5%] mr-[5%] flex gap-3 overflow-x-auto pb-2 mb-6 scrollbar-hide">
            <button
                v-for="(key, index) in buttonArray"
                :key="index"
                @click="videosBycategory(key)"
                :class="{ 'bg-blue-500': key == seletcKey }"
                class="text-white px-4 py-2 rounded-full text-sm whitespace-nowrap shadow-sm hover:bg-blue-600 transition-colors"
            >
                {{ key }}
            </button>
        </div>
        <!-- 视频区标题 -->
        <p class="ml-[5%] mr-[5%] text-lg font-semibold text-gray-800 mb-6">视频区</p>
        <!-- 瀑布流容器 -->
        <div class="relative w-[90%] mx-auto" v-waterfall>
            <!-- 视频卡片 -->
            <div v-for="i in videosBycategoryList" :key="i.id" class="group w-[10rem]">
                <div
                    class="bg-white h-full rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                    <!-- 视频缩略图 -->
                    <div class="w-full relative" @click="openPlayerInNewTab(i)">
                        <img
                            :src="i.cover"
                            alt="视频缩略图"
                            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            :class="{
                                'opacity-0': !imgLoaded[i.id],
                                'opacity-100': imgLoaded[i.id]
                            }"
                            @load="imgLoaded[i.id] = true"
                            style="transition: opacity 0.3s ease-in-out; background: #f0f0f0"
                        />
                        <!-- 视频时长 -->
                        <span
                            class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded backdrop-blur-sm"
                        >
                            {{ i.duration }}
                        </span>
                        <div
                            class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                            <svg
                                class="w-10 h-10 text-white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>
                    <!-- 视频信息 -->
                    <div class="p-3">
                        <h3 class="font-medium text-gray-800 line-clamp-2 mb-2 h-12 text-sm">
                            {{ i.title }}
                        </h3>
                        <div class="flex items-center text-gray-500 text-xs">
                            <!-- 观看量 -->
                            <span class="flex items-center mr-3">
                                <svg
                                    class="w-3.5 h-3.5 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    ></path>
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    ></path>
                                </svg>
                                {{ Math.floor(Math.random() * 10000) + 100 }}
                            </span>
                            <!-- 上传时间 -->
                            <span>{{
                                new Date().getDate() - new Date(i.uploadTime).getDate()
                                    ? `${new Date(new Date().getDate() - new Date(i.uploadTime).getDate()).getDate()}天前`
                                    : '今天'
                            }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 加载更多提示 -->
        <div class="text-center mt-8" v-if="isLoading">
            <div
                class="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
            ></div>
            <p class="text-sm text-gray-500 mt-2">加载中...</p>
        </div>
        <div class="text-center mt-8 text-gray-500 text-sm" v-if="!hasMore && !isLoading">
            已加载全部内容
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Video } from '@/api.type/video.api'
import { getVideoList } from '@/request'
import Header from '@view/home/components/header/index.vue'
import { nextTick, ref, onMounted, onUnmounted } from 'vue'

// 视频列表数据（初始30条，下拉加载更多）
const videoList = ref<Array<Video>>([])
const buttonArray = ref(['全部', 'NEST', 'REACT', 'ES6', 'VUE', 'JavaScript', 'CSS'])
const videosBycategoryList = ref<Array<Video>>([])
const total = ref()
// 图片加载状态
const imgLoaded = ref<Record<number, boolean>>({})
// 加载状态控制
const isLoading = ref(false)
// 是否还有更多数据
const hasMore = ref(true)
// 当前页
const currentPage = ref(1)
// 每页加载数量
const pageSize = 10

// 保留你原有的瀑布流指令逻辑
const vWaterfall = {
    mounted: async (e: any) =>{
        const renderWaterfall = () => {
            const items = Array.from(e.childNodes).filter(
                (node: any) => node.nodeType === 1
            ) as HTMLElement[]
            if (items.length === 0) return
            const Seewidth = e.offsetWidth
            const columnCount = Math.max(1, Math.floor(Seewidth / items[0].offsetWidth))
            const totalAvailableSpace = Seewidth - columnCount * items[0].offsetWidth
            const columnGap = columnCount > 1 ? totalAvailableSpace / (columnCount - 1) : 0
            const arrytop = new Array(columnCount).fill(0)
            items.forEach((i: any) => {
                i.style.position = 'absolute'

                const minHeight = Math.min(...arrytop)
                const minHeightindex = arrytop.indexOf(minHeight)
                i.style.top = minHeight + 'px'
                i.style.left = minHeightindex * (i.offsetWidth + columnGap) + 'px'
                arrytop[minHeightindex] += i.offsetHeight + columnGap
            })
            e.style.height = Math.max(...arrytop) + 20 + 'px'
        }

        // 防抖处理滚动事件
        const debounce = (fn: Function, delay = 0) => {
            let timer: number | null = null
            return (...args: any[]) => {
                timer && clearTimeout(timer)
                timer = window.setTimeout(() => fn.apply(this, args), delay)
            }
        }
        const debouncedRender = debounce(renderWaterfall)
        window.addEventListener('resize', debouncedRender)
         e._waterfallRender = debouncedRender
        nextTick(renderWaterfall)
    },
    updated: (e: any) => {
        nextTick(() => {
            e._waterfallRender?.()
        })
    },
    unmounted: (e: any) => {
        window.removeEventListener('resize', e._waterfallRender)
    }
}
const formatImageUrl = (imagePath: string) => {
    return import.meta.env.VITE_APP_BASE_URL + imagePath
}
const seletcKey = ref<string>('全部')
const videosBycategory = (key: string = '全部') => {
    seletcKey.value = key
    if (key == '全部') return (videosBycategoryList.value = videoList.value)
    videosBycategoryList.value = videoList.value.filter((i: any) => i.category == key)
}
// 打开视频播放页
const openPlayerInNewTab = (video: Video) => {
    const basePath = import.meta.env.VITE_APP_BASE || '/'
    const playerUrl = `${window.location.origin}${basePath}player/${video.id}`
    const newWindow = window.open(playerUrl, '_blank')
    if (newWindow) {
        // 监听新窗口的“就绪”信号，只监听一次
        const handleMessage = (e: MessageEvent) => {
            console.log(3)
            // 验证：来源必须匹配，且是当前新窗口的就绪信号
            if (
                e.origin === window.location.origin &&
                e.data.type === 'readplay' &&
                e.source === newWindow
            ) {
                // 关键：验证消息来源窗口
                newWindow.postMessage({ type: 'videoData', ...video }, window.location.origin)
            }
        }
        window.addEventListener('message', handleMessage, { once: true }) // 只触发一次后自动移除
    }
}
// 加载更多数据
const loadMore = async () => {
    if (isLoading.value || !hasMore.value) return
    isLoading.value = true
    // 模拟接口请求延迟
    currentPage.value++
    const res = await getVideoList(currentPage.value)
    // 生成新数据（实际项目中替换为接口请求）
    const newItems = res.videos.map((i: Video) => {
        i.cover = formatImageUrl(i.cover)
        return i
    })
    videoList.value?.push(...newItems)
    //分类
    videosBycategory(seletcKey.value)
    // 模拟数据上限（实际项目中根据接口返回判断）
    if (videoList.value.length >= total.value) {
        hasMore.value = false
    }
    isLoading.value = false
}
// 滚动监听逻辑
const handleScroll = () => {
    if (isLoading.value || !hasMore.value) return
    // 计算滚动距离底部的距离
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const clientHeight = document.documentElement.clientHeight || window.innerHeight
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
    const distanceToBottom = scrollHeight - scrollTop - clientHeight
    if (distanceToBottom <5) {
        loadMore()
    }
}
// 挂载时添加滚动监听
onMounted(async () => {
    const res = await getVideoList()
    total.value = res.total
    videoList.value = res.videos.map((i: Video) => {
        i.cover = formatImageUrl(i.cover)
        return i
    })
    videosBycategory()
    document.addEventListener('scroll', handleScroll)
})
// 卸载时移除滚动监听
onUnmounted(() => {
    document.removeEventListener('scroll', handleScroll)
})
</script>
<style>
/* 自定义工具类 */
@layer utilities {
    .content-auto {
        content-visibility: auto;
    }
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
    .aspect-video {
        aspect-ratio: 16 / 9;
    }
}
/* 加载动画 */
.animate-spin {
    animation: spin 1s linear infinite;
}
@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>
