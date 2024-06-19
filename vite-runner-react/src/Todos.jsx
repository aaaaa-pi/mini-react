import React from "../core/React";

export function Todos (){
    const [todos,setTodos] = React.useState([
        {
            id: crypto.randomUUID(), // 浏览器创建的唯一标识
            title:'吃饭',
            status: 'active'
        },
        {
            id: crypto.randomUUID(), // 浏览器创建的唯一标识
            title:'吃饭',
            status: 'active'
        },
        {
            id: crypto.randomUUID(), // 浏览器创建的唯一标识
            title:'吃饭',
            status: 'active'
        }
    ])
    const [inputValue,setInputValue] = React.useState("")
    function handleAdd (){
        addTodo(inputValue)
        setInputValue("")
    }
    function addTodo(title) {
        setTodos((todos) => [
            ...todos,
            { 
                id: crypto.randomUUID(),   
                title 
            }
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
    
    return (
        <div>
            <h1>Todos</h1>
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
            <button onClick = {handleAdd}>add</button>

            <ul>
                {...todos.map((todo) => {
                   return (
                        <li className={todo.status}>
                            {todo.title}
                            <button onClick={() => removeTodo(todo.id)}>remove</button>    
                            {todo.status === "active" ? 
                                <button onClick={() => doneTodo(todo.id)}>done</button>:
                                <button onClick={() => cancelTodo(todo.id)}>cabcel</button>    
                            }   
                        </li>  
                   )
                })}
            </ul>
        </div>
    )
}