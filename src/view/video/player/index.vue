<template>
        <Header id="navbar"></Header>
    <div class="bg-light h-full w-full font-inter">
        <!-- 顶部导航（复用你的 Header 组件，确保与 #navbar 定位兼容） -->
        <!-- 主内容区：播放器 + 详情 + 推荐（背景加装饰元素） -->
        <div class="container mx-auto px-4 py-6 relative">
            <!-- 背景美化元素1：播放器区域径向光晕（主色低透明度，不干扰内容） -->
            <div
                class="absolute top-20 left-1/2 -translate-x-1/2 w-[80%] h-96 bg-primary/5 rounded-full blur-3xl -z-10"
            ></div>
            <!-- 1. 视频播放器区域（占主要宽度，居中显示） -->
            <div class="max-w-4xl mx-auto mb-10 relative mt-[5rem]">
                <!-- 装饰性标题线（主色点缀，分隔导航与播放器） -->
                <div class="flex items-center gap-3 mb-6">
                    <div class="h-0.5 w-12 bg-primary"></div>
                    <h2 class="text-xl font-semibold text-dark">视频播放</h2>
                    <div class="flex-1 h-0.5 bg-primary/20"></div>
                </div>

                <!-- 播放器主体（用你的 hover-lift 工具类，增强交互） -->
                <div
                    class="aspect-video bg-dark rounded-xl overflow-hidden shadow-lg relative hover-lift"
                >
                    <!-- 原生 video 标签 -->
                    <video
                        ref="videoRef"
                        :src="currentVideo.url"
                        preload="metadata"
                        class="w-full h-full object-contain"
                        @timeupdate="updateProgress"
                        @loadedmetadata="initPlayer"
                        @waiting="isLoading = true"
                        @playing="
                        isLoading =false;
                        resetControlTimer()"
                        @ended="handleVideoEnd"
                        @click="togglePlay"
                    ></video>
                    <!-- 加载中动画（用你的主色，更贴合主题） -->
                    <div
                        v-if="isLoading"
                        class="absolute inset-0 flex items-center justify-center bg-dark/40 bg-blur"
                    >
                        <div
                            class="w-14 h-14 border-3 border-primary border-t-transparent rounded-full animate-spin"
                        ></div>
                    </div>

                    <!-- 播放控制层（用你的 bg-blur 和渐变，优化透明度） -->
                    <div
                        class="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/30 to-transparent flex flex-col justify-end opacity-0 transition-opacity duration-300"
                        @mouseenter="
                        showControls = true;
                        resetControlTimer()
                        "
                        @mouseleave="startControlTimer()"
                        :class="{ 'opacity-100': showControls || isDragging || isLoading }"
                    >
                        <!-- 进度条（主色填充，优化交互反馈） -->
                        <div class="px-6 pb-2">
                            <div
                                ref="progressBarRef"
                                class="w-full h-2 bg-dark/60 rounded-full cursor-pointer group relative"
                                @click="seekProgress"
                                @mousedown.prevent="handleDragStart"
                                @touchstart.prevent="handleDragStart"
                            >
                                <!-- 已播放进度（用你的主色） -->
                                <div
                                    class="h-full bg-primary rounded-full transition-all duration-150"
                                    :style="{ width: `${progressPercent}%` }"
                                ></div>

                                <!-- 进度滑块（hover 放大+主色阴影，用你的工具类思路） -->
                                <div
                                    class="absolute top-1/2 w-5 h-5 bg-light rounded-full shadow-lg transition-all duration-150 group-hover:scale-110"
                                    :style="{
                                        left: `${progressPercent}%`,
                                        transform: 'translate(-50%, -50%)',
                                        boxShadow: isDragging
                                            ? '0 0 0 4px rgba(99, 102, 241, 0.2)'
                                            : 'none'
                                    }"
                                ></div>

                                <!-- 拖拽预览时间（用你的 bg-blur，提升质感） -->
                                <div
                                    v-if="isDragging"
                                    class="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark bg-blur text-light text-xs px-2 py-1 rounded whitespace-nowrap"
                                >
                                    {{ formatTime(draggingTime) }}
                                </div>
                            </div>
                            <!-- 时间显示（优化对比度，用你的浅色） -->
                            <div class="flex justify-between text-light/90 text-sm mt-1">
                                <span>{{ formatTime(currentTime) }}</span>
                                <span>{{ formatTime(totalTime) }}</span>
                            </div>
                        </div>

                        <!-- 控制按钮组（hover 主色反馈，统一交互） -->
                        <div class="px-6 pb-6 flex items-center gap-6 text-light/90">
                            <!-- 播放/暂停（hover 主色变色） -->
                            <button
                                @click="togglePlay"
                                class="text-xl transition-colors hover:text-primary"
                            >
                                <svg
                                    v-if="isPlaying"
                                    class="w-7 h-7"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                </svg>
                                <svg v-else class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </button>

                            <!-- 音量控制（滑块用主色，优化样式） -->
                            <div class="flex items-center gap-2 group">
                                <button
                                    @click="toggleMute"
                                    class="transition-colors hover:text-primary"
                                >
                                    <svg
                                        v-if="!isMuted && volume > 0.5"
                                        class="w-6 h-6"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"
                                        />
                                    </svg>
                                    <svg
                                        v-else-if="!isMuted && volume > 0"
                                        class="w-6 h-6"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M11 5L6 9H2v6h4l5 4V5zm7.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm-2.5-4.5c.55 0 1 .45 1 1v3c0 .55-.45 1-1 1s-1-.45-1-1v-3c0-.55.45-1 1-1z"
                                        />
                                    </svg>
                                    <svg
                                        v-else
                                        class="w-6 h-6"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5L19.73 13 14 7.27V3H4.27zM14 15.5v-7l-3.5 3.5z"
                                        />
                                    </svg>
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    :value="volume"
                                    @input="adjustVolume"
                                    @mousedown="resetControlTimer()"
                                    class="w-24 h-1.5 bg-dark/60 rounded-full appearance-none cursor-pointer group-hover:bg-dark/80 transition-colors"
                                />
                            </div>

                            <!-- 倍速播放（下拉框用你的深色系，选中态主色） -->
                            <div class="relative group">
                                <button
                                    class="text-sm flex items-center gap-1 transition-colors hover:text-primary"
                                >
                                    {{ playbackRate }}x
                                    <svg
                                        class="w-3.5 h-3.5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>
                                <div
                                    class="absolute bottom-full left-0 mb-2 bg-dark bg-blur rounded-md shadow-xl w-24 opacity-0 group-hover:opacity-100 transition-all duration-200 origin-bottom"
                                >
                                    <button
                                        v-for="rate in playbackRates"
                                        :key="rate"
                                        @click="
                                            setPlaybackRate(rate);
                                            resetControlTimer()
                                        "
                                        class="block w-full text-left px-3 py-2 text-sm hover:bg-dark/50 transition-colors"
                                        :class="{
                                            'bg-primary text-light': playbackRate === rate,
                                            'text-light/90': playbackRate !== rate
                                        }"
                                    >
                                        {{ rate }}x
                                    </button>
                                </div>
                            </div>

                            <!-- 全屏（右对齐，hover 主色反馈） -->
                            <button
                                @click="toggleFullscreen"
                                class="ml-auto transition-colors hover:text-primary"
                            >
                                <svg
                                    v-if="!isFullscreen"
                                    class="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
                                    />
                                </svg>
                                <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 背景美化元素2：详情区装饰线条（主色+辅助色渐变，分隔播放器与详情） -->
            <div class="max-w-6xl mx-auto my-8">
                <div
                    class="h-0.5 w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent"
                ></div>
            </div>

            <!-- 2. 视频详情 + 相关推荐（两栏布局，背景加辅助色点缀） -->
            <div class="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto relative">
                <!-- 背景美化元素3：详情区小光晕（辅助色低透明度，增加层次） -->
                <div
                    class="absolute top-1/2 left-20 w-40 h-40 bg-secondary/5 rounded-full blur-2xl -z-10"
                ></div>

                <!-- 左侧：视频详情区（用你的 card-gradient 思路，优化卡片质感） -->
                <div class="lg:w-2/3">
                    <!-- 视频标题（用你的 text-gradient，增强视觉焦点） -->
                    <h1
                        class="text-[clamp(1.5rem,3vw,2.2rem)] font-bold text-dark mb-4 leading-tight text-gradient"
                    >
                        {{ currentVideo.title }}
                    </h1>

                    <!-- 视频基础信息（图标用主色，标签用辅助色） -->
                    <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-dark/70 mb-6">
                        <span class="flex items-center gap-1.5">
                            <svg
                                class="w-4.5 h-4.5 text-primary"
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
                            <!-- {{ formatNum(currentVideo.viewCount) }} 次观看 -->
                        </span>
                        <span class="flex items-center gap-1.5">
                            <svg
                                class="w-4.5 h-4.5 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                ></path>
                            </svg>
                            {{ new Date(currentVideo.uploadTime).toLocaleString() }}
                        </span>
                        <span class="flex items-center gap-1.5">
                            <svg
                                class="w-4.5 h-4.5 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                ></path>
                            </svg>
                            <span
                                class="px-2 py-0.5 bg-secondary/10 text-secondary rounded text-xs font-medium"
                            >
                                {{ currentVideo.category }}
                            </span>
                        </span>
                    </div>

                    <!-- 视频简介（用你的卡片样式，加主色边框提升精致度） -->
                    <div
                        class="bg-light border border-primary/10 rounded-xl shadow-sm p-5 mb-6 transition-all duration-300 hover:shadow-md"
                    >
                        <h3 class="font-semibold text-dark mb-3 text-lg flex items-center gap-2">
                            <svg
                                class="w-5 h-5 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                ></path>
                            </svg>
                            视频简介
                        </h3>
                        <p class="text-dark/70 leading-relaxed whitespace-pre-line">
                            {{ currentVideo.desc }}
                        </p>
                    </div>
                </div>

                <!-- 右侧：相关推荐（用你的 hover-lift，卡片加主色点缀） -->
                <div class="lg:w-1/3">
                    <!-- 推荐标题（用装饰点+主色，呼应整体风格） -->
                    <h2 class="text-xl font-bold text-dark mb-4 flex items-center gap-2">
                        <span class="w-2 h-2 bg-primary rounded-full"></span>
                        相关推荐
                        <span class="text-sm font-normal text-dark/50 ml-2"
                            >{{ relatedVideos.length }} 个视频</span
                        >
                    </h2>

                    <!-- 推荐视频列表（用你的 hover-lift，增强交互） -->
                    <div class="space-y-4" v-if="relatedVideos.length">
                        <div
                            v-for="item in relatedVideos"
                            :key="item.id"
                            class="flex gap-3 cursor-pointer bg-light border border-primary/5 rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover-lift"
                            @click="goToPlayer(item)"
                            @mouseenter="resetControlTimer()"
                        >
                            <!-- 推荐视频缩略图（加主色边框，提升精致度） -->
                            <div
                                class="w-2/5 relative aspect-video rounded-l-lg overflow-hidden flex-shrink-0 border-r border-primary/5"
                            >
                                <img
                                    :src="formatImageUrl(item.cover)"
                                    alt="推荐视频缩略图"
                                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    loading="lazy"
                                />
                                <!-- 视频时长（用你的 bg-blur，提升质感） -->
                                <span
                                    class="absolute bottom-1.5 right-1.5 bg-dark/80 bg-blur text-light text-xs px-1.5 py-0.5 rounded"
                                >
                                    {{ item.duration }}
                                </span>
                            </div>
                            <!-- 推荐视频信息（标题 hover 主色） -->
                            <div class="w-3/5 p-3">
                                <h4
                                    class="font-medium text-dark line-clamp-2 mb-2 transition-colors hover:text-primary"
                                >
                                    {{ item.title }}
                                </h4>
                                <!-- <p class="text-dark/50 text-xs line-clamp-1 mb-1">{{ formatNum(item.viewCount) }} 次观看</p> -->
                                <p class="text-dark/40 text-xs">{{ item.uploadTime }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Video } from '@/api.type/video.api'
