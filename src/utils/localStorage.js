const token="Authorization"
//封装localStorage
let localStorage={
    //设置本地数据
    set(key,value){
        window.localStorage.setItem(key,JSON.stringify(value))
    },
    //获取本地数据
    get(key){
        return JSON.parse(window.localStorage.getItem(key))
    },
    //删除
    remove(key){
        window.localStorage.removeItem(key)
    }
}
export default localStorage