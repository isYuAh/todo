import { defineStore } from "pinia";

export const useSettingsStore = defineStore('settings', {
    state() {
        return {
            mode: 'offline',
            server: {
                url: localStorage.getItem('server') || '',
            }
        }
    }
})