import { getRelationVideos } from '@/request'
import { formatDate, videoinof } from '@/utils/utils'
import Header from '@view/home/components/header/index.vue'
import { ref, onMounted, watch, onUnmounted} from 'vue'
import { useRoute, useRouter } from 'vue-router'

// ---------------------- 路由与数据 ----------------------
const route = useRoute()
const router = useRouter()
// 当前播放的视频数据 + 相关推荐视频
const currentVideo = ref<Video>({
    title: '',
    url: '',
    cover: '',
    uploadTime: '',
    category: '',
    desc: '',
    duration: '',
    status: 1,
    id: NaN
})
const relatedVideos = ref<Array<Video>>([])
// ---------------------- 播放器核心状态 ----------------------
const videoRef = ref<HTMLVideoElement | null>(null)
const progressBarRef = ref<HTMLDivElement | null>(null)
const isPlaying = ref(false)
const isMuted = ref(false)
const volume = ref(1)
const currentTime = ref(0)
const totalTime = ref(0)
const progressPercent = ref(0)
const isLoading = ref(false)
const showControls = ref(false)
const isDragging = ref(false)
const isFullscreen = ref(false)
const draggingTime = ref(0) // 拖拽预览时间
const controlTimer = ref<number | null>(null) // 浏览器环境使用 number
// ---------------------- 生命周期与路由数据 ----------------------
onMounted(async () => {
    if (route.query.id) {
        currentVideo.value = route.query as unknown as Video
    }
    const VideoTOOls = new videoinof(+route.params.id)
    if (VideoTOOls.getVideoInof()) {
        currentVideo.value = VideoTOOls.getVideoInof()
    }
    window.opener?.postMessage({ type: 'readplay' }, window.location.origin)
    // 监听父窗口发送的视频数据
    const awaitDate = () => {
        return new Promise<void>((resolve) => {
            window.addEventListener('message', async (e: MessageEvent<any>) => {
                // 严格验证来源和消息类型
                if (e.origin !== window.location.origin) return
                if (e.data.type === 'videoData') {
                    e.data.url = formatImageUrl(e.data.url)
                    currentVideo.value = await e.data
                    VideoTOOls.setViodeInof(currentVideo.value)
                    // 处理视频数据（例如：初始化播放器）
                }
                resolve()
            })
            // 移除事件监听，避免重复处理
            window.removeEventListener('message', awaitDate)
        })
    }

    if (!currentVideo.value.category) await awaitDate()
    const res = await getRelationVideos(currentVideo.value.category)
    res.data.map((i) => {
        i.url = formatImageUrl(i.url)
        i.uploadTime = formatDate(i.uploadTime)
        return i
    })
    res.data = res.data.filter(
        (item: Video) =>
            item.category === currentVideo.value.category && item.id !== currentVideo.value.id
    )
    if (res.data.length <= 2) {
        relatedVideos.value = res.data
    } else {
        for (let i = 0; i < 2; i++) {
            relatedVideos.value.push(
                res.data[Math.floor(Math.random() * (res.data.length - 2) + 1)]
            )
        }
    }
    // 监听全局鼠标移动，防止控制层误隐藏
    document.addEventListener('mousemove', resetControlTimer)
    // 全屏状态监听（一次注册）
    const handleFSChange = () => {
        isFullscreen.value = !!document.fullscreenElement
    }
    document.addEventListener('fullscreenchange', handleFSChange)
    // 卸载时清理（确保移除监听）
    onUnmounted(() => {
        document.removeEventListener('fullscreenchange', handleFSChange)
    })
})

