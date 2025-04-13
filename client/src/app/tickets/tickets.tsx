import { Ticket, User, UserContextType } from '@acme/shared-models';
import styles from './tickets.module.css';
import { useContext, useEffect, useState } from 'react';
import TicketCard from './ticket-card';
import { UserContext } from 'client/src/UserProvider/UserContextProvider';

import { Button, Select, Spin, Typography } from 'antd';
import NewTicketModal from './new-ticket-modal';
import axios from 'axios';

const { Title } = Typography;

export function Tickets() {
  const [tickets, setTickets] = useState([] as Ticket[]);
  const [filterValue, setFilterValue] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(false)
  const userContext = useContext(UserContext)
  const [isModalNewTicketOpen, setIsModalNewTicketOpen] = useState(false)
  const users = userContext.state.users || []


  async function fetchTickets() {
    if (isLoading) return
    setIsLoading(true)
    const data = await axios.get('/api/tickets');
    setTickets(data.data);
    setIsLoading(false)
  }

  const onChangeFilter = (value: string) => {
    setFilterValue(value)
  }

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCloseModalNewTicket = (needReload?: boolean) => {
    setIsModalNewTicketOpen(false)
    if (needReload) {
      fetchTickets()
    }
  }
  if (!tickets) return <div>Something went wrong</div>

  let ticketsForRendering = tickets
  if (filterValue === 'incompleted') ticketsForRendering = tickets.filter(t => !t.completed)
  if (filterValue === 'completed') ticketsForRendering = tickets.filter(t => t.completed)
  return (
    <div className={styles['tickets']}>
      <NewTicketModal isOpen={isModalNewTicketOpen} onClose={handleCloseModalNewTicket} />
      <div className={styles['flex']}>
        <div className={styles['flex-1']}>
          <Title level={3}>List of Tickets</Title>
        </div>
        <div className={styles['flex']}>
          <div>
            <Select onChange={onChangeFilter} value={filterValue} data-testid="status-select" className={styles['status-select']}>
              <Select.Option value="all">All</Select.Option>
              <Select.Option value="completed">Completed</Select.Option>
              <Select.Option value="incompleted">Incompleted</Select.Option>
            </Select>
          </div>
          <Button type='primary' onClick={() => setIsModalNewTicketOpen(true)}>New Ticket</Button>
        </div>
      </div>
      {isLoading ? (
        <div className={styles['loading-container']}>
          <Spin size='large' />
        </div>
      ) : (
        <>
          {ticketsForRendering.length === 0 && (
            <div className={styles['loading-container']}>
              <Title level={2}>No tickets to display</Title>
            </div>
          )}
          {ticketsForRendering.map((t, index) => (
            <div key={t.id} data-testid="ticket-item" style={index !== ticketsForRendering.length - 1 ? { marginBottom: 20 } : {}}>
              <TicketCard data={t} users={users} />
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default Tickets;
