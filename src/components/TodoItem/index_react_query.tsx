import React from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import { TodoModel } from '../../todoModel';
import { API_BASE_URL } from '../../config';

interface TodoItemProps {
  id: number;
}

export const TodoItem = ({ id }: TodoItemProps) => {
  const selfUrl = `${API_BASE_URL}/todos/${id}`;
  const { isLoading, error, data } = useQuery<TodoModel>(['todoItem', id], () =>
    axios.get<TodoModel>(selfUrl).then((content) => content.data),
  );
  const queryClient = useQueryClient();

  const { mutate } = useMutation<
    TodoModel,
    unknown,
    boolean,
    { previousState: boolean; newTodoState: boolean }
  >(
    (newState) =>
      axios.patch(selfUrl, { done: newState }).then((data) => data.data),
    {
      onMutate: async (willBeDone) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(['todoItem', id]);

        // Snapshot the previous value
        const previousTodo = queryClient.getQueryData<TodoModel>([
          'todoItem',
          id,
        ]);

        // Optimistically update to the new value
        queryClient.setQueryData(['todoItem', id], {
          ...previousTodo,
          done: willBeDone,
        });

        // Return a context with the previous and new todo
        return { previousState: !willBeDone, newTodoState: willBeDone };
      },
      // If the mutation fails, use the context we returned above
      onError: (err, newTodo, context) => {
        const previousTodo = queryClient.getQueryData<TodoModel>([
          'todoItem',
          id,
        ]);
        queryClient.setQueryData(['todoItem', id], {
          ...previousTodo,
          done: context?.previousState,
        });
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(['todoItem', id]);
      },
    },
  );

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Something went wrong...</div>;
  }

  return (
    <div className="flex justify-center">
      <div className="flex-1">{data.title}</div>
      <div>
        <Checkbox.Root
          defaultChecked={data.done}
          className="bg-transparent border-none p-0 h-4 w-4 rounded flex items-center justify-center ring-2"
          onCheckedChange={(event) => {
            console.log(event);
            console.log(event.target.value);
            mutate(event.target.checked);
          }}
        >
          <Checkbox.Indicator as={CheckIcon} />
        </Checkbox.Root>
      </div>
    </div>
  );
};
