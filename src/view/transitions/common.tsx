import { TransitionState } from "model/screen-fsm"; 

export interface TransitionViewProps {
    fromScreen: React.ReactNode;
    toScreen: React.ReactNode;
    transitionState: TransitionState
}