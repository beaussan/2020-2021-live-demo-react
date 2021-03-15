import React, { useCallback, useEffect, useState } from 'react';
import { TodoItem } from './components/TodoItem';
import axios from 'axios';
import { TodoModel } from './todoModel';
import { API_BASE_URL } from './config';

function App() {
  const [todos, setTodos] = useState<TodoModel[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [hasErrored, setHasErrored] = useState<boolean>(false);

  const refreshData = () => {
    axios
      .get<TodoModel[]>(`${API_BASE_URL}/todos`)
      .then(({ data }) => {
        setTodos(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setHasErrored(true);
      });
  };

  useEffect(() => {
    refreshData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (hasErrored) {
    return <div>Something went bad :(</div>;
  }

  return (
    <div className="h-screen w-screen bg-gray-100 flex justify-center items-center content-center">
      <div className="bg-white shadow rounded-lg p-4 w-60">
        {todos.map(({ id, done, title }) => (
          <TodoItem
            done={done}
            title={title}
            id={id}
            key={id}
            refreshValues={() => refreshData()}
          />
        ))}
      </div>
    </div>
  );
}
/*
function AppUsingReactQuery() {
  const { isLoading, error, data } = useQuery<TodoModel[]>('todoList', () =>
    axios
      .get<TodoModel[]>(`${API_BASE_URL}/todos`)
      .then((result) => result.data),
  );

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Something went bad :(</div>;
  }

  return (
    <div className="h-screen w-screen bg-gray-100 flex justify-center items-center content-center">
      <div className="bg-white shadow rounded-lg p-4 w-60">
        {data.map(({ id }) => (
          <TodoItem id={id} key={id} />
        ))}
      </div>
    </div>
  );
}

 */

export default App;
