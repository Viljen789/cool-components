import Clock from "./Clock.jsx";
import styles from "./ClockGrid.module.css";

const ClockGrid = () => {
	const fullClock = [];
	for (let i = 0; i < 1; i++) {
		fullClock.push(<Clock/>)
	}
	return(
		<div className={styles.view}>
			{fullClock}
		</div>
	)
}
export default ClockGrid;