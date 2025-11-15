import request from './req'
const id = import.meta.env.VITE_APP_USERID
export const getuserInof = async () => {
    try {
        const res = await request.get(`/user/userInof/${import.meta.env.VITE_APP_USER_ID}`)
        return res.data
    } catch (e) {
        console.log(e)
    }
}
export const addDiscussion = async (body: { text: string }) => {
    try {
        const res = await request.post(
            `/discussion/create/${import.meta.env.VITE_APP_USER_ID}`,
            body
        )
        return res.data
    } catch (e) {
        console.log(e)
    }
}
export const postview = async () => {
    try {
    const res=    await request.post(`/view/${import.meta.env.VITE_APP_USER_ID}`)
        console.log(res)
        console.log(22222)
    } catch (e) {}
}
export const getVideoList = async (page: number = 1, size: number = 10) => {
    try {
        const res = await request.get(`/video/myweb?page=${page}&size=${size}`)
        return res.data
    } catch (e) {}
}
export const getVideoById = async (id: number) => {
    try {
        const res = await request.get(`/video/${id}`)
        return res.data
    } catch (e) {}
}
export const getRelationVideos = async (key: string) => {
    try {
        const res = await request.get(`/video/relation/${key}`)
        return res.data
    } catch (e) {}
}
