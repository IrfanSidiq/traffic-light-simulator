import { TrafficLightColor, TrafficLightState } from '@/features/trafficLight/types/TrafficLight.types';


export const TRAFFIC_LIGHT_CONFIG: Record<TrafficLightColor, TrafficLightState> = {
    red: { duration: 5, next: 'green', color: 'red', name: 'Red' },
    yellow: { duration: 2, next: 'red', color: 'yellow', name: 'Yellow' },
    green: { duration: 4, next: 'yellow', color: 'green', name: 'Green' }
};

export const INITIAL_LIGHT: TrafficLightColor = 'red';
export const INITIAL_DURATION: number = TRAFFIC_LIGHT_CONFIG[INITIAL_LIGHT].duration
export const LIGHT_DISPLAY_ORDER: TrafficLightColor[] = ['red', 'yellow', 'green'];