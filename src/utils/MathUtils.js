
export function clamp(x, min, max){
    if(x < min) return min;
    if(x > max) return max;
    return x;
}

export function clamp01(x){
    return clamp(x, 0, 1);
}

export function randIntFrom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

export function randomFrom(wordsArr) {
    let choice = randIntFrom(0, wordsArr.length);
    return wordsArr[choice];
}