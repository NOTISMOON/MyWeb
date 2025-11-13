import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_APP_BASE),
    routes: [
        {
            path: '/home',
            name: 'home',
            component: () => import('@view/home/index.vue')
        },
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/video',
            name: 'video',
            component: () => import('@view/video/index.vue')
        },
        {
            name: 'player',
            path: '/player/:id?',
            component: () => import('@view/video/player/index.vue')
        }
    ]
})

export default router
