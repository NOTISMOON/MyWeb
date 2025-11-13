export interface CreateVideo {
    title: string
    desc: string
    cover: string
    url?: string
    category: string
    duration: string
}
export interface Video extends CreateVideo {
    id: number
    uploadTime: string
    status: number
}
export interface VideoListRes {
    videos: Video[]
    totial: number
}
