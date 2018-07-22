import * as React from 'react';
import { TransitionViewProps } from './common';

export class SlideLeftTransitionView extends React.PureComponent<TransitionViewProps, { progress: number }> {
    constructor(props: TransitionViewProps) {
        super(props);
        this.state = {
            progress: 0
        };
    }

    componentDidMount() {
        let duration = 1000,
            fps = 60,
            frameDuration = 1000 / fps,
            increment = 1 * (frameDuration / duration);
        let interval = setInterval(() => {
            this.setState({ progress: this.state.progress + increment }, () => {
                if (this.state.progress >= 1) {
                    clearInterval(interval);
                    this.props.transitionState.finish();
                }
            });
        }, frameDuration);
    }

    render() {
        return (
            <React.Fragment>
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        transform: `translate(${-(this.state.progress * 100)}%, 0)`
                    }}
                >
                    { this.props.fromScreen }
                </div>
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        transform: `translate(${100 - (this.state.progress * 100)}%, 0)`
                    }}
                >
                    { this.props.toScreen }
                </div>
            </React.Fragment>
        );
    }
}