import { defineStore } from "pinia";

export const useUserStore = defineStore('user', {
    state() {
        return {
            account: '',
            token: '',
            basicInfo: {
                nickname: '',
                avatar: ''
            }
        }
    }
})