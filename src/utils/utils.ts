import type { Video } from '@/api.type/video.api'
export function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleString() // 格式化为本地日期时间格式
}
export function formatCreateTime(obj: any) {
    for (const key in obj) {
        const value = obj[key]
        if (Array.isArray(value)) {
            value.forEach((item) => {
                if (item && typeof item === 'object' && item.createTime) {
                    item.createTime = formatDate(item.createTime as string)
                }
            })
        } else if (
            typeof value === 'object' &&
            value !== null &&
            !Object.keys(value).includes('createTime')
        ) {
            formatCreateTime(value) // 递归调用处理对象
        }
    }
}
export const setupWechatSmoothScroll = () => {
    // 判断是否微信浏览器
    if (/MicroMessenger/i.test(navigator.userAgent)) {
        console.log('检测到微信浏览器，启用JS平滑滚动修复')

        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault()

                const targetId = this.getAttribute('href')
                if (!targetId || targetId === '#') return

                const targetElement = document.querySelector(targetId)
                if (!targetElement) return

                // 获取导航栏高度
                const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0

                // 计算目标位置（减去导航栏高度和额外间距）
                const targetPosition =
                    targetElement.getBoundingClientRect().top +
                    window.pageYOffset -
                    navbarHeight -
                    20
                // 平滑滚动
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                })
            })
        })
    }
}

export class videoinof {
    private id: number
    private readonly KEY: string
    constructor(id: number) {
        this.id = id
        this.KEY = `video${this.id}`
    }
    setViodeInof(value: Video) {
        sessionStorage.setItem(this.KEY, JSON.stringify(value))
    }
    getVideoInof() {
        const viode = sessionStorage.getItem(this.KEY)
        if (!viode) return null
        return JSON.parse(viode)
    }
}
