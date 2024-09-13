import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { open } from "@tauri-apps/plugin-dialog";
import { readTextFileLines } from "@tauri-apps/plugin-fs";
import { TableReviews } from "./components/Table";

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
          obj[key] = values[index] || null;
          return obj;
        }, {} as DataObject);

        dataObjects.push(dataObject);
        console.log(dataObject);
      }

      setJsonData(dataObjects);

      // Esempio di invocazione di una funzione Tauri
      setGreetMsg(await invoke("greet", { name }));
    } catch (error) {
      console.error("Error reading file:", error);
    }
  }

  return (
    <div className="container">
      <h1>Welcome to Tauri!</h1>
      <TableReviews />
    </div>
  );
}

export default App;
