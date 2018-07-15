import * as React from 'react';
import styled, { keyframes } from 'styled-components';
import { TransitionViewProps } from 'view/transitions/common';
import { GearImageView } from 'view/common/gear-image';

enum Stage {
    Start,
    GearIn,
    SlideUp,
    SlideDown,
    GearOut,
    End
};

const DelaysAfter = {
    [Stage.Start]: 1,
    [Stage.GearIn]: 200,
    [Stage.SlideUp]: 600,
    [Stage.SlideDown]: 800,
    [Stage.GearOut]: 800,
    [Stage.End]: 0
}

function delay(milliseconds: number) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, milliseconds);
    });
}

const rotationCCW = keyframes`
    0% { rotate: 0deg }
    100% { rotate: 360deg }
`;

const rotationCW = keyframes`
    0% { rotate: 360deg }
    100% { rotate: 0deg }
`;

const AnimatedScreen = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
`;

const OutScreen = AnimatedScreen.extend`
    transition: ${DelaysAfter[Stage.SlideUp]}ms all ease-in;
    transform: ${(props: any) => props.out ? 'translate(0, -100%)' : 'translate(0, 0)'};
`;

const InScreen = AnimatedScreen.extend`
    transition: ${DelaysAfter[Stage.SlideDown]}ms all ease-out;
    transform: ${(props: any) => props.in ? 'translate(0, 0)' : 'translate(0, -100%)'};
`;

const GearContainer = styled.div`
    position: absolute;
    top: 15%;
    width: 120px;
    height: 120px;
    transition: all ${DelaysAfter[Stage.GearIn]}ms ease-out;
`;

const GearContainerLeft = GearContainer.extend`
    left: 0;
    transform: ${(props: any) => props.in ? 'translate(-50%, 0)' : 'translate(-100%, 0)'};
`;

const GearContainerRight = GearContainer.extend`
    right: 0;
    transform: ${(props: any) => props.in ? 'translate(50%, 0)' : 'translate(100%, 0)'};
`;

const Gear = styled.div`
    width: 100%;
    height: 100%;
    animation: ${(props: any) => props.clockwise ? rotationCW : rotationCCW} 1s linear infinite;
    animation-delay: ${DelaysAfter[Stage.GearIn] - 100}ms;
    animation-play-state: ${(props: any) => props.in ? 'running' : 'paused'}
`;

export class UpchangeTransitionView extends React.PureComponent<TransitionViewProps, { stage: Stage }> {
    constructor(props: TransitionViewProps) {
        super(props);
        this.state = {
            stage: Stage.Start
        };
    }

    async componentDidMount() {
        await delay(1);
        this.setState({ stage: Stage.GearIn });
        await delay(DelaysAfter[Stage.GearIn] - 100);

        this.setState({ stage: Stage.SlideUp });
        await delay(DelaysAfter[Stage.SlideUp] + 400);

        this.setState({ stage: Stage.SlideDown });
        await delay(DelaysAfter[Stage.SlideDown]);

        this.setState({ stage: Stage.GearOut });
        await delay(DelaysAfter[Stage.GearOut]);

        this.setState({ stage: Stage.End });
        this.props.transitionState.finish();
    }

    render() {
        const gearIn = this.state.stage >= Stage.GearIn && this.state.stage < Stage.GearOut,
              gearClockwise = this.state.stage >= Stage.SlideDown;
        return (
            <React.Fragment>
                <OutScreen out={this.state.stage >= Stage.SlideUp}>
                    { this.props.fromScreen }

                    <GearContainerLeft in={gearIn}>
                        <Gear in={gearIn} clockwise={gearClockwise}><GearImageView /></Gear>
                    </GearContainerLeft>
                    <GearContainerRight in={gearIn}>
                        <Gear in={gearIn} clockwise={gearClockwise}><GearImageView /></Gear>
                    </GearContainerRight>
                </OutScreen>
                <InScreen in={this.state.stage >= Stage.SlideDown}>
                    { this.props.toScreen }

                    <GearContainerLeft in={gearIn}>
                        <Gear in={gearIn} clockwise={gearClockwise}><GearImageView /></Gear>
                    </GearContainerLeft>
                    <GearContainerRight in={gearIn}>
                        <Gear in={gearIn} clockwise={gearClockwise}><GearImageView /></Gear>
                    </GearContainerRight>
                </InScreen>
            </React.Fragment>
        );
    }
}