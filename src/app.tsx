import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { BoardView } from 'view/board';
import { ScreensView, ScreenView } from 'view/screens';
import { ScreenFsm } from 'model/screen-fsm';
import { GameStore } from 'model/game-store';
import { GameView } from 'view/game';
import { loadAssets } from 'assets';

async function main() {
    window.addEventListener('contextmenu', event => { event.preventDefault(); event.stopPropagation(); });

    await loadAssets();

    let store = new GameStore(),
        element = document.getElementById('react-container');
    ReactDOM.render(
        <GameView store={store} />
        ,
        element
    )
}

main();