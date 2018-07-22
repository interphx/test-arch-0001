import { ObservableVec2, Vec2 } from './vec2';
import { action, computed, observable } from 'mobx';
import { Aabb } from 'utils/geometry';

export type SelectionMode = 'replace' | 'add' | 'subtract';

export interface SelectedState {
    readonly selected: boolean;
    setSelected(selected: boolean): void;
}

export class SimpleSelectedState {
    @observable public selected: boolean;

    constructor() {
        this.selected = false;
    }

    setSelected(selected: boolean) {
        this.selected = selected;
    }
}

export interface RectangleSelection {
    readonly startPoint: Vec2;
    readonly draggedPoint: Vec2;
    readonly aabb: Aabb;
    readonly mode: SelectionMode;

    setDraggedPoint(x: number, y: number): void;
    setMode(mode: SelectionMode): void;
}

export class SimpleSelection implements RectangleSelection {
    startPoint: Vec2;
    draggedPoint: ObservableVec2;
    mode: SelectionMode;

    constructor(startPoint: Vec2) {
        this.startPoint = startPoint;
        this.draggedPoint = new ObservableVec2(startPoint.x + 1, startPoint.y + 1);
        this.mode = 'replace';
    }

    @action
    setDraggedPoint(x: number, y: number) {
        this.draggedPoint.x = x;
        this.draggedPoint.y = y;
    }

    @action
    setMode(mode: SelectionMode) {
        this.mode = mode;
    }

    @computed
    get aabb() {
        const top  = Math.min(this.startPoint.y, this.draggedPoint.y),
              right = Math.max(this.startPoint.x, this.draggedPoint.x),
              bottom = Math.max(this.startPoint.y, this.draggedPoint.y),
              left = Math.min(this.startPoint.x, this.draggedPoint.x);
        return { top, right, bottom, left };
    }
}