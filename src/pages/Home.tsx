import { useEffect, useState } from "react";
import "../App.css"
import { BaseDirectory, exists, readTextFile, writeTextFile, mkdir } from "@tauri-apps/plugin-fs";
import TodoForm from "../components/TodoForm";
import TodoItem from "../components/TodoItem";

const FILE_NAME = "todo.json";

async function loadTodoList(): Promise<string[]> {
  const fileAppDataExists = await exists(FILE_NAME, { baseDir: BaseDirectory.AppData })
  if (fileAppDataExists) {
    const data = await readTextFile(FILE_NAME, { baseDir: BaseDirectory.AppData })
    console.log("File found! Data: ", data)
    return JSON.parse(data)
  } else {
    console.log("No file found :(, creating file and/or directory")
    await mkdir('', {
      baseDir: BaseDirectory.AppData,
    });
    return []
  }
}

async function saveTodoList(list: string[]): Promise<void> {
  const jsonList = JSON.stringify(list)
  await writeTextFile(FILE_NAME, jsonList, { baseDir: BaseDirectory.AppData })
}

function Home() {
  const [input, setInput] = useState("");
  const [list, setList] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    loadTodoList().then(savedList => {
      setList(savedList.length ? savedList : ["Default Task"]);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) {
      saveTodoList(list);
    }
  }, [list, loaded]);

  const addItem = () => {
    if (!input.trim()) return;
    setList([...list, input.trim()]);
    setInput("");
  };

  const removeItem = (index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  const clearItems = () => {
    setList([]);
  };

  return (
    <>
      <main id="app">
        <TodoForm input={input} setInput={setInput} onAdd={addItem} />

        <section className="list">
          {list.map((item, index) => (
            <TodoItem item={item} index={index} onRemove={removeItem}/>
          ))}

          {list.length > 0 && (
            <button className="remove" onClick={clearItems}>
              Clear All Items
            </button>
          )}
        </section>
      </main>
    </>
  );
}

export default Home;
