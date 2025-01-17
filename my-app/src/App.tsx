import React, { useState, ChangeEvent } from 'react';
import './App.css';
import { Task } from './interfaces/Task'
import TaskItem from './components/TaskItem';

const loadTaskList = (): Task[] => {
  const data = localStorage.getItem("taskList")
  return JSON.parse(data || "[]")
}

const App: React.FC = () => {

  const [taskName, setTaskName] = useState<string>("");
  const [taskList, setTaskList] = useState<Task[]>(() => loadTaskList());

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setTaskName(event.target.value)
  };

  const updateTaskList = (updatedTaskList: Task[]) => {
    localStorage.setItem("taskList", JSON.stringify(updatedTaskList));
    setTaskList(updatedTaskList)
  }

  const handleTaskStatus = (updatedTask: Task) => {
    const updatedTaskList = taskList.map((outdatedTask) => {
      if (outdatedTask.name == updatedTask.name) {
        return updatedTask
      }
      return outdatedTask
    });

    updateTaskList(updatedTaskList);
  };

  const handleRemoveTask = (task: Task): void => {
    const filteredTasks = taskList.filter((t) => t.name !== task.name);
    updateTaskList(filteredTasks)
  };

  const handleEditTask = (task: Task, newName: string) => {
    const updatedTaskList = taskList.map((outdatedTask) => {
      if (outdatedTask.name === task.name) {
        return {
          name: newName,
          completed: task.completed
        };
      }
      return outdatedTask;
    });
    
    updateTaskList(updatedTaskList);
  };

  const addTask = (): void => {
    if (taskName.trim().length > 0) {
      const newTask = {
        name: taskName,
        completed: false
      };
      const updatedTaskList = [...taskList, newTask]
      
      setTaskName("")
      updateTaskList(updatedTaskList);
    }
  }

  const removeTask = (task: Task): void => {
    const index = taskList.indexOf(task);
    if (index !== -1) {
      const updatedTaskList = [...taskList];
      updatedTaskList.splice(index, 1);
      
      updateTaskList(updatedTaskList);
    }
  };

  return (
    <div className="App">
      <div className='header'>
        <h1>Lista de tarefas</h1>
        <div>
          <input type='text' value={taskName} placeholder='type your task here' onChange={handleChange}/>
          <button onClick={addTask}>add</button>
        </div>
      </div>
      <div className='todoList'>
        <div className='pending'>
          <h1>Pendentes</h1>
          {taskList.filter((t) => t.completed === false).map( (task: Task, key: number) => {
            return <TaskItem 
            key={key} 
            task={task} 
            onComplete={handleTaskStatus} 
            onRemove={handleRemoveTask}
            onEdit={handleEditTask} 
            />
          })}
        </div>
        <div className='done'>
          <h1>Completas</h1>
          {taskList.filter((t) => t.completed === true).map( (task: Task, key: number) => {
            return <TaskItem 
            key={key} 
            task={task} 
            onComplete={handleTaskStatus} 
            onRemove={handleRemoveTask}
            onEdit={handleEditTask} 
            />
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
