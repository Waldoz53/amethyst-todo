import { useEffect, useRef, useState } from "react";
import "./App.css"
import { BaseDirectory, exists, readTextFile, writeTextFile, mkdir } from "@tauri-apps/plugin-fs";

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

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
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
        <section className="form">
          <input
            ref={inputRef}
            type="text"
            value={input}
            placeholder="Add an item"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
          />
          <button onClick={addItem}>+</button>
        </section>

        <section className="list">
          {list.map((item, index) => (
            <div className="item" key={index} style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <p className="line-clamp" style={{ margin: 0 }}>{item}</p>
              <div className="spacer"></div>
              <button onClick={() => removeItem(index)}>Delete</button>
            </div>
          ))}

          {list.length > 0 && (
            <button className="remove" onClick={clearItems} style={{ marginTop: 12 }}>
              Clear All Items
            </button>
          )}
        </section>
      </main>
    </>
  );
}

export default App;
