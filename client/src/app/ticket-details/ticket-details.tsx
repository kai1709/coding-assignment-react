import { Link, useNavigation, useParams } from 'react-router-dom';
import styles from './ticket-details.module.css';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Ticket, User } from '@acme/shared-models';
import { Button, Card, Modal, Radio, Spin, Tag, Typography } from 'antd';
import { UserContext } from 'client/src/UserProvider/UserContextProvider';
import { UNASSIGNED_TEXT } from '../constants';
import { App } from 'antd'
import { LeftOutlined } from '@ant-design/icons';

export function TicketDetails() {
  return (
    <App>
      <TicketDetailsContent />
    </App>
  )
};

const TicketDetailsContent = () => {
  const { id } = useParams();
  const [ticketDetail, setTicketDetail] = useState<Ticket | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { modal } = App.useApp();
  const [isShowModalAssign, setIsShowModalAssign] = useState(false)
  const [selectedUser, setSeletedUser] = useState(null)
  const getTicketDetail = async () => {
    setIsLoading(true)
    const res = await axios.get(`/api/tickets/${id}`)
    setTicketDetail(res.data)
    setIsLoading(false)
  }
  const userContext = useContext(UserContext)
  const users = userContext.state.users || []

  const handleUnassign = async () => {
    setIsProcessing(true)
    const res = await axios.put(`/api/tickets/${id}/unassign`)
    if (res.status === 204 && ticketDetail) {
      setTicketDetail({ ...ticketDetail, assigneeId: null })
    }
    setIsProcessing(false)
  }

  const handleAssign = async () => {
    setIsProcessing(true)
    const res = await axios.put(`/api/tickets/${id}/assign/${selectedUser}`)
    if (res.status === 204 && ticketDetail) {
      setTicketDetail({ ...ticketDetail, assigneeId: selectedUser })
    }
    setIsShowModalAssign(false)
    setIsProcessing(false)
  }

  const warnUnassign = () => {
    modal.warning({ title: 'Unassign', content: 'Are you sure that you want to unassign this user?', okText: 'Confirm', cancelText: 'Cancel', onOk: handleUnassign, okCancel: true });
  }

  const handleMarkAction = async (action: string) => {
    setIsProcessing(true)
    const res = action === 'complete' ? await axios.put(`/api/tickets/${id}/complete`) : await axios.delete(`/api/tickets/${id}/complete`)
    if (res.status === 204 && ticketDetail) {
      setTicketDetail({ ...ticketDetail, completed: action === 'complete' ? true : false })
    }
    setIsProcessing(false)
  }

  const warnMarkAction = (action: string) => {
    modal.warning({ title: `Mark as ${action}`, content: `Are you sure that you want to mark this ticket as ${action}?`, okText: 'Confirm', cancelText: 'Cancel', onOk: () => handleMarkAction(action), okCancel: true });
  }

  useEffect(() => {
      getTicketDetail()
  }, [])

  if (isLoading) {
    return <div className={styles['loading-container']}><Spin size='large' /></div>
  }

  const assignee = users.find((u: User) => u.id === ticketDetail?.assigneeId)
  return (
    <div className={styles['ticket-card']}>
      <Modal open={isShowModalAssign} footer={null} onCancel={() => setIsShowModalAssign(false)} onClose={() => { setIsShowModalAssign(false) }}>
        <div className={styles['modal-title']}>Select a user to assign</div>
        <Radio.Group
          style={{ flexDirection: 'column', display: 'flex' }}
          value={selectedUser}
          onChange={(e) => setSeletedUser(e.target.value)}
          options={users.map((u: User) => ({ value: u.id, label: u.name }))}
          className={styles['user-select']}
        />
        <div className={styles['modal-footer']}>
          <Button onClick={() => setIsShowModalAssign(false)} className={styles['cancel-btn']}>Cancel</Button>
          <Button type="primary" loading={isProcessing} className={styles['submit-btn']} onClick={handleAssign}>{isLoading ? <Spin /> : 'Submit'}</Button>
        </div>
      </Modal>
      <div className={styles['title-wrapper']}>
        <div className={styles['back-btn']}>
          <Link to="/"><Button variant='outlined' ><LeftOutlined /></Button></Link>
        </div>
        <Tag color='processing' data-testid="title" className={styles['title']}>Ticket {ticketDetail?.id}</Tag>
      </div>
      <Card className={styles['ticket-card']}>
        <div className={styles['ticket-action']}>
          <div className={styles['assignee-section']}>
            Assignee:
            <div className={styles['assignee-user']}>
              {assignee ? (
                <>
                  {assignee.name}
                  <div>
                    <Button variant='outlined' color='danger' onClick={warnUnassign}>Unassign</Button>
                  </div>
                </>
              ) : (
                <>
                  {UNASSIGNED_TEXT}
                  <div >
                    <Button type='primary' color='danger' onClick={() => setIsShowModalAssign(true)}>Assign</Button>
                  </div>
                </>
              )}
            </div>
          </div>
          <div>
            <strong>Status:</strong>
            <div className={styles['assignee-user']}>
              {ticketDetail?.completed ? (
                <>
                  <span data-testid="ticket-status">Completed</span>
                  <div>
                    <Button variant='outlined' color='danger' onClick={() => warnMarkAction('incomplete')}>Mark as Incomplete</Button>
                  </div>
                </>
              ) : (
                <>
                  <span data-testid="ticket-status">Incompleted</span>
                  <div >
                    <Button variant='outlined' color='green' onClick={() => warnMarkAction('complete')}>Mark as Complete</Button>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
        <div>
          <strong>Description:</strong>
          <div data-testid="description">
            {ticketDetail?.description}
          </div>
        </div>
      </Card>
    </div>
  );
}


export default TicketDetails;


