import { observable } from "mobx";
import { Vec2, ObservableVec2 } from "./vec2";

export interface WireSocket {
    readonly localPos: Vec2;
}

export class SimpleWireSocket implements WireSocket {
    @observable localPos: ObservableVec2;

    constructor(localPos: Vec2) {
        this.localPos = new ObservableVec2(localPos.x, localPos.y);
    }

    
}