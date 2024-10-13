import "./App.css";

import Charts from "./components/charts";
import { useState } from "react";
import MonthPicker from "./components/monthPickerInput/MonthPickerInput";
import { MonthType } from "./@types";
import QuickButtons from "./components/quickButton/QuickButtons";
import { Container } from "@mantine/core";

//sistemare ui import/stats
// aggiungere delete dei selezionati
//salvare categorie nuove

function App() {
  const [month, setMonth] = useState<MonthType>([]);

  return (
    <Container>
      <MonthPicker month={month} setMonth={setMonth} />
      <QuickButtons />
      <Charts month={month} />
    </Container>
  );
}

export default App;
