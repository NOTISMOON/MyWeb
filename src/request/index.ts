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
        const res = await request.post(`/discussion/create/${import.meta.env.VITE_APP_USER_ID}`, body)
        return res.data
    } catch (e) {
        console.log(e)
    }
}
export const postview= async() =>{
    try{
            await request.post(`/view/${import.meta.env.VITE_APP_USER_ID}`)
    }catch(e){
    }    
     
}