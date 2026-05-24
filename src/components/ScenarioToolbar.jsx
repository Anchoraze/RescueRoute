const TOOLS = [
  { id: 'none',  emoji: '🖱',  label: 'Navigate',    title: 'Click map to place START / END points' },
  { id: 'block', emoji: '🧱',  label: 'Block Road',  title: 'Click a road node to block it (impassable)' },
  { id: 'flood', emoji: '🌊',  label: 'Flood (8×)',  title: 'Click a road node to mark as flooded (8× cost)' },
  { id: 'fire',  emoji: '🔥',  label: 'Fire (12×)',  title: 'Click a road node to mark as fire hazard (12× cost)' },
];

export default function ScenarioToolbar({
  activeTool, setActiveTool,
  onReset, onRun, onClear, onRetry,
  isRunning, loadState,
}) {
  return (
    <div style={{
      background: 'rgba(10,15,25,0.97)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      padding: '8px 16px',
      display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap',
    }}>
      <span style={{
        color: '#64748b', fontSize: 10,
        fontFamily: 'Share Tech Mono', letterSpacing: '0.15em',
      }}>
        PAINT OBSTACLES
      </span>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {TOOLS.map(t => {
          const isActive = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              title={t.title}
              style={{
                background: isActive ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isActive ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.12)'}`,
                borderRadius: 6, color: isActive ? '#fff' : '#94a3b8',
                cursor: 'pointer', padding: '5px 10px',
                fontSize: 11, fontFamily: 'Rajdhani', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 5,
                transition: 'all 0.15s',
              }}
            >
              <span>{t.emoji}</span>
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
        {loadState === 'error' && (
          <button
            onClick={onRetry}
            style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 6, color: '#fca5a5', cursor: 'pointer',
              padding: '6px 14px', fontSize: 12, fontFamily: 'Rajdhani', fontWeight: 600,
            }}
          >
            ↺ Retry Load
          </button>
        )}

        <button
          onClick={onClear}
          disabled={isRunning}
          style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 6, color: '#94a3b8', cursor: isRunning ? 'not-allowed' : 'pointer',
            padding: '6px 14px', fontSize: 12, fontFamily: 'Rajdhani', fontWeight: 600,
          }}
        >
          Clear Paths
        </button>

        <button
          onClick={onReset}
          disabled={isRunning}
          style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 6, color: '#94a3b8', cursor: isRunning ? 'not-allowed' : 'pointer',
            padding: '6px 14px', fontSize: 12, fontFamily: 'Rajdhani', fontWeight: 600,
          }}
        >
          Reset Map
        </button>

        <button
          onClick={onRun}
          disabled={isRunning || loadState !== 'loaded'}
          style={{
            background: isRunning
              ? 'rgba(34,197,94,0.1)'
              : loadState !== 'loaded'
              ? 'rgba(255,255,255,0.05)'
              : 'linear-gradient(135deg, #dc2626, #ef4444)',
            border: `1px solid ${isRunning ? 'rgba(34,197,94,0.3)' : loadState !== 'loaded' ? 'rgba(255,255,255,0.15)' : '#dc2626'}`,
            borderRadius: 6, color: loadState !== 'loaded' ? '#475569' : '#fff',
            cursor: (isRunning || loadState !== 'loaded') ? 'not-allowed' : 'pointer',
            padding: '6px 20px', fontSize: 13, fontFamily: 'Rajdhani', fontWeight: 700,
            letterSpacing: '0.05em',
            boxShadow: (!isRunning && loadState === 'loaded') ? '0 0 20px rgba(220,38,38,0.4)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          {isRunning ? '⏳ RUNNING…' : '🚨 FIND ROUTES'}
        </button>
      </div>
    </div>
  );
}
