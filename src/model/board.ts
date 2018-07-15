import { observable, action } from 'mobx';
import { Item, NotItem } from 'model/item';
import { RectangleSelection, SimpleSelection, SelectionMode } from 'model/selection';
import { Vec2 } from 'model/vec2';
import { testAabbIntersection } from 'utils/geometry';

export interface Board {
    readonly backgroundColor: string;
    readonly items: ReadonlyArray<Item>;
    readonly selection: RectangleSelection | null;

    addItem(item: Item): void;
    removeItem(itemId: string): void;

    startSelection(startPos: Vec2): void;
    setSelectionDraggedPoint(x: number, y: number): void;
    stopSelection(): void;
    moveSelectedItemsBy(dx: number, dy: number): void;
    setSelectionMode(mode: SelectionMode): void;
}

export class SimpleBoard implements Board {
    @observable backgroundColor: string = 'white';
    @observable items: Item[] = observable.array([]);
    @observable selection: RectangleSelection | null = null;

    constructor() {
        for (let i = 0; i < 1000; ++i) {
            let item = new NotItem(); 
            item.moveBy(Math.random() * 8000 - 4000, Math.random() * 6000 - 3000);
            this.addItem(item);
        }

        // TODO: Should we by default bind all methods?
        this.moveSelectedItemsBy = this.moveSelectedItemsBy.bind(this);
    }

    @action
    public addItem(item: Item) {
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
                        if (testAabbIntersection(item.aabb, this.selection.aabb)) {
                            item.setSelected(true);
                        } else {
                            item.setSelected(false);
                        }
                    }
                    break;
                }
                case 'subtract': {
                    for (const item of this.items) {
                        if (testAabbIntersection(item.aabb, this.selection.aabb)) {
                            item.setSelected(false);
                        }
                    }
                    break;
                }
                case 'add': {
                    for (const item of this.items) {
                        if (testAabbIntersection(item.aabb, this.selection.aabb)) {
                            item.setSelected(true);
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
            if (item.selected) {
                item.moveBy(dx, dy);
            }
        }
    }

    @action
    setSelectionMode(mode: SelectionMode) {
        if (this.selection) {
            this.selection.setMode(mode);
        }
    }
}