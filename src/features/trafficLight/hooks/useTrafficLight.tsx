import { useState, useEffect, useRef, useCallback } from 'react';
import { TRAFFIC_LIGHT_CONFIG, INITIAL_LIGHT, INITIAL_DURATION } from '@/features/trafficLight/config/config';
import { FSMState, TrafficLightColor } from '@/features/trafficLight/types/TrafficLight.types';


export function useTrafficLight() {
    const [currentLight, setCurrentLight] = useState<TrafficLightColor>(INITIAL_LIGHT);
    const [timeLeft, setTimeLeft] = useState<number>(INITIAL_DURATION);
    const [fsmStatus, setFsmStatus] = useState<FSMState>('idle');

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


    useEffect(() => {
        if (fsmStatus !== 'running') return;

        const intervalId = setInterval(() => {
            if (fsmStatus === 'running') {
                handleTick();
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [fsmStatus, handleTick]);

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