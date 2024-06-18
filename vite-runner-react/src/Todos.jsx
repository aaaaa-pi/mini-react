import React from "../core/React";

export function Todos (){
    const [todos,setTodos] = React.useState([
        {
            id: crypto.randomUUID(), // 浏览器创建的唯一标识
            title:'吃饭'
        },
        {
            id: crypto.randomUUID(), // 浏览器创建的唯一标识
            title:'吃饭'
        },
        {
            id: crypto.randomUUID(), // 浏览器创建的唯一标识
            title:'吃饭'
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
    
    return (
        <div>
            <h1>Todos</h1>
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
            <button onClick = {handleAdd}>add</button>

            <ul>
                {...todos.map((todo) => {
                   return (
                        <li>
                            {todo.title}
                            <button onClick={() => removeTodo(todo.id)}>remove</button>    
                        </li>  
                   )
                })}
            </ul>
        </div>
    )
}