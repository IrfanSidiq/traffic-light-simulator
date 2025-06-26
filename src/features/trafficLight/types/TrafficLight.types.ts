export type TrafficLightColor = 'red' | 'yellow' | 'green';

export interface TrafficLightState {
    duration: number;
    next: TrafficLightColor;
    color: string;
    name: string;
}

export type FSMState = 'idle' | 'running' | 'paused';