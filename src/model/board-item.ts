import { AdvancedMutableVec2 } from "./vec2";
import { SelectedState } from "./selection";
import { Collider } from "./collider";

export interface BoardItem {
    id: string;
    position: AdvancedMutableVec2;
    selection?: SelectedState;
    collider?: Collider;
}