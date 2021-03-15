import React from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import { API_BASE_URL } from '../../config';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface TodoItemProps {
  title: string;
  done: boolean;
  id: number;
  refreshValues: () => void;
}

export const TodoItem = ({ id, title, done, refreshValues }: TodoItemProps) => {
  const selfUrl = `${API_BASE_URL}/todos/${id}`;

  const updateIsDone = async (isDone: boolean) => {
    await axios.patch(selfUrl, { done: isDone });
    refreshValues();
    toast('Updated !');
  };

  return (
    <div className="flex justify-center">
      <div className="flex-1">{title}</div>
      <div>
        <Checkbox.Root
          defaultChecked={done}
          className="bg-transparent border-none p-0 h-4 w-4 rounded flex items-center justify-center ring-2"
          onCheckedChange={(event) => {
            updateIsDone(event.target.checked);
          }}
        >
          <Checkbox.Indicator as={CheckIcon} />
        </Checkbox.Root>
      </div>
    </div>
  );
};
