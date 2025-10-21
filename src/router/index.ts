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
        }
    ]
})

export default router
