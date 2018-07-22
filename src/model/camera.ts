import { observable, computed } from 'mobx';

import { Vec2, ObservableVec2 } from "./vec2";
import { Collider, PosSizeCollider } from 'model/collider';
import { Aabb } from 'utils/geometry';

const MIN_ZOOM = 0.001,
      MAX_ZOOM = 10;

export interface Camera2d {
    readonly pos: Vec2;
    readonly distance: number;
    readonly viewportSize: Vec2;
    readonly aabb: Aabb;

    moveBy(offset: Vec2): void;
    moveBy(x: number, y: number): void;
    contains(x: number, y: number, width: number, height: number): boolean;
}

export class SimpleCamera2d implements Camera2d {
    @observable pos: ObservableVec2 = new ObservableVec2(0, 0);
    @observable distance: number = 1;
    @observable viewportSize: ObservableVec2;

    constructor(viewportSize: Vec2) {
        this.viewportSize = new ObservableVec2(viewportSize.x, viewportSize.y);
    }

    @computed
    get aabb() {
        return {
            left:  this.pos.x / this.distance,
            top:   this.pos.y / this.distance,
            right: (this.pos.x + this.viewportSize.x)  / this.distance,
            bottom: (this.pos.y + this.viewportSize.y) / this.distance
        };
    }

    public contains(x: number, y: number, width: number, height: number) {
        let aabb = this.aabb;
        return (
            x <= aabb.right &&
            y <= aabb.bottom &&
            (x + width) >= aabb.left &&
            (y + height) >= aabb.top
        );
    }

    public moveBy(offset: Vec2): void
    public moveBy(x: number, y: number): void
    public moveBy(xOrOffset: number | Vec2, y?: number) {
        if (typeof xOrOffset === 'number' && typeof y === 'number') {
            this.pos.x += xOrOffset;
            this.pos.y += y;
        } else if (typeof xOrOffset === 'object') {
            this.pos.x += xOrOffset.x;
            this.pos.y += xOrOffset.y;
        } else {
            throw new Error(`Expecting two numbers or Vec2`);
        }
    }

    public zoomBy(amount: number) {
        this.distance = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, this.distance + amount));
    }
}