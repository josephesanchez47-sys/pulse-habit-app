import React from 'react';

export default function HabitCard({ habit, toggleHabit, deleteHabit, isMobile }) {
  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row', 
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'stretch' : 'center', 
        padding: isMobile ? '14px' : '18px', 
        borderRadius: '8px', 
        backgroundColor: habit.completed ? '#e6f4ea' : '#f9f9f9',
        border: habit.completed ? '1px solid #137333' : '1px solid #ddd',
        gap: isMobile ? '12px' : '20px' 
      }}
    >
      <div style={{ flex: 1, minWidth: '0' }}>
        <h3 style={{ 
          margin: '0 0 8px 0', 
          textDecoration: habit.completed ? 'line-through' : 'none', 
          color: habit.completed ? '#137333' : '#333',
          wordBreak: 'break-word',
          fontSize: isMobile ? '15px' : '17px'
        }}>
          {habit.name}
        </h3>
        <span style={{ fontSize: '11px', color: '#666', backgroundColor: '#eee', padding: '3px 8px', borderRadius: '4px', fontWeight: '500' }}>
          🔥 {habit.streak} day streak
        </span>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', flexShrink: 0, alignItems: 'center' }}>
        <button 
          onClick={() => toggleHabit(habit.id)}
          style={{
            flex: isMobile ? 1 : 'none',
            padding: '12px 20px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: habit.completed ? '#137333' : '#007bff',
            color: 'white',
            fontWeight: 'bold',
            minWidth: isMobile ? 'auto' : '105px', 
            textAlign: 'center',
            fontSize: '13px'
          }}
        >
          {habit.completed ? 'Done ✓' : 'Complete'}
        </button>

        <button 
          onClick={() => deleteHabit(habit.id)}
          style={{
            padding: '12px 16px',
            borderRadius: '6px',
            border: '1px solid #dc3545',
            cursor: 'pointer',
            backgroundColor: 'transparent',
            color: '#dc3545',
            fontWeight: 'bold'
          }}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
