import { Vec2 } from "model/vec2";
import { Pin } from "model/pin";
import { Socket, InputSocket, OutputSocket } from "model/socket";
import { observable, action, computed } from "mobx";

export interface Wire {
    readonly points: ReadonlyArray<Vec2>;
    readonly power: number;

    addPin(pin: Pin): void;
    removePin(pinId: string): void;
}

export class SimpleWire implements Wire {
    private findPath: (a: Vec2, b: Vec2) => ReadonlyArray<Vec2>;
    @observable private pins: Pin[] = observable.array([]);

    public startPin: Pin | null;
    public endPin: Pin | null;
    public power: number;

    constructor(
        findPath: (a: Vec2, b: Vec2) => ReadonlyArray<Vec2>,
        initialEndpoints: [Pin, null] | [null, Pin] | [Pin, Pin]
    ) {
        this.findPath = findPath;
        this.startPin = initialEndpoints[0];
        this.endPin = initialEndpoints[1];
        this.power = 0;
    }

    @computed
    get points() {
        const result = this.startPin ? [ this.startPin.position ] : [];
        for (const pin of this.pins) {
            result.push(pin.position);
        }
        if (this.endPin) {
            result.push(this.endPin.position);
        }
        return result;
    }

    @action
    addPin(pin: Pin) {
        if (this.pins.find(other => other.id === pin.id)) {
            throw new Error(`Same pin cannot be added twice!`);
        }
        this.pins.push(pin);
    }

    @action
    removePin(pinId: string) {
        const index = this.pins.findIndex(other => other.id === pinId);
        if (index >= 0) {
            this.pins.splice(index, 1);
        }
    }
}