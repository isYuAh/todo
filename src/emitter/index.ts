import { Todo, UpdateEvent, todoFilter } from "@/types";
import mitt from "mitt";

type EventHandlerMap = {
    'completeTodoOnce' : Todo
    'refreshTodos': any
    'updateQueryClause': todoFilter
    'showTodoDetail': Todo
    'deleteTodo': string
    'updateTodoStatus': UpdateEvent
    'updateTodo': UpdateEvent
}

export const emitter = mitt<EventHandlerMap>();