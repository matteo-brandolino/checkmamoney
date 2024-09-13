import { useState } from "react";

import { open } from "@tauri-apps/plugin-dialog";
import { readTextFileLines } from "@tauri-apps/plugin-fs";
import TransactionTable from "./components/TransactionTable";
import { Button } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";

import "./App.css";

export type DataObject = {
  [key: string]: string | null;
};

function App() {
  const [data, setData] = useState<DataObject[]>([]);
  const [header, setHeader] = useState<string[]>([]);

  const onChangeField = (newValue: string, key: string, index: number) => {
    const newData = [...data];
    newData[index][key] = newValue;
    setData(newData);
  };

  const onChangeColumnField = (
    oldColumnName: string,
    newColumnName: string
  ) => {
    const newData = [...data].map((d) => {
      delete Object.assign(d, { [newColumnName]: d[oldColumnName] })[
        oldColumnName
      ];
      return d;
    });
    setData(newData);
  };

  const deleteRow = (index: number) => {
    setData([...data.filter((_, i) => i !== index)]);
  };

  const importFile = async () => {
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
      const dataObjects: DataObject[] = [];

      for await (const line of lines) {
        if (header.length === 0) {
          header = line.split(";");
          console.log(`Header: ${header}`);
          setHeader(header);
          continue;
        }

        const values = line.split(";");
        const dataObject = header.reduce<DataObject>((obj, key, index) => {
          obj[key] = values[index] || null;
          return obj;
        }, {} as DataObject);

        dataObjects.push(dataObject);
      }

      console.log(dataObjects);
      setData(dataObjects);
    } catch (error) {
      console.error("Error reading file:", error);
    }
  };

  return (
    <div className="container">
      <h1>Welcome to Tauri!</h1>
      <Button
        onClick={importFile}
        radius="xl"
        rightSection={<IconDownload size={14} />}
      >
        Import
      </Button>
      {data.length > 0 && (
        <TransactionTable
          header={header}
          data={data}
          onChangeField={onChangeField}
          deleteRow={deleteRow}
        />
      )}
    </div>
  );
}

export default App;