onUnmounted(() => {
    // 清理控制器定时器
    if (controlTimer.value !== null) {
        window.clearTimeout(controlTimer.value)
        controlTimer.value = null
    }
    document.removeEventListener('mousemove', resetControlTimer)
    // 如果正在拖拽，强制结束并移除监听
    handleDragEnd()
})
watch(
    () => route.query,
    async (value) => {
        currentVideo.value = value as unknown as Video
        const res = await getRelationVideos(currentVideo.value.category)
        res.data.map((i) => {
            i.url = formatImageUrl(i.url)
            i.uploadTime = formatDate(i.uploadTime)
            return i
        })
        res.data = res.data.filter(
            (item: Video) =>
                item.category === currentVideo.value.category && item.id !== currentVideo.value.id
        )
        relatedVideos.value = []
        if (res.data.length <= 2) {
            relatedVideos.value = res.data
        } else {
            for (let i = 0; i < 2; i++) {
                relatedVideos.value.push(
                    res.data[Math.floor(Math.random() * (res.data.length - 2) + 1)]
                )
            }
        }
    }
)
const formatImageUrl = (imagePath: string) => {
    return import.meta.env.VITE_APP_BASE_URL + imagePath
}
// ---------------------- 播放控制函数 ----------------------
const initPlayer = async () => {
    if (!videoRef.value) return
    totalTime.value = videoRef.value.duration || 0
    // 确保音量与静音状态同步
    videoRef.value.volume = volume.value
    videoRef.value.muted = isMuted.value
    try {
        // 尝试自动播放（可能被浏览器策略阻止）
        await videoRef.value.play()
        isPlaying.value = true
    } catch (err) {
        // 若被阻止，静音后重试一次
        try {
            videoRef.value.muted = true
            await videoRef.value.play()
            isPlaying.value = true
            isMuted.value = true
        } catch (e) {
            isPlaying.value = false
        }
    }
}

