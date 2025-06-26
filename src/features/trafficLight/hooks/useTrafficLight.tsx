import { useState, useEffect, useRef, useCallback } from 'react';
import { TRAFFIC_LIGHT_CONFIG, INITIAL_LIGHT, INITIAL_DURATION } from '@/features/trafficLight/config/config';
import { FSMState, TrafficLightColor } from '@/features/trafficLight/types/TrafficLight.types';


export function useTrafficLight() {
    const [currentLight, setCurrentLight] = useState<TrafficLightColor>(INITIAL_LIGHT);
    const [timeLeft, setTimeLeft] = useState<number>(INITIAL_DURATION);
    const [fsmStatus, setFsmStatus] = useState<FSMState>('idle');

    const intervalRef = useRef<number | null>(null);

    // Function for changing lights
    const advanceLight = useCallback(() => {
        setCurrentLight(prevLight => {
            const nextLight = TRAFFIC_LIGHT_CONFIG[prevLight].next;
            setTimeLeft(TRAFFIC_LIGHT_CONFIG[nextLight].duration);
            return nextLight;
        });
    }, []);

    // Function for handling time countdown
    const handleTick = useCallback(() => {
        console.log(`[Tick] ${new Date().toISOString()}`);
        setTimeLeft(prevTimeLeft => {
            if (prevTimeLeft > 1) {
                return prevTimeLeft - 1;
            }
            else {
                advanceLight();
                return 0;
            }
        });
    }, [advanceLight]);

    // Function for handling start/pause/resume
    const handleStartPause = useCallback(() => {
        setFsmStatus(prevStatus => {
            if (prevStatus === 'idle') {
                setCurrentLight(INITIAL_LIGHT);
                setTimeLeft(INITIAL_DURATION);
                return 'running';
            }
            if (prevStatus === 'running') return 'paused';
            if (prevStatus === 'paused') return 'running';

            return prevStatus;
        });
    }, []);

    const handleReset = useCallback(() => {
        setFsmStatus('idle');
        setCurrentLight(INITIAL_LIGHT);
        setTimeLeft(INITIAL_DURATION);
    }, []);


    // Resets interval everytime fsmStatus changes
    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if (fsmStatus === 'running') {
            intervalRef.current = setInterval(handleTick, 1000);
        }

        // Proper cleanup
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [fsmStatus, handleTick]);

    return {
        currentLight,
        secondsLeft: timeLeft,
        fsmStatus,
        actions: {
            startPause: handleStartPause,
            reset: handleReset
        }
    };
};