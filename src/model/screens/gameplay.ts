import { Board, SimpleBoard } from "model/board";
import { Camera2d, SimpleCamera2d } from "model/camera";

export class GameplayScreen {
    public readonly type: 'gameplay' = 'gameplay';

    board: Board = new SimpleBoard();
    camera: Camera2d = new SimpleCamera2d({ x: 1500, y: 700 });
}