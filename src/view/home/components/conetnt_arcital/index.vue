<template>
    <section id="artical" class="py-20 bg-gradient-to-b from-dark to-dark/95 relative">
        <div class="container mx-auto px-4">
            <div class="text-center mb-16">
                <h2 class="text-[clamp(1.8rem,3vw,2.5rem)] font-bold mb-4">
                    技术<span class="text-primary">博文</span>
                </h2>
                <p class="text-gray-400 max-w-2xl mx-auto">哈哈哈这个人很懒什么也没有留下</p>
            </div>

            <div
                class="grid grid-cols-1 md:grid-cols-2 gap-10 lg:grid-cols-4 gap-10 justify-items-center"
            >
                <div
                    v-for="(item, index) in articalList"
                    :key="index"
                    class="w-[18rem] aspect-square card-gradient rounded-2xl shadow-xl hover-lift p-6 border border-gray-800 flex flex-col"
                >
                    <!-- 文章类型标签 -->
                    <div class="mb-3">
                        <span
                            class="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full"
                        >
                            {{ item.category }}
                        </span>
                    </div>

                    <!-- 文章标题 -->
                    <h3 class="text-xl font-bold mb-2 line-clamp-2 text-white">
                        {{ item.title }}
                    </h3>

                    <!-- 发布时间 -->
                    <div class="text-sm text-gray-400 mb-4">
                        {{ item.createTime }}
                    </div>

                    <!-- 文章内容摘要 -->
                    <p class="text-gray-300 text-sm line-clamp-6 flex-grow">
                        <MdPreview :id="id" :modelValue="item.content.slice(0, 100)" />
                    </p>

                    <!-- 阅读更多按钮 -->
                    <div
                        class="mt-4 inline-flex items-center text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                        @click="Postdata(item)"
                    >
                        阅读全文
                    </div>
                </div>
            </div>
            <a-button
                type="primary"
                shape="round"
                class="self-end"
                v-if="data.length >= 8 && articalList.length < data.length"
                @click="loadMore"
                >看查更多</a-button
            >
            <a-button
                type="primary"
                shape="round"
                class="self-end"
                @click="loadclear"
                v-else-if="articalList.length >= 8 && articalList.length === data.length"
                >收起更多</a-button
            >
        </div>

        <!-- 蒙层 -->
        <div
            v-show="isOpen"
            class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            @click="closeModal"
        >
            <!-- 弹窗容器 -->
            <div
                class="bg-dark border border-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all"
                @click.stop
            >
                <!-- 弹窗头部 -->
                <div class="p-6 border-b border-gray-800 flex justify-between items-center">
                    <h3 class="text-xl font-bold text-white">{{ article?.title }}</h3>
                    <button
                        class="text-gray-400 hover:text-white transition-colors"
                        @click="closeModal"
                    >
                        <i class="fa fa-times text-xl"></i>
                    </button>
                </div>

                <!-- 弹窗内容 -->
                <div class="p-6 overflow-y-auto flex-grow">
                    <!-- 这里用 v-md-preview 渲染文章内容 -->
                    <MdPreview :id="id" :modelValue="article?.content" />
                    <MdCatalog :editorId="id" :scrollElement="scrollElement" />
                </div>

                <!-- 弹窗底部 -->
                <div class="p-6 border-t border-gray-800 flex justify-between items-center">
                    <div class="text-gray-400 text-sm">
                        <span>{{ article?.createTime }}</span>
                        <span class="mx-2">•</span>
                    </div>
                    <button
                        @click="isOpen = false"
                        class="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors"
                    >
                        返回
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>
<script setup lang="ts">
import type { ArticalAPI } from '@/api.type/artical.type'
import { computed, watch } from 'vue'
import { ref } from 'vue'
import { MdPreview, MdCatalog } from 'md-editor-v3'
// preview.css相比style.css少了编辑器那部分样式
import 'md-editor-v3/lib/preview.css'
const id = 'preview-only'
const scrollElement = document.documentElement
const props = defineProps<{ modelValue: ArticalAPI[] }>()
const data = computed(() => props.modelValue)
const isOpen = ref(false)
const Postdata = (value: ArticalAPI) => {
    isOpen.value = true
    article.value = value
    console.log(value)
}
let article = ref<ArticalAPI>()
const count = ref(8) // 初始显示 8 条
const articalList = ref<ArticalAPI[]>([])
// 初始加载
const loadArticals = async () => {
    // 从 props.modelValue 截取前 count.value 条
    articalList.value = props.modelValue.slice(0, count.value)
    console.log(articalList.value.length, props.modelValue.length)
}
// 点击加载更多
const loadMore = () => {
    count.value += 5 // 每次多加载 5 条
    loadArticals()
}
//收起更多
const loadclear = () => {
    count.value = 8
    articalList.value = articalList.value.slice(0, count.value)
}
const closeModal = () => {
    isOpen.value = false
}
watch(
    () => props.modelValue,
    (newVal) => {
        if (newVal.length > 0) {
            loadArticals()
        }
    },
    { immediate: true }
)
</script>
<style scoped>
/* 美化预览区 */
:deep(.md-editor-preview) {
    padding: 1.5rem !important;
    background-color: #0f172a !important;
    color: #cbd5e1 !important;
    line-height: 1.7;
}

/* 标题样式 */
:deep(.md-editor-preview h1, .md-editor-preview h2, .md-editor-preview h3) {
    color: #fff !important;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
}

/* 段落样式 */
:deep(.md-editor-preview p) {
    color: #cbd5e1 !important;
    margin-bottom: 1rem;
}

/* 链接样式 */
:deep(.md-editor-preview a) {
    color: #6366f1 !important;
}

/* 代码块样式 */
:deep(.md-editor-preview pre) {
    background-color: #1e293b !important;
    border-radius: 0.5rem;
    border: 1px solid rgba(99, 102, 241, 0.3);
}

/* 行内代码 */
:deep(.md-editor-preview code) {
    background-color: rgba(99, 102, 241, 0.1) !important;
    color: #c4b5fd !important;
    padding: 0.15rem 0.4rem;
    border-radius: 0.25rem;
}

/* 目录美化 */
:deep(.md-catalog) {
    border-radius: 0.75rem !important;
    padding: 1rem !important;
    background-color: #1e293b !important;
    border-left: 2px solid #6366f1 !important;
}

:deep(.md-catalog-item.active > a) {
    color: #6366f1 !important;
    font-weight: bold;
}
</style>
