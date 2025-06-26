export const AUDIO_VOLUMES = {
  // Background audio volumes
  BACKGROUND_DAY: 0.8,
  BACKGROUND_NIGHT: 0.8,
  BACKGROUND: 0.8, // Generic background volume for current audio

  // Ambient audio volumes
  RUSTLE: 0.8,
  FIRE_CRACKLING: 0.8,

  // Transition volumes (used during fade transitions)
  TRANSITION_START: 0,
  TRANSITION_END: 0.8,
} as const;
