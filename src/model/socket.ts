import { Vec2, ObservableVec2 } from "model/vec2";
import { observable } from "../../node_modules/mobx";
import { generateRandomId } from "utils/id";

export type SocketType = 'input' | 'output';

export interface Socket {
    readonly localPos: Vec2;
    readonly type: SocketType;
    readonly power: number;
    
    setPower(power: number): void;
}

abstract class BaseSocket {
                public          id      : string          = generateRandomId();
    @observable public          localPos: ObservableVec2;
    @observable public          power   : number          = 0;

    constructor(localPos: Vec2) {
        this.localPos = new ObservableVec2(localPos.x, localPos.y);
    }

    setPower(power: number): void {
        this.power = power;
    }
}

export class InputSocket extends BaseSocket {
    public readonly type: SocketType = 'input';
}

export class OutputSocket extends BaseSocket {
    public readonly type: SocketType = 'output';
}