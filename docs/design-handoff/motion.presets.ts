// Reference configuration for an existing compatible spring engine.
// No runtime dependency or application integration is implied.
export const springs = {
  "press": {
    "mass": 1,
    "stiffness": 520,
    "damping": 38
  },
  "popover": {
    "mass": 1,
    "stiffness": 420,
    "damping": 32
  },
  "dialog": {
    "mass": 1,
    "stiffness": 360,
    "damping": 30
  },
  "layout": {
    "mass": 1,
    "stiffness": 320,
    "damping": 32
  },
  "success": {
    "mass": 1,
    "stiffness": 480,
    "damping": 30
  }
} as const;

export const motionTiming = {
  hover: 0.12,
  opacityEnter: 0.14,
  opacityExit: 0.14,
  navigation: 0.18,
  reducedFade: 0.1,
} as const;

export function overlayMotion(kind: 'popover' | 'dialog', reducedMotion: boolean) {
  if (reducedMotion) {
    return {
      initial: { opacity: 0, scale: 1, y: 0 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 1, y: 0 },
      transition: { duration: 0, opacity: { duration: 0.1, ease: 'linear' } },
    };
  }
  return {
    initial: { opacity: 0, scale: kind === 'popover' ? 0.97 : 0.98, y: kind === 'popover' ? 6 : 12 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.99, y: 4, transition: { duration: 0.14, ease: 'easeOut' } },
    transition: { type: 'spring', ...springs[kind], opacity: { duration: 0.14, ease: 'easeOut' } },
  };
}

// Keep hit targets/layout stable. Apply the transform to the visual surface.
export const pressMotion = {
  whileTap: { scale: 0.97 },
  transition: { type: 'spring', ...springs.press },
} as const;

// reducedMotion => still mascot; stop decorative loops when !working or hidden.
// Completion, errors and focus updates must never depend on animation end.