// 播放/暂停切换
const togglePlay = async () => {
    if (!videoRef.value) return
    if (isPlaying.value) {
        videoRef.value.pause()
        isPlaying.value = false
    } else {
        try {
            await videoRef.value.play()
            isPlaying.value = true
        } catch (err) {
            // 若播放被阻止，静音并尝试
            videoRef.value.muted = true
            isMuted.value = true
            await videoRef.value.play().catch(() => {})
            isPlaying.value = !videoRef.value.paused
        }
    }
    resetControlTimer()
}

// 静音切换
const toggleMute = () => {
    if (!videoRef.value) return
    videoRef.value.muted = !isMuted.value
    isMuted.value = !isMuted.value
}

// 调节音量
const adjustVolume = (e: Event) => {
    const target = e.target as HTMLInputElement
    volume.value = parseFloat(target.value)
    if (videoRef.value) {
        videoRef.value.volume = volume.value
        if (volume.value > 0 && isMuted.value) {
            videoRef.value.muted = false
            isMuted.value = false
        }
    }
}

// ---------------------- 进度 / 拖拽逻辑 ----------------------
// 更新播放进度（由 video timeupdate 触发）
const updateProgress = () => {
    if (!videoRef.value) return
    currentTime.value = videoRef.value.currentTime || 0
    if (!totalTime.value || totalTime.value === 0) {
        progressPercent.value = 0
    } else {
        progressPercent.value = (currentTime.value / totalTime.value) * 100
    }
}

