import React, { useEffect } from 'react';
import { useTrafficLight } from '@/features/trafficLight';


export function TrafficLightTest() {
    const { currentLight, secondsLeft, fsmStatus, actions } = useTrafficLight();

    useEffect(() => {
        let running = true;

        // Rapidly toggle start/pause per frame
        const toggleLoop = () => {
            actions.startPause();
            if (running) requestAnimationFrame(toggleLoop);
        };

        requestAnimationFrame(toggleLoop);

        return () => {
            running = false;
        };
    }, [actions]);

    useEffect(() => {
        console.log(`[FSM Status]: ${fsmStatus}`);
    }, [fsmStatus]);

    useEffect(() => {
        console.log(`[Light]: ${currentLight} | Time left: ${secondsLeft}`);
    }, [currentLight, secondsLeft]);

    return (
        <div style={{ fontFamily: 'monospace' }}>
            <h2>Traffic Light Stress Test</h2>
            <p>Current Light: {currentLight}</p>
            <p>Seconds Left: {secondsLeft}</p>
            <p>Status: {fsmStatus}</p>
        </div>
    );
}
