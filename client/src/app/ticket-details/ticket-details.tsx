import { useParams } from 'react-router';
import styles from './ticket-details.module.css';

export function TicketDetails() {
  const { id } = useParams();
  console.log({ id })
  return (
    <div className={styles['container']}>

      <h1>Welcome to TicketDetails!</h1>

    </div>
  );
};


export default TicketDetails;


