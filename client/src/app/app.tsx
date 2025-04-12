import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import styles from './app.module.css';
import Tickets from './tickets/tickets';
import TicketDetails from './ticket-details/ticket-details';
import UserContextProvider from '../UserProvider/UserContextProvider';
import { Tag, Typography } from 'antd';

const { Title } = Typography;

const App = () => {
  return (
    <div className={styles['app']}>
      <div className={styles['app-name-wrapper']}>
        <Tag color='geekblue' className={styles['app-name']}>Ticketing App</Tag>
      </div>
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Tickets />} />
          <Route path="/:id" element={<TicketDetails />} />
        </Routes>
      </UserContextProvider>
    </div>
  );
};

export default App;
