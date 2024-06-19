import React from "../core/React";

export function Todos (){
    const [filter,setFilter] = React.useState("all")
    const [todos,setTodos] = React.useState([])
    const [displayTodos,setDisplayTodos] = React.useState([])
    const [inputValue,setInputValue] = React.useState("")
    function handleAdd (){
        addTodo(inputValue)
        setInputValue("")
    }
    function createTodo(title) {
        return {id: crypto.randomUUID(),title,status: 'active'}
    }
    function addTodo(title) {
        setTodos((todos) => [
            ...todos,
            createTodo(title)
        ])
    }
    function removeTodo(id) {
        const newTodos = todos.filter((todo) => {
          return id !== todo.id;
        });
    
        setTodos(newTodos);
    }

    function doneTodo(id) {
        const newTodos = todos.map((todo) => {
            if(todo.id === id){
                return { ...todo, status: 'done' }
            }
            return todo
        })
        setTodos(newTodos)
    }
    function cancelTodo(id) {
        const newTodos = todos.map((todo) => {
            if(todo.id === id){
                return { ...todo, status: 'active' }
            }
            return todo
        })
        setTodos(newTodos)
    }

    function saveTodos(){
        localStorage.setItem("todos",JSON.stringify(todos))
    }

    React.useEffect(() => {
        if(filter === "all"){
            setDisplayTodos(todos)
        }else if(filter === "active"){
            const newDisplayTodos = todos.filter((todo) => {
                return todo.status === "active"
            })
            setDisplayTodos(newDisplayTodos)
        }else if(filter === "done"){
            const newDisplayTodos = todos.filter((todo) => {
                return todo.status === "done"
            })
            setDisplayTodos(newDisplayTodos)
        }
    },[filter,todos])
    
    React.useEffect(() => {
        const rawTodos = localStorage.getItem("todos")
        if(rawTodos){
            setTodos(JSON.parse(rawTodos))
        }
    },[])
    return (
        <div>
            <h1>Todos</h1>
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
            <button onClick = {handleAdd}>add</button>
            <button onClick = {saveTodos}>save</button>

            <div>
                <input 
                    type="radio" 
                    name="filter"
                    id="all"
                    checked={filter === "all"} 
                    onClick={() => setFilter("all")}
                />
                <label htmlFor="all">all</label>

                <input 
                    type="radio" 
                    name="filter"
                    id="active"
                    checked={filter === "active"} 
                    onClick={() => setFilter("active")}
                />
                <label htmlFor="active">active</label>

                <input 
                    type="radio" 
                    name="filter"
                    id="done"
                    checked={filter === "done"} 
                    onClick={() => setFilter("done")}
                />
                <label htmlFor="done">done</label>
            </div>

            <ul>
                {...displayTodos.map((todo) => {
                   return (
                        <li>
                            <TodoItem 
                                todo={todo}
                                removeTodo={removeTodo}
                                doneTodo={doneTodo}
                                cancelTodo={cancelTodo}
                            />
                        </li>  
                   )
                })}
            </ul>
        </div>
    )
}

function TodoItem ({todo,removeTodo,doneTodo,cancelTodo}){
    return (
        <div className={todo.status}>
            {todo.title}
            <button onClick={() => removeTodo(todo.id)}>remove</button>    
            {todo.status === "active" ? (
                <button onClick={() => doneTodo(todo.id)}>done</button>
            ):(
                <button onClick={() => cancelTodo(todo.id)}>cabcel</button>
            )}
        </div>
    )
}