import * as React from 'react';
import { ScreenFsm } from 'model/screen-fsm';
import { Board } from 'model/board';
import { BoardView } from 'view/board';
import { Camera2d } from 'model/camera';
import { MainMenuScreen } from 'model/screens';

export interface GameplayViewProps {
    screenFsm: ScreenFsm;
    board: Board;
    camera: Camera2d;
    transitionState: string;
}

export interface GameplayViewState {
    
}

export class GameplayView extends React.Component<GameplayViewProps, GameplayViewState> {
    constructor(props: GameplayViewProps) {
        super(props);
        this.state = {
            
        }
    }

    render() {
        return (
            <div
                className={this.props.transitionState}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    transition: 'all 1s ease-out',
                    border: '1px solid #999',
                    transform: 'translate(0, 0)'
                }}
            >
                <BoardView board={this.props.board} camera={this.props.camera} />
                <button 
                    style={{position: 'absolute', top: '10px', right: '10px'}} 
                    onClick={() => this.props.screenFsm.transitionTo(new MainMenuScreen())}
                >
                    To menu
                </button>
            </div>
        )
    }
}