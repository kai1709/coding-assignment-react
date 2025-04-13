import { act, render, waitFor } from '@testing-library/react';

import Tickets from './tickets';
import * as axios from "axios";
import UserContextProvider from 'client/src/UserProvider/UserContextProvider';
import { BrowserRouter } from 'react-router-dom';

jest.mock("axios");


describe('Tickets', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should render successfully', () => {
    axios.get.mockImplementation(() => Promise.resolve({
      status: 200, data: []
    }));
    const { baseElement } = render(<Tickets />);
    expect(baseElement).toBeTruthy();
  });

  it('should render title, filter dropdown and new ticket button correctly', () => {
    axios.get.mockImplementation(() => Promise.resolve({
      status: 200, data: []
    }));
    const wrapper = render(<Tickets />);
    const newTicketBtn = wrapper.getByText('New Ticket')
    const filterDropdown = wrapper.getByTestId('status-select')
    const title = wrapper.getByText('List of Tickets')
    expect(title).toBeVisible()
    expect(filterDropdown).toBeVisible()
    expect(newTicketBtn).toBeVisible()
  });

  it('should tickets correctly', async () => {
    axios.get.mockImplementation(() => Promise.resolve({
      status: 200, data: [
        {
          id: 1,
          description: 'Install a monitor arm',
          assigneeId: 1,
          completed: false,
        },
        {
          id: 2,
          description: 'Move the desk to the new location',
          assigneeId: 1,
          completed: false,
        },
      ]
    }));
    let wrapper
    await act(async () => {
      wrapper = render(
        <BrowserRouter>
          <UserContextProvider>
            <Tickets />
          </UserContextProvider>
        </BrowserRouter>
      );
    })

    const ticketsElements = wrapper!.getAllByTestId('ticket-item')
    expect(ticketsElements).toHaveLength(2)
    const firstTicket = wrapper!.getByText('Ticket 1')
    const secondTicket = wrapper!.getByText('Ticket 2')
    expect(firstTicket).toBeVisible()
    expect(secondTicket).toBeVisible()
  });

});
