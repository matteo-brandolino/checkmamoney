import "./App.css";
import TransactionTableContainer from "./components/transactionTable";
import AddTransaction from "./components/addTransaction/AddTransaction";
import Charts from "./components/charts";
import { useState } from "react";
import MonthPicker from "./components/monthPickerInput/MonthPickerInput";
import { MonthType } from "./@types";

// unire dates nei vari charts e tenere conto degli anni
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
