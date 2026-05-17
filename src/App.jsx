import React, { useState, useEffect } from 'react';

function App() {
  // 1. Load habits from localStorage on startup. If none exist, use the default list.
  const [habits, setHabits] = useState(() => {
    const savedHabits = localStorage.getItem('habit_pulse_data');
    return savedHabits ? JSON.parse(savedHabits) : [
      { id: 1, name: 'Drink 8 glasses of water', completed: false, streak: 0 },
      { id: 2, name: 'Go to the gym', completed: false, streak: 0 }
    ];
  });

  const [newHabitName, setNewHabitName] = useState('');

  // 2. Automatically save habits to localStorage whenever the list changes
  useEffect(() => {
    localStorage.setItem('habit_pulse_data', JSON.stringify(habits));
  }, [habits]);

  // CALCULATE STATS FOR THE SCOREBOARD
  const totalHabits = habits.length;
  const completedHabits = habits.filter(h => h.completed).length;
  const completionPercentage = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

  const addHabit = (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const newHabit = {
      id: Date.now(),
      name: newHabitName,
      completed: false,
      streak: 0 // New habits start fresh at 0!
    };

    setHabits([...habits, newHabit]);
    setNewHabitName('');
  };

  const toggleHabit = (id) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        return { 
          ...habit, 
          completed: !habit.completed,
          streak: !habit.completed ? habit.streak + 1 : habit.streak - 1
        };
      }
      return habit;
    }));
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '550px', margin: '0 auto' }}>
      <h1 style={{ color: '#333', textAlign: 'center', marginBottom: '5px' }}>Habit Pulse ⚡</h1>
      <p style={{ color: '#666', textAlign: 'center', marginTop: '0' }}>Track your daily consistency and build your streaks!</p>
      
      {/* NEW FEATURE: Dynamic Scoreboard Progress Bar */}
      <div style={{ backgroundColor: '#f0f4f8', padding: '20px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #d0e1fd' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontWeight: 'bold', color: '#1a73e8' }}>Today's Progress</span>
          <span style={{ fontWeight: 'bold', color: '#1a73e8' }}>{completionPercentage}%</span>
        </div>
        <div style={{ width: '100%', height: '12px', backgroundColor: '#e0e0e0', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ width: `${completionPercentage}%`, height: '100%', backgroundColor: '#1a73e8', transition: 'width 0.3s ease' }}></div>
        </div>
        <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#5f6368', textAlign: 'center' }}>
          {completedHabits} of {totalHabits} habits completed today
        </p>
      </div>

      <form onSubmit={addHabit} style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
        <input 
          type="text" 
          placeholder="Create a new habit (e.g., Meditate)..." 
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '14px'
          }}
        />
        <button 
          type="submit"
          style={{
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Add
        </button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {habits.map(habit => (
          <div 
            key={habit.id} 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '18px', // Slightly larger padding for a premium feel
              borderRadius: '8px', 
              backgroundColor: habit.completed ? '#e6f4ea' : '#f9f9f9',
              border: habit.completed ? '1px solid #137333' : '1px solid #ddd',
              gap: '20px' // FIXED: Guarantees a wide gap between text and buttons
            }}
          >
            {/* FIXED: 'flex: 1' ensures text takes up left space and wraps nicely if long, instead of bumping buttons */}
            <div style={{ flex: 1, minWidth: '0' }}>
              <h3 style={{ 
                margin: '0 0 8px 0', 
                textDecoration: habit.completed ? 'line-through' : 'none', 
                color: habit.completed ? '#137333' : '#333',
                wordBreak: 'break-word',
                fontSize: '17px'
              }}>
                {habit.name}
              </h3>
              <span style={{ fontSize: '12px', color: '#666', backgroundColor: '#eee', padding: '3px 8px', borderRadius: '4px', fontWeight: '500' }}>
                🔥 {habit.streak} day streak
              </span>
            </div>
            
            {/* FIXED: 'flexShrink: 0' forces the controls container to keep its size and never get squished */}
            <div style={{ display: 'flex', gap: '10px', flexShrink: 0, alignItems: 'center' }}>
              <button 
                onClick={() => toggleHabit(habit.id)}
                style={{
                  padding: '10px 20px', // FIXED: Wider, more comfortable button size
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: habit.completed ? '#137333' : '#007bff',
                  color: 'white',
                  fontWeight: 'bold',
                  minWidth: '105px', // FIXED: Forces uniform button width so layout stays rock solid
                  textAlign: 'center'
                }}
              >
                {habit.completed ? 'Done ✓' : 'Complete'}
              </button>

              <button 
                onClick={() => deleteHabit(habit.id)}
                style={{
                  padding: '10px 14px',
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
        ))}
      </div>
    </div>
  );
}

export default App;