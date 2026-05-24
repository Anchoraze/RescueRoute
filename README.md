# 🚨 RescueRoute — Disaster Pathfinding System

A real-time pathfinding visualizer set in a disaster/rescue scenario. Watch **Dijkstra, A\*, BFS, and Bellman-Ford** race to find rescue routes on a real OpenStreetMap overlay.

## Features

- 🗺️ **Real Map** — OpenStreetMap tiles (free, no API key needed)
- 🎨 **Terrain Painting** — Draw flooded zones, fire hazards, debris, rescue teams, hospitals
- ⚡ **4 Algorithms Racing** — Live side-by-side comparison with nodes explored, path cost, execution time
- 📊 **Complexity Panel** — Big-O time/space for each algorithm
- 🏆 **Verdict** — Which algorithm won and why

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173

## How to Use

1. The map starts with a **🚑 Rescue Team** (yellow) and **🏥 Hospital** (purple)
2. Use the toolbar at the bottom to paint terrain:
   - 🟢 **Clear Road** — weight 1 (fast)
   - 🌊 **Flooded Zone** — weight 8 (slow)
   - 🔥 **Fire / Hazard** — weight 12 (very slow)
   - 🧱 **Collapsed / Debris** — impassable (blocked)
3. Click **🚨 FIND ROUTES** to run all 4 algorithms simultaneously
4. Watch the right panel fill with stats
5. See which algorithm found the best route

## Algorithm Comparison

| Algorithm | Time Complexity | Accounts for Weights? | Notes |
|---|---|---|---|
| Dijkstra | O((V+E) log V) | ✅ Yes | Always finds optimal path |
| A* | O(E log V) | ✅ Yes | Faster with good heuristic |
| BFS | O(V+E) | ❌ No | Fewest hops, not cheapest |
| Bellman-Ford | O(V×E) | ✅ Yes | Handles negative weights |

## Project Structure

```
src/
├── algorithms/       ← Pure JS algorithm implementations
├── components/       ← React UI components
├── hooks/            ← useGrid, useAlgorithm state management
├── constants/        ← Terrain types, weights, grid size
└── utils/            ← Grid helpers, heuristics, pathfinding utils
```

## Tech Stack

- **React + Vite** — Frontend only, no backend
- **Leaflet.js + react-leaflet** — Map rendering
- **OpenStreetMap** — Free map tiles, no API key
- All algorithms run client-side in JavaScript

## Topics Covered (from CSE curriculum)

- Graph Traversal (BFS, DFS)
- Shortest Path Algorithms (Dijkstra, Bellman-Ford, A*)
- Greedy Methods
- Complexity Analysis (Big-O time/space)
- Weighted Graph representation
