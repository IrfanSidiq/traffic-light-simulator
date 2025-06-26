import { useState } from 'react';
import { useTrafficLight, TRAFFIC_LIGHT_CONFIG, LIGHT_DISPLAY_ORDER } from '@/features/trafficLight';
import styles from './TrafficLight.module.css';


export function TrafficLight() {
  const { currentLight, secondsLeft, fsmStatus, actions } = useTrafficLight();
  
  const getButtonLabel = () => {
    if (fsmStatus === 'idle') return 'Start';
    if (fsmStatus === 'running') return 'Pause';
    if (fsmStatus === 'paused') return 'Resume';
  }

  const currentLightConfig = TRAFFIC_LIGHT_CONFIG[currentLight];
  
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Traffic Light Simulation</h2>

      <div className={styles.lightCasing}>
        {LIGHT_DISPLAY_ORDER.map((lightToDisplay) => (
          <div
            key={lightToDisplay}
            className={styles.light}
            style={{
              backgroundColor:
                currentLight === lightToDisplay
                  ? TRAFFIC_LIGHT_CONFIG[lightToDisplay].color
                  : '#4a4a4a',
              border: `3px solid ${
                currentLight === lightToDisplay
                  ? TRAFFIC_LIGHT_CONFIG[lightToDisplay].color
                  : '#333'
              }`,
              boxShadow:
                currentLight === lightToDisplay
                  ? `0 0 25px ${TRAFFIC_LIGHT_CONFIG[lightToDisplay].color}, 0 0 10px ${TRAFFIC_LIGHT_CONFIG[lightToDisplay].color} inset`
                  : 'none',
              opacity: currentLight === lightToDisplay ? 1 : 0.25,
            }}
          />
        ))}
      </div>

      <div className={styles.timerContainer}>
        <div
          className={styles.timerDisplay}
          style={{ color: currentLightConfig?.color || '#333' }}
        >
          {fsmStatus !== 'idle'
            ? `${secondsLeft}s`
            : `IDLE`}
        </div>
      </div>

      <div className={styles.statusDisplay}>
        {fsmStatus === 'idle'
          ? 'Status: STOPPED'
          : `Current Light: ${currentLightConfig?.name} | Status: ${fsmStatus.toUpperCase()}`}
      </div>

      <div className={styles.controls}>
        <button
          className={`${styles.button} ${styles.startButton}`}
          onClick={actions.startPause}
        >
          {getButtonLabel()}
        </button>
        <button
          className={`${styles.button} ${styles.resetButton}`}
          onClick={actions.reset}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
