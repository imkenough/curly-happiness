import React from 'react';

interface CountUpProps {
  from: number;
  to: number;
  separator?: string;
  direction?: 'up' | 'down';
  duration?: number;
  className?: string;
}

const CountUp: React.FC<CountUpProps> = ({
  from,
  to,
  separator = '',
  direction = 'up',
  duration = 1, // duration in seconds
  className,
}) => {
  const [current, setCurrent] = React.useState(from);
  const ref = React.useRef(current);
  const [start, setStart] = React.useState(false);
  const isCountingUp = direction === 'up';

  const counter = React.useCallback(() => {
    if (!start) return;

    let startTime: number;
    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / (duration * 1000); // progress in %

      let value;
      if (isCountingUp) {
        value = from + (to - from) * progress;
        if (value >= to) value = to;
      } else {
        value = from - (from - to) * progress;
        if (value <= to) value = to;
      }

      setCurrent(Math.floor(value));
      ref.current = Math.floor(value);

      if ((isCountingUp && value < to) || (!isCountingUp && value > to)) {
        requestAnimationFrame(animateCount);
      }
    };
    requestAnimationFrame(animateCount);
  }, [start, from, to, duration, isCountingUp]);

  React.useEffect(() => {
    setStart(true);
    counter();
  }, [counter]);

  // Reset count on 'to' prop change
  React.useEffect(() => {
    if (start) {
      setCurrent(from);
      ref.current = from;
      counter();
    }
  }, [to, from, counter, start]);

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', { useGrouping: true }).replace(/,/g, separator);
  };

  return <span className={className}>{formatNumber(current)}</span>;
};

export default CountUp;
