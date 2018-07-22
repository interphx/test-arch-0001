import * as React from 'react';
import { Socket } from 'model/socket';

export interface SocketViewProps {
    socket: Socket;
}

export interface SocketViewState {
    
}

export class SocketView extends React.Component<SocketViewProps, SocketViewState> {
    constructor(props: SocketViewProps) {
        super(props);
        this.state = {
            
        };
    }

    render() {
        const { socket } = this.props;

        return (
            <rect
                x={socket.localPos.x}
                y={socket.localPos.y}
                width={8}
                height={8}
                fill={socket.power > 0.5 ? 'red' : 'black'}
            />
        );
    }
}