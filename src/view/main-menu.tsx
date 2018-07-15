import * as React from 'react';
import { ScreenFsm } from 'model/screen-fsm';
import { GameplayScreen } from 'model/screens';

export interface MainMenuViewProps {
    screenFsm: ScreenFsm;
    transitionState: string;
}

export interface MainMenuViewState {
    
}

export class MainMenuView extends React.Component<MainMenuViewProps, MainMenuViewState> {
    constructor(props: MainMenuViewProps) {
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
                Main menu ({ this.props.transitionState })
                <button onClick={() => this.props.screenFsm.transitionTo(new GameplayScreen())}>Start game</button>
            </div>
        )
    }
}