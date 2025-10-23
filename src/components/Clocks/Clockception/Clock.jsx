import { useEffect, useState } from 'react';
import cx from 'classnames';
import styles from './Clock.module.css';
import { digitsMapSmall } from '../../Digits14x8.jsx';

const Hand = () => <div className={styles.hand} />;
const Frame = ({ className, ...rest }) => (
  <div {...rest} className={cx(styles.frame, className)}>
    <Hand />
    <Hand />
  </div>
);

const Clock = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const options = {
    '┐': 'leftDown',
    '┘': 'leftUp',
    '└': 'rightUp',
    '┌': 'rightDown',
    '─': 'horizontal',
    '│': 'vertical',
    ' ': 'inactive',
  };

  const seconds = now.getSeconds().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');

  return (
    <div className={styles.fullClock} data-particle-block="true">
      <div className={styles.digit}>
        {Array.from({ length: 24 }, (_, i) => (
          <Frame
            key={i}
            className={styles[options[digitsMapSmall[hours[0]][i]]]}
          />
        ))}
      </div>
      <div className={styles.digit}>
        {Array.from({ length: 24 }, (_, i) => (
          <Frame
            key={i}
            className={styles[options[digitsMapSmall[hours[1]][i]]]}
          />
        ))}
      </div>
      <div className={styles.comma}>
        {Array.from({ length: 12 }, (_, i) => (
          <Frame key={i} className={styles[options[digitsMapSmall[':'][i]]]} />
        ))}
      </div>
      <div className={styles.digit}>
        {Array.from({ length: 24 }, (_, i) => (
          <Frame
            key={i}
            className={styles[options[digitsMapSmall[minutes[0]][i]]]}
          />
        ))}
      </div>
      <div className={styles.digit}>
        {Array.from({ length: 24 }, (_, i) => (
          <Frame
            key={i}
            className={styles[options[digitsMapSmall[minutes[1]][i]]]}
          />
        ))}
      </div>
      <div className={styles.comma}>
        {Array.from({ length: 12 }, (_, i) => (
          <Frame key={i} className={styles[options[digitsMapSmall[':'][i]]]} />
        ))}
      </div>

      <div className={styles.digit}>
        {Array.from({ length: 24 }, (_, i) => (
          <Frame
            key={i}
            className={styles[options[digitsMapSmall[seconds[0]][i]]]}
          />
        ))}
      </div>
      <div className={styles.digit}>
        {Array.from({ length: 24 }, (_, i) => (
          <Frame
            key={i}
            className={styles[options[digitsMapSmall[seconds[1]][i]]]}
          />
        ))}
      </div>
    </div>
  );
};

export default Clock;
