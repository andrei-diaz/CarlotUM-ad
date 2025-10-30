import React from 'react';
import Rating from 'react-rating';
import { Star } from 'lucide-react';

const StarRating = ({ 
  value, 
  onChange, 
  readonly = false, 
  size = 24 
}) => {
  return (
    <Rating
      initialRating={value}
      onChange={onChange}
      readonly={readonly}
      emptySymbol={
        <Star 
          size={size} 
          className="text-gray-300 dark:text-gray-600" 
          fill="none"
        />
      }
      fullSymbol={
        <Star 
          size={size} 
          className="text-yellow-400" 
          fill="currentColor"
        />
      }
      fractions={1}
    />
  );
};

export default StarRating;
