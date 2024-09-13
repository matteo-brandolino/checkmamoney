import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { open } from "@tauri-apps/plugin-dialog";
import { readTextFileLines } from "@tauri-apps/plugin-fs";

type DataObject = {
  [key: string]: string | null; // Tipo generico per le proprietà degli oggetti
};

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [jsonData, setJsonData] = useState<DataObject[]>([]); // Stato per i dati JSON

  async function greet() {
    try {
      const filePath = await open({
        filters: [
          {
            name: "CSV",
            extensions: ["csv"],
          },
        ],
      });
      if (!filePath) return null;

      console.log(filePath);

      const lines = await readTextFileLines(filePath);
      console.log(lines);
      let header: string[] = [];
      const dataObjects: DataObject[] = []; // Array per accumulare gli oggetti

      for await (const line of lines) {
        if (header.length === 0) {
          header = line.split(";");
          console.log(`Header: ${header}`);
          continue;
        }

        const values = line.split(";");
        const dataObject = header.reduce<DataObject>((obj, key, index) => {
          obj[key] = values[index] || null; // Gestione di valori nulli
          return obj;
        }, {} as DataObject); // Inizializza l'accumulatore come un oggetto vuoto

        dataObjects.push(dataObject); // Aggiungi l'oggetto all'array
        console.log(dataObject); // Log dell'oggetto creato
      }

      setJsonData(dataObjects); // Salva i dati JSON nello stato

      // Esempio di invocazione di una funzione Tauri
      setGreetMsg(await invoke("greet", { name }));
    } catch (error) {
      console.error("Error reading file:", error);
      setGreetMsg("An error occurred while reading the file.");
    }
  }

  return (
    <div className="container">
      <h1>Welcome to Tauri!</h1>
      <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <p>Click on the Tauri, Vite, and React logos to learn more.</p>
      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
      <p>{greetMsg}</p>
      <pre>{JSON.stringify(jsonData, null, 2)}</pre> {/* Stampa i dati JSON */}
    </div>
  );
}

export default App;
