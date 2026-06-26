import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const LenisContext = createContext(null);

const anchorEasing = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

export function LenisProvider({ children }) {
  const { hash, pathname } = useLocation();
  const lenisRef = useRef(null);
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (reduceMotion.matches) {
      return undefined;
    }

    const isTouch = window.matchMedia('(pointer: coarse)').matches;

    const instance = new Lenis({
      autoRaf: true,
      anchors: {
        duration: 1.1,
        easing: anchorEasing,
      },
      lerp: isTouch ? 0.08 : 0.1,
      smoothWheel: true,
      stopInertiaOnNavigate: true,
      syncTouch: isTouch,
      touchMultiplier: 1.2,
      wheelMultiplier: 1,
    });

    lenisRef.current = instance;
    setLenis(instance);

    return () => {
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  useEffect(() => {
    const scrollTarget = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;

    if (scrollTarget && lenisRef.current) {
      lenisRef.current.scrollTo(scrollTarget, { offset: -88 });
      return;
    }

    if (scrollTarget) {
      scrollTarget.scrollIntoView({ behavior: 'auto', block: 'start' });
      return;
    }

    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
      return;
    }

    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [hash, pathname]);

  const value = useMemo(() => ({ lenis }), [lenis]);

  return <LenisContext.Provider value={value}>{children}</LenisContext.Provider>;
}

export function useLenis() {
  const context = useContext(LenisContext);
  if (!context) {
    throw new Error('useLenis must be used within LenisProvider');
  }
  return context;
}
