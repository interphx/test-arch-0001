import * as React from 'react';
import { observer } from 'mobx-react';
import { NotItem } from 'model/item';

export interface NotGateViewProps {
    item: NotItem;
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
        const dx = event.clientX - this.lastMouseX,
              dy = event.clientY - this.lastMouseY;
        
        if (this.props.item.selected) {
            this.props.moveSelectedItemsBy(dx, dy);
        } else {
            this.props.item.moveBy(dx, dy);
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
            ? item.selected ? 'blue' : item.background.color
            : undefined;

        const imageUrl = (item.background.type === 'image')
            ? item.background.url
            : undefined;
    
        const SvgComponent = (item.background.type === 'color') ? 'rect' : 'image';

        return (
            <SvgComponent
                width={item.size.x} 
                height={item.size.y}
                x={item.pos.x}
                y={item.pos.y}
                fill={color}
                xlinkHref={imageUrl}
                preserveAspectRatio="none"
                
                onMouseDown={this.handleMouseDown}
            />
        );
    }
}

/*
export const NotGateView = observer(
    ({ item }: NotGateProps) => {
        let color = item.background.type === 'color' ? item.background.color : 'yellow';
        return <rect
            width={item.size.x} 
            height={item.size.y}
            x={item.pos.x}
            y={item.pos.y}
            fill={item.selected ? 'blue' : color}
        ></rect>
    }
);*/