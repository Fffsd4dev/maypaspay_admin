import { useEffect, useRef } from 'react';

const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'wheel'];
const CHECK_EVERY_MS = 15 * 1000;

/**
 * Calls `onIdle` once the user has done nothing for `timeoutMs`.
 *
 * We record the time of the last activity and check it on an interval
 * (instead of one long setTimeout), so it still works correctly after the
 * laptop wakes from sleep or the tab comes back from the background.
 */
export default function useIdleTimer({ enabled, timeoutMs, onIdle }) {
  const onIdleRef = useRef(onIdle);

  useEffect(() => {
    onIdleRef.current = onIdle;
  }, [onIdle]);

  useEffect(() => {
    if (!enabled) return;

    let lastActivity = Date.now();
    const markActive = () => {
      lastActivity = Date.now();
    };
    const checkIdle = () => {
      if (Date.now() - lastActivity >= timeoutMs) onIdleRef.current();
    };

    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, markActive, { passive: true }));
    document.addEventListener('visibilitychange', checkIdle);
    const interval = setInterval(checkIdle, CHECK_EVERY_MS);

    return () => {
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, markActive));
      document.removeEventListener('visibilitychange', checkIdle);
      clearInterval(interval);
    };
  }, [enabled, timeoutMs]);
}
