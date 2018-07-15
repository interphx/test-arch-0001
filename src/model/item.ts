import { observable, computed } from 'mobx';

import { Vec2, ObservableVec2 } from "model/vec2";
import { Aabb } from 'utils/geometry';
import { assets } from 'assets';

type ItemBackground = 
        | { type: 'image', url: string }
        | { type: 'color', color: string };

export interface Item {
    readonly id: string;
    readonly pos: Vec2;
    readonly size: Vec2;
    readonly background: ItemBackground;
    readonly selected: boolean;
    readonly aabb    : Aabb;

    moveBy(offset: Vec2): void;
    moveBy(x: number, y: number): void;

    setSelected(selected: boolean): void;
}

export abstract class BaseItem implements Item {
                id                         = Math.random().toString(32).slice(2).toUpperCase();
    @observable pos       : ObservableVec2 = new ObservableVec2(0, 0);
    @observable size      : ObservableVec2 = new ObservableVec2(96, 48);
    @observable selected                   = false;

    get background(): ItemBackground {
        return { type: 'color' as 'color', color: 'black' };
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

    public setSelected(selected: boolean) {
        this.selected = selected;
    }

    @computed
    get aabb() {
        return {
            left: this.pos.x,
            top: this.pos.y,
            right: this.pos.x + this.size.x,
            bottom: this.pos.y + this.size.y
        };
    }
}

export class NotItem extends BaseItem {
    @observable size = new ObservableVec2(108, 116);

    private backgroundDefault = { type: 'image' as 'image', url: assets.images.gateNotBase };
    private backgroundSelected = { type: 'image' as 'image', url: assets.images.gateNotSelected };    

    // @computed
    get background(): ItemBackground {
        if (this.selected) {
            return this.backgroundSelected;
        }
        return this.backgroundDefault;
    }
}

export class AndItem extends BaseItem {
    background = { type: 'color' as 'color', color: 'green' };
}

export class OrItem extends BaseItem {
    background = { type: 'color' as 'color', color: 'blue' };
}