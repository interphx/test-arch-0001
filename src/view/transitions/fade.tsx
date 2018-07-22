import * as React from 'react';
import { TransitionViewProps } from './common';

export class FadeTransitionView extends React.PureComponent<TransitionViewProps, { progress: number }> {
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
            increment = Math.PI * (frameDuration / duration);
        let interval = setInterval(() => {
            this.setState({ progress: this.state.progress + increment }, () => {
                if (this.state.progress >= Math.PI) {
                    clearInterval(interval);
                    this.props.transitionState.finish();
                }
            });
        }, frameDuration);
    }

    render() {
        return (
            <React.Fragment>
                { this.state.progress < (Math.PI / 2) ? this.props.fromScreen : this.props.toScreen }
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        zIndex: 1000,
                        background: `rgba(255, 255, 255, ${Math.sin(this.state.progress)})`
                    }}
                />
            </React.Fragment>
        );
    }
}