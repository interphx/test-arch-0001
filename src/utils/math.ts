export function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
}

export function mod(a: number, b: number): number {
    return ((a % b) + b) % b;
}

export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

export function roundTo(value: number, step: number): number {
    return Math.round(value / step) * step;
}

export function floorTo(value: number, step: number): number {
    return Math.floor(value / step) * step;
}

export function ceilTo(value: number, step: number): number {
    return Math.ceil(value / step) * step;
}