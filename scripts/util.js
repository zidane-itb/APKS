export function generateUser() {
    const i = Math.floor(Math.random() * 501);
    const suffix = String(i);
    const password = suffix.repeat(10);

    let suffixBytesAsHex = '';
    for (let charIdx = 0; charIdx < suffix.length; charIdx++) {
        suffixBytesAsHex += suffix.charCodeAt(charIdx).toString(16);
    }
    const username = `Cornell_${suffixBytesAsHex}`;
    return {
        username: username,
        password: password
    };
}

export function getRandRange(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function getInAndOutDate() {
    const today = new Date();
    const maxEndDate = new Date();
    maxEndDate.setDate(today.getDate() + 500);

    const todayTimestamp = today.getTime();
    const maxEndTimestamp = maxEndDate.getTime();

    let timestamp1 = todayTimestamp + Math.random() * (maxEndTimestamp - todayTimestamp);
    let timestamp2 = todayTimestamp + Math.random() * (maxEndTimestamp - todayTimestamp);

    let inTimestamp = Math.min(timestamp1, timestamp2);
    let outTimestamp = Math.max(timestamp1, timestamp2);

    const inDate = formatDate(new Date(inTimestamp));
    const outDate = formatDate(new Date(outTimestamp));

    return { inDate, outDate };
}