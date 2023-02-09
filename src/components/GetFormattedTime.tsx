export default function getFormattedTime(time: number) {
    const hours = Math.floor(time / 3600);
    const mintues = Math.floor((time - (hours * 3600)) / 60);
    const seconds = time - (hours * 3600) - (mintues * 60);
    return { hours, mintues, seconds }
}
export function getTotalTime(time: any) {
    let total = (time.hours * 3600) + (time.minutes * 60) + time.seconds;
    return total;
}