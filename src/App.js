import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { gql } from "apollo-boost";


const GET_TODOS =  gql`
  query getTodos {
    todos {
      id
      text
      done
    }
  }
`;

const TOGGLE_TODO = gql`
  mutation toggleTodo($id: uuid!, $done: Boolean!) {
  update_todos(where: {id: {_eq: $id}}, _set: {done: $done}) {
    returning {
      done
      id
      text
    }
  }
}
`;

const ADD_TODO = gql`
mutation addTodo($text: String!) {
  insert_todos(objects: {text: $text}) {
    returning {
      done
      id
      text
    }
  }
}
`;

const DEL_TODO = gql`
  mutation deleteTodo($id: uuid!) {
  delete_todos(where: {id: {_eq: $id}}) {
    returning {
      done
      id
      text
    }
  }
}
`;

function App() {

  const [text, setText] = useState("");

  const { data, loading, error } = useQuery(GET_TODOS);

  //mutations
  const [toggleTodo] = useMutation(TOGGLE_TODO);
  const [addTodo] = useMutation(ADD_TODO);
  const [deleteTodo] = useMutation(DEL_TODO);

  if(loading) return <h1>loading</h1>
  if(error) return <h1 style={{color: "red"}}>Error fetching todos</h1>

  async function handleToggleTodo({id, done}) {
    const data = await toggleTodo({ variables: { id, done: !done} });
    console.log(data);
  };

  async function handleAddTodo(e){
    e.preventDefault();

    if(!text.trim()) return;

    const data = await addTodo({ variables: { text }, 
      refetchQueries: [
        {query: GET_TODOS}
      ]
    });
    console.log("added todo", data);
    setText("");
  }

  async function handleDelTodo(id) {
    const isConfirmed = window.confirm("Want to delete this todo?");
    if(isConfirmed) {
      await deleteTodo({ variables: {id}, update: cache => {
        const prevData = cache.readQuery({ query: GET_TODOS });
        const newTodos  = prevData.todos.filter(todo =>  todo.id !== id);
        cache.writeQuery({query: GET_TODOS, data: { todos: newTodos}})
      }});
    } 
  }

  return(
    <div className="vh-100 code flex flex-column items-center bg-purple white pa3 fl-1">
      <h1 className="f2-l">GraphQL Checklist
      <span role="img" aria-label="Checkmark">💯</span>
      </h1>
      <form onSubmit={handleAddTodo} className="mb3 ">
        <input onChange={(e) => setText(e.target.value)} value={text} className="pa2 f4" type="text" placeholder="Todo?" />
        <button className="pa2 f4 bg-green" type="submit">Create</button>
      </form>
      <div className="flex items-center justify-center flex-column">
        {data.todos.map(todo => (
          <p onDoubleClick={() => handleToggleTodo(todo)} key={todo.id}>
            <span className={`pointer list pa1 f3 ${todo.done && "strike"}`}>{todo.text}</span>
            <button onClick={() => handleDelTodo(todo.id)} className="bg-transparent bn f1f">
              <span className="red">&times;</span>
            </button>
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;
