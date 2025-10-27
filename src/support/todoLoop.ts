import { Todo, todo_notificationOption_Interval, todo_resetOption_weekSpecificDay, UpdateEvent } from "@/types";
import { toRaw } from "vue";

let Interval: NodeJS.Timeout[] = [];
let isRefreshTriggerCalled = false;

function refreshNextTrigger(todos: Todo[]) {
    if (!todos.length) {
        return
    }
    isRefreshTriggerCalled = true;
    todos.forEach((todo) => {
        if (todo.notificationOption.type === 'Interval') {
            if (todo.notificationOption.trigger < Date.now()) {
                const passedTime = Date.now() - todo.notificationOption.initTime;
                todo.notificationOption.trigger = todo.notificationOption.initTime +
                                            Math.ceil(passedTime / todo.notificationOption.interval) * todo.notificationOption.interval;
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
        if (todo.notificationOption.type === 'Interval') {
            Interval.push(setInterval(() => {
                let notification = todo.notificationOption as todo_notificationOption_Interval;
                if (Date.now() > notification.trigger) {
                    const passedTime = Date.now() - notification.initTime;
                    notification.trigger = notification.initTime +
                                    Math.ceil(passedTime / notification.interval) * notification.interval; //重置trigger
                    if (todo.status === 'processing' && 'text' in todo.notificationOption && todo.notificationOption.text) {
                        new Notification(`Mew Todo - ${todo.title}`, {
                            body: notification.text
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