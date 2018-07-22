import { Aabb } from "utils/geometry";
import { Vec2 } from "./vec2";
import { observable, computed } from "mobx";

export interface Collider {
    readonly aabb: Aabb;
}

export class PosSizeCollider implements Collider {
    @observable private obj: { position: Vec2, size: Vec2 };
    
    constructor(obj: { position: Vec2, size: Vec2 }) {
        this.obj = obj;
    }

    @computed
    get aabb() {
        const { position:pos, size } = this.obj;

        return {
            top: pos.y,
            right: pos.x + size.x,
            bottom: pos.y + size.y,
            left: pos.x
        };
    }
}