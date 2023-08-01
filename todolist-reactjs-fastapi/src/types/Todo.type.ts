export interface Todo {
    id: string;
    title: string;
    desc: string;
};

export type Props = {
    id: string;
    onDeleteTodo: (id: string) => void;
};