import * as React          from 'react';
import { GameStore }       from 'model/game-store';
import { ScreensView, ScreenView } from 'view/screens';
import { observer }        from 'mobx-react';
import { TransitionGroup, Transition } from 'react-transition-group';
import { MainMenuView } from 'view/main-menu';
import { GameplayView } from 'view/gameplay';

export interface GameViewProps {
    store: GameStore;
}

export interface GameViewState {
    
}

@observer
export class GameView extends React.Component<GameViewProps, GameViewState> {
    constructor(props: GameViewProps) {
        super(props);
        this.state = {
            
        }
    }

    render() {
        const { store } = this.props,
              { screenFsm } = store,
              screenState = screenFsm.getState();
            
        return (
            <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
                <ScreensView screenState={screenState}>
                    <ScreenView name="main-menu">
                        {screenProps =>
                            <MainMenuView 
                                transitionState={screenProps.transition && screenProps.transition.state || ''} 
                                screenFsm={screenFsm}
                            />
                        }
                    </ScreenView>
                    <ScreenView name="gameplay">
                        {screenProps => 
                            <GameplayView
                                transitionState={screenProps.transition && screenProps.transition.state || ''}
                                screenFsm={screenFsm}
                                board={screenProps.screen.board}
                                camera={screenProps.screen.camera}
                            />
                        }
                    </ScreenView>
                </ScreensView>
            </div>
        );
    }
}