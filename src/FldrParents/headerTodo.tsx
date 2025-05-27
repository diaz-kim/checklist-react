import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash } from "lucide-react";

interface ToDoItem {
    text: string;
    check: boolean;
}

function HeaderTodo() { 

const [task, setTask] = useState("");
const [todo, setTodo] = useState<ToDoItem[]>(() => {
    const stored = localStorage.getItem("todo-list");
    return stored ? JSON.parse(stored) : [];
});
const [drag, setDrag] = useState<number | null>(null);

const count = todo.filter(item => item.check).length;

useEffect(() => {
    localStorage.setItem("todo-list", JSON.stringify(todo));
}, [todo]);

function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setTask(e.target.value);
}

function handleAdd() {
    if (task.trim() === "") return;
    setTodo([...todo, { text: task.trim(), check: false}]);
    setTask("");
}

function handleCheck(index: number) {
    setTodo(todo =>
        todo.map((item, i) =>
            i === index ? {...item, check: !item.check} : item
        )
    )
}

function handleDelete(index: number) {
    setTodo(todo =>
        todo.filter((_, i) => i !== index
        )
    )
}

function handleDragStart(index: number) {
    setDrag(index);
}

function handleDragOver(index: number) {
    if (drag === null) return;
    if (drag === index) return;

    const newTodo = [...todo];
    const dragValue = newTodo[drag];
    newTodo.splice(drag, 1);
    newTodo.splice(index, 0, dragValue);

    setDrag(index);
    setTodo(newTodo);
}

function handleDragEnd() {
    setDrag(null);
}

return (
    <>
    <div className="flex flex-col items-center gap-6 min-w-[300px]">
    <Card className="w-full md:w-[40vw]">
        <CardContent>
            <div className="grid grid-cols-2 gap-4 items-center">
                <div>
                    {count} / {todo.length}
                </div>
                <div className="flex items-center">
                    <Input placeholder="Add an item" value={task} 
                        onChange={handleInput}
                        onKeyDown={(e) => {if (e.key === "Enter") handleAdd(); }}
                        className="me-2"
                    />
                    <Button variant="outline" onClick={handleAdd} ><Plus color="green" /></Button>
                </div>
            </div>
        </CardContent>
    </Card>
    <Card className="w-full md:w-[40vw]">
        <CardContent>
            <ol className="flex flex-col items-start">
                {todo.map((item, index) => 
                <li key={index} className="flex items-center w-full justify-between"
                    draggable
                    onDragStart={()=>handleDragStart(index)}
                    onDragOver={()=>handleDragOver(index)}
                    onDragEnd={handleDragEnd}
                >
                    <span className="flex items-center gap-2">
                    <Checkbox className="bg-gray-200" checked={item.check} onCheckedChange={()=>handleCheck(index)}/>
                    <span className={ item.check ? "line-through text-gray-400" : ""} >
                        {item.text} 
                    </span>
                    </span>
                    <Button variant="ghost" onClick={()=>handleDelete(index)} ><Trash color="red" /></Button>
                </li>
                )}
            </ol>
        </CardContent>
    </Card>
    </div>
    </>
)
}

export default HeaderTodo;