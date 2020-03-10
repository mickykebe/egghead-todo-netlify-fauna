import React, { useContext, useRef, useReducer } from "react";
import { Link } from "@reach/router";
import {
  Container,
  Flex,
  NavLink,
  Input,
  Label,
  Button,
  Checkbox
} from "theme-ui";
import { gql, useMutation, useQuery } from "@apollo/client";
import { IdentityContext } from "../../identity-context";

const ADD_TODO = gql`
  mutation AddTodo($text: String!) {
    addTodo(text: $text) {
      id
    }
  }
`;

const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      text
      done
    }
  }
`;

const UPDATE_TODO_DONE = gql`
  mutation UpdateTodoDone($id: ID!) {
    updateTodoDone(id: $id) {
      text
      done
    }
  }
`;

const todosReducer = (state, action) => {
  switch (action.type) {
    case "addTodo":
      return [{ done: false, value: action.payload }, ...state];
    case "toggleTodo":
      return state.map((todo, index) => ({
        value: todo.value,
        done: index === action.payload ? !todo.done : todo.done
      }));
    default:
      throw new Error("Unknown Action Type");
  }
};

export default () => {
  const { user, identity } = useContext(IdentityContext);
  const inputRef = useRef();
  const [addTodo] = useMutation(ADD_TODO);
  const [updateTodoDone] = useMutation(UPDATE_TODO_DONE);
  const { loading, error, data, refetch } = useQuery(GET_TODOS);

  return (
    <Container>
      <Flex as="nav">
        <NavLink as={Link} to="/" p={2}>
          Home
        </NavLink>
        <NavLink as={Link} to={"/app"} p={2}>
          Dashboard
        </NavLink>
        {user && (
          <NavLink href="#!" p={2} onClick={() => identity.logout()}>
            Log out {user.user_metadata.full_name}
          </NavLink>
        )}
      </Flex>
      <Flex
        as="form"
        onSubmit={async e => {
          e.preventDefault();
          await addTodo({ variables: { text: inputRef.current.value } });
          inputRef.current.value = "";
          await refetch();
        }}>
        <Label sx={{ display: "flex" }}>
          <span>Add &nbsp; Todo</span>
          <Input ref={inputRef} sx={{ marginLeft: 1 }} />
        </Label>
        <Button sx={{ marginLeft: 1 }}>Submit</Button>
      </Flex>
      <Flex sx={{ flexDirection: "column" }}>
        {loading && <div>loading ...</div>}
        {error && <div>{error.message}</div>}
        {!loading && !error && (
          <ul sx={{ listStyleType: "none" }}>
            {data.todos.map(todo => (
              <Flex
                as="li"
                key={todo.id}
                onClick={async e => {
                  await updateTodoDone({ variables: { id: todo.id } });
                  await refetch();
                }}>
                <Checkbox checked={todo.done} />
                <span>{todo.text}</span>
              </Flex>
            ))}
          </ul>
        )}
      </Flex>
    </Container>
  );
};
