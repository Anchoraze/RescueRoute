import { TERRAIN, GRID_ROWS, GRID_COLS } from '../constants/terrainTypes';

export function createEmptyGrid(rows = GRID_ROWS, cols = GRID_COLS) {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      row: r,
      col: c,
      terrain: 'CLEAR',
      visited: false,
      inPath: false,
      distance: Infinity,
      f: Infinity,
      g: Infinity,
      h: Infinity,
      parent: null,
    }))
  );
}

export function getNeighbors(grid, node, allowDiagonal = false) {
  const { row, col } = node;
  const rows = grid.length;
  const cols = grid[0].length;
  const dirs = [[0,1],[1,0],[0,-1],[-1,0]];
  if (allowDiagonal) dirs.push([1,1],[1,-1],[-1,1],[-1,-1]);

  const neighbors = [];
  for (const [dr, dc] of dirs) {
    const nr = row + dr;
    const nc = col + dc;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
      const neighbor = grid[nr][nc];
      if (TERRAIN[neighbor.terrain].passable) {
        neighbors.push(neighbor);
      }
    }
  }
  return neighbors;
}

export function heuristic(a, b) {
  // Manhattan distance
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

export function euclideanHeuristic(a, b) {
  return Math.sqrt((a.row - b.row) ** 2 + (a.col - b.col) ** 2);
}

export function reconstructPath(endNode) {
  const path = [];
  let current = endNode;
  while (current !== null) {
    path.unshift({ row: current.row, col: current.col });
    current = current.parent;
  }
  return path;
}

export function nodeKey(node) {
  return `${node.row}-${node.col}`;
}

export function cloneGrid(grid) {
  return grid.map(row => row.map(cell => ({ ...cell, parent: null })));
}

export function findNodeByTerrain(grid, terrainType) {
  for (const row of grid) {
    for (const cell of row) {
      if (cell.terrain === terrainType) return cell;
    }
  }
  return null;
}
