import React, { useState, useEffect } from 'react';
import HabitForm from './components/HabitForm.jsx';
import HabitList from './components/HabitList.jsx';
import StatsPanel from './components/StatsPanel.jsx';
import AICoachPanel from './components/AICoachPanel.jsx';

function App() {
  // Line 8: Initialize data state (Added default reminderTime slots)
  const [habits, setHabits] = useState(() => {
    const savedHabits = localStorage.getItem('habit_pulse_data');
    return savedHabits ? JSON.parse(savedHabits) : [
      { id: 1, name: '💧 Drink water', completed: false, streak: 0, reminderTime: '14:00' },
      { id: 2, name: '🏋️ Go to the gym', completed: false, streak: 0, reminderTime: '' }
    ];
  });

  // Line 18: UI Layout & Input states
  const [newHabitName, setNewHabitName] = useState('');
  const [chartView, setChartView] = useState('bar');
  const [isMobile, setIsMobile] = useState(false);

  // Line 23: Monitor responsive width parameters
  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 600);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Line 31: REQUEST BROWSER NOTIFICATION PERMISSIONS
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log(`Notification permission state: ${permission}`);
      });
    }
  }, []);

  // Line 40: SYNC LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem('habit_pulse_data', JSON.stringify(habits));
  }, [habits]);

  // Line 45: BACKGROUND TIME REMINDER CHECKER ENGINE (Ticks every 60s)
  useEffect(() => {
    const checkReminders = setInterval(() => {
      if (!('Notification' in window) || Notification.permission !== 'granted') return;

      const now = new Date();
      // Formats current system time as "HH:MM" (e.g., "14:00")
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeString = `${currentHours}:${currentMinutes}`;

      habits.forEach(habit => {
        // TRIGGER CONDITION: Match target time AND habit is not checked off yet
        if (habit.reminderTime === currentTimeString && !habit.completed) {
          new Notification('Habit Pulse ⚡ Reminder', {
            body: `Don't forget to stay consistent! You haven't checked off your habit: "${habit.name}" yet today.`,
            icon: '/favicon.ico'
          });
        }
      });
    }, 60000); // Evaluates code precisely every 60 seconds

    return () => clearInterval(checkReminders);
  }, [habits]);

  // Line 71: Metrics Calculations
  const totalHabits = habits.length;
  const completedHabits = habits.filter(h => h.completed).length;
  const completionPercentage = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;
  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;
  const totalStreaksCombined = habits.reduce((sum, h) => sum + h.streak, 0);

  // Line 79: AI Coaching Suggestion Templates
  const aiSuggestions = [
    { name: '💻 90-Minute Deep Work Block' },
    { name: '🧘 10-Minute Mindfulness Reset' },
    { name: '📱 No screens 30 mins before bed' }
  ];

  const addSuggestedHabit = (name) => {
    if (habits.some(h => h.name.toLowerCase() === name.toLowerCase())) return;
    setHabits([...habits, { id: Date.now(), name, completed: false, streak: 0, reminderTime: '' }]);
  };

  // Line 91: AI Coach Mood Logic
  const getAICoachInsight = () => {
    if (totalHabits === 0) return { message: "Welcome! Establish your routines below.", tip: "Pick a blueprint template to begin.", moodColor: '#673ab7' };
    if (completionPercentage === 100) return { message: "Outstanding! 100% completion rate.", tip: "Protect this momentum.", moodColor: '#2e7d32' };
    if (completionPercentage >= 50) return { message: "Solid progress!", tip: "Can you knock out one more?", moodColor: '#1565c0' };
    return { message: "Consistency is about showing up.", tip: "Choose the easiest habit next.", moodColor: '#c62828' };
  };

  // Line 100: Array Data Mutations
  const addHabit = (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    setHabits([...habits, { id: Date.now(), name: newHabitName, completed: false, streak: 0, reminderTime: '' }]);
    setNewHabitName('');
  };

  const toggleHabit = (id) => {
    setHabits(habits.map(h => h.id === id ? { ...h, completed: !h.completed, streak: !h.completed ? h.streak + 1 : Math.max(0, h.streak - 1) } : h));
  };

  const deleteHabit = (id) => setHabits(habits.filter(h => h.id !== id));

  // LINE 112: UPDATE REMINDER TIME METHOD
  const updateReminderTime = (id, timeString) => {
    setHabits(habits.map(h => h.id === id ? { ...h, reminderTime: timeString } : h));
  };

  // Line 117: Manual Reset function
  const resetAllData = () => {
    localStorage.removeItem('habit_pulse_data');
    setHabits([
      { id: 1, name: '💧 Drink water', completed: false, streak: 0, reminderTime: '14:00' },
      { id: 2, name: '🏋️ Go to the gym', completed: false, streak: 0, reminderTime: '' }
    ]);
  };

  // Line 127: Main Application User Interface
  return (
    <div style={{ padding: isMobile ? '15px 10px' : '30px', fontFamily: 'sans-serif', maxWidth: '550px', margin: '0 auto' }}>
      <header>
        <h1 style={{ textAlign: 'center', fontSize: isMobile ? '24px' : '32px', margin: '0' }}>Habit Pulse ⚡</h1>
        <p style={{ textAlign: 'center', color: '#666', fontSize: '14px' }}>Track consistency, build streaks.</p>
      </header>

      <main>
        <div style={{ backgroundColor: '#f0f4f8', padding: '15px', borderRadius: '12px', marginBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>
            <span>Progress Bar</span>
            <span>{completionPercentage}%</span>
          </div>
          <div style={{ width: '100%', height: '10px', backgroundColor: '#e0e0e0', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ width: `${completionPercentage}%`, height: '100%', backgroundColor: '#1a73e8', transition: 'width 0.3s ease' }}></div>
          </div>
        </div>

        <AICoachPanel 
          coachInsight={getAICoachInsight()} 
          aiSuggestions={aiSuggestions} 
          addSuggestedHabit={addSuggestedHabit} 
          isMobile={isMobile} 
        />

        <StatsPanel 
          habits={habits} 
          chartView={chartView} 
          setChartView={setChartView} 
          maxStreak={maxStreak} 
          totalStreaksCombined={totalStreaksCombined} 
          isMobile={isMobile} 
        />

        <HabitForm 
          newHabitName={newHabitName} 
          setNewHabitName={setNewHabitName} 
          addHabit={addHabit} 
          isMobile={isMobile} 
        />

        {/* LINE 171: REMINDER INPUT PANEL WRAPPER AREA */}
        <section style={{ marginBottom: '20px', backgroundColor: '#fdfefe', border: '1px dashed #bbb', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#555' }}>⏰ Set Daily Reminders:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {habits.map(habit => (
              <div key={`rem-${habit.id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>{habit.name}</span>
                <input 
                  type="time" 
                  value={habit.reminderTime || ''} 
                  onChange={(e) => updateReminderTime(habit.id, e.target.value)}
                  style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'sans-serif' }}
                />
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <HabitList 
            habits={habits} 
            toggleHabit={toggleHabit} 
            deleteHabit={deleteHabit} 
            isMobile={isMobile} 
          />
        </section>

        <footer style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px', textAlign: 'center' }}>
          <button
            onClick={resetAllData}
            style={{
              padding: '10px 20px',
              backgroundColor: '#fff',
              color: '#dc3545',
              border: '1px solid #dc3545',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '13px',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => { e.target.style.backgroundColor = '#dc3545'; e.target.style.color = '#fff'; }}
            onMouseOut={(e) => { e.target.style.backgroundColor = '#fff'; e.target.style.color = '#dc3545'; }}
          >
            ⚠️ Reset All App Data
          </button>
        </footer>
      </main>
    </div>
  );
}

export default App;
