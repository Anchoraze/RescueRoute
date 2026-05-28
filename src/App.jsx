import { useState, useEffect, useRef, useCallback } from 'react';
import MapCanvas       from './components/MapCanvas';
import ScenarioToolbar from './components/ScenarioToolbar';
import AlgoRacePanel   from './components/AlgoRacePanel';
import ComplexityPanel from './components/ComplexityPanel';
import { useOverpassGraph } from './hooks/useOverpassGraph';
import { useAlgorithm, ALGORITHMS } from './hooks/useAlgorithm';
import 'leaflet/dist/leaflet.css';

export default function App() {
  const mapRef = useRef(null);

  const {
    graphNodes, graphAdj, nodeCount, edgeCount,
    loadState, errorMsg, statusMsg,
    blockedNodes, floodNodes, fireNodes,
    load, forceReload, snapToNearest, snapToNearestNode, toggleObstacle, resetObstacles, getEffectiveWeight,
  } = useOverpassGraph();

  const { results, isRunning, animationProgress, runAll, reset: resetAlgo } =
    useAlgorithm(graphNodes, graphAdj, getEffectiveWeight, { blockedNodes, floodNodes, fireNodes });

  const [activeTool, setActiveTool]   = useState('none');
  const [startNode, setStartNode]     = useState(null);
  const [endNode, setEndNode]         = useState(null);
  const [placingMode, setPlacingMode] = useState('loading');
  const [highlightedAlgo, setHighlightedAlgo] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSmall, setIsSmall]   = useState(window.innerWidth <= 480);
  const [showMobilePanel, setShowMobilePanel] = useState(false);

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsSmall(window.innerWidth <= 480);
      // FIX: Tell Leaflet to recalculate its container size on window resize.
      // Without this the map stays the wrong size after orientation changes.
      mapRef.current?.invalidateSize?.();
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (loadState === 'loaded')  {
      setPlacingMode('start');
      // FIX: After OSM data loads the layout may have shifted (status bar
      // disappears, toolbar reflows). Force Leaflet to re-measure its container.
      setTimeout(() => mapRef.current?.invalidateSize?.(), 100);
    }
    if (loadState === 'error')   setPlacingMode('error');
    if (loadState === 'loading') setPlacingMode('loading');
  }, [loadState]);

  const handleNodeClick = useCallback((lat, lon) => {
    if (loadState !== 'loaded') return;
    const isObstacleTool = activeTool === 'block' || activeTool === 'flood' || activeTool === 'fire';

    if (isObstacleTool) {
      // FIX: was using snapToNearestNode which doesn't exist on useOverpassGraph.
      // snapToNearest with role='start' returns a real or virtual node — we use
      // it here without the virtual-node behaviour (always lands on a real node
      // since obstacle painting doesn't need edge-snapping).
      const realNode = snapToNearestNode(lat, lon);
      if (!realNode) return;
      const id = String(realNode.id);
      const isSet =
        (activeTool === 'block' && blockedNodes.has(id)) ||
        (activeTool === 'flood' && floodNodes.has(id)) ||
        (activeTool === 'fire'  && fireNodes.has(id));
      toggleObstacle(realNode.id, activeTool);
      if (isSet) mapRef.current?.removeObstacleMarker(id);
      else mapRef.current?.addObstacleMarker(id, realNode.lat, realNode.lon, activeTool);
      return;
    }

    if (placingMode === 'start' || (placingMode === 'done' && activeTool === 'none')) {
      const nearest = snapToNearest(lat, lon, 'start');
      if (!nearest) return;
      setStartNode(nearest);
      mapRef.current?.placeStartMarker(nearest.lat, nearest.lon, 'Rescue Team');
      setPlacingMode('end');
      return;
    }
    if (placingMode === 'end') {
      const nearest = snapToNearest(lat, lon, 'end');
      if (!nearest) return;
      setEndNode(nearest);
      mapRef.current?.placeEndMarker(nearest.lat, nearest.lon, 'Hospital');
      setPlacingMode('done');
    }
  }, [loadState, activeTool, placingMode, snapToNearest, toggleObstacle, blockedNodes, floodNodes, fireNodes]);

  const handleRun = useCallback(() => {
    mapRef.current?.clearPaths();
    runAll(startNode, endNode, (algo, path) => {
      mapRef.current?.drawPath(algo, path, graphNodes);
    });
  }, [runAll, startNode, endNode, graphNodes]);

  const handleClear = useCallback(() => {
    mapRef.current?.clearPaths();
    resetAlgo();
  }, [resetAlgo]);

  const handleReset = useCallback(() => {
    mapRef.current?.clearPaths();
    mapRef.current?.clearMarkers();
    mapRef.current?.clearObstacleMarkers();
    resetAlgo();
    resetObstacles();
    setStartNode(null);
    setEndNode(null);
    setPlacingMode('start');
  }, [resetAlgo, resetObstacles]);

  const headerHeight = isSmall ? 44 : isMobile ? 50 : 56;

  return (<>
    <div style={{
      width: '100vw', height: '100dvh',
      background: 'linear-gradient(170deg, #020508 0%, #04080f 40%, #060c18 100%)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', fontFamily: '"Exo 2", sans-serif',
    }}>
      {/* ── Header ── */}
      <header style={{
        background: 'rgba(3,6,14,0.96)',
        borderBottom: '1px solid rgba(239,68,68,0.2)',
        padding: isSmall ? '0 8px' : isMobile ? '0 12px' : '0 22px',
        height: headerHeight,
        display: 'flex', alignItems: 'center',
        gap: isSmall ? 5 : isMobile ? 8 : 14,
        flexShrink: 0,
        boxShadow: '0 1px 40px rgba(239,68,68,0.1), 0 0 0 0.5px rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        position: 'relative', zIndex: 100, overflow: 'hidden',
      }}>
        {/* Animated grid */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage:
            'linear-gradient(rgba(239,68,68,0.04) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(239,68,68,0.04) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'linear-gradient(90deg, transparent 0%, black 20%, black 80%, transparent 100%)',
        }} />
        {/* Red sweep line */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(239,68,68,0.6) 30%, rgba(251,146,60,0.4) 60%, transparent 100%)',
        }} />

        {/* Logo */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: isSmall ? 6 : 10,
          position: 'relative', zIndex: 1, flexShrink: 0,
        }}>
          <div style={{
            width: isSmall ? 30 : isMobile ? 34 : 40,
            height: isSmall ? 30 : isMobile ? 34 : 40,
            background: 'linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)',
            borderRadius: isSmall ? 7 : 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: isSmall ? 14 : isMobile ? 16 : 19,
            boxShadow:
              '0 0 24px rgba(220,38,38,0.5), 0 0 48px rgba(220,38,38,0.15),' +
              'inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.3)',
            flexShrink: 0,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: '-40%', right: '-40%', height: '50%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%)',
              borderRadius: '0 0 50% 50%',
            }} />
            🚨
          </div>

          <div style={{ lineHeight: 1, minWidth: 0 }}>
            <div style={{
              fontSize: isSmall ? 15 : isMobile ? 18 : 22,
              fontFamily: '"Exo 2", sans-serif',
              fontWeight: 800,
              letterSpacing: isSmall ? '0.03em' : '0.06em',
              lineHeight: 1,
              background: 'linear-gradient(90deg, #ffffff 0%, #fca5a5 25%, #ef4444 50%, #fb923c 75%, #fbbf24 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              whiteSpace: 'nowrap',
              filter: 'drop-shadow(0 0 12px rgba(239,68,68,0.4))',
            }}>
              RESCUE<span style={{
                fontStyle: 'italic',
                background: 'linear-gradient(90deg, #f97316, #fbbf24)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>ROUTE</span>
            </div>
            {!isSmall && (
              <div style={{
                color: '#475569',
                fontSize: isMobile ? 7 : 8,
                fontFamily: '"Share Tech Mono", monospace',
                letterSpacing: '0.22em',
                marginTop: 3,
                whiteSpace: 'nowrap',
              }}>
                DISASTER PATHFINDING SYSTEM
              </div>
            )}
          </div>
        </div>

        {/* Status badges */}
        {!isSmall && (
          <StatusBadge color="#ef4444" label={isMobile ? 'EMERGENCY' : 'EMERGENCY ACTIVE'} pulse />
        )}
        {!isMobile && <StatusBadge color="#f59e0b" label="4 ALGORITHMS READY" />}
        <StatusBadge
          color="#22d3ee"
          label={
            loadState === 'loaded'  ? 'OSM LIVE'   :
            loadState === 'loading' ? 'LOADING…'   : 'OSM ERR'
          }
        />

        <div style={{ flex: 1 }} />

        {!isMobile && (
          <>
            <div style={{
              color: '#22d3ee',
              fontSize: 15,
              fontFamily: '"Share Tech Mono", monospace',
              letterSpacing: '0.12em',
              textShadow: '0 0 14px rgba(34,211,238,0.6)',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {time.toLocaleTimeString('en-IN', { hour12: false })}
            </div>
            <div style={{
              color: '#334155',
              fontSize: 9,
              fontFamily: '"Share Tech Mono", monospace',
              letterSpacing: '0.08em',
            }}>
              DIJKSTRA · A* · BFS · BELLMAN-FORD
            </div>
          </>
        )}
      </header>

      {/* ── Loading status bar — shown while fetching OSM data ── */}
      {loadState === 'loading' && statusMsg && (
        <div style={{
          background: 'rgba(34,211,238,0.07)',
          borderBottom: '1px solid rgba(34,211,238,0.15)',
          padding: '5px 22px',
          color: '#22d3ee',
          fontSize: 11,
          fontFamily: '"Share Tech Mono", monospace',
          letterSpacing: '0.1em',
          flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>◌</span>
          {statusMsg}
        </div>
      )}

      {/* ── Main body ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

        {/* Map + bottom panels column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

          {/* FIX: Map container must have position:relative and an explicit height
              so Leaflet can measure it. Using flex:1 alone on a flex child with
              minHeight:0 means the computed height can be 0 before layout
              settles — Leaflet initialises with a 0×0 viewport and renders
              nothing. Adding position:relative satisfies Leaflet's internal
              getBoundingClientRect check. */}
          <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', position: 'relative' }}>
            <MapCanvas
              ref={mapRef}
              graphNodes={graphNodes}
              snapToNearest={snapToNearest}
              onNodeClick={handleNodeClick}
              placingMode={placingMode}
              nodeCount={nodeCount}
              edgeCount={edgeCount}
              loadState={loadState}
              errorMsg={errorMsg}
              highlightedAlgo={highlightedAlgo}
              isMobile={isMobile}
            />
          </div>

          <ComplexityPanel results={results} ALGORITHMS={ALGORITHMS} />
          <ScenarioToolbar
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            onReset={handleReset}
            onRun={handleRun}
            onClear={handleClear}
            onRetry={forceReload}
            isRunning={isRunning}
            loadState={loadState}
            isMobile={isMobile}
          />
        </div>

        {/* Algo panel — sidebar on desktop */}
        {!isMobile && (
          <AlgoRacePanel
            ALGORITHMS={ALGORITHMS}
            results={results}
            animationProgress={animationProgress}
            isRunning={isRunning}
            highlightedAlgo={highlightedAlgo}
            setHighlightedAlgo={setHighlightedAlgo}
          />
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,300;0,400;0,600;0,700;0,800;1,700;1,800&family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&display=swap');
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { opacity:0; transform: translateX(24px); } to { opacity:1; transform: translateX(0); } }
        @keyframes glow-pulse { 0%,100%{box-shadow:0 0 12px rgba(239,68,68,0.4)} 50%{box-shadow:0 0 28px rgba(239,68,68,0.8)} }
        * { box-sizing: border-box; }
        body { margin: 0; overflow: hidden; height: 100dvh; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(239,68,68,0.25); border-radius: 2px; }
        .leaflet-container { background: #060c18; }

        /*
         * FIX: brightness(0.28) made map tiles nearly invisible (solid black).
         * 0.65 keeps the dark cyberpunk aesthetic while keeping roads readable.
         * If tiles still look too dark/bright, tweak this one value.
         */
        .leaflet-tile {
          filter: brightness(0.65) saturate(0.3) hue-rotate(205deg);
        }

        .leaflet-control-attribution { background: rgba(0,0,0,0.75)!important; color:#334155!important; font-size:9px!important; }
        .leaflet-control-attribution a { color:#475569!important; }
        .leaflet-control-zoom a {
          background: rgba(6,10,20,0.92)!important;
          color: #64748b!important;
          border-color: rgba(255,255,255,0.07)!important;
          font-family: "Exo 2", sans-serif!important;
          backdrop-filter: blur(10px);
          transition: all 0.15s;
        }
        .leaflet-control-zoom a:hover {
          background: rgba(239,68,68,0.15)!important;
          color: #ef4444!important;
          border-color: rgba(239,68,68,0.3)!important;
        }
        @media (max-width: 768px) {
          .leaflet-control-zoom a { width:28px!important; height:28px!important; line-height:28px!important; font-size:14px!important; }
          .leaflet-control-attribution { font-size:8px!important; }
        }
        @media (max-width: 480px) {
          .leaflet-control-zoom { display:none; }
        }
      `}</style>
    </div>

    {/* Mobile overlay panel */}
    {isMobile && showMobilePanel && (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(6px)',
        display: 'flex', justifyContent: 'flex-end',
      }} onClick={() => setShowMobilePanel(false)}>
        <div style={{
          width: 'min(340px, 90vw)', height: '100%',
          background: 'rgba(4,8,18,0.97)',
          borderLeft: '1px solid rgba(239,68,68,0.15)',
          overflowY: 'auto',
          animation: 'slideIn 0.2s cubic-bezier(0.16,1,0.3,1)',
        }} onClick={e => e.stopPropagation()}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 14px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(239,68,68,0.06)',
          }}>
            <span style={{ color: '#ef4444', fontSize: 11, fontFamily: '"Share Tech Mono", monospace', letterSpacing: '0.15em' }}>
              ALGO RACE PANEL
            </span>
            <button onClick={() => setShowMobilePanel(false)} style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#94a3b8', borderRadius: 6, padding: '4px 12px',
              cursor: 'pointer', fontSize: 12, fontFamily: '"Exo 2", sans-serif', fontWeight: 600,
            }}>✕</button>
          </div>
          <AlgoRacePanel
            ALGORITHMS={ALGORITHMS}
            results={results}
            animationProgress={animationProgress}
            isRunning={isRunning}
            highlightedAlgo={highlightedAlgo}
            setHighlightedAlgo={setHighlightedAlgo}
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            isMobile={isMobile}
          />
        </div>
      </div>
    )}

    {isMobile && (
      <DraggableFAB
        onToggle={() => setShowMobilePanel(p => !p)}
        showPanel={showMobilePanel}
        hasResults={Object.keys(results).length > 0}
      />
    )}
  </>);
}

/* ── Draggable FAB ──────────────────────────────────────── */
function DraggableFAB({ onToggle, showPanel, hasResults }) {
  const [pos, setPos] = useState(() => ({
    x: window.innerWidth - 64,
    y: window.innerHeight - 120,
  }));
  const posRef      = useRef(pos);
  const dragging    = useRef(false);
  const dragStart   = useRef(null);
  const posAtStart  = useRef(null);

  useEffect(() => { posRef.current = pos; }, [pos]);

  const onPointerDown = useCallback((e) => {
    e.preventDefault();
    e.target.setPointerCapture(e.pointerId);
    dragStart.current  = { x: e.clientX, y: e.clientY };
    posAtStart.current = { ...posRef.current };
    dragging.current   = false;
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) dragging.current = true;
    setPos({
      x: Math.max(8, Math.min(window.innerWidth  - 56, posAtStart.current.x + dx)),
      y: Math.max(8, Math.min(window.innerHeight - 56, posAtStart.current.y + dy)),
    });
  }, []);

  const onPointerUp = useCallback(() => {
    if (!dragging.current) onToggle();
    dragStart.current = null;
  }, [onToggle]);

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        position: 'fixed',
        left: pos.x, top: pos.y,
        zIndex: 800,
        width: 50, height: 50, borderRadius: '50%',
        background: showPanel
          ? 'linear-gradient(135deg, #1e293b, #334155)'
          : hasResults
          ? 'linear-gradient(135deg, #dc2626, #f97316)'
          : 'linear-gradient(135deg, #dc2626, #ef4444)',
        color: '#fff', fontSize: 20,
        cursor: 'grab',
        boxShadow: showPanel
          ? '0 4px 20px rgba(0,0,0,0.6)'
          : hasResults
          ? '0 4px 24px rgba(239,68,68,0.7), 0 0 0 3px rgba(239,68,68,0.25), 0 0 0 6px rgba(239,68,68,0.08)'
          : '0 4px 20px rgba(220,38,38,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        userSelect: 'none', touchAction: 'none',
        transition: 'box-shadow 0.3s, background 0.3s',
        animation: (!showPanel && hasResults) ? 'glow-pulse 2s infinite' : 'none',
      }}
    >
      {showPanel ? '✕' : '📊'}
    </div>
  );
}

/* ── Status Badge ──────────────────────────────────────── */
function StatusBadge({ color, label, pulse }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 5,
      background: `${color}10`,
      border: `1px solid ${color}25`,
      borderRadius: 5, padding: '3px 8px',
      flexShrink: 0,
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{
        width: 5, height: 5, borderRadius: '50%',
        background: color,
        boxShadow: `0 0 6px ${color}, 0 0 12px ${color}60`,
        animation: pulse ? 'pulse 1.4s infinite' : 'none',
        flexShrink: 0,
      }} />
      <span style={{
        color, fontSize: 9,
        fontFamily: '"Share Tech Mono", monospace',
        letterSpacing: '0.1em',
        whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
    </div>
  );
}