import React from 'react';

export default function HabitForm({ newHabitName, setNewHabitName, addHabit, isMobile }) {
  return (
    <form onSubmit={addHabit} style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '10px', marginBottom: '25px' }}>
      <input 
        type="text" 
        placeholder="Create a new habit..." 
        value={newHabitName}
        onChange={(e) => setNewHabitName(e.target.value)}
        style={{
          flex: 1,
          padding: '14px 12px',
          borderRadius: '6px',
          border: '1px solid #ccc',
          fontSize: '14px'
        }}
      />
      <button 
        type="submit"
        style={{
          padding: '14px 24px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 'bold',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        Add Habit
      </button>
    </form>
  );
}
