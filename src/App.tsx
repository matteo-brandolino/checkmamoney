import "./App.css";
import TransactionTableContainer from "./components/TransactionTable";
import AddTransaction from "./components/addTransaction/AddTransaction";
import Charts from "./components/charts";
import { useState } from "react";
import MonthPicker from "./components/monthPickerInput/MonthPickerInput";
import { MonthType } from "./@types";

// aggiungere delete dei selezionati
//salvare categorie nuove

function App() {
  const [month, setMonth] = useState<MonthType>([]);
  return (
    <>
      <MonthPicker month={month} setMonth={setMonth} />
      <Charts month={month} />
      <TransactionTableContainer />
      <AddTransaction />
    </>
  );
}

export default App;
