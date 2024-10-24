import { useEffect, useState } from 'react'
import TaskInput from '../TaskInput'
import TaskList from '../TaskList'
import styles from './todoList.module.scss'
import { AddTodo, Todo } from '../../@types/todo.type'
import { database } from '../../firebaseConfig'
import { collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null)
  const collectionRef = collection(database, 'todos')
  const auth = getAuth()

  const doneTodos = todos.filter((todo) => todo.done)
  const notDoneTodos = todos.filter((todo) => !todo.done)

  useEffect(() => {
    const loadTodosFromLocalStorage = () => {
      const localTodosString = localStorage.getItem('todos')
      if (localTodosString) {
        const localTodos: Todo[] = JSON.parse(localTodosString)
        setTodos(localTodos)
      }
    }

    loadTodosFromLocalStorage()

    const unsubscribe = onSnapshot(
      collectionRef,
      (querySnapshot) => {
        const todosArray = querySnapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            name: data.name,
            done: data.done
          }
        })
        console.log(todosArray)
        setTodos(todosArray)
        localStorage.setItem('todos', JSON.stringify(todosArray))
      },
      (error) => {
        console.error('Error getting documents: ', error)
      }
    )

    return () => unsubscribe()
  }, [])

  const showAlert = () => {
    alert('You need to be logged in to make changes! Please sign in to continue.')
  }

  const addTodo = async (name: string) => {
    if (!auth.currentUser) {
      showAlert()
      return
    }

    const todo: AddTodo = {
      name,
      done: false
    }
    await addDoc(collectionRef, todo)
    const updatedTodos = [...todos, { ...todo, id: Date.now().toString() }]
    setTodos(updatedTodos)
    localStorage.setItem('todos', JSON.stringify(updatedTodos))
  }

  const handleDoneTodo = async (id: string, done: boolean) => {
    if (!auth.currentUser) {
      showAlert()
      return
    }

    const todoRef = doc(database, 'todos', id)
    await updateDoc(todoRef, { done })

    const updatedTodos = todos.map((todo) => (todo.id === id ? { ...todo, done } : todo))
    setTodos(updatedTodos)
    localStorage.setItem('todos', JSON.stringify(updatedTodos))
  }

  const startEditTodo = (id: string) => {
    const findedTodo = todos.find((todo) => todo.id === id)
    if (findedTodo) {
      setCurrentTodo(findedTodo)
    }
  }

  const editTodo = (name: string) => {
    setCurrentTodo((prev) => {
      if (prev) return { ...prev, name }
      return null
    })
  }

  const finishedEditTodo = async () => {
    if (!auth.currentUser) {
      showAlert()
      return
    }

    if (currentTodo) {
      const todoRef = doc(database, 'todos', currentTodo.id)
      await updateDoc(todoRef, { name: currentTodo.name })

      const updatedTodos = todos.map((todo) =>
        todo.id === currentTodo.id ? { ...todo, name: currentTodo.name } : todo
      )
      setTodos(updatedTodos)
      localStorage.setItem('todos', JSON.stringify(updatedTodos))
    }
    setCurrentTodo(null)
  }

  const deleteTodo = async (id: string) => {
    if (!auth.currentUser) {
      showAlert()
      return
    }

    if (currentTodo) {
      setCurrentTodo(null)
    }
    const todoRef = doc(database, 'todos', id)
    await deleteDoc(todoRef)

    const updatedTodos = todos.filter((todo) => todo.id !== id)
    setTodos(updatedTodos)
    localStorage.setItem('todos', JSON.stringify(updatedTodos))
  }

  return (
    <div className={styles.todoList}>
      <div className={styles.todoListContainer}>
        <TaskInput
          addTodo={addTodo}
          currentTodo={currentTodo}
          editTodo={editTodo}
          finishedEditTodo={finishedEditTodo}
        />
        <TaskList
          todos={notDoneTodos}
          handleDoneTodo={handleDoneTodo}
          startEditTodo={startEditTodo}
          deleteTodo={deleteTodo}
        />
        <TaskList
          todos={doneTodos}
          doneTaskList
          handleDoneTodo={handleDoneTodo}
          startEditTodo={startEditTodo}
          deleteTodo={deleteTodo}
        />
      </div>
    </div>
  )
}
