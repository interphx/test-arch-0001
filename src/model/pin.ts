import { Vec2, AdvancedObservableMutableVec2 } from "model/vec2";
import { observable, computed } from "mobx";
import { identity } from "utils/functional";
import { generateRandomId } from "utils/id";

export interface Pin {
    readonly id: string;
    readonly position: Vec2;
}

export class MovablePin implements Pin {
    public readonly id: string = generateRandomId();
    @observable public position: AdvancedObservableMutableVec2;

    constructor(initialPosition: Vec2) {
        this.position = new AdvancedObservableMutableVec2(initialPosition.x, initialPosition.y);
    }
}

export class BoundPin implements Pin {
    public readonly id: string = generateRandomId();
    constructor(private obj: { position: Vec2 }, private transformer: (pos: Vec2) => Vec2 = identity) {

    }

    @computed
    get position() {
        return this.transformer(this.obj.position);
    }
}