import { createHook, createSweetContext } from "react-sweet-context";
import { randomWord } from "./utls";

type User = { name: string; age: number };

const initState: User = { name: "John", age: 20 };

export const context = createSweetContext({
  initState,
  action: ({ set, get }) => ({
    updateUser: (user: User) => set(user),

    updateUserName: (name: string) => set({ name }),

    updateUserAge: () => set({ age: get().age + 1 }),
  }),
});

const useMultiState = createHook(context);

export const MultiState = () => {
  const [user, actions] = useMultiState();

  return (
    <div>
      <p className="inline-10">
        <span>Name: {user.name}</span>
        <span>Age: {user.age}</span>
      </p>

      <div className="inline-10">
        <button onClick={() => actions.updateUser(initState)}>
          Reset User
        </button>

        <button onClick={() => actions.updateUserName(randomWord())}>
          Update Name
        </button>

        <button onClick={() => actions.updateUserAge()}>Update Age</button>
      </div>
    </div>
  );
};

const useName = createHook(context, ({ name }) => name);

export const SelectedName = () => {
  const [name] = useName();
  return <span>Name: {name}</span>;
};
