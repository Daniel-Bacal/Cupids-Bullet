
export function clamp(x, min, max){
    if(x < min) return min;
    if(x > max) return max;
    return x;
}

export function clamp01(x){
    return clamp(x, 0, 1);
}