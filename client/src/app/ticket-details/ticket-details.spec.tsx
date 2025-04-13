import { act, render, RenderResult } from '@testing-library/react';
import * as axios from "axios";
import TicketDetails from './ticket-details';
import { BrowserRouter } from 'react-router-dom';
import UserContextProvider from 'client/src/UserProvider/UserContextProvider';

jest.mock("axios");

const mockData = {
  id: 1,
  description: 'Install a monitor arm',
  assigneeId: 1,
  completed: false,
}

const mockUsersData = [
  {
    id: 1,
    name: 'Son'
  }
]

describe('TicketDetails', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should render successfully', () => {
    axios.get.mockImplementation(() => Promise.resolve({
      status: 204, data: {
        id: 1,
        description: 'Install a monitor arm',
        assigneeId: 1,
        completed: false,
      }
    }));
    const { baseElement } = render(<BrowserRouter><TicketDetails /></BrowserRouter>);
    expect(baseElement).toBeTruthy();
  });

  it('should render title and description and status incomplete correctly', async () => {

    axios.get.mockImplementation((url: string) => {
      if (url === '/api/users') {
        return Promise.resolve({ data: [] });
      } else {
        return Promise.resolve({
          status: 204, data: mockData
        })
      }
    })
    let wrapper: RenderResult
    await act(async () => {
      wrapper = render(
        <BrowserRouter >
          <UserContextProvider>
            <TicketDetails />
          </UserContextProvider>
        </BrowserRouter>
      );
    })


    const title = wrapper!.getByTestId('title')
    const desc = wrapper!.getByTestId('description')
    const status = wrapper!.getByTestId('ticket-status')

    expect(title.innerHTML).toEqual(`Ticket ${mockData.id}`)
    expect(desc.innerHTML).toEqual(mockData.description)
    expect(status.innerHTML).toEqual('Incompleted')

  });


  it('should render status complete correctly', async () => {
    axios.get.mockImplementation((url: string) => {
      if (url === '/api/users') {
        return Promise.resolve({ data: [] });
      } else {
        return Promise.resolve({
          status: 204, data: {
            ...mockData,
            completed: true
          }
        })
      }
    })
    let wrapper
    await act(async () => {
      wrapper = render(
        <BrowserRouter >
          <UserContextProvider>
            <TicketDetails />
          </UserContextProvider>
        </BrowserRouter>
      );
    })
    const status = wrapper!.getByTestId('ticket-status')
    expect(status.innerHTML).toEqual('Completed')
  });


  it('should render assignee correctly', async () => {
    axios.get.mockImplementation((url: string) => {
      if (url === '/api/users') {
        return Promise.resolve({ data: mockUsersData });
      } else {
        return Promise.resolve({
          status: 204, data: mockData
        })
      }
    })
    let wrapper
    await act(async () => {
      wrapper = render(
        <BrowserRouter >
          <UserContextProvider>
            <TicketDetails />
          </UserContextProvider>
        </BrowserRouter>
      );
    })
    const status = wrapper!.getByText('Son')
    expect(status).toBeVisible()
  });
});
