import { PieChart } from "@mantine/charts";
import { Group, Table, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import connectDB from "../../lib/db";
import { PieChartsDataType, PieChartsPercentageDataType } from "../../@types";
import { COLORS } from "../../constants";

const elements = [
  { position: 6, name: "Carbon" },
  { position: 7, name: "Nitrogen" },
  { position: 39, name: "Yttrium" },
  { position: 56, name: "Barium" },
  { position: 58, name: "Cerium" },
];
function PieCharts({ dates }: { dates: string[] }) {
  const [positiveData, setPositiveData] = useState<
    PieChartsPercentageDataType[]
  >([]);
  const [negativeData, setNegativeData] = useState<
    PieChartsPercentageDataType[]
  >([]);
  const rows = elements.map((element) => (
    <Table.Tr key={element.name}>
      <Table.Td>{element.position}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
    </Table.Tr>
  ));

  useEffect(() => {
    const getPieCharts = async () => {
      const db = await connectDB();
      try {
        if (!db) throw Error("Db ko");
        console.log(`Trying to get pie charts info: ${dates}`);
        let whereClause = "";
        const datesValues: string[] = [];
        dates.forEach((d, i) => {
          if (i === 0) {
            whereClause +=
              "WHERE TO_CHAR(DATE_TRUNC('month', date), 'MM') = $1";
          } else {
            whereClause += ` OR TO_CHAR(DATE_TRUNC('month', date), 'MM') = $${
              i + 1
            }`;
          }
          datesValues.push(d);
        });

        const result: PieChartsDataType[] = await db.select(
          `WITH categorized_transactions AS (
            SELECT  
                amount::float, 
                description, 
                category, 
                CASE                                
                    WHEN amount > 0 THEN 'positive' 
                    ELSE 'negative' 
                END AS transaction_type
            FROM normalized_transaction
            ${whereClause}
            )
            SELECT 
                transaction_type,
                amount,
                description,
                category,
                COUNT(category) OVER (PARTITION BY category) AS category_count
            FROM categorized_transactions
            ORDER BY 
                transaction_type,
                ABS(amount) DESC;`,
          datesValues
        );
        console.log("Get PieCharts:", result);
        const positiveDataToRender: {
          name: string;
          value: number;
          color: string;
        }[] = [];
        const negativeDataToRender: {
          name: string;
          value: number;
          color: string;
        }[] = [];
        let indexColor = 0;
        let negativeIndexColor = 0;
        result.forEach((r) => {
          if (
            r.transaction_type === "positive" &&
            (!positiveDataToRender ||
              positiveDataToRender.filter((d) => d.name === r.category).length <
                1)
          ) {
            const slice = {
              name: r.category,
              value: r.category_count,
              color: COLORS[indexColor],
            };
            indexColor += 1;
            positiveDataToRender.push(slice);
          }
          if (
            r.transaction_type === "negative" &&
            (!negativeDataToRender ||
              negativeDataToRender.filter((d) => d.name === r.category).length <
                1)
          ) {
            const slice = {
              name: r.category,
              value: r.category_count,
              color: COLORS[negativeIndexColor],
            };
            negativeIndexColor += 1;
            negativeDataToRender.push(slice);
          }
        });
        positiveDataToRender.sort((a, b) => b.value - a.value);
        let groupDataToRender = positiveDataToRender.splice(4);
        let positiveData = positiveDataToRender;
        if (groupDataToRender.length > 0) {
          const otherObj = groupDataToRender.reduce(
            (acc, current) => ({ ...acc, value: acc.value + current.value }),
            { name: "Altro", value: 0, color: COLORS[indexColor] }
          );

          console.log(
            `positiveDataToRender ${JSON.stringify(positiveDataToRender)}`
          );
          positiveData = [...positiveDataToRender, otherObj];
        }

        setPositiveData(positiveData);

        negativeDataToRender.sort((a, b) => b.value - a.value);
        let negativeData = negativeDataToRender;
        let negativeGroupDataToRender = negativeDataToRender.splice(4);
        if (negativeDataToRender.length > 0) {
          const negativeOtherObj = negativeGroupDataToRender.reduce(
            (acc, current) => ({ ...acc, value: acc.value + current.value }),
            { name: "Altro", value: 0, color: COLORS[negativeIndexColor] }
          );

          console.log(negativeOtherObj);
          console.log(
            `negativeDataToRender ${JSON.stringify(negativeDataToRender)}`
          );
          negativeData = [...negativeDataToRender, negativeOtherObj];
        }

        setNegativeData(negativeData);
      } catch (error) {
        console.error(`Get PieCharts error: ${error}`);
      }
    };

    getPieCharts();
  }, [dates]);
  return (
    <div>
      <Group gap={50}>
        <div>
          <Text fz="xs" mb="sm" ta="center">
            Entrate
          </Text>
          <PieChart
            data={positiveData}
            withTooltip
            withLabelsLine
            withLabels
            labelsPosition="inside"
            labelsType="percent"
            tooltipDataSource="segment"
            mx="auto"
          />
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Descrizione</Table.Th>
                <Table.Th>Importo</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </div>
        <div>
          <Text fz="xs" mb="sm" ta="center">
            Uscite
          </Text>
          <PieChart
            data={negativeData}
            withTooltip
            withLabelsLine
            withLabels
            labelsPosition="inside"
            labelsType="percent"
            tooltipDataSource="segment"
            mx="auto"
          />
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Element position</Table.Th>
                <Table.Th>Element name</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </div>
      </Group>
    </div>
  );
}

export default PieCharts;