// 点击进度条跳转（click）
const seekProgress = (e: MouseEvent | TouchEvent) => {
    if (!videoRef.value || !progressBarRef.value) return
    const rect = progressBarRef.value.getBoundingClientRect()
    let clientX = 0
    if (e instanceof TouchEvent) {
        clientX = e.changedTouches?.[0]?.clientX ?? 0
    } else {
        clientX = (e as MouseEvent).clientX
    }
    const clickX = clientX - rect.left
    const p = Math.max(0, Math.min(1, clickX / rect.width))
    const seekTime = p * (totalTime.value || 0)
    progressPercent.value = p * 100
    draggingTime.value = seekTime
    // 立即跳转
    videoRef.value.currentTime = seekTime
}

// 禁用 / 恢复 文本选择
const setDocumentSelecting = (allow: boolean) => {
    document.body.style.userSelect = allow ? '' : 'none'
}

// 拖拽开始（鼠标或触摸）
const handleDragStart = (e: MouseEvent | TouchEvent) => {
    isDragging.value = true
    setDocumentSelecting(false)
    // 绑定 move / end（支持 mouse + touch）
    document.addEventListener('mousemove', handleDragMove as any)
    document.addEventListener('mouseup', handleDragEnd as any)
    document.addEventListener('touchmove', handleDragMove as any, { passive: false })
    document.addEventListener('touchend', handleDragEnd as any)
    // 立即处理当前点（兼容 click/touchstart 触发）
    handleDragMove(e)
}
// 拖拽移动（更新预览 / 实时跳转）
const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (!progressBarRef.value) return
    if ((e as Event).cancelable) (e as Event).preventDefault()
    const rect = progressBarRef.value.getBoundingClientRect()
    let clientX = 0
    if (e instanceof TouchEvent) {
        clientX = e.touches?.[0]?.clientX ?? 0
    } else {
        clientX = (e as MouseEvent).clientX
    }
    const clickX = clientX - rect.left
    const p = Math.max(0, Math.min(1, clickX / rect.width))
    const seekTime = p * (totalTime.value || 0)
    progressPercent.value = p * 100
    draggingTime.value = seekTime
    // 若实时预览需要真正跳转则设置 currentTime（会导致频繁 seek）
    if (isDragging.value && videoRef.value) {
        videoRef.value.currentTime = seekTime
    }
}
// 拖拽结束（释放鼠标/触摸）
const handleDragEnd = () => {
    isDragging.value = false
    setDocumentSelecting(true)
    document.removeEventListener('mousemove', handleDragMove as any)
    document.removeEventListener('mouseup', handleDragEnd as any)
    document.removeEventListener('touchmove', handleDragMove as any)
    document.removeEventListener('touchend', handleDragEnd as any)
    // 已在 move 中实时更新 currentTime；若你想只在 end 时应用，请在此处再写入一次：
    if (videoRef.value) {
        videoRef.value.currentTime = draggingTime.value
    }
}
// ---------------------- 全屏逻辑 ----------------------
const toggleFullscreen = () => {
    const player = document.querySelector('.aspect-video') as HTMLElement | null
    if (!player) return
    if (!document.fullscreenElement) {
        player.requestFullscreen?.().catch(() => {})
    } else {
        document.exitFullscreen?.().catch(() => {})
    }
}
// ---------------------- 其他控制与事件 ----------------------
const handleVideoEnd = () => {
    isPlaying.value = false
    currentTime.value = 0
    progressPercent.value = 0
    showControls.value = true
}
// 倍速播放
const playbackRate = ref(1)
const playbackRates = ref([0.5, 0.75, 1, 1.25, 1.5, 2])
const setPlaybackRate = (rate: number) => {
    playbackRate.value = rate
    if (videoRef.value) videoRef.value.playbackRate = rate
}
// 控制层自动隐藏（播放时3秒无操作隐藏）
const clearControlTimer = () => {
    if (controlTimer.value !== null) {
        window.clearTimeout(controlTimer.value)
        controlTimer.value = null
    }
}
const startControlTimer = () => {
    clearControlTimer()
    if (!isPlaying.value || isLoading.value) return
    controlTimer.value = window.setTimeout(() => (showControls.value = false), 2000)
}
const resetControlTimer = () => {
    showControls.value = true
    clearControlTimer()
    if (!isPlaying.value || isLoading.value) return
    controlTimer.value = window.setTimeout(() => (showControls.value = false), 2000)
}
// ---------------------- 工具函数（适配你的设计风格） ----------------------
// 格式化时间（支持小时，适配浅色文本）
const formatTime = (time: number) => {
    if (!time || Number.isNaN(time)) return '0:00'
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = Math.floor(time % 60)

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
// 格式化数字（万级单位，适配深色文本）
const formatNum = (num: number) => {
    if (num >= 100000000) return (num / 100000000).toFixed(1) + '亿'
    if (num >= 10000) return (num / 10000).toFixed(1) + '万'
    return num.toString()
}
const goToPlayer = (item: Video) =>
    router.push({ name: 'player', query: { ...item }, params: { id: item.id }, force: true })
</script>
<style scoped>
/* 引入你的基础样式（确保与你的全局样式文件路径一致） */
@import '../../../style.css'; /* 替换为你的全局样式文件路径 */
/* 补充：音量滑块样式（适配你的主色，覆盖默认样式） */
@layer utilities {
    input[type='range']::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: var(--color-primary); /* 用你的主色变量 */
        cursor: pointer;
        transition: all 0.15s ease;
    }
    input[type='range']::-webkit-slider-thumb:hover {
        background: var(--color-primary);
        box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2); /* 主色低透明度阴影 */
    }
}
/* 确保播放器比例生效（兼容你的 aspect-video 工具类） */
.aspect-video {
    aspect-ratio: 16 / 9;
}
</style>
