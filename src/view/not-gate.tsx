import * as React from 'react';
import { observer } from 'mobx-react';
import { NotGate } from 'model/gate';
import { SocketView } from './socket';

export interface NotGateViewProps {
    item: NotGate;
    moveSelectedItemsBy: (dx: number, dy: number) => void;
}

export interface NotGateViewState {
    isDragged: boolean;
}

@observer
export class NotGateView extends React.Component<NotGateViewProps, NotGateViewState> {
    constructor(props: NotGateViewProps) {
        super(props);
        this.state = {
            isDragged: false
        }

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp   = this.handleMouseUp.bind(this);
    }

    lastMouseX: number = NaN;
    lastMouseY: number = NaN;

    handleMouseDown(event: React.MouseEvent<SVGElement>) {
        if (event.button !== 0) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        this.setState({ isDragged: true });
        this.lastMouseX = event.clientX;
        this.lastMouseY = event.clientY;

        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('mouseup', this.handleMouseUp);
    }

    handleMouseMove(event: MouseEvent) {
        const { item } = this.props,
              dx = event.clientX - this.lastMouseX,
              dy = event.clientY - this.lastMouseY;
        
        if (item.selection.selected) {
            this.props.moveSelectedItemsBy(dx, dy);
        } else {
            item.position.moveBy(dx, dy);
        }
        this.lastMouseX = event.clientX;
        this.lastMouseY = event.clientY;
    }

    handleMouseUp(event: MouseEvent) {
        this.lastMouseX = NaN;
        this.lastMouseY = NaN;
        this.setState({ isDragged: false });
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mouseup', this.handleMouseUp);
    }

    render() {
        const item  = this.props.item;

        const color = (item.background.type === 'color')
            ? item.selection.selected ? 'blue' : item.background.color
            : undefined;

        const imageUrl = (item.background.type === 'image')
            ? item.background.url
            : undefined;
    
        const SvgComponent = (item.background.type === 'color') ? 'rect' : 'image';

        return (
            <g
                transform={`translate(${item.position.x}, ${item.position.y})`}
            >
                { item.sockets.map(socket => <SocketView key={socket.id} socket={socket} />) }
                <SvgComponent
                    width={item.size.x} 
                    height={item.size.y}
                    fill={color}
                    xlinkHref={imageUrl}
                    preserveAspectRatio="none"
                    
                    onMouseDown={this.handleMouseDown}
                />
            </g>
        );
    }
}