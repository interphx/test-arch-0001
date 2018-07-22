import { assets } from 'assets';
import { observable } from 'mobx';
import { BoardItem } from 'model/board-item';
import { Collider, PosSizeCollider } from 'model/collider';
import { SelectedState, SimpleSelectedState } from 'model/selection';
import { generateRandomId } from 'utils/id';

import { AdvancedMutableVec2, AdvancedObservableMutableVec2, ObservableVec2, Vec2 } from './vec2';
import { Socket, InputSocket, OutputSocket } from 'model/socket';

type GateBackground = 
        | { type: 'image', url: string }
        | { type: 'color', color: string };

export interface Gate extends BoardItem {
    readonly size      : Vec2;
    readonly background: GateBackground;
    readonly sockets   : ReadonlyArray<Socket>;
}

export abstract class BaseGate implements Gate {
                id                                = generateRandomId();
                sockets   : ReadonlyArray<Socket> = [];
    @observable position  : AdvancedMutableVec2   = new AdvancedObservableMutableVec2(0, 0);
    @observable size      : ObservableVec2        = new ObservableVec2(96, 48);
    @observable selection : SelectedState         = new SimpleSelectedState();
    @observable collider  : Collider              = new PosSizeCollider(this);

    get background(): GateBackground {
        return { type: 'color' as 'color', color: 'black' };
    }
}

export class NotGate extends BaseGate {
    @observable size    = new ObservableVec2(108, 116);
                sockets = [
                    new InputSocket({ x: 108 / 2 - 4, y: 0 - 8 }),
                    new OutputSocket({ x: 108 / 2 - 4, y: 116 }),
                ];

    private backgroundDefault = { type: 'image' as 'image', url: assets.images.gateNotBase };
    private backgroundSelected = { type: 'image' as 'image', url: assets.images.gateNotSelected }; 

    // @computed
    get background(): GateBackground {
        if (this.selection.selected) {
            return this.backgroundSelected;
        }
        return this.backgroundDefault;
    }
}

export class AndItem extends BaseGate {
    background = { type: 'color' as 'color', color: 'green' }; 
}

export class OrItem extends BaseGate {
    background = { type: 'color' as 'color', color: 'blue' };
}