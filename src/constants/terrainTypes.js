export const TERRAIN = {
  CLEAR: {
    id: 'CLEAR',
    label: 'Clear Road',
    weight: 1,
    color: 'rgba(34, 197, 94, 0.25)',
    borderColor: 'rgba(34, 197, 94, 0.5)',
    emoji: '🟢',
    passable: true,
  },
  FLOOD: {
    id: 'FLOOD',
    label: 'Flooded Zone',
    weight: 8,
    color: 'rgba(59, 130, 246, 0.45)',
    borderColor: 'rgba(59, 130, 246, 0.7)',
    emoji: '🌊',
    passable: true,
  },
  FIRE: {
    id: 'FIRE',
    label: 'Fire / Hazard',
    weight: 12,
    color: 'rgba(249, 115, 22, 0.45)',
    borderColor: 'rgba(249, 115, 22, 0.7)',
    emoji: '🔥',
    passable: true,
  },
  DEBRIS: {
    id: 'DEBRIS',
    label: 'Collapsed / Debris',
    weight: Infinity,
    color: 'rgba(239, 68, 68, 0.55)',
    borderColor: 'rgba(239, 68, 68, 0.85)',
    emoji: '🧱',
    passable: false,
  },
  START: {
    id: 'START',
    label: 'Rescue Team',
    weight: 1,
    color: 'rgba(250, 204, 21, 0.7)',
    borderColor: 'rgba(250, 204, 21, 1)',
    emoji: '🚑',
    passable: true,
  },
  END: {
    id: 'END',
    label: 'Hospital / Shelter',
    weight: 1,
    color: 'rgba(168, 85, 247, 0.7)',
    borderColor: 'rgba(168, 85, 247, 1)',
    emoji: '🏥',
    passable: true,
  },
};

export const TOOL_ORDER = ['CLEAR', 'FLOOD', 'FIRE', 'DEBRIS', 'START', 'END'];

export const GRID_ROWS = 22;
export const GRID_COLS = 36;
