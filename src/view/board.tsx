import * as React from 'react';
import { observer } from 'mobx-react';
import { Board } from 'model/board';
import { Camera2d } from 'model/camera';
import { NotGateView } from './not-gate';
import { NotGate, Gate } from 'model/gate';
import { Vec2, MutableVec2 } from 'model/vec2';
import { runFrameLoop } from 'utils/async';
import { clamp } from 'utils/math';
import { BoardItem } from 'model/board-item';
import { testAabbIntersection } from 'utils/geometry';

interface BoardViewProps {
    board: Board;
    camera: Camera2d;
}

@observer
export class BoardView extends React.Component<BoardViewProps, { isPanning: boolean }> {
    constructor(props: BoardViewProps) {
        super(props);
        this.state = {
            isPanning: false
        };

        this.handlePanMouseDown = this.handlePanMouseDown.bind(this);
        this.handlePanMouseMove = this.handlePanMouseMove.bind(this);
        this.handlePanMouseUp   = this.handlePanMouseUp.bind(this);

        this.handleSelectionMouseDown = this.handleSelectionMouseDown.bind(this);
        this.handleSelectionMouseMove = this.handleSelectionMouseMove.bind(this);
        this.handleSelectionMouseUp   = this.handleSelectionMouseUp.bind(this);

        this.handleAnyMouseDown = this.handleAnyMouseDown.bind(this);

        this.isItemInCamera  = this.isItemInCamera.bind(this);
        this.renderItem      = this.renderItem.bind(this);
    }

    handleAnyMouseDown(event: React.MouseEvent<Element>) {
        if (event.button === 0) {
            return this.handleSelectionMouseDown(event);
        } else {
            return this.handlePanMouseDown(event);
        }
    }

    handleSelectionMouseDown(event: React.MouseEvent<Element>) {
        this.props.board.startSelection({ x: event.clientX + this.props.camera.pos.x, y: event.clientY + this.props.camera.pos.y });

        window.addEventListener('mousemove', this.handleSelectionMouseMove);
        window.addEventListener('mouseup', this.handleSelectionMouseUp);        
    }

    handleSelectionMouseMove(event: MouseEvent) {
        if (event.shiftKey) {
            this.props.board.setSelectionMode('add');
        } else if (event.altKey) {
            this.props.board.setSelectionMode('subtract');
        } else {
            this.props.board.setSelectionMode('replace');
        }
        this.props.board.setSelectionDraggedPoint(
            event.clientX + this.props.camera.pos.x,
            event.clientY + this.props.camera.pos.y
        );
    }

    handleSelectionMouseUp(event: MouseEvent) {
        this.props.board.stopSelection();

        window.removeEventListener('mousemove', this.handleSelectionMouseMove);
        window.removeEventListener('mouseup', this.handleSelectionMouseUp);    
    }

    private lastMouseX: number = 0;
    private lastMouseY: number = 0;
    private speed: MutableVec2 = { x: 0, y: 0 };
    private lastMoveTime: number = NaN;

    handlePanMouseDown(event: React.MouseEvent<Element>) {
        this.setState({ isPanning: true });
        this.lastMouseX = event.clientX;
        this.lastMouseY = event.clientY;
        window.addEventListener('mouseup', this.handlePanMouseUp);
        window.addEventListener('mousemove', this.handlePanMouseMove);

        this.speed.x = 0;
        this.speed.y = 0;
    }

    handlePanMouseUp(event: MouseEvent) {
        this.setState({ isPanning: false });
        window.removeEventListener('mouseup', this.handlePanMouseUp);
        window.removeEventListener('mousemove', this.handlePanMouseMove);

        if (isNaN(this.lastMouseX) || isNaN(this.lastMouseY) || isNaN(this.lastMoveTime)) {
            return;
        }

        let coefficient = 1 - (clamp(Date.now() - this.lastMoveTime, 0, 130) / 130);
        this.speed.x *= coefficient;
        this.speed.y *= coefficient;
        this.lastMoveTime = NaN;

        let loop = runFrameLoop(() => {
            this.props.camera.moveBy(this.speed);
            this.speed.x *= 0.9;
            this.speed.y *= 0.9;
            if (Math.sqrt(Math.pow(this.speed.x, 2) + Math.pow(this.speed.y, 2)) < 0.05) {
                loop.stop();
                this.speed.x = 0;
                this.speed.y = 0;
            }
        }, 15);
    }

    handlePanMouseMove(event: MouseEvent) {
        if (!this.state.isPanning) {
            return;
        }
        let deltaX = event.clientX - this.lastMouseX,
            deltaY = event.clientY - this.lastMouseY;
        this.props.camera.moveBy(-deltaX, -deltaY);
        this.lastMouseX = event.clientX;
        this.lastMouseY = event.clientY;

        this.speed.x *= 0.9;
        this.speed.y *= 0.9;
        this.speed.x += (-deltaX * 0.1);
        this.speed.y += (-deltaY * 0.1);
        this.lastMoveTime = Date.now();
    }

    componentWillUnmount() {

    }

    isItemInCamera(item: BoardItem) {
        if (!item.collider) { return true; }
        return testAabbIntersection(this.props.camera.aabb, item.collider.aabb);
    }

    renderItem(item: BoardItem) {
        if (item instanceof NotGate) {
            return <NotGateView key={item.id} item={item as NotGate} moveSelectedItemsBy={this.props.board.moveSelectedItemsBy} />;
        }
        return null;
    }

    render() {
        let { board, camera } = this.props;

        let transform = `
            translate(${-camera.pos.x}, ${-camera.pos.y})
        `.trim();

        let items = board.items.filter(this.isItemInCamera);

        let selection = board.selection
            ? <rect 
                x={board.selection.aabb.left} y={board.selection.aabb.top}
                width={board.selection.aabb.right - board.selection.aabb.left}
                height={board.selection.aabb.bottom - board.selection.aabb.top}
                fill={'transparent'}
                stroke={'lime'}
                strokeWidth={2}
              />
            : null;

        return (
            <React.Fragment>
                <svg 
                    style={{ width: '100%', height: '100%' }}
                    onMouseDown={this.handleAnyMouseDown}
                >
                    <g style={{ willChange: this.state.isPanning ? 'transform' : undefined }} transform={transform}>
                        { items.map(this.renderItem) }
                        { selection }
                    </g>
                </svg>
            </React.Fragment>
        );
    }
}