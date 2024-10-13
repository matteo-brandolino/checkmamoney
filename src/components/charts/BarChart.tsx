import { useEffect, useState } from "react";
import connectDB from "../../lib/db";
import { BarChartsType } from "../../@types";
import { BarChart } from "@mantine/charts";
import { COLORS } from "../../constants";
import { Container } from "@mantine/core";
import { getMonthName, getWhereClause, month } from "../../lib/helper";
interface MonthData {
  month: string;
  [category: string]: number | string;
}
export const data = [
  { month: "January", Smartphones: 1200, Laptops: 900, Tablets: 200 },
  { month: "February", Smartphones: 1900, Laptops: 1200, Tablets: 400 },
  { month: "March", Smartphones: 400, Laptops: 1000, Tablets: 200 },
  { month: "April", Smartphones: 1000, Laptops: 200, Tablets: 800 },
  { month: "May", Smartphones: 800, Laptops: 1400, Tablets: 1200 },
  { month: "June", Smartphones: 750, Laptops: 600, Tablets: 1000 },
];
function BarCharts({ dates }: { dates: string[] }) {
  const [barChartsData, setBarChartsData] = useState<MonthData[] | null>(null);
  const [categories, setCategories] = useState<string[]>();

  useEffect(() => {
    const getBarChartData = async () => {
      const db = await connectDB();
      try {
        if (!db) throw Error("Db ko");
        console.log(`Trying to get bar charts info: ${dates}`);
        let [whereClause, datesValues] = getWhereClause(dates);

        const result: BarChartsType[] = await db.select(
          `SELECT category, 
          ${month},
          COUNT(*) as total 
          FROM normalized_transaction
          ${whereClause}
          GROUP BY category, TO_CHAR(DATE_TRUNC('month', date), 'MM-YYYY') 
          ORDER BY total desc;`,
          datesValues
        );
        console.log("Get Bar Chart:", result);
        const categories: string[] = [];
        const data = result.reduce(
          (acc: { [month: string]: MonthData }, curr) => {
            const m = getMonthName(curr.month);
            if (!acc[m]) {
              acc[m] = { month: m };
            }
            acc[m][curr.category] = curr.total;
            if (!(curr.category in categories)) {
              categories.push(curr.category);
            }
            return acc;
          },
          {} as { [month: string]: MonthData }
        );
        console.log(categories);
        setCategories(categories);
        let newData = Object.values(data);

        newData = newData.map((nd) => {
          const diff = categories.filter(function (x) {
            return Object.keys(nd).indexOf(x) < 0;
          });
          const diffValues: Record<string, number> = {};

          diff.forEach((str) => {
            diffValues[str] = 0;
          });

          return { ...nd, ...diffValues };
        });
        console.log(newData);

        setBarChartsData(newData);
      } catch (error) {
        console.error(`Get BarChart error: ${error}`);
      }
    };

    getBarChartData();
  }, [dates]);

  return (
    <Container pt={15} pb={100}>
      {barChartsData && categories && (
        <BarChart
          withLegend
          legendProps={{ verticalAlign: "bottom", height: 50 }}
          h={450}
          data={barChartsData}
          dataKey="month"
          series={categories?.map((c, i) => ({ name: c, color: COLORS[i] }))}
          tickLine="y"
        />
      )}
    </Container>
  );
}

export default BarCharts;
