import  {useEffect, useState} from 'react';
import cx from 'classnames';
import styles from './Clock.module.css';


const Hand = () => <div className={styles.hand}/>
const Frame = ({className, ...rest}) => (<div {...rest} className={cx(styles.frame, className)}>
        <Hand/>
        <Hand/>
    </div>
);

const Clock = () => {

    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, [])
    const options = {
        "┐": "leftDown",
        "┘": "leftUp",
        "└": "rightUp",
        "┌": "rightDown",
        "─": "horizontal",
        "│": "vertical",
        " ": "inactive",
    };

    const digitsMap = {
        '0': ["┌", "─", "─", "┐",
            "│", "┌", "┐", "│",
            "│", "│", "│", "│",
            "│", "│", "│", "│",
            "│", "└", "┘", "│",
            "└", "─", "─", "┘"],

        '1': ["┌", "─", "┐", " ",
            "└", "┐", "│", " ",
            " ", "│", "│", " ",
            " ", "│", "│", " ",
            "┌", "┘", "└", "┐",
            "└", "─", "─", "┘"],

        '2': ["┌", "─", "─", "┐",
            "└", "─", "┐", "│",
            "┌", "─", "┘", "│",
            "│", "┌", "─", "┘",
            "│", "└", "─", "┐",
            "└", "─", "─", "┘"],

        '3': ["┌", "─", "─", "┐",
            "└", "─", "┐", "│",
            "┌", "─", "┘", "│",
            "└", "─", "┐", "│",
            "┌", "─", "┘", "│",
            "└", "─", "─", "┘"],

        '4': ["┌", "┐", "┌", "┐",
            "│", "│", "│", "│",
            "│", "└", "┘", "│",
            "└", "─", "┐", "│",
            " ", " ", "│", "│",
            " ", " ", "└", "┘"],

        '5': ["┌", "─", "─", "┐",
            "│", "┌", "─", "┘",
            "│", "└", "─", "┐",
            "└", "─", "┐", "│",
            "┌", "─", "┘", "│",
            "└", "─", "─", "┘"],

        '6': ["┌", "─", "─", "┐",
            "│", "┌", "─", "┘",
            "│", "└", "─", "┐",
            "│", "┌", "┐", "│",
            "│", "└", "┘", "│",
            "└", "─", "─", "┘"],

        '7': ["┌", "─", "─", "┐",
            "└", "─", "┐", "│",
            " ", " ", "│", "│",
            " ", " ", "│", "│",
            " ", " ", "│", "│",
            " ", " ", "└", "┘"],

        '8': ["┌", "─", "─", "┐",
            "│", "┌", "┐", "│",
            "│", "└", "┘", "│",
            "│", "┌", "┐", "│",
            "│", "└", "┘", "│",
            "└", "─", "─", "┘"],

        '9': ["┌", "─", "─", "┐",
            "│", "┌", "┐", "│",
            "│", "└", "┘", "│",
            "└", "─", "┐", "│",
            "┌", "─", "┘", "│",
            "└", "─", "─", "┘"],
        ':': [" ", " ",
              "┌", "┐",
              "└", "┘",
              "┌", "┐",
              "└", "┘",
              " ", " ",],
    }
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const hours = now.getHours().toString().padStart(2, "0");


    return (
        <div className={styles.fullClock}>
            <div className={styles.digit}>

                {Array.from({length: 24}, (_, i) => (
                    <Frame
                        key={i}
                        className={styles[options[digitsMap[hours[0]][i]]]}/>
                ))}
            </div>
            <div className={styles.digit}>

                {Array.from({length: 24}, (_, i) => (
                    <Frame
                        key={i}
                        className={styles[options[digitsMap[hours[1]][i]]]}/>
                ))}
            </div>
              <div className={styles.comma}>
                {Array.from({length: 12}, (_, i) => (
                    <Frame
                        key={i}
                        className={styles[options[digitsMap[':'][i]]]}/>
                ))}
            </div>
            <div className={styles.digit}>
                {Array.from({length: 24}, (_, i) => (
                    <Frame
                        key={i}
                        className={styles[options[digitsMap[minutes[0]][i]]]}/>
                ))}
            </div>
            <div className={styles.digit}>
                {Array.from({length: 24}, (_, i) => (
                    <Frame
                        key={i}
                        className={styles[options[digitsMap[minutes[1]][i]]]}/>
                ))}
            </div>
            <div className={styles.comma}>
                {Array.from({length: 12}, (_, i) => (
                    <Frame
                        key={i}
                        className={styles[options[digitsMap[":"][i]]]}/>
                ))}
            </div>

            <div className={styles.digit}>
                {Array.from({length: 24}, (_, i) => (
                    <Frame
                        key={i}
                        className={styles[options[digitsMap[seconds[0]][i]]]}/>
                ))}
            </div>
            <div className={styles.digit}>
                {Array.from({length: 24}, (_, i) => (
                    <Frame
                        key={i}
                        className={styles[options[digitsMap[seconds[1]][i]]]}
                    />
                ))}
            </div>
        </div>
    );
}

export default Clock;