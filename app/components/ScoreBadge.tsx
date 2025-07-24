import React from 'react';

interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  // Determine badge style and text based on score
  let badgeStyle = '';
  let badgeText = '';

  if (score > 70) {
    badgeStyle = 'bg-badge-green text-badge-green-text';
    badgeText = 'Strong';
  } else if (score > 49) {
    badgeStyle = 'bg-badge-yellow text-badge-yellow-text';
    badgeText = 'Good Start';
  } else {
    badgeStyle = 'bg-badge-red text-badge-red-text';
    badgeText = 'Need Work';
  }

  return (
    <div className={`px-3 py-1 rounded-full text-sm font-medium ${badgeStyle}`}>
      <p className='text-[10px]'>{badgeText}</p>
    </div>
  );
};

export default ScoreBadge;