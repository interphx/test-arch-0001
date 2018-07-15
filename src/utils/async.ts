export interface FrameLoopHandle {
    stop(): void;
}

export function runFrameLoop(fun: () => void, delay: number = 1): FrameLoopHandle {
    let handle = {
            frameId: 0,
            stop() {
                cancelAnimationFrame(handle.frameId);
                handle.frameId = NaN;
            }
        },
        lastTime = Date.now(),
        loop = function() {
            let currentTime = Date.now();
            if (currentTime >= (lastTime + delay)) {
                fun();
                lastTime = currentTime;
            }
            if (!isNaN(handle.frameId)) {
                handle.frameId = requestAnimationFrame(loop);
            }
        };

    handle.frameId = requestAnimationFrame(loop);
    return handle;
}
