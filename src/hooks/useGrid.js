import { useState, useCallback } from 'react';
import { createEmptyGrid } from '../utils/gridHelpers';
import { GRID_ROWS, GRID_COLS } from '../constants/terrainTypes';

export function useGrid() {
  const [grid, setGrid] = useState(() => {
    const g = createEmptyGrid();
    // Default start and end positions
    g[11][3].terrain = 'START';
    g[11][32].terrain = 'END';
    return g;
  });
  const [activeTool, setActiveTool] = useState('DEBRIS');
  const [isMouseDown, setIsMouseDown] = useState(false);

  const paintCell = useCallback((row, col) => {
    setGrid(prev => {
      const next = prev.map(r => r.map(c => ({ ...c })));
      const cell = next[row][col];

      // If placing START/END, clear previous one first
      if (activeTool === 'START' || activeTool === 'END') {
        for (let r = 0; r < GRID_ROWS; r++) {
          for (let c = 0; c < GRID_COLS; c++) {
            if (next[r][c].terrain === activeTool) {
              next[r][c].terrain = 'CLEAR';
            }
          }
        }
      }

      // Don't overwrite the other marker
      if (
        (cell.terrain === 'START' && activeTool !== 'START') ||
        (cell.terrain === 'END' && activeTool !== 'END')
      ) {
        return prev;
      }

      cell.terrain = activeTool;
      return next;
    });
  }, [activeTool]);

  const resetGrid = useCallback(() => {
    const g = createEmptyGrid();
    g[11][3].terrain = 'START';
    g[11][32].terrain = 'END';
    setGrid(g);
  }, []);

  const clearPaths = useCallback(() => {
    setGrid(prev => prev.map(row => row.map(cell => ({
      ...cell,
      visited: false,
      inPath: false,
    }))));
  }, []);

  const applyVisualization = useCallback((algoId, visitedNodes, pathNodes) => {
    setGrid(prev => {
      const next = prev.map(r => r.map(c => ({ ...c })));
      for (const { row, col } of visitedNodes) {
        if (next[row][col].terrain === 'CLEAR' || next[row][col].terrain === 'FLOOD' || next[row][col].terrain === 'FIRE') {
          next[row][col][`visited_${algoId}`] = true;
        }
      }
      for (const { row, col } of pathNodes) {
        next[row][col][`path_${algoId}`] = true;
      }
      return next;
    });
  }, []);

  const clearVisualization = useCallback(() => {
    setGrid(prev => prev.map(row => row.map(cell => {
      const clean = { ...cell };
      Object.keys(clean).forEach(k => {
        if (k.startsWith('visited_') || k.startsWith('path_')) {
          delete clean[k];
        }
      });
      return clean;
    })));
  }, []);

  return {
    grid,
    activeTool,
    setActiveTool,
    paintCell,
    resetGrid,
    clearPaths,
    applyVisualization,
    clearVisualization,
    isMouseDown,
    setIsMouseDown,
  };
}
