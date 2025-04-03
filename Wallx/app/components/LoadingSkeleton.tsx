import React from 'react';

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 animate-pulse">
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-600 rounded-lg opacity-0 animate-pulse"></div>
      </div>
    ))}
  </div>
);

export default LoadingSkeleton;