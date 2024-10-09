import React, { useEffect } from 'react';

const Counter = ({ target }) => {
  useEffect(() => {
    const counters = document.querySelectorAll('.total-number p');
    const speed = 20;

    counters.forEach(counter => {
      const targetValue = +counter.innerText;
      let currentCount = 0;
      const increment = Math.ceil(targetValue / speed);

      const updateCount = () => {
        if (currentCount < targetValue) {
          currentCount += increment;
          if (currentCount > targetValue) {
            currentCount = targetValue;
          }
          counter.innerText = currentCount;
          setTimeout(updateCount, 50);
        }
      };

      updateCount();
    });
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="total-number">
      <p>{target}</p>
    </div>
  );
};

export default Counter;
