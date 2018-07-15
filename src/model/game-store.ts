import { observable } from 'mobx';
import { ScreenFsm } from 'model/screen-fsm';
import { Board, SimpleBoard } from 'model/board';
import { Camera2d, SimpleCamera2d } from 'model/camera';
import { NotItem } from 'model/item';

export class GameStore {
    constructor(
        public screenFsm: ScreenFsm = new ScreenFsm({ type: 'main-menu' })
    ) {

    }
}