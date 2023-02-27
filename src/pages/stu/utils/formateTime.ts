export default function (t: number = 0) {
    const sec = appendZero(t % 60);
    const min = appendZero(Math.floor((t / 60) % 60));
    const hour = appendZero(Math.floor(t / 3600));
    return `${hour}:${min}:${sec}`;
}

const appendZero = (n: any) => n.toLocaleString({}, { minimumIntegerDigits: 2 });

export const LearnTimeMonth = (value:string): string => {
    const time1 = value.split(" ")[0];
    return time1.split("-")[1];
}
export const LearnTimeDay = (value:string): string => {
    const time1 = value.split(" ")[0];
    return time1.split("-")[2];
}