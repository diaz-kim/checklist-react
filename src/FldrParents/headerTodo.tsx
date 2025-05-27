import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Plus, Search, Trash, Maximize2, Minimize2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToDoItem {
    text: string;
    check: boolean;
}

function HeaderTodo() { 

const [fullWidth, setFullWidth] = useState(false);
const width = fullWidth ? "w-full" : "w-full md:w-[60vw]";

const [task, setTask] = useState("");
const [todo, setTodo] = useState<ToDoItem[]>(() => {
    const stored = localStorage.getItem("todo-list");
    return stored ? JSON.parse(stored) : [];
});
const [drag, setDrag] = useState<number | null>(null);
const [search, setSearch] = useState("");
const filteredTodo = todo.filter(item =>
    item.text.toLowerCase().includes(search.toLowerCase())
);

const count = todo.filter(item => item.check).length;

useEffect(() => {
    localStorage.setItem("todo-list", JSON.stringify(todo));
}, [todo]);

function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setTask(e.target.value);
}

function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
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

function handleClearAll() {
    setTodo([]);
}

// mobile
const [touchStartY, setTouchStartY] = useState<number | null>(null);
const [touchDragIndex, setTouchDragIndex] = useState<number | null>(null);

function handleTouchStart(e: React.TouchEvent, index: number) {
  setTouchStartY(e.touches[0].clientY);
  setTouchDragIndex(index);
}

function handleTouchMove(e: React.TouchEvent) {
  if (touchStartY === null || touchDragIndex === null) return;
  const currentY = e.touches[0].clientY;
  const deltaY = currentY - touchStartY;

  if (Math.abs(deltaY) > 30) {
    const direction = deltaY > 0 ? 1 : -1;
    const newIndex = touchDragIndex + direction;
    if (newIndex >= 0 && newIndex < todo.length) {
      const newTodo = [...todo];
      const [removed] = newTodo.splice(touchDragIndex, 1);
      newTodo.splice(newIndex, 0, removed);
      setTodo(newTodo);
      setTouchDragIndex(newIndex);
      setTouchStartY(currentY);
    }
  }
}

function handleTouchEnd() {
  setTouchStartY(null);
  setTouchDragIndex(null);
}

return (
    <>
    <div className="flex flex-col items-center gap-5 min-w-[300px] text-base">
        <div className={cn("flex flex-row justify-between", width)}>
            <Button
            className="self-end"
            variant="outline"
            onClick={() => setFullWidth(w => !w)}
            title={fullWidth ? "Shrink" : "Expand"}
        >
            {fullWidth ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </Button>
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                className="bg-red-500 hover:bg-red-600 text-white self-start"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Clear all?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-red-500 hover:bg-red-600 text-white" onClick={handleClearAll}>Clear</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </div>
    <Card className={width}>
        <CardContent>
            <div className="grid grid-cols-2 gap-4 items-center">
                <h1 className="text-3xl font-bold">
                    {count} / {todo.length}
                </h1>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row items-center">
                        <Input placeholder="Task" value={task} 
                            onChange={handleInput}
                            onKeyDown={(e) => {if (e.key === "Enter") handleAdd(); }}
                            className="me-2 text-lg"
                        />
                        <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={handleAdd} ><Plus color="white" /></Button>
                    </div>
                        <div className="relative w-full">
                        <Input
                        value={search}
                        onChange={handleSearch}
                        className="pl-10"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
    <Card className={width}>
        <CardContent>
            <ol className="flex flex-col items-start">
                {filteredTodo.length === 0 ? (
                    <span className="text-center w-full text-gray-400 text-[1.15rem]">No tasks yet</span>
                ) : (
                filteredTodo.map((item) => {
                    const index = todo.indexOf(item);
                    return (
                        <li
                        key={index}
                        className="flex items-center w-full justify-between text-[1.15rem]"
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={() => handleDragOver(index)}
                        onDragEnd={handleDragEnd}
                        onTouchStart={e => handleTouchStart(e, index)}
                        onTouchMove={e => handleTouchMove(e)}
                        onTouchEnd={handleTouchEnd}
                        >
                            <span className="flex items-center gap-2">
                                <Checkbox className="bg-gray-200" checked={item.check} onCheckedChange={()=>handleCheck(index)}/>
                                <span
                                    className={
                                        (item.check ? "line-through text-gray-400 " : "") +
                                        "text-left w-full"
                                    }
                                >
                                    {item.text}
                                </span>
                            </span>
                            <Button variant="ghost" onClick={()=>handleDelete(index)} ><Trash color="red" /></Button>
                        </li>
                    );
                }))}
            </ol>
        </CardContent>
    </Card>
    </div>
    <div className="absolute flex bottom-0 left-0 w-full items-center justify-center text-[1.01rem] text-gray-800 py-2">
        <p>Copyright &#169; 2025 Kim Diaz</p>
    </div>
    </>
)
}

export default HeaderTodo;