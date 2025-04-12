import { Ticket, User } from "@acme/shared-models";
import { Collapse } from "antd";
import styles from './tickets.module.css';
import { TICKET_STATUSES } from "../constants";
import { EditOutlined } from "@ant-design/icons";
import { Link, useNavigation } from "react-router-dom";

type TicketCard = {
  data: Ticket
  users: User[]
}

type TicketHeader = {
  data: Ticket
}

const Header = ({ data }: TicketHeader) => {
  return (
    <div className={styles['ticket-header']}>
      <div className={styles['ticket-header-label']}>
        Ticket {data.id}
      </div>
      <div>
        Status: {
          !data.completed ? (
            <span className={styles['status-incompleted']}>{TICKET_STATUSES.INCOMPLETED}</span>
          ) : (
            <span className={styles['status-completed']}>{TICKET_STATUSES.COMPLETED}</span>
          )
        }
      </div>
      <Link to={`/${data.id}`} className={styles['edit-btn']}>
        <EditOutlined />
      </Link>
    </div>
  )
}
const TicketCard = ({ data, users }: TicketCard) => {
  const assignee = users.find(u => u.id === data.assigneeId)
  const Content = () => (
    <div>
      <div className={styles['ticket-assignee']}>
        Assignee: <span>{assignee ? assignee.name : 'Not assigned'}</span>
      </div>
      <div className={styles['ticket-content']}>
        {data.description}
      </div>
    </div>
  )
  return (
    <Collapse
      size="large"
      items={[{ key: '1', label: <Header data={data} />, children: <Content /> }]}
    />
  )
}

export default TicketCard
