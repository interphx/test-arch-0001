import { Screen, ScreenName } from "model/screens";
import { observable } from "mobx";


class SimpleSingleScreenState implements SingleScreenState {
    public readonly type: 'screen' = 'screen';

    constructor(public readonly screen: Screen) {

    }

    getScreen() { return this.screen }
}


class SimpleTransitionState {
    public readonly type: 'transition' = 'transition';

    constructor(
        public readonly transitionName: string,
        public readonly fromScreen: Screen,
        public readonly toScreen: Screen,
        private onFinish: () => void
    ) {

    }

    getTransitionName() { return this.transitionName }

    getFromScreen() { return this.fromScreen }

    getToScreen() { return this.toScreen }

    finish() {
        this.onFinish();
        this.onFinish = () => {};
    }
}

export interface SingleScreenState {
    readonly type: 'screen';
    readonly getScreen: () => Screen;
}

export interface TransitionState {
    readonly type: 'transition';
    readonly getTransitionName: () => string;
    readonly getFromScreen: () => Screen;
    readonly getToScreen: () => Screen;
    readonly finish: () => void;
}

export type ScreenState = SingleScreenState | TransitionState;

function getDefaultTransitionName(fromName: ScreenName, toName: ScreenName) {
    const transitions = {
        'main-menu -> gameplay': 'upchange',
        'gameplay -> main-menu': 'upchange'
    };
    
    return transitions[`${fromName} -> ${toName}` as keyof typeof transitions] || 'fade';
}

export class ScreenFsm {
     @observable private screenState: SingleScreenState | TransitionState;

    constructor(
        screen: Screen
    ) {
        this.screenState = new SimpleSingleScreenState(screen);
    }

    private runTransition(transition: TransitionState) {
        this.screenState = transition;
    }

    private setScreen(screen: Screen) {
        this.screenState = new SimpleSingleScreenState(screen);
    }

    transitionTo(screen: Screen) {
        if (this.screenState.type === 'screen') {
            this.screenState = new SimpleTransitionState(
                getDefaultTransitionName(this.screenState.getScreen().type, screen.type),
                this.screenState.getScreen(),
                screen,
                () => { this.setScreen(screen) }
            );
        } else if (this.screenState.type === 'transition') {
            this.screenState = new SimpleTransitionState(
                getDefaultTransitionName(this.screenState.getFromScreen().type, screen.type),
                this.screenState.getFromScreen(),
                screen,
                () => { this.setScreen(screen) }
            );
        } else {

        }
    }

    getState() {
        return this.screenState;
    }
}