import Summary from "./Summary";
import { MonthType } from "../../@types";
import PieCharts from "./PieCharts";

function Charts({ month }: { month: MonthType }) {
  const dates = month.map((m) => {
    const d = new Date(m);
    return (d.getMonth() + 1).toString().padStart(2, "0");
  });
  return (
    <>
      <Summary dates={dates} />
      <PieCharts dates={dates} />
    </>
  );
}

export default Charts;
