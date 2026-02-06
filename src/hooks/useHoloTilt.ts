"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

interface HoloTiltValues {
  mx: number;
  my: number;
  rx: number;
  ry: number;
  hyp: number;
}

const DEFAULT_VALUES: HoloTiltValues = {
  mx: 50,
  my: 50,
  rx: 0,
  ry: 0,
  hyp: 0,
};

const MAX_TILT = 15;
const GYRO_TILT_RANGE = 30; // degrees of phone tilt mapped to full range

export function useHoloTilt(ref: RefObject<HTMLDivElement | null>) {
  const [values, setValues] = useState<HoloTiltValues>(DEFAULT_VALUES);
  const animationFrame = useRef<number>(0);
  const isHovering = useRef(false);
  const isGyroActive = useRef(false);

  const updatePosition = useCallback(
    (clientX: number, clientY: number) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;

      const mx = Math.max(0, Math.min(100, x));
      const my = Math.max(0, Math.min(100, y));

      const rx = -(my / 100 - 0.5) * MAX_TILT * 2;
      const ry = (mx / 100 - 0.5) * MAX_TILT * 2;

      const dx = mx / 100 - 0.5;
      const dy = my / 100 - 0.5;
      const hyp = Math.sqrt(dx * dx + dy * dy);

      setValues({ mx, my, rx, ry, hyp });
    },
    [ref]
  );

  const updateFromGyro = useCallback(
    (beta: number, gamma: number) => {
      // beta: front-to-back tilt (-180 to 180), gamma: left-to-right tilt (-90 to 90)
      // Map to 0-100 range within our tilt range
      const mx = Math.max(0, Math.min(100, 50 + (gamma / GYRO_TILT_RANGE) * 50));
      const my = Math.max(0, Math.min(100, 50 + ((beta - 45) / GYRO_TILT_RANGE) * 50)); // offset by 45 for natural holding angle

      const rx = -(my / 100 - 0.5) * MAX_TILT * 2;
      const ry = (mx / 100 - 0.5) * MAX_TILT * 2;

      const dx = mx / 100 - 0.5;
      const dy = my / 100 - 0.5;
      const hyp = Math.sqrt(dx * dx + dy * dy);

      setValues({ mx, my, rx, ry, hyp });
    },
    []
  );

  // Set up gyroscope listener on mobile
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (!isMobile) return;

    let cleanup: (() => void) | undefined;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;
      isGyroActive.current = true;
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = requestAnimationFrame(() => {
        updateFromGyro(e.beta!, e.gamma!);
      });
    };

    const startListening = () => {
      window.addEventListener("deviceorientation", handleOrientation);
      cleanup = () => window.removeEventListener("deviceorientation", handleOrientation);
    };

    // iOS 13+ requires permission
    const doe = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };
    if (typeof doe.requestPermission === "function") {
      // We'll request permission on the first touch interaction
      const requestOnTouch = () => {
        doe.requestPermission!().then((response: string) => {
          if (response === "granted") {
            startListening();
          }
        }).catch(() => {
          // Permission denied, fall back to touch
        });
        window.removeEventListener("touchstart", requestOnTouch, { capture: true });
      };
      window.addEventListener("touchstart", requestOnTouch, { capture: true, once: true });
      cleanup = () => window.removeEventListener("touchstart", requestOnTouch, { capture: true });
    } else {
      startListening();
    }

    return () => cleanup?.();
  }, [updateFromGyro]);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      isHovering.current = true;
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = requestAnimationFrame(() => {
        updatePosition(e.clientX, e.clientY);
      });
    },
    [updatePosition]
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (isGyroActive.current) return; // prefer gyroscope over touch
      isHovering.current = true;
      const touch = e.touches[0];
      if (!touch) return;
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = requestAnimationFrame(() => {
        updatePosition(touch.clientX, touch.clientY);
      });
    },
    [updatePosition]
  );

  const onMouseLeave = useCallback(() => {
    isHovering.current = false;
    const start = performance.now();
    const startValues = { ...values };
    const duration = 400;

    function animate(now: number) {
      if (isHovering.current) return;
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);

      setValues({
        mx: startValues.mx + (50 - startValues.mx) * ease,
        my: startValues.my + (50 - startValues.my) * ease,
        rx: startValues.rx * (1 - ease),
        ry: startValues.ry * (1 - ease),
        hyp: startValues.hyp * (1 - ease),
      });

      if (t < 1) {
        animationFrame.current = requestAnimationFrame(animate);
      }
    }

    animationFrame.current = requestAnimationFrame(animate);
  }, [values]);

  const style: Record<string, string> = {
    "--mx": `${values.mx}%`,
    "--my": `${values.my}%`,
    "--rx": `${values.rx}deg`,
    "--ry": `${values.ry}deg`,
    "--hyp": `${values.hyp}`,
  };

  return {
    values,
    style,
    handlers: {
      onMouseMove,
      onTouchMove,
      onMouseLeave,
    },
  };
}
