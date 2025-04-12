import { Button, Input, Modal, Spin } from "antd"
import axios from "axios"
import { useState } from "react"
import styles from './tickets.module.css'
type TicketModalProps = {
  isOpen: boolean
  onClose: (needReload?: boolean) => void
}
const NewTicketModal = ({ isOpen, onClose }: TicketModalProps) => {
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isInputError, setIsInputError] = useState(false)
  const onSubmit = async () => {
    try {
      if (!description.trim()) {
        setIsInputError(true)
        return
      }
      if (isLoading) return
      setIsLoading(true)
      await axios.post('/api/tickets', { description: description.trim() }).then();
      setIsLoading(false)
      onClose(true)
      setDescription('')
    } catch (e) {
      alert('Something went wrong')
    }
  }
  return (
    <Modal title="New Ticket" open={isOpen} footer={null}>
      <div>
        <Input status={isInputError ? 'error' : undefined} value={description} onChange={(e) => setDescription(e.target.value)} />
        {isInputError && <div className={styles['error-text']}>Description is required</div>}
      </div>
      <div className={styles['new-ticket-footer']}>
        <Button onClick={() => onClose()} className={styles['cancel-btn']}>Cancel</Button>
        <Button type="primary" disabled={isLoading} className={styles['submit-btn']} onClick={() => onSubmit()}>{isLoading ? <Spin /> : 'Submit'}</Button>
      </div>
    </Modal>
  )
}

export default NewTicketModal
