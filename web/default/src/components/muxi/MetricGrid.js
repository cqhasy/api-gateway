import React from 'react';

const MetricGrid = ({ columns = 4, layout, children, className = '' }) => {
  const layoutClass =
    layout === 'rhythm'
      ? 'muxi-metric-grid--rhythm'
      : layout === 'emphasis-first'
        ? 'muxi-metric-grid--emphasis-first'
        : `muxi-metric-grid--cols-${columns}`;

  return (
    <div className={`muxi-metric-grid ${layoutClass} ${className}`.trim()}>
      {children}
    </div>
  );
};

export default MetricGrid;
