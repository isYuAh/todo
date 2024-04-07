import { Todo, todoFilter } from "@/types";
import { defineStore } from "pinia";

export const useTodoStore = defineStore('todo', {
    state() {
        return {
            todos: <Todo[]>[],
            config: {
                page: 1,
                total: 1,
                pageNum: 15,
            },
            query: <todoFilter>{
                enable: false,
            },
        }
    }
})