import React, { useState, useEffect } from 'react';
import HabitForm from './components/HabitForm';
import HabitList from './components/HabitList';
import StatsPanel from './components/StatsPanel';
import AICoachPanel from './components/AICoachPanel';

function App() {
  const [habits, setHabits] = useState(() => {
    const savedHabits = localStorage.getItem('habit_pulse_data');
    return savedHabits ? JSON.parse(savedHabits) : [];
  });

  const [newHabitName, setNewHabitName] = useState('');
  const [chartView, setChartView] = useState('bar');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 600);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    localStorage.setItem('habit_pulse_data', JSON.stringify(habits));
  }, [habits]);

  const totalHabits = habits.length;
  const completedHabits = habits.filter(h => h.completed).length;
  const completionPercentage = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;
  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;
  const totalStreaksCombined = habits.reduce((sum, h) => sum + h.streak, 0);

  const aiSuggestions = [
    { name: '💻 90-Minute Deep Work Block' },
    { name: '🧘 10-Minute Mindfulness Reset' },
    { name: '📱 No screens 30 mins before bed' }
  ];

  const addSuggestedHabit = (name) => {
    if (habits.some(h => h.name.toLowerCase() === name.toLowerCase())) return;
    setHabits([...habits, { id: Date.now(), name, completed: false, streak: 0 }]);
  };

  const getAICoachInsight = () => {
    if (totalHabits === 0) return { message: "Welcome! Establish your routines below.", tip: "Pick a blueprint template to begin.", moodColor: '#673ab7' };
    if (completionPercentage === 100) return { message: "Outstanding! 100% completion rate.", tip: "Protect this momentum.", moodColor: '#2e7d32' };
    if (completionPercentage >= 50) return { message: "Solid progress!", tip: "Can you knock out one more?", moodColor: '#1565c0' };
    return { message: "Consistency is about showing up.", tip: "Choose the easiest habit next.", moodColor: '#c62828' };
  };

  const addHabit = (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    setHabits([...habits, { id: Date.now(), name: newHabitName, completed: false, streak: 0 }]);
    setNewHabitName('');
  };

  const toggleHabit = (id) => {
    setHabits(habits.map(h => h.id === id ? { ...h, completed: !h.completed, streak: !h.completed ? h.streak + 1 : Math.max(0, h.streak - 1) } : h));
  };

  const deleteHabit = (id) => setHabits(habits.filter(h => h.id !== id));

  return (
    <div style={{ padding: isMobile ? '15px 10px' : '30px', fontFamily: 'sans-serif', maxWidth: '550px', margin: '0 auto' }}>
      <header>
        <h1 style={{ textAlign: 'center', fontSize: isMobile ? '24px' : '32px', margin: '0' }}>Habit Pulse ⚡</h1>
        <p style={{ textAlign: 'center', color: '#666', fontSize: '14px' }}>Track consistency, build streaks.</p>
      </header>

      <main>
        {/* Progress Bar Header Area */}
        <div style={{ backgroundColor: '#f0f4f8', padding: '15px', borderRadius: '12px', marginBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>
            <span>Progress Bar</span>
            <span>{completionPercentage}%</span>
          </div>
          <div style={{ width: '100%', height: '10px', backgroundColor: '#e0e0e0', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ width: `${completionPercentage}%`, height: '100%', backgroundColor: '#1a73e8' }}></div>
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

        <section>
          <HabitList 
            habits={habits} 
            toggleHabit={toggleHabit} 
            deleteHabit={deleteHabit} 
            isMobile={isMobile} 
          />
        </section>
      </main>
    </div>
  );
}

export default App;
