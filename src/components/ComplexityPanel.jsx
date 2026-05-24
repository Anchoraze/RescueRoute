export default function ComplexityPanel({ results, ALGORITHMS }) {
  return (
    <div style={{
      background: 'rgba(8,12,22,0.98)',
      borderTop: '1px solid rgba(255,255,255,0.07)',
      padding: '8px 16px',
      display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap',
    }}>
      {/* Obstacle legend */}
      <div>
        <div style={{ color: '#475569', fontSize: 9, fontFamily: 'Share Tech Mono', letterSpacing: '0.15em', marginBottom: 4 }}>
          OBSTACLE LEGEND
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <LegendItem color="rgba(250,204,21,0.7)" border="rgba(250,204,21,1)" label="🚑 Rescue Team (START)" />
          <LegendItem color="rgba(168,85,247,0.7)"  border="rgba(168,85,247,1)"  label="🏥 Hospital (END)" />
          <LegendItem color="rgba(239,68,68,0.6)"   border="rgba(239,68,68,0.9)" label="🧱 Blocked (∞)" />
          <LegendItem color="rgba(59,130,246,0.6)"  border="rgba(59,130,246,0.9)" label="🌊 Flooded (8×)" />
          <LegendItem color="rgba(249,115,22,0.6)"  border="rgba(249,115,22,0.9)" label="🔥 Fire (12×)" />
        </div>
      </div>

      {/* Path colour key — only when results exist */}
      {Object.keys(results).length > 0 && (
        <div style={{ marginLeft: 'auto' }}>
          <div style={{ color: '#475569', fontSize: 9, fontFamily: 'Share Tech Mono', letterSpacing: '0.15em', marginBottom: 4 }}>
            PATH COLORS
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            {ALGORITHMS.map(algo => (
              <div key={algo.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: 24, height: 3, borderRadius: 2,
                  background: algo.color, boxShadow: `0 0 5px ${algo.color}`,
                  ...(algo.id === 'bfs'         ? { backgroundImage: `repeating-linear-gradient(90deg,${algo.color} 0 6px,transparent 6px 10px)` } : {}),
                  ...(algo.id === 'bellmanford' ? { backgroundImage: `repeating-linear-gradient(90deg,${algo.color} 0 3px,transparent 3px 7px)` }  : {}),
                }} />
                <span style={{ color: '#64748b', fontSize: 10, fontFamily: 'Share Tech Mono' }}>{algo.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LegendItem({ color, border, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <div style={{ width: 12, height: 12, borderRadius: 2, background: color, border: `1px solid ${border}` }} />
      <span style={{ color: '#64748b', fontSize: 10, fontFamily: 'Share Tech Mono' }}>{label}</span>
    </div>
  );
}
