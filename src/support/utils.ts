export function formatTimestamp(timestamp: number) {
    let date = new Date(timestamp); // 转换为毫秒
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2); // 月份从0开始，需要加1
    let day = ('0' + date.getDate()).slice(-2);
    let hours = ('0' + date.getHours()).slice(-2);
    let minutes = ('0' + date.getMinutes()).slice(-2);
    let seconds = ('0' + date.getSeconds()).slice(-2);

    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
}