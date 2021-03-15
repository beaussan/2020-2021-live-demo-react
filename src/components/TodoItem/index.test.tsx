import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { TodoItem } from './index';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { TodoModel } from '../../todoModel';
import { Toaster } from 'react-hot-toast';
import { API_BASE_URL } from '../../config';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('TodoItem', () => {
  it('should display the title', () => {
    const TITLE = 'My awesome todo item';
    render(
      <TodoItem title={TITLE} done={false} id={2} refreshValues={() => {}} />,
    );

    expect(screen.getByText(/my awesome todo item/i)).toBeInTheDocument();
  });

  it('should display the state in the checkbox when unchecked', () => {
    render(
      <TodoItem title={'toto'} done={false} id={2} refreshValues={() => {}} />,
    );
    expect(screen.getByRole('checkbox')).toHaveAttribute(
      'aria-checked',
      'false',
    );
  });

  it('should display the state in the checkbox when checked', () => {
    render(
      <TodoItem title={'toto'} done={true} id={2} refreshValues={() => {}} />,
    );
    expect(screen.getByRole('checkbox')).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('should update when I click on the ckeckbox and call the api', async () => {
    const mockFn = jest.fn();
    server.use(
      rest.patch<Partial<TodoModel>>(
        `${API_BASE_URL}/todos/1`,
        (req, res, ctx) => {
          expect(req.body.done).toBeTruthy();
          return res(ctx.status(200));
        },
      ),
    );

    render(
      <>
        <TodoItem title={'toto'} done={false} id={1} refreshValues={mockFn} />,
        <Toaster />
      </>,
    );

    await screen.getByRole('checkbox').click();

    await screen.findByText(/Updated /i);

    expect(screen.getByRole('checkbox')).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(mockFn).toHaveBeenCalled();
  });
});
