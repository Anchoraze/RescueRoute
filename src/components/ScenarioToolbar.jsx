const TOOLS = [
  { id: 'none',  emoji: '🖱',  label: 'Navigate',   title: 'Click map to place START / END points' },
  { id: 'block', emoji: '🧱',  label: 'Block Road', title: 'Click a road node to block it (impassable)' },
  { id: 'flood', emoji: '🌊',  label: 'Flood (8×)', title: 'Click a road node to mark as flooded (8× cost)' },
  { id: 'fire',  emoji: '🔥',  label: 'Fire (12×)', title: 'Click a road node to mark as fire hazard (12× cost)' },
];

const TOOL_COLORS = {
  none:  { active: 'rgba(34,211,238,0.12)',  border: 'rgba(34,211,238,0.45)',  text: '#22d3ee',  glow: 'rgba(34,211,238,0.25)'  },
  block: { active: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.45)',   text: '#ef4444',  glow: 'rgba(239,68,68,0.25)'   },
  flood: { active: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.45)',  text: '#60a5fa',  glow: 'rgba(59,130,246,0.25)'  },
  fire:  { active: 'rgba(249,115,22,0.12)',  border: 'rgba(249,115,22,0.45)',  text: '#fb923c',  glow: 'rgba(249,115,22,0.25)'  },
};

