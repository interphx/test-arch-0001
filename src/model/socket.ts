import { Vec2, ObservableVec2 } from "model/vec2";
import { observable } from "../../node_modules/mobx";
import { generateRandomId } from "utils/id";

export type SocketType = 'input' | 'output';

export interface Socket {
    readonly localPos: Vec2;
    readonly type    : SocketType;
    readonly power   : number;
    readonly size    : Vec2;
    
    setPower(power: number): void;
}

export interface InputSocket extends Socket {
    readonly type: 'input';
}

export interface OutputSocket extends Socket {
    readonly type: 'output'
}

abstract class BaseSocket {
                public          id      : string          = generateRandomId();
    @observable public          localPos: ObservableVec2;
    @observable public          size    : ObservableVec2  = new ObservableVec2(8, 8);
    @observable public          power   : number          = 0;

    constructor(getLocalPos: (size: Vec2) => Vec2) {
        const localPos = getLocalPos(this.size);
        this.localPos = new ObservableVec2(localPos.x, localPos.y);
    }

    setPower(power: number): void {
        this.power = power;
    }
}

export class SimpleInputSocket extends BaseSocket {
    public readonly type: SocketType = 'input';
}

export class SimpleOutputSocket extends BaseSocket {
    public readonly type: SocketType = 'output';
}