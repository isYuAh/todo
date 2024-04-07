import {InjectionKey} from 'vue'

export type Todo =  Todo_Default

export type Todo_Default = {
    id: string
    title: string
    brief: string
    content: string
    status: string
    type: string
    tags: string[]
    repeatOption: todo_repeatOption
    resetOption: todo_resetOption
    origin: todo_origin
    notificationMessage?: {
        reset?: string,
        repeat?: string
    }
}

export interface UpdateEvent {
    id: string
    title?: string
    brief?: string
    content?: string
    status?: string
    type?: string
    tags?: string[]
    repeatOption?: todo_repeatOption
    resetOption?: todo_resetOption
    notificationMessage?: {
        reset?: string,
        repeat?: string
    }
}
export interface TodoChanges {
    title?: string
    brief?: string
    content?: string
    status?: string
    type?: string
    tags?: string[]
    repeatOption?: todo_repeatOption
    resetOption?: todo_resetOption
    notificationMessage?: {
        reset?: string,
        repeat?: string
    }
}


export type todo_repeatOption = todo_repeatOption_Interval |
                                todo_repeatOption_someTimes

export type todo_resetOption = todo_resetOption_weekSpecificDay |
                                todo_resetOption_None

export type todo_repeatOption_Interval = {
    type: 'Interval'
    initTime: number
    interval: number //毫秒
    trigger: number //上次触发的时候
}
export type todo_repeatOption_someTimes = {
    type: 'Times'
    totalTimes: number
    restTimes: number
}

export type todo_resetOption_weekSpecificDay = {
    type: 'WeekSpecificDay'
    days: number[]
    lastTrigger: number
}
export type todo_resetOption_None = {
    type: 'None'
}

export type todo_origin = todo_origin_self | todo_origin_remote
export type todo_origin_self = {
    origin: 'self'
}
export type todo_origin_remote = {
    origin: 'remote',
    source: string
}

export interface todoFilter {
    enable: boolean
    title: string
    tags: string[]
    tagMode: boolean //false: 与 true: 或
    sortByStatus: boolean
}

export type user_basicInfo = {
    nickname: string
    avatar: string
}

export type loginVaildParams = {
    account: string
}

export type loginParams = {
    account: string,
    pwd: string
}

export type registerParams = {
    account: string,
    pwd: string,
    basicInfo: user_basicInfo
}

export type loginResponse = standardResponse<{
    account: string,
    token: string,
    basicInfo: user_basicInfo
}>
export type registerResponse = simpleResponse
export type userBasicInfosResponse = standardResponse<user_basicInfo[]>
export type updateTodoResponse = simpleResponse
export type addTodoResponse = standardResponse<string>
export type getTodoResponse = standardResponse<Todo>
export type deleteTodoResponse = simpleResponse
export type getAllTodoResponse = standardResponse<Todo[]>


export type getTodoPageResponse = standardResponse<{
    todos: Todo[],
    total: number
}>

export type standardResponse<T> = {
    code: number,
    status: string,
    data?: T //防止error没有data，所以设置为可选
}
export type simpleResponse = {
    code: number,
    status: string,
}

export const getTodoInjectionKey:InjectionKey<(id: string) => Promise<standardResponse<Todo | undefined>>> = Symbol()
export const deleteTodoInjectionKey:InjectionKey<(id: string) => Promise<simpleResponse>> = Symbol()
export const getTodoPageInjectionKey:InjectionKey<() => Promise<getTodoPageResponse>> = Symbol()
export const getAllTodoInjectionKey:InjectionKey<() => Promise<standardResponse<Todo[] | undefined>>> = Symbol()
export const addTodoInjectionKey:InjectionKey<(todo: Todo) => Promise<standardResponse<string>>> = Symbol()
export const completeTodoOnceInjectionKey:InjectionKey<(todo: Todo) => Promise<standardResponse<number>>> = Symbol()
export const updateTodoInjectionKey:InjectionKey<(UpdateEvent: UpdateEvent) => Promise<standardResponse<number>>> = Symbol()
export const updateTodoStatusInjectionKey:InjectionKey<(UpdateEvent: UpdateEvent) => Promise<standardResponse<number>>> = Symbol()
export const userLogoutInjectionKey:InjectionKey<() => Promise<simpleResponse>> = Symbol()
export const refreshTodosInjectionKey:InjectionKey<() => Promise<void>> = Symbol()
export const filterTodosInjectionKey:InjectionKey<(todos: Todo[], query: todoFilter) => Todo[]> = Symbol();