export default function ScenarioToolbar({
  activeTool, setActiveTool,
  onReset, onRun, onClear, onRetry,
  isRunning, loadState, isMobile,
}) {
  const baseStyle = {
    background: 'rgba(3,6,14,0.88)',
    backdropFilter: 'blur(20px) saturate(1.5)',
    WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    boxShadow:
      'inset 0 1px 0 rgba(255,255,255,0.03),' +
      'inset 0 -1px 0 rgba(0,0,0,0.5),' +
      '0 -1px 20px rgba(0,0,0,0.3)',
    position: 'relative', overflow: 'hidden',
  };

  if (isMobile) {
    return (
      <div style={{ ...baseStyle, display: 'flex', flexDirection: 'column' }}>
        {/* Top line gradient */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent)',
          pointerEvents: 'none',
        }} />

        {/* Row 1: tool buttons */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '7px 10px 5px',
          overflowX: 'auto', flexShrink: 0,
        }}>
          <span style={{
            color: '#1e3a4a', fontSize: 8,
            fontFamily: '"Share Tech Mono", monospace',
            letterSpacing: '0.18em', whiteSpace: 'nowrap', flexShrink: 0,
          }}>OBSTACLES</span>
          {TOOLS.map(t => {
            const isActive = activeTool === t.id;
            const tc = TOOL_COLORS[t.id];
            return (
              <button
                key={t.id}
                onClick={() => setActiveTool(t.id)}
                title={t.title}
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, ${tc.active}, rgba(0,0,0,0.2))`
                    : 'rgba(255,255,255,0.025)',
                  border: `1px solid ${isActive ? tc.border : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 8,
                  color: isActive ? tc.text : '#334155',
                  cursor: 'pointer',
                  padding: '5px 9px',
                  fontSize: 11,
                  fontFamily: '"Exo 2", sans-serif',
                  fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 4,
                  whiteSpace: 'nowrap', flexShrink: 0,
                  boxShadow: isActive
                    ? `0 0 16px ${tc.glow}, inset 0 1px 0 rgba(255,255,255,0.06)`
                    : 'inset 0 1px 0 rgba(255,255,255,0.02)',
                }}
              >
                <span style={{ fontSize: 12 }}>{t.emoji}</span>
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Row 2: action buttons + big Find Routes */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 10px 8px',
        }}>
          {loadState === 'error' && (
            <button onClick={onRetry} style={{
              background: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(239,68,68,0.05))',
              border: '1px solid rgba(239,68,68,0.28)',
              borderRadius: 8, color: '#fca5a5', cursor: 'pointer',
              padding: '6px 10px', fontSize: 10,
              fontFamily: '"Exo 2", sans-serif', fontWeight: 600,
              flexShrink: 0,
            }}>↺ Retry</button>
          )}
          <GhostButton onClick={onClear} disabled={isRunning} label="Clear" />
          <GhostButton onClick={onReset} disabled={isRunning} label="Reset" />

          {/* Find Routes — full width remaining */}
          <button
            onClick={onRun}
            disabled={isRunning || loadState !== 'loaded'}
            style={{
              flex: 1,
              background: isRunning
                ? 'rgba(34,197,94,0.08)'
                : loadState !== 'loaded'
                ? 'rgba(255,255,255,0.03)'
                : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 40%, #f97316 100%)',
              border: isRunning
                ? '1px solid rgba(34,197,94,0.25)'
                : loadState !== 'loaded'
                ? '1px solid rgba(255,255,255,0.08)'
                : '1px solid rgba(220,38,38,0.4)',
              borderRadius: 8,
              color: loadState !== 'loaded' ? '#1e293b' : '#fff',
              cursor: (isRunning || loadState !== 'loaded') ? 'not-allowed' : 'pointer',
              padding: '8px 12px',
              fontSize: 13,
              fontFamily: '"Exo 2", sans-serif',
              fontWeight: 800,
              letterSpacing: '0.08em',
              boxShadow: (!isRunning && loadState === 'loaded')
                ? '0 0 24px rgba(220,38,38,0.45), 0 0 48px rgba(220,38,38,0.18)'
                : 'none',
              opacity: (isRunning || loadState !== 'loaded') ? 0.55 : 1,
              position: 'relative', overflow: 'hidden',
            }}
          >
            {isRunning ? '⏳ RUNNING…' : '🚨 FIND ROUTES'}
          </button>
        </div>
      </div>
    );
  }

  // ── Desktop layout (unchanged) ────────────────────────────
  return (
    <div style={{
      ...baseStyle,
      padding: '8px 14px',
      display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent)',
        pointerEvents: 'none',
      }} />

      <span style={{
        color: '#1e3a4a', fontSize: 9,
        fontFamily: '"Share Tech Mono", monospace',
        letterSpacing: '0.22em', whiteSpace: 'nowrap',
      }}>PAINT OBSTACLES</span>

      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {TOOLS.map(t => {
          const isActive = activeTool === t.id;
          const tc = TOOL_COLORS[t.id];
          return (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              title={t.title}
              style={{
                background: isActive
                  ? `linear-gradient(135deg, ${tc.active}, rgba(0,0,0,0.2))`
                  : 'rgba(255,255,255,0.025)',
                border: `1px solid ${isActive ? tc.border : 'rgba(255,255,255,0.06)'}`,
                borderRadius: 8,
                color: isActive ? tc.text : '#334155',
                cursor: 'pointer',
                padding: '5px 11px',
                fontSize: 11,
                fontFamily: '"Exo 2", sans-serif',
                fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 5,
                transition: 'all 0.15s cubic-bezier(0.16,1,0.3,1)',
                letterSpacing: '0.04em',
                backdropFilter: 'blur(8px)',
                boxShadow: isActive
                  ? `0 0 16px ${tc.glow}, inset 0 1px 0 rgba(255,255,255,0.06)`
                  : 'inset 0 1px 0 rgba(255,255,255,0.02)',
              }}
            >
              <span style={{ fontSize: 12 }}>{t.emoji}</span>
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', gap: 7, alignItems: 'center' }}>
        {loadState === 'error' && (
          <button onClick={onRetry} style={{
            background: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(239,68,68,0.05))',
            border: '1px solid rgba(239,68,68,0.28)',
            borderRadius: 8, color: '#fca5a5', cursor: 'pointer',
            padding: '6px 14px', fontSize: 11,
            fontFamily: '"Exo 2", sans-serif', fontWeight: 600,
            letterSpacing: '0.04em', backdropFilter: 'blur(8px)',
          }}>↺ Retry Load</button>
        )}

        <GhostButton onClick={onClear} disabled={isRunning} label="Clear Paths" />
        <GhostButton onClick={onReset} disabled={isRunning} label="Reset Map" />

        <button
          onClick={onRun}
          disabled={isRunning || loadState !== 'loaded'}
          style={{
            background: isRunning
              ? 'rgba(34,197,94,0.08)'
              : loadState !== 'loaded'
              ? 'rgba(255,255,255,0.03)'
              : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 40%, #f97316 100%)',
            border: isRunning
              ? '1px solid rgba(34,197,94,0.25)'
              : loadState !== 'loaded'
              ? '1px solid rgba(255,255,255,0.08)'
              : '1px solid rgba(220,38,38,0.4)',
            borderRadius: 8,
            color: loadState !== 'loaded' ? '#1e293b' : '#fff',
            cursor: (isRunning || loadState !== 'loaded') ? 'not-allowed' : 'pointer',
            padding: '6px 20px',
            fontSize: 12,
            fontFamily: '"Exo 2", sans-serif',
            fontWeight: 800,
            letterSpacing: '0.1em',
            backdropFilter: 'blur(8px)',
            boxShadow: (!isRunning && loadState === 'loaded')
              ? '0 0 24px rgba(220,38,38,0.45), 0 0 48px rgba(220,38,38,0.18), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.2)'
              : 'none',
            transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
            opacity: (isRunning || loadState !== 'loaded') ? 0.55 : 1,
            position: 'relative', overflow: 'hidden',
          }}
        >
          {!isRunning && loadState === 'loaded' && (
            <div style={{
              position: 'absolute', top: 0, left: '-20%', right: '-20%', height: '50%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)',
              borderRadius: '0 0 50% 50%', pointerEvents: 'none',
            }} />
          )}
          {isRunning ? '⏳ RUNNING…' : '🚨 FIND ROUTES'}
        </button>
      </div>
    </div>
  );
}

function GhostButton({ onClick, disabled, label }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 8, color: '#334155',
        cursor: disabled ? 'not-allowed' : 'pointer',
        padding: '6px 10px', fontSize: 11,
        fontFamily: '"Exo 2", sans-serif', fontWeight: 600,
        letterSpacing: '0.04em',
        opacity: disabled ? 0.4 : 1,
        transition: 'all 0.15s',
        backdropFilter: 'blur(8px)',
        whiteSpace: 'nowrap', flexShrink: 0,
      }}
    >
      {label}
    </button>
  );
}