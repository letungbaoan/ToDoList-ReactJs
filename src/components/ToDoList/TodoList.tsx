import TaskInput from '../TaskInput'
import TaskList from '../TaskList'
import styles from './todoList.module.scss'

export default function TodoList() {
  return (
    <div className={styles.todoList}>
      <div className={styles.todoListContainer}>
        <TaskInput />
        <TaskList doneTaskList={false} />
        <TaskList doneTaskList />
      </div>
    </div>
  )
}
