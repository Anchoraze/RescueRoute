import { useRef, useEffect, useCallback } from 'react';
import { TERRAIN, GRID_ROWS, GRID_COLS } from '../constants/terrainTypes';

const ALGO_COLORS = {
  dijkstra: 'rgba(34,211,238,0.18)',
  astar: 'rgba(74,222,128,0.18)',
  bfs: 'rgba(251,146,60,0.18)',
  bellmanford: 'rgba(244,114,182,0.18)',
};

const ALGO_PATH_COLORS = {
  dijkstra: 'rgba(34,211,238,0.85)',
  astar: 'rgba(74,222,128,0.85)',
  bfs: 'rgba(251,146,60,0.85)',
  bellmanford: 'rgba(244,114,182,0.85)',
};

const ALGO_GLOW = {
  dijkstra: '0 0 6px rgba(34,211,238,0.9)',
  astar: '0 0 6px rgba(74,222,128,0.9)',
  bfs: '0 0 6px rgba(251,146,60,0.9)',
  bellmanford: '0 0 6px rgba(244,114,182,0.9)',
};

export default function GridOverlay({ grid, paintCell, isMouseDown, setIsMouseDown }) {
  const containerRef = useRef(null);

  const getCellSize = () => {
    if (!containerRef.current) return { cw: 20, ch: 20 };
    const { width, height } = containerRef.current.getBoundingClientRect();
    return {
      cw: width / GRID_COLS,
      ch: height / GRID_ROWS,
    };
  };

  const getRowColFromEvent = useCallback((e) => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const { cw, ch } = getCellSize();
    const col = Math.floor(x / cw);
    const row = Math.floor(y / ch);
    if (row >= 0 && row < GRID_ROWS && col >= 0 && col < GRID_COLS) {
      return { row, col };
    }
    return null;
  }, []);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsMouseDown(true);
    const pos = getRowColFromEvent(e);
    if (pos) paintCell(pos.row, pos.col);
  }, [paintCell, getRowColFromEvent, setIsMouseDown]);

  const handleMouseMove = useCallback((e) => {
    if (!isMouseDown) return;
    const pos = getRowColFromEvent(e);
    if (pos) paintCell(pos.row, pos.col);
  }, [isMouseDown, paintCell, getRowColFromEvent]);

  const handleMouseUp = useCallback(() => setIsMouseDown(false), [setIsMouseDown]);

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseUp]);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
        gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
        cursor: 'crosshair',
        userSelect: 'none',
        zIndex: 1000,
      }}
    >
      {grid.map((row, r) =>
        row.map((cell, c) => {
          const terrain = TERRAIN[cell.terrain];

          // Determine if any algo visited or pathed through this cell
          const visitedBy = ['dijkstra','astar','bfs','bellmanford'].filter(id => cell[`visited_${id}`]);
          const pathedBy = ['dijkstra','astar','bfs','bellmanford'].filter(id => cell[`path_${id}`]);

          const isStart = cell.terrain === 'START';
          const isEnd = cell.terrain === 'END';
          const isBlocked = !terrain.passable;

          let bg = terrain.color;
          let border = terrain.borderColor;
          let content = null;

          if (visitedBy.length > 0 && !isStart && !isEnd && !isBlocked) {
            // Mix colors of all visiting algos
            bg = ALGO_COLORS[visitedBy[visitedBy.length - 1]];
          }

          // Path cells get special treatment — show all paths as stripes
          const pathStyles = pathedBy.map((id, i) => ({
            position: 'absolute',
            inset: 0,
            background: ALGO_PATH_COLORS[id],
            opacity: 1 / pathedBy.length,
          }));

          if (isStart) content = <span style={{ fontSize: '14px', lineHeight: 1 }}>🚑</span>;
          if (isEnd) content = <span style={{ fontSize: '14px', lineHeight: 1 }}>🏥</span>;

          return (
            <div
              key={`${r}-${c}`}
              style={{
                position: 'relative',
                background: bg,
                border: `0.5px solid ${border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.15s',
                boxShadow: pathedBy.length > 0 ? ALGO_GLOW[pathedBy[pathedBy.length - 1]] : 'none',
                overflow: 'hidden',
              }}
            >
              {pathedBy.map((id) => (
                <div key={id} style={{
                  position: 'absolute',
                  inset: 0,
                  background: ALGO_PATH_COLORS[id],
                  opacity: 0.5 / pathedBy.length + 0.3,
                  mixBlendMode: 'screen',
                }} />
              ))}
              {content && (
                <span style={{ position: 'relative', zIndex: 2, fontSize: '11px' }}>
                  {isStart ? '🚑' : '🏥'}
                </span>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
