import * as React from 'react';
import { Screen, ScreenName } from 'model/screens';
import { observer } from 'mobx-react';
import { ScreenState, TransitionState } from 'model/screen-fsm';
import { FadeTransitionView } from 'view/transitions/fade';
import { SlideLeftTransitionView } from 'view/transitions/slide-left';
import { UpchangeTransitionView } from 'view/transitions/upchange';

function getTransitionComponent(transitionName: string) {
    const components = {
        'fade': FadeTransitionView,
        'slide-left': SlideLeftTransitionView,
        'upchange': UpchangeTransitionView
    };

    return components[transitionName as keyof typeof components] || FadeTransitionView;
}

export interface ScreensViewProps {
    screenState: ScreenState;
}

export interface ScreensViewState {
    
}

function isScreenNamed(screenElement: React.ReactNode, screenName: ScreenName) {
    return Boolean(
           (typeof screenElement === 'object') &&
           (screenElement)                     &&
           ('props' in screenElement)          &&
           screenElement.props.name === screenName
    );
}

export class ScreensView extends React.Component<ScreensViewProps, ScreensViewState> {
    constructor(props: ScreensViewProps) {
        super(props);
        this.state = {
            
        }
    }

    render() {
        const { screenState } = this.props;

        if (screenState.type === 'screen') {
            return React.Children.map(this.props.children, child => 
                child                                               && 
                (typeof child === 'object')                         && 
                ('props' in child)                                  &&
                child.props                                         &&
                child.props.name === screenState.getScreen().type   &&
                React.cloneElement(child, { screen: screenState.getScreen() })
            );
        } else if (screenState.type === 'transition') {
            let Transition = getTransitionComponent(screenState.getTransitionName()),
                childrenArray = React.Children.toArray(this.props.children),
                fromScreen = childrenArray.find(screen => isScreenNamed(screen, screenState.getFromScreen().type)),
                toScreen = childrenArray.find(screen => isScreenNamed(screen, screenState.getToScreen().type));

            if (React.isValidElement<ScreenViewProps<string>>(fromScreen)) {
                fromScreen = React.cloneElement(fromScreen, {
                    screen: screenState.getFromScreen(),
                    transition: {
                        state: 'exiting'
                    }
                });
            }

            if (React.isValidElement<ScreenViewProps<string>>(toScreen)) {
                toScreen = React.cloneElement(toScreen, {
                    screen: screenState.getToScreen(),
                    transition: {
                        state: 'entering'
                    }
                });
            }

            return <Transition fromScreen={fromScreen} toScreen={toScreen} transitionState={screenState} />;
        } else {
            return `Unknown screen state type: ${(screenState as any).type}`;
        }
    }
}




interface InjectedScreenViewProps<T extends Screen> {
    screen: T;
    transition?: {
        state: 'entering' | 'exiting';
    } | null | undefined;
}

interface ScreenViewState {

}

export interface ScreenViewProps<TName extends string> {
    name: TName;
    screen?: Extract<Screen, { type: TName }>;
    transition?: {
        state: 'entering' | 'exiting';
    } | null | undefined;
    children? : ((props: InjectedScreenViewProps<Extract<Screen, { type: TName }>>) => React.ReactNode) | React.ReactNode;
    render?   : (props: InjectedScreenViewProps<Extract<Screen, { type: TName }>>) => React.ReactNode;
    component?: React.ComponentType<InjectedScreenViewProps<Extract<Screen, { type: TName }>>> | React.ComponentType<any>;
}


export class ScreenView<TName extends string> extends React.Component<ScreenViewProps<TName>, ScreenViewState> {
    constructor(props: ScreenViewProps<TName>) {
        super(props);
        this.state = {
            
        }
    }

    render() {
        if ([this.props.children, this.props.render, this.props.component].filter(x => Boolean(x)).length !== 1) {
            throw new Error(`<${this.constructor.name}> must have exactly one of (render | component | children) properties`);
        }

        if (!this.props.screen) {
            throw new Error(`Attempt to render a Screen without "screen" property`);
        }

        const injectedProps = {
            transition: this.props.transition,
            screen: this.props.screen
        };

        if (typeof this.props.children === 'function') {
            return this.props.children(injectedProps);
        }

        if (typeof this.props.children === 'object') {
            return this.props.children;
        }

        if (this.props.render) {
            return this.props.render(injectedProps);
        }

        if (this.props.component) {
            return React.createElement(this.props.component, injectedProps);
        }

        return null;
    }
}