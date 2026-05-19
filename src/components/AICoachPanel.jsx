import React from 'react';

export default function AICoachPanel({ coachInsight, aiSuggestions, addSuggestedHabit, isMobile }) {
  return (
    <div style={{ 
      backgroundColor: '#f3e5f5', 
      padding: isMobile ? '15px' : '20px', 
      borderRadius: '12px', 
      marginBottom: '15px', 
      border: `1px solid ${coachInsight.moodColor}`,
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: coachInsight.moodColor, fontSize: isMobile ? '14px' : '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        🤖 AI Consistency Coach
      </h3>
      <p style={{ margin: '0 0 12px 0', fontSize: isMobile ? '13px' : '14px', color: '#311b92', lineHeight: '1.5', fontStyle: 'italic' }}>
        "{coachInsight.message}"
      </p>
      <div style={{ backgroundColor: '#ffffff', padding: '10px 12px', borderRadius: '6px', borderLeft: `4px solid ${coachInsight.moodColor}`, marginBottom: '15px' }}>
        <p style={{ margin: '0', fontSize: '11px', color: '#424242', fontWeight: '500' }}>
          {coachInsight.tip}
        </p>
      </div>

      <h4 style={{ margin: '0 0 8px 0', color: '#4a148c', fontSize: '12px', fontWeight: 'bold' }}>✨ Recommended Blueprints:</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {aiSuggestions.map((suggestion, idx) => (
          <div key={`sug-${idx}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.6)', padding: '8px 12px', borderRadius: '6px', gap: '10px' }}>
            <span style={{ fontSize: '11px', color: '#4a148c', fontWeight: '500' }}>{suggestion.name}</span>
            <button
              onClick={() => addSuggestedHabit(suggestion.name)}
              style={{
                padding: '6px 10px',
                fontSize: '11px',
                backgroundColor: '#673ab7',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              + Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
