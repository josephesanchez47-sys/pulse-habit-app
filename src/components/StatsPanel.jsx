import React from 'react';

export default function StatsPanel({ habits, chartView, setChartView, maxStreak, totalStreaksCombined, isMobile }) {
  const buildPieChartStyle = () => {
    if (totalStreaksCombined === 0) return { background: '#e0e0e0' };
    let currentAngle = 0;
    const colorPalette = ['#ff5722', '#2196f3', '#4caf50', '#9c27b0', '#ffeb3b'];
    const gradientSlices = habits.map((habit, index) => {
      const percentage = (habit.streak / totalStreaksCombined) * 100;
      const nextAngle = currentAngle + (percentage * 3.6);
      const color = colorPalette[index % colorPalette.length];
      const sliceString = `${color} ${currentAngle}deg ${nextAngle}deg`;
      currentAngle = nextAngle;
      return sliceString;
    });
    return {
      background: `conic-gradient(${gradientSlices.join(', ')})`,
      width: isMobile ? '140px' : '180px',
      height: isMobile ? '140px' : '180px',
      borderRadius: '50%',
      margin: '20px auto',
      boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.1)'
    };
  };

  if (habits.length === 0) {
    return (
      <div style={{ backgroundColor: '#ffffff', padding: isMobile ? '15px' : '20px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #e0e0e0' }}>
        <p style={{ color: '#888', fontSize: '14px', margin: '0', textAlign: 'center' }}>No habit data available to chart.</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#ffffff', padding: isMobile ? '15px' : '20px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #e0e0e0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
        <h3 style={{ margin: '0', color: '#333', fontSize: isMobile ? '14px' : '15px' }}>📊 Analytics Display</h3>
        <div style={{ display: 'flex', gap: '4px', backgroundColor: '#eee', padding: '3px', borderRadius: '6px' }}>
          {['bar', 'graph', 'pie'].map((view) => (
            <button
              key={view}
              onClick={() => setChartView(view)}
              style={{
                padding: isMobile ? '6px 10px' : '5px 12px',
                fontSize: '11px',
                textTransform: 'capitalize',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                backgroundColor: chartView === view ? '#fff' : 'transparent',
                color: chartView === view ? '#007bff' : '#666'
              }}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      {chartView === 'bar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {habits.map(habit => {
            const barWidth = maxStreak > 0 ? Math.round((habit.streak / maxStreak) * 100) : 0;
            return (
              <div key={`bar-${habit.id}`} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '75%', color: '#444' }}>{habit.name}</span>
                  <span style={{ fontWeight: 'bold', color: '#ff5722' }}>🔥 {habit.streak}d</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${maxStreak > 0 ? barWidth : 5}%`, height: '100%', backgroundColor: '#ff9800', borderRadius: '4px', transition: 'width 0.4s ease' }}></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {chartView === 'graph' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '10px' }}>
          <div style={{ display: 'flex', height: '100px', alignItems: 'flex-end', justifyContent: 'space-around', borderBottom: '2px solid #ccc', paddingBottom: '5px' }}>
            {habits.map((habit) => {
              const barHeight = maxStreak > 0 ? Math.round((habit.streak / maxStreak) * 100) : 0;
              return (
                <div key={`graph-${habit.id}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', position: 'relative' }}>
                  <div style={{ bottom: `${barHeight}%`, width: '8px', height: '8px', backgroundColor: '#2196f3', borderRadius: '50%', marginBottom: '-4px', zIndex: 2, position: 'absolute' }}></div>
                  <div style={{ height: `${barHeight}px`, width: '2px', backgroundColor: 'rgba(33, 150, 243, 0.2)' }}></div>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '9px', color: '#777' }}>
            {habits.map(habit => (
              <span key={`lbl-${habit.id}`} style={{ width: `${100 / habits.length}%`, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center' }}>
                {habit.name.substring(0, 5)}..
              </span>
            ))}
          </div>
        </div>
      )}

      {chartView === 'pie' && (
        <div style={{ textAlign: 'center' }}>
          {totalStreaksCombined === 0 ? (
            <p style={{ color: '#999', fontSize: '12px', margin: '15px 0' }}>Build up a streak to populate segments!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: isMobile ? '15px' : '30px' }}>
              <div style={buildPieChartStyle()}></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left', width: isMobile ? '100%' : 'auto' }}>
                {habits.map((habit, index) => {
                  const colorPalette = ['#ff5722', '#2196f3', '#4caf50', '#9c27b0', '#ffeb3b'];
                  const sliceColor = colorPalette[index % colorPalette.length];
                  const slicePercentage = Math.round((habit.streak / totalStreaksCombined) * 100);
                  return (
                    <div key={`legend-${habit.id}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: sliceColor, flexShrink: 0 }}></div>
                      <span style={{ color: '#444' }}>{slicePercentage}% - {habit.name.substring(0, 15)}...</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
