export default function AlgoRacePanel({ ALGORITHMS, results, animationProgress, isRunning, highlightedAlgo, setHighlightedAlgo }) {
  return (
    <div style={{
      width: '280px',
      minWidth: '280px',
      background: 'rgba(4,7,16,0.75)',
      backdropFilter: 'blur(24px) saturate(1.6)',
      WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
      borderLeft: '1px solid rgba(255,255,255,0.05)',
      padding: '14px 11px',
      display: 'flex',
      flexDirection: 'column',
      gap: '7px',
      overflowY: 'auto',
      position: 'relative',
      boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.03), inset -1px 0 0 rgba(0,0,0,0.4)',
    }}>
      {/* Ambient red glow top-right */}
      <div style={{
        position: 'absolute', top: -40, right: -20,
        width: 160, height: 160, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        paddingBottom: '10px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        marginBottom: '2px',
        position: 'relative',
      }}>
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: isRunning
            ? 'radial-gradient(circle, #ff6b6b, #ef4444)'
            : '#ef4444',
          boxShadow: isRunning
            ? '0 0 12px #ef4444, 0 0 24px rgba(239,68,68,0.5)'
            : '0 0 8px rgba(239,68,68,0.7)',
          animation: isRunning ? 'pulse 0.7s infinite' : 'none',
          flexShrink: 0,
        }} />
        <span style={{
          color: '#94a3b8',
          fontSize: '10px',
          fontFamily: '"Share Tech Mono", monospace',
          letterSpacing: '0.2em',
          fontWeight: 400,
        }}>
          ALGO RACE
        </span>
        {isRunning && (
          <span style={{
            marginLeft: 'auto',
            color: '#ef4444',
            fontSize: '9px',
            fontFamily: '"Share Tech Mono", monospace',
            letterSpacing: '0.1em',
            fontWeight: 700,
          }}>● LIVE</span>
        )}
      </div>

      {/* ── Algorithm cards ── */}
      {ALGORITHMS.map(algo => {
        const result   = results[algo.id];
        const progress = animationProgress[algo.id] || 0;
        const hasResult = !!result;
        const found     = result?.found;
        const isHL      = highlightedAlgo === algo.id;

        return (
          <div
            key={algo.id}
            onClick={() => setHighlightedAlgo(prev => prev === algo.id ? null : algo.id)}
            style={{
              cursor: 'pointer',
              background: isHL
                ? `linear-gradient(145deg, ${algo.color}14 0%, ${algo.color}06 60%, rgba(0,0,0,0.3) 100%)`
                : 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.2) 100%)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: isHL
                ? `1px solid ${algo.color}45`
                : hasResult
                ? `1px solid ${algo.color}30`
                : '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '11px 10px',
              transition: 'all 0.22s cubic-bezier(0.16,1,0.3,1)',
              boxShadow: isHL
                ? `0 4px 32px ${algo.color}18, 0 0 0 1px ${algo.color}12, inset 0 1px 0 rgba(255,255,255,0.06)`
                : 'inset 0 1px 0 rgba(255,255,255,0.04), 0 1px 0 rgba(0,0,0,0.3)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top shimmer line on highlight */}
            {isHL && (
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                background: `linear-gradient(90deg, transparent 0%, ${algo.color}90 30%, ${algo.color} 50%, ${algo.color}90 70%, transparent 100%)`,
              }} />
            )}
            {/* Left accent bar */}
            <div style={{
              position: 'absolute', top: '20%', left: 0, width: '2px', height: '60%',
              background: isHL
                ? `linear-gradient(180deg, transparent, ${algo.color}, transparent)`
                : `linear-gradient(180deg, transparent, ${algo.color}60, transparent)`,
              borderRadius: '0 2px 2px 0',
              transition: 'all 0.22s',
            }} />

            {/* Card header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Algo color dot */}
                <div style={{
                  width: '9px', height: '9px', borderRadius: '50%',
                  background: `radial-gradient(circle at 35% 35%, ${algo.color}ff, ${algo.color}88)`,
                  boxShadow: hasResult
                    ? `0 0 10px ${algo.color}, 0 0 20px ${algo.color}60, 0 0 40px ${algo.color}20`
                    : `0 0 6px ${algo.color}80`,
                  flexShrink: 0,
                  transition: 'box-shadow 0.3s',
                }} />
                {/*
                  FIX: was using WebkitTextFillColor:transparent + dark gradient (#94a3b8→#64748b)
                  which made text near-invisible on the dark panel background.
                  Now uses a plain solid color: bright when highlighted, clearly visible when not.
                */}
                <span style={{
                  fontSize: '13px',
                  fontFamily: '"Exo 2", sans-serif',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  color: isHL ? '#f1f5f9' : '#94a3b8',
                  transition: 'color 0.22s',
                }}>
                  {algo.name}
                </span>
              </div>
              {hasResult && (
                <span style={{
                  fontSize: '8px',
                  color: found ? '#4ade80' : '#ef4444',
                  fontFamily: '"Share Tech Mono", monospace',
                  background: found
                    ? 'linear-gradient(135deg, rgba(74,222,128,0.12), rgba(74,222,128,0.05))'
                    : 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.05))',
                  border: `1px solid ${found ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.3)'}`,
                  borderRadius: '5px',
                  padding: '2px 6px',
                  letterSpacing: '0.06em',
                  backdropFilter: 'blur(4px)',
                }}>
                  {found ? '✓ FOUND' : '✗ NO PATH'}
                </span>
              )}
            </div>

            {/* Progress bar */}
            {(isRunning || hasResult) && (
              <div style={{
                height: '2px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '2px',
                marginBottom: '9px',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${algo.color}66, ${algo.color}ff)`,
                  borderRadius: '2px',
                  transition: 'width 0.12s ease',
                  boxShadow: `0 0 10px ${algo.color}`,
                }} />
              </div>
            )}

            {/* Stats */}
            {hasResult ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <StatRow label="Nodes explored" value={result.nodesExplored} color={algo.color} />
                <StatRow label="Path length"    value={found ? result.pathLength : '—'} color={algo.color} />
                <StatRow label="Path cost"      value={found ? (result.cost === Infinity ? '∞' : result.cost.toFixed(1)) : '—'} color={algo.color} />
                <StatRow label="Time"           value={`${result.timeMs}ms`} color={algo.color} highlight />
              </div>
            ) : (
              <div style={{
                color: '#475569',
                fontSize: '10px',
                fontFamily: '"Share Tech Mono", monospace',
                letterSpacing: '0.05em',
              }}>
                {isRunning && progress > 0 ? `${progress}% scanned…` : 'Awaiting start…'}
              </div>
            )}

            {/* Complexity footer */}
            <div style={{
              marginTop: '9px',
              paddingTop: '7px',
              borderTop: '1px solid rgba(255,255,255,0.04)',
              display: 'flex', gap: '10px',
            }}>
              <ComplexBadge label="T" value={algo.timeComplexity} color={algo.color} />
              <ComplexBadge label="S" value={algo.spaceComplexity} color={algo.color} />
            </div>
          </div>
        );
      })}

      {Object.keys(results).length === 4 && (
        <WinnerSummary results={results} ALGORITHMS={ALGORITHMS} />
      )}
    </div>
  );
}

/* ── Stat Row ── */
function StatRow({ label, value, color, highlight }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ color: '#475569', fontSize: '10px', fontFamily: '"Share Tech Mono", monospace' }}>{label}</span>
      <span style={{
        color: highlight ? color : '#94a3b8',
        fontSize: '11px',
        fontFamily: '"Share Tech Mono", monospace',
        fontWeight: 600,
        textShadow: highlight ? `0 0 10px ${color}80` : 'none',
        letterSpacing: '0.04em',
      }}>{value}</span>
    </div>
  );
}

/* ── Complexity Badge ── */
function ComplexBadge({ label, value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <span style={{
        color: `${color}80`,
        fontSize: '8px',
        fontFamily: '"Share Tech Mono", monospace',
        letterSpacing: '0.1em',
      }}>{label}:</span>
      <span style={{
        color: '#475569',
        fontSize: '9px',
        fontFamily: '"Share Tech Mono", monospace',
        letterSpacing: '0.04em',
      }}>{value}</span>
    </div>
  );
}

/* ── Winner Summary ── */
function WinnerSummary({ results, ALGORITHMS }) {
  const found = ALGORITHMS.filter(a => results[a.id]?.found);
  if (found.length === 0) return null;

  const fastest = found.reduce((a, b) => results[a.id].timeMs          < results[b.id].timeMs          ? a : b);
  const fewest  = found.reduce((a, b) => results[a.id].nodesExplored   < results[b.id].nodesExplored   ? a : b);
  const optimal = found.reduce((a, b) => results[a.id].cost            < results[b.id].cost            ? a : b);

  return (
    <div style={{
      background: 'linear-gradient(145deg, rgba(250,204,21,0.07) 0%, rgba(0,0,0,0.3) 100%)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(250,204,21,0.2)',
      borderRadius: '12px',
      padding: '12px 10px',
      boxShadow:
        '0 4px 32px rgba(250,204,21,0.08), inset 0 1px 0 rgba(255,255,255,0.05),' +
        'inset 0 -1px 0 rgba(0,0,0,0.3)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(250,204,21,0.7), rgba(251,146,60,0.4), transparent)',
      }} />
      <div style={{
        fontSize: '10px',
        fontFamily: '"Share Tech Mono", monospace',
        marginBottom: '9px',
        letterSpacing: '0.18em',
        color: '#facc15',
        fontWeight: 700,
      }}>
        ⚡ VERDICT
      </div>
      <VerdictRow label="Fastest exec" algo={fastest} />
      <VerdictRow label="Fewest nodes" algo={fewest} />
      <VerdictRow label="Lowest cost"  algo={optimal} />
    </div>
  );
}

function VerdictRow({ label, algo }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', alignItems: 'center' }}>
      <span style={{ color: '#475569', fontSize: '10px', fontFamily: '"Share Tech Mono", monospace' }}>{label}</span>
      <span style={{
        fontSize: '11px',
        fontFamily: '"Exo 2", sans-serif',
        fontWeight: 700,
        color: algo.color,
        letterSpacing: '0.04em',
      }}>{algo.name}</span>
    </div>
  );
}