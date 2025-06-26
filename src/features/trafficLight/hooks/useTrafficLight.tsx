import { useState, useEffect, useRef, useCallback } from 'react';
import { TRAFFIC_LIGHT_CONFIG, INITIAL_LIGHT, INITIAL_DURATION } from '@/features/trafficLight/config/config';
import { FSMState, TrafficLightColor } from '@/features/trafficLight/types/TrafficLight.types';


export function useTrafficLight(useRAF = false) {
    const [currentLight, setCurrentLight] = useState<TrafficLightColor>(INITIAL_LIGHT);
    const [timeLeft, setTimeLeft] = useState<number>(INITIAL_DURATION);
    const [fsmStatus, setFsmStatus] = useState<FSMState>('idle');

    const rafId = useRef<number | null>(null);
    const lastTickTime = useRef<number>(0);
    const accumulatedDelta = useRef<number>(0);

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
        // Stop RAF if traffic light is not running (paused/stopped)
        if (fsmStatus !== 'running') {
            if (useRAF && rafId.current) {
                cancelAnimationFrame(rafId.current);
                rafId.current = null;
            }
            return;
        }

        if (useRAF) {
            const tickLoop = (timestamp: number) => {
                if (fsmStatus !== 'running') {
                    if (rafId.current) cancelAnimationFrame(rafId.current)
                    rafId.current = null;
                    return;
                }

                if (!lastTickTime.current) {
                    lastTickTime.current = timestamp;
                }

                accumulatedDelta.current += timestamp - lastTickTime.current;
                lastTickTime.current = timestamp;

                // While accumulated time difference is greater than 1 second, decrease time left
                while (accumulatedDelta.current >= 1000) {
                    if (fsmStatus != 'running') break;
                    handleTick();
                    accumulatedDelta.current -= 1000;
                }

                // Schedule tickLoop for next frame
                if (fsmStatus === 'running') {
                    rafId.current = requestAnimationFrame(tickLoop);
                }
                else {
                    if (rafId.current) cancelAnimationFrame(rafId.current);
                    rafId.current = null;
                }
            };

            // Initiate tickLoop
            lastTickTime.current = performance.now();
            accumulatedDelta.current = 0;
            rafId.current = requestAnimationFrame(tickLoop);
        }
        else {
            // If not using RAF, just use interval
            const intervalId = setInterval(handleTick, 1000);
            return () => clearInterval(intervalId);
        }

        return () => {
            // Stop RAF on cleanup
            if (useRAF && rafId.current) {
                cancelAnimationFrame(rafId.current);
                rafId.current = null;
            }
        };
    }, [fsmStatus, useRAF, handleTick]);

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

        if (useRAF) {
            if (rafId.current) {
                cancelAnimationFrame(rafId.current);
                rafId.current = null;
            }
            lastTickTime.current = 0;
            accumulatedDelta.current = 0;
        }
    }, [useRAF]);

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