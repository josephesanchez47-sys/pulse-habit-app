import React, { useState, useEffect } from 'react';

function App() {
  // 1. Load habits from localStorage on startup. If none exist, use the default list.
  const [habits, setHabits] = useState(() => {
    const savedHabits = localStorage.getItem('habit_pulse_data');
    return savedHabits ? JSON.parse(savedHabits) : [
      { id: 1, name: 'Drink 8 glasses of water', completed: false, streak: 3 },
      { id: 2, name: 'Go to the gym', completed: false, streak: 5 }
    ];
  });

  const [newHabitName, setNewHabitName] = useState('');
  
  // NEW STATE: Tracks the active chart view choice ('bar', 'graph', 'pie')
  const [chartView, setChartView] = useState('bar');

  // 2. Automatically save habits to localStorage whenever the list changes
  useEffect(() => {
    localStorage.setItem('habit_pulse_data', JSON.stringify(habits));
  }, [habits]);

  // CALCULATE STATS FOR THE SCOREBOARD
  const totalHabits = habits.length;
  const completedHabits = habits.filter(h => h.completed).length;
  const completionPercentage = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

  // CHART MATH LOGIC
  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;
  const totalStreaksCombined = habits.reduce((sum, h) => sum + h.streak, 0);

  // NEW FEATURE: AI SUGGESTED ROUTINES DATA
  const aiSuggestions = [
    { name: '💻 90-Minute Deep Work Block', defaultStreak: 0 },
    { name: '🧘 10-Minute Mindfulness Reset', defaultStreak: 0 },
    { name: '📱 No screens 30 mins before bed', defaultStreak: 0 }
  ];

  const addSuggestedHabit = (name) => {
    // Prevent duplicates
    if (habits.some(h => h.name.toLowerCase() === name.toLowerCase())) return;
    
    const newHabit = {
      id: Date.now(),
      name: name,
      completed: false,
      streak: 0
    };
    setHabits([...habits, newHabit]);
  };

  // CLIENT-SIDE AI BEHAVIORAL COACH ENGINE
  const getAICoachInsight = () => {
    if (totalHabits === 0) {
      return {
        message: "Welcome to your growth journey! My analysis shows your dashboard is clear. Let's establish your foundational routines below.",
        tip: "Actionable Advice: Pick one of my suggested templates below to start building immediate positive momentum!",
        moodColor: '#673ab7'
      };
    }
    if (completionPercentage === 100) {
      return {
        message: `Outstanding performance today! You've achieved a 100% completion rate across all ${totalHabits} routines. Your execution is flawless.`,
        tip: "Actionable Advice: Momentum is a powerful force. Protect this energy and ensure your environment is set up for success again tomorrow.",
        moodColor: '#2e7d32'
      };
    }
    if (completionPercentage >= 50) {
      return {
        message: "Solid progress! You've crossed the halfway mark for today's goals. Your consistency metrics are trending positively.",
        tip: "Actionable Advice: Look at your remaining habits. Can you knock out one more right now to push your progress bar closer to completion?",
        moodColor: '#1565c0'
      };
    }
    return {
      message: "Your habits are active and waiting. Consistency isn't about being perfect; it's about showing up even when you don't feel like it.",
      tip: "Actionable Advice: Choose the easiest habit on your list right now and complete it. Small wins break procrastination cycles instantly.",
      moodColor: '#c62828'
    };
  };

  const coachInsight = getAICoachInsight();

  const addHabit = (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const newHabit = {
      id: Date.now(),
      name: newHabitName,
      completed: false,
      streak: 0
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
          streak: !habit.completed ? habit.streak + 1 : Math.max(0, habit.streak - 1)
        };
      }
      return habit;
    }));
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  // GENERATE PIE CHART STYLING USING CONIC GRADIENTS
  const buildPieChartStyle = () => {
    if (totalStreaksCombined === 0) return { background: '#e0e0e0' };
    
    let currentAngle = 0;
    const colorPalette = ['#ff5722', '#2196f3', '#4caf50', '#9c27b0', '#ffeb3b'];
    
    const gradientSlices = habits.map((habit, index) => {
      const percentage = (habit.streak / totalStreaksCombined) * 100;
      const nextAngle = currentAngle + (percentage * 3.6); // 3.6 degrees per 1%
      const color = colorPalette[index % colorPalette.length];
      const sliceString = `${color} ${currentAngle}deg ${nextAngle}deg`;
      currentAngle = nextAngle;
      return sliceString;
    });

    return {
      background: `conic-gradient(${gradientSlices.join(', ')})`,
      width: '180px',
      height: '180px',
      borderRadius: '50%',
      margin: '20px auto',
      boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.1)'
    };
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '550px', margin: '0 auto' }}>
      <h1 style={{ color: '#333', textAlign: 'center', marginBottom: '5px' }}>Habit Pulse ⚡</h1>
      <p style={{ color: '#666', textAlign: 'center', marginTop: '0' }}>Track your daily consistency and build your streaks!</p>
      
      {/* SCOREBOARD PROGRESS BAR */}
      <div style={{ backgroundColor: '#f0f4f8', padding: '20px', borderRadius: '12px', marginBottom: '15px', border: '1px solid #d0e1fd' }}>
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

      {/* AI COACH INSIGHTS PANEL & DAILY SUGGESTIONS */}
      <div style={{ 
        backgroundColor: '#f3e5f5', 
        padding: '20px', 
        borderRadius: '12px', 
        marginBottom: '15px', 
        border: `1px solid ${coachInsight.moodColor}`,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: coachInsight.moodColor, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🤖 AI Consistency Coach
        </h3>
        <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#311b92', lineHeight: '1.5', fontStyle: 'italic' }}>
          "{coachInsight.message}"
        </p>
        <div style={{ backgroundColor: '#ffffff', padding: '10px 12px', borderRadius: '6px', borderLeft: `4px solid ${coachInsight.moodColor}`, marginBottom: '15px' }}>
          <p style={{ margin: '0', fontSize: '12px', color: '#424242', fontWeight: '500' }}>
            {coachInsight.tip}
          </p>
        </div>

        {/* INTERACTIVE ROUTINE SUGGESTIONS SECTION */}
        <h4 style={{ margin: '0 0 8px 0', color: '#4a148c', fontSize: '13px', fontWeight: 'bold' }}>✨ Recommended Blueprints:</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {aiSuggestions.map((suggestion, idx) => {
            const isAlreadyAdded = habits.some(h => h.name.toLowerCase() === suggestion.name.toLowerCase());
            return (
              <div key={`sug-${idx}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.6)', padding: '8px 12px', borderRadius: '6px' }}>
                <span style={{ fontSize: '12px', color: '#4a148c', fontWeight: '500' }}>{suggestion.name}</span>
                <button
                  onClick={() => addSuggestedHabit(suggestion.name)}
                  disabled={isAlreadyAdded}
                  style={{
                    padding: '4px 10px',
                    fontSize: '11px',
                    backgroundColor: isAlreadyAdded ? '#b0bec5' : '#673ab7',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isAlreadyAdded ? 'default' : 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {isAlreadyAdded ? 'Added ✓' : '+ Add'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* DYNAMIC MULTI-VIEW STATS CHART SYSTEM */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #e0e0e0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ margin: '0', color: '#333', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📊 Analytics Display
          </h3>
          {/* VIEW TOGGLE CONTROLS */}
          <div style={{ display: 'flex', gap: '4px', backgroundColor: '#eee', padding: '3px', borderRadius: '6px' }}>
            {['bar', 'graph', 'pie'].map((view) => (
              <button
                key={view}
                onClick={() => setChartView(view)}
                style={{
                  padding: '5px 12px',
                  fontSize: '11px',
                  textTransform: 'capitalize',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  backgroundColor: chartView === view ? '#fff' : 'transparent',
                  color: chartView === view ? '#007bff' : '#666',
                  boxShadow: chartView === view ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                {view}
              </button>
            ))}
          </div>
        </div>
        
        {habits.length === 0 ? (
          <p style={{ color: '#888', fontSize: '14px', margin: '0', textAlign: 'center' }}>No habit data available to chart.</p>
        ) : (
          <div>
            {/* VIEW 1: HORIZONTAL BAR CHART */}
            {chartView === 'bar' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {habits.map(habit => {
                  const barWidth = maxStreak > 0 ? Math.round((habit.streak / maxStreak) * 100) : 0;
                  return (
                    <div key={`bar-${habit.id}`} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                        <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '75%', color: '#444' }}>{habit.name}</span>
                        <span style={{ fontWeight: 'bold', color: '#ff5722' }}>🔥 {habit.streak} d</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${maxStreak > 0 ? barWidth : 5}%`, height: '100%', backgroundColor: '#ff9800', borderRadius: '4px', transition: 'width 0.4s ease' }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* VIEW 2: LINE GRAPH TREND PREVIEW */}
            {chartView === 'graph' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '10px' }}>
                <div style={{ display: 'flex', height: '120px', alignItems: 'flex-end', justifyContent: 'space-around', borderBottom: '2px solid #ccc', paddingBottom: '5px', position: 'relative' }}>
                  {habits.map((habit, idx) => {
                    const barHeight = maxStreak > 0 ? Math.round((habit.streak / maxStreak) * 100) : 0;
                    return (
                      <div key={`graph-${habit.id}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', position: 'relative' }}>
                        {/* Interactive Data Node Plot Point */}
                        <div style={{ 
                          bottom: `${barHeight}%`, 
                          width: '10px', 
                          height: '10px', 
                          backgroundColor: '#2196f3', 
                          borderRadius: '50%', 
                          marginBottom: '-5px',
                          zIndex: 2,
                          transition: 'all 0.5s ease',
                          position: 'absolute'
                        }}></div>
                        {/* Translucent Fill Trend Column */}
                        <div style={{ height: `${barHeight}px`, width: '2px', backgroundColor: 'rgba(33, 150, 243, 0.2)', transition: 'height 0.5s ease' }}></div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '10px', color: '#777', textAlign: 'center' }}>
                  {habits.map(habit => (
                    <span key={`lbl-${habit.id}`} style={{ width: `${100 / habits.length}%`, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 2px' }}>
                      {habit.name.substring(0, 8)}...
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 3: PIE CHART SEGMENTATION */}
            {chartView === 'pie' && (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                {totalStreaksCombined === 0 ? (
                  <p style={{ color: '#999', fontSize: '13px', margin: '20px 0' }}>All habit streaks are currently 0. Build up a streak to populate the pie graph sections!</p>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
                    <div style={buildPieChartStyle()}></div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
                      {habits.map((habit, index) => {
                        const colorPalette = ['#ff5722', '#2196f3', '#4caf50', '#9c27b0', '#ffeb3b'];
                        const sliceColor = colorPalette[index % colorPalette.length];
                        const slicePercentage = Math.round((habit.streak / totalStreaksCombined) * 100);
                        return (
                          <div key={`legend-${habit.id}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: sliceColor }}></div>
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
        )}
      </div>

      {/* INPUT FORM */}
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

      {/* HABIT LIST CONTAINER */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {habits.map(habit => (
          <div 
            key={habit.id} 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '18px', 
              borderRadius: '8px', 
              backgroundColor: habit.completed ? '#e6f4ea' : '#f9f9f9',
              border: habit.completed ? '1px solid #137333' : '1px solid #ddd',
              gap: '20px' 
            }}
          >
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
            
            <div style={{ display: 'flex', gap: '10px', flexShrink: 0, alignItems: 'center' }}>
              <button 
                onClick={() => toggleHabit(habit.id)}
                style={{
                  padding: '10px 20px', 
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: habit.completed ? '#137333' : '#007bff',
                  color: 'white',
                  fontWeight: 'bold',
                  minWidth: '105px', 
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
