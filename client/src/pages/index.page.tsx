import type { TaskModel } from 'commonTypesWithClient/models';
import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { Loading } from 'src/components/Loading/Loading';
import { apiClient } from 'src/utils/apiClient';
import { returnNull } from 'src/utils/returnNull';
import styles from './index.module.css';

const Home = () => {
  const [tasks, setTasks] = useState<TaskModel[]>();
  const [label, setLabel] = useState('');
  const inputLabel = (e: ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
  };
  const fetchTasks = async () => {
    const tasks = await apiClient.tasks.$get().catch(returnNull);

    if (tasks !== null) setTasks(tasks);
  };
  const createTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!label) return;

    await apiClient.tasks.post({ body: { label } });
    setLabel('');
    await fetchTasks();
  };
  const toggleDone = async (task: TaskModel) => {
    await apiClient.tasks._taskId(task.id).patch({ body: { done: !task.done } });
    await fetchTasks();
  };
  const deleteTask = async (task: TaskModel) => {
    await apiClient.tasks._taskId(task.id).delete();
    await fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);
  if (!tasks) return <Loading visible={true} />;

  return (
    <>
      <div className={styles.title} style={{ marginTop: '160px' }}>
        Welcome to frourio!
      </div>
      <button
        onClick={async () =>
          await apiClient.game.config.$post({
            body: { width: 10, height: 10, bombRatioPercent: 10 },
          })
        }
      >
        test
      </button>

      <form style={{ textAlign: 'center', marginTop: '80px' }} onSubmit={createTask}>
        <input value={label} type="text" onChange={inputLabel} />
        <input type="submit" value="ADD" />
      </form>
      <ul className={styles.tasks}>
        {tasks.map((task) => (
          <li key={task.id}>
            <label>
              <input type="checkbox" checked={task.done} onChange={() => toggleDone(task)} />
              <span>{task.label}</span>
            </label>
            <input
              type="button"
              value="DELETE"
              className={styles.deleteBtn}
              onClick={() => deleteTask(task)}
            />
          </li>
        ))}
      </ul>
    </>
  );
};

export default Home;
