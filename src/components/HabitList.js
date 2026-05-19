import React from 'react';
import HabitCard from './HabitCard';

export default function HabitList({ habits, toggleHabit, deleteHabit, isMobile }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {habits.map(habit => (
        <HabitCard 
          key={habit.id}
          habit={habit}
          toggleHabit={toggleHabit}
          deleteHabit={deleteHabit}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
}
