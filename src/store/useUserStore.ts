import { defineStore } from "pinia";

export const useUserStore = defineStore('user', {
    state() {
        return localStorage.getItem("userStore") ? JSON.parse(localStorage.getItem("userStore")!) : {
            account: '',
            token: '',
            basicInfo: {
                nickname: '',
                avatar: ''
            }
        }
    }
})