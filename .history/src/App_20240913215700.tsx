import { useState } from "react";

import { open } from "@tauri-apps/plugin-dialog";
import { readTextFileLines } from "@tauri-apps/plugin-fs";
import { TableReviews } from "./components/Table";
import { Button } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";

import "./App.css";

type DataObject = {
  [key: string]: string | null; // Tipo generico per le proprietà degli oggetti
};

function App() {
  const [data, setData] = useState<DataObject[]>([]);

  async function importFile() {
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

      setData(dataObjects);
    } catch (error) {
      console.error("Error reading file:", error);
    }
  }

  return (
    <div className="container">
      <h1>Welcome to Tauri!</h1>
      <form onSubmit={importFile}>
        <Button
          onClick={importFile}
          radius="xl"
          rightSection={<IconDownload size={14} />}
        >
          Import
        </Button>
      </form>
      {data.length > 0 && <TableReviews />}
    </div>
  );
}

export default App;
