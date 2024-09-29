import { MonthPickerInput } from "@mantine/dates";
import "./App.css";
import TransactionTableContainer from "./components/TransactionTable";
import AddTransaction from "./components/addTransaction/AddTransaction";
import Charts from "./components/charts";
import { useState } from "react";

// aggiungere delete dei selezionati
//salvare categorie nuove

function App() {
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);
  console.log(value);

  return (
    <div>
      <MonthPickerInput
        type="range"
        label="Pick dates range"
        placeholder="Pick dates range"
        value={value}
        onChange={setValue}
      />
      <Charts />
      <TransactionTableContainer />
      <AddTransaction />
    </div>
  );
}

export default App;
