import { Todo, todo_repeatOption_Interval, todo_resetOption_weekSpecificDay, UpdateEvent } from "@/types";
import { toRaw } from "vue";

let Interval: NodeJS.Timeout[] = [];
let isRefreshTriggerCalled = false;

function refreshNextTrigger(todos: Todo[]) {
    if (!todos.length) {
        return
    }
    isRefreshTriggerCalled = true;
    todos.forEach((todo) => {
        if (todo.repeatOption.type === 'Interval') {
            if (todo.repeatOption.trigger < Date.now()) {
                const passedTime = Date.now() - todo.repeatOption.initTime;
                todo.repeatOption.trigger = todo.repeatOption.initTime +
                                            Math.ceil(passedTime / todo.repeatOption.interval) * todo.repeatOption.interval;
            }
        }
    })
}

export function refreshLoop(todos: Todo[], 
                            updateTodoStatus: (UpdateEvent: UpdateEvent) => void) {
    if(!isRefreshTriggerCalled) {
        refreshNextTrigger(todos);
    }
    stopLoop();
    todos.forEach((todo: Todo) => {
        if (todo.resetOption.type === 'WeekSpecificDay') {
            let now = new Date()
            Interval.push(setInterval(() => {
                let resetOption = (<todo_resetOption_weekSpecificDay>todo.resetOption);
                // console.log(resetOption.days, now.getDay());
                if (resetOption.days.includes(now.getDay())) {
                    // console.log(now.toDateString(), new Date(resetOption.lastTrigger).toDateString());
                    if (now.toDateString() !== new Date(resetOption.lastTrigger).toDateString()) {
                        resetOption.lastTrigger = now.getTime();
                        updateTodoStatus({id: todo.id, resetOption: toRaw(todo.resetOption), status: 'default'})
                    }
                }
            }, 1000))
        }
        if (todo.repeatOption.type === 'Interval') {
            Interval.push(setInterval(() => {
                let repeat = todo.repeatOption as todo_repeatOption_Interval;
                if (Date.now() > repeat.trigger) {
                    const passedTime = Date.now() - repeat.initTime;
                    repeat.trigger = repeat.initTime +
                                    Math.ceil(passedTime / repeat.interval) * repeat.interval; //重置trigger
                    if (todo.status === 'processing' && todo.notificationMessage && todo.notificationMessage.repeat) {
                        new Notification(`Mew Todo - ${todo.title}`, {
                            body: todo.notificationMessage.repeat
                        })
                    }
                }
            }, 1000))
        }
    })
}

export function stopLoop() {
    Interval.forEach((interv) => {clearInterval(interv)})
}