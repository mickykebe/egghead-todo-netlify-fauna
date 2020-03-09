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
import { IdentityContext } from "../../identity-context";

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
  const [todos, dispatch] = useReducer(todosReducer, []);

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
        onSubmit={e => {
          e.preventDefault();
          dispatch({ type: "addTodo", payload: inputRef.current.value });
          inputRef.current.value = "";
        }}>
        <Label sx={{ display: "flex" }}>
          <span>Add &nbsp; Todo</span>
          <Input ref={inputRef} sx={{ marginLeft: 1 }} />
        </Label>
        <Button sx={{ marginLeft: 1 }}>Submit</Button>
      </Flex>
      <Flex sx={{ flexDirection: "column" }}>
        <ul sx={{ listStyleType: "none" }}>
          {todos.map((todo, index) => (
            <Flex
              as="li"
              key={index}
              onClick={e => {
                dispatch({ type: "toggleTodo", payload: index });
              }}>
              <Checkbox checked={todo.done} />
              <span>{todo.value}</span>
            </Flex>
          ))}
        </ul>
      </Flex>
    </Container>
  );
};
