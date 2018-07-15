import { observable } from 'mobx';

export interface Vec2 {
    readonly x: number;
    readonly y: number;
}

export interface MutableVec2 extends Vec2 {
    x: number;
    y: number;
}

export class ObservableVec2 implements Vec2 {
    @observable x: number = 0;
    @observable y: number = 0;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}