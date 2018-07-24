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
            <g>
                <rect
                    x={socket.localPos.x - 4}
                    y={socket.localPos.y - 4}
                    width={socket.size.x + 8}
                    height={socket.size.y + 8}
                    fill={`rgba(0, 0, 0, 0.3)`}
                />
                <rect
                    x={socket.localPos.x}
                    y={socket.localPos.y}
                    width={socket.size.x}
                    height={socket.size.y}
                    fill={socket.power > 0.5 ? 'red' : 'black'}
                />
            </g>
        );
    }
}