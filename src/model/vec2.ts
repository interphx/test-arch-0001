import { observable, action } from 'mobx';

export interface Vec2 {
    readonly x: number;
    readonly y: number;
}

export interface MutableVec2 extends Vec2 {
    x: number;
    y: number;
}

export class ObservableVec2 implements MutableVec2 {
    @observable x: number = 0;
    @observable y: number = 0;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export interface AdvancedMutableVec2 extends MutableVec2 {
    moveBy(x: number, y: number): void;
    moveBy(offset: Vec2): void;

    moveTo(x: number, y: number): void;
    moveTo(offset: Vec2): void;
}

export class AdvancedObservableMutableVec2 implements AdvancedMutableVec2 {
    @observable x: number = 0;
    @observable y: number = 0;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    moveBy(x: number, y: number): void;
    moveBy(offset: Vec2): void;
    @action moveBy(xOrOffset: number | Vec2, y?: number): void {
        if (typeof xOrOffset === 'number') {
            if (y != null) {
                this.x += xOrOffset;
                this.y += y;
            } else {
                throw new Error(`y must not be null`);
            }
        } else {
            this.x += xOrOffset.x;
            this.y += xOrOffset.y;
        }
    }

    
    moveTo(x: number, y: number): void;
    moveTo(pos: Vec2): void;
    @action moveTo(xOrPos: number | Vec2, y?: number): void {
        if (typeof xOrPos === 'number') {
            if (y != null) {
                this.x = xOrPos;
                this.y = y;
            } else {
                throw new Error(`y must not be null`);
            }
        } else {
            this.x = xOrPos.x;
            this.y = xOrPos.y;
        }
    }
}