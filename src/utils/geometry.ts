export interface Aabb {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export function testAabbIntersection(a: Aabb, b: Aabb) {
    return (
        a.left <= b.right &&
        a.top <= b.bottom &&
        a.right >= b.left &&
        a.bottom >= b.top
    );
}