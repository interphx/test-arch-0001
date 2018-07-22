import { observable, action } from 'mobx';
import { Gate, NotGate } from './gate';
import { RectangleSelection, SimpleSelection, SelectionMode } from './selection';
import { Vec2 } from './vec2';
import { testAabbIntersection } from 'utils/geometry';
import { BoardItem } from './board-item';

export interface Board {
    readonly backgroundColor: string;
    readonly items: ReadonlyArray<BoardItem>;
    readonly selection: RectangleSelection | null;

    addItem(item: BoardItem): void;
    removeItem(itemId: string): void;

    startSelection(startPos: Vec2): void;
    setSelectionDraggedPoint(x: number, y: number): void;
    stopSelection(): void;
    moveSelectedItemsBy(dx: number, dy: number): void;
    setSelectionMode(mode: SelectionMode): void;
}

export class SimpleBoard implements Board {
    @observable backgroundColor: string = 'white';
    @observable items: BoardItem[] = observable.array([]);
    @observable selection: RectangleSelection | null = null;

    constructor() {
        for (let i = 0; i < 1000; ++i) {
            let item = new NotGate(); 
            item.position.moveBy(Math.random() * 8000 - 4000, Math.random() * 6000 - 3000);
            this.addItem(item);
        }

        // TODO: Should we by default bind all methods?
        this.moveSelectedItemsBy = this.moveSelectedItemsBy.bind(this);
    }

    @action
    public addItem(item: BoardItem) {
        this.items.push(item);
    }

    @action
    public removeItem(itemId: string) {
        let index = this.items.findIndex(item => item.id === itemId);
        if (index >= 0) {
            this.items.splice(index, 1);
        }
    }

    @action
    startSelection(startPos: Vec2) {
        if (this.selection) {
            this.stopSelection();
        }
        this.selection = new SimpleSelection(startPos);
    }

    @action
    setSelectionDraggedPoint(x: number, y: number) {
        if (this.selection) {
            this.selection.setDraggedPoint(x, y);
            const mode = this.selection.mode;

            switch (mode) {
                case 'replace': {
                    for (const item of this.items) {
                        if (!item.collider || !item.selection) { continue; }
                        if (testAabbIntersection(item.collider.aabb, this.selection.aabb)) {
                            item.selection.setSelected(true);
                        } else {
                            item.selection.setSelected(false);
                        }
                    }
                    break;
                }
                case 'subtract': {
                    for (const item of this.items) {
                        if (!item.collider || !item.selection) { continue; }
                        if (testAabbIntersection(item.collider.aabb, this.selection.aabb)) {
                            item.selection.setSelected(false);
                        }
                    }
                    break;
                }
                case 'add': {
                    for (const item of this.items) {
                        if (!item.collider || !item.selection) { continue; }
                        if (testAabbIntersection(item.collider.aabb, this.selection.aabb)) {
                            item.selection.setSelected(true);
                        }
                    }
                    break;
                }
            }
        }
    }

    @action
    stopSelection() {
        if (this.selection) {
            this.selection = null;
        }
    }

    @action
    moveSelectedItemsBy(dx: number, dy: number) {
        for (let item of this.items) {
            if (!item.selection) { continue; }
            if (item.selection.selected) {
                item.position.moveBy(dx, dy);
            }
        }
    }

    @action
    setSelectionMode(mode: SelectionMode) {
        if (this.selection) {
            this.selection.setMode(mode);
        }
    }

    @action
    deselectAll() {
        for (const item of this.items) {
            if (item.selection && item.selection.selected) {
                item.selection.setSelected(false);
            }
        }
    }
}