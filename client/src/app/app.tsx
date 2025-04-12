import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Ticket, User } from '@acme/shared-models';

import styles from './app.module.css';
import Tickets from './tickets/tickets';
import TicketDetails from './ticket-details/ticket-details';
import UserContextProvider from '../UserProvider/UserContextProvider';
import { Typography } from 'antd';

const { Title } = Typography;

const App = () => {
  return (
    <div className={styles['app']}>
      <Title level={1}>Ticketing App</Title>
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
