import react from 'react';
import styles from './Clock.module.css';


const Hand = () => <div className={styles.hand}/>
const Frame = () => <div className={styles.frame}><Hand/><Hand/></div>

const Clock = () => {
	const digits = [];
	for (let i = 0; i < 24; i++) {
		digits.push(<Frame/>)
	}
	return (
		<div className={styles.digit}>
			{ digits }
		</div>
	)
}

export default Clock;