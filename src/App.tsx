import { useState } from "react";

import { open } from "@tauri-apps/plugin-dialog";
import { readFile } from "@tauri-apps/plugin-fs";
import TransactionTable from "./components/TransactionTable";
import { Button } from "@mantine/core";
import { IconCactus, IconDownload } from "@tabler/icons-react";
import Database from "@tauri-apps/plugin-sql";
import { read, utils } from "xlsx";
import { convertExcelDate, convertToDateString } from "./lib/helper";

import "./App.css";
import AddTransaction from "./components/addTransaction/AddTransaction";

// capire la migrazione di sqlx come funziona
//aggiungere possiblità di aggiungere singola transazione
// aggiungere delete dei selezionati
//salvare categorie nuove

export type DataObject = {
  [key: string]: string | null;
};

function App() {
  const [data, setData] = useState<(string | number | Date)[][]>([]);
  const [header, setHeader] = useState<string[]>([]);

  const onChangeField = (
    newValue: string | number | Date,
    columnId: number,
    rowId: number
  ) => {
    const newData = [...data];
    console.log(data);

    newData[rowId][columnId] = newValue;
    console.log(newData);
    setData(newData);
  };

  const onChangeColumnField = (columnId: number, newColumnName: string) => {
    console.log(columnId);
    console.log(newColumnName);

    const newHeader = [...header];
    newHeader[columnId] = newColumnName;
    setHeader(newHeader);
  };

  const deleteColumn = (columnId: number) => {
    console.log(columnId);
    const newHeader = [...header];
    newHeader.splice(columnId, 1);
    setHeader(newHeader);
    setData(
      [...data].map((d) => {
        const newD = [...d];
        newD.splice(columnId, 1);
        return newD;
      })
    );
  };

  const deleteRow = (index: number) => {
    setData([...data.filter((_, i) => i !== index)]);
  };

  const save = async () => {
    const db = await Database.load(
      "postgresql://postgres:checkmamoney@localhost:5432/checkmamoney"
    );

    try {
      let query = "INSERT INTO transaction (data) VALUES ";
      let normalizedQuery =
        "INSERT INTO normalized_transaction (date, amount, description, category) VALUES";

      const values: any[] = [];
      const normalizedValues: any[] = [];

      data.forEach((record: (string | number | Date)[], i: number) => {
        query += `($${i + 1}),`;
        const transactionObject = header.reduce((obj, header, index) => {
          obj[header] = record[index];
          return obj;
        }, {} as any);

        values.push(transactionObject);

        normalizedQuery += `($${i * 4 + 1}::date, $${i * 4 + 2}, $${
          i * 4 + 3
        }, $${i * 4 + 4}),`;

        const date =
          typeof record[0] === "number"
            ? convertExcelDate(record[0])
            : (record[0] as Date);

        normalizedValues.push(
          convertToDateString(date.toISOString()),
          record[7],
          record[1],
          record[5]
        );
      });

      query = query.slice(0, -1);
      normalizedQuery = normalizedQuery.slice(0, -1);

      query += " RETURNING id, data";
      normalizedQuery += " RETURNING id";

      console.log(normalizedQuery);
      console.log(normalizedValues);

      const result = await db.execute(query, values);

      console.log("Insert successful:", result);

      const normalizedResult = await db.execute(
        normalizedQuery,
        normalizedValues
      );

      console.log(
        "Insert normalized transaction successful:",
        normalizedResult
      );

      setData([]);
    } catch (error) {
      console.log("Error during insertion:", error);
    } finally {
      console.log("Done");
    }
  };

  const importFile = async () => {
    try {
      const filePath = await open({
        filters: [
          {
            name: "CSV",
            extensions: ["csv", "xlsx"],
          },
        ],
      });
      if (!filePath) return null;
      const d = await readFile(filePath);
      const wb = read(d);

      const ws = wb.Sheets[wb.SheetNames[0]];

      const array: string[][] = utils.sheet_to_json(ws, {
        header: 1,
        blankrows: false,
      });
      console.log(array);
      const header = array.shift();
      if (header) {
        setHeader(header);
        setData(array);
      }
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
        <Button
          onClick={save}
          radius="xl"
          rightSection={<IconCactus size={14} />}
        >
          Save
        </Button>
      )}
      {data.length > 0 && (
        <TransactionTable
          header={header}
          data={data}
          onChangeField={onChangeField}
          deleteRow={deleteRow}
          onChangeColumnField={onChangeColumnField}
          deleteColumn={deleteColumn}
        />
      )}
      <AddTransaction />
    </div>
  );
}

export default App;
