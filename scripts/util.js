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