import { observable } from 'mobx';
import { ScreenFsm } from './screen-fsm';
import { Board, SimpleBoard } from './board';
import { Camera2d, SimpleCamera2d } from './camera';
import { NotGate } from './gate';

export class GameStore {
    constructor(
        public screenFsm: ScreenFsm = new ScreenFsm({ type: 'main-menu' })
    ) {

    }
}