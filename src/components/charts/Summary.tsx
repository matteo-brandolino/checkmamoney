import {
  Group,
  Paper,
  Text,
  ThemeIcon,
  SimpleGrid,
  Container,
} from "@mantine/core";
import { IconArrowUpRight, IconArrowDownRight } from "@tabler/icons-react";
import { SummaryDataType } from "../../@types";
import connectDB from "../../lib/db";
import { useEffect, useState } from "react";
import { getWhereClause } from "../../lib/helper";

const initialData = [
  { title: "total_income", value: "0" },
  { title: "total_expense", value: "0" },
  { title: "percentage", value: "0%" },
];

function Summary({ dates }: { dates: string[] }) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const getSummary = async () => {
      const db = await connectDB();
      try {
        if (!db) throw Error("Db ko");
        console.log(`Trying to get summary info: ${dates}`);
        let [whereClause, datesValues] = getWhereClause(dates);
        const result: SummaryDataType[] = await db.select(
          `SELECT 
                SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END)::float AS total_income,
                SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END)::float AS total_expense
            FROM 
                normalized_transaction
            ${whereClause};`,
          datesValues
        );
        console.log("Get Summary:", result, dates);
        const res = result[0];
        if (!res || !res.total_income || !res.total_expense) return;
        const fixedTotalIncome = res.total_income.toFixed(2);
        const fixedTotalExpense = res.total_expense.toFixed(2);
        let percentage = "0";
        if (res.total_income !== 0) {
          percentage = (
            (Math.abs(res.total_income + res.total_expense) /
              res.total_income) *
            100
          ).toFixed(2);
        }
        const mappedData = [
          {
            title: "total_income",
            value: `${fixedTotalIncome}€`,
          },
          {
            title: "total_expense",
            value: `${fixedTotalExpense}€`,
          },
          {
            title: "percentage",
            value: `${
              res.total_income + res.total_expense < 0 ? "-" : ""
            }${percentage}%`,
          },
        ];
        setData(mappedData);
      } catch (error) {
        console.error(`Get Summary error: ${error}`);
      }
    };

    getSummary();
  }, [dates]);

  const stats = data.map((stat) => {
    const isPositive = parseFloat(stat.value.replace("€", "")) > 0;
    const DiffIcon = isPositive ? IconArrowUpRight : IconArrowDownRight;
    return (
      <Paper withBorder p="md" radius="md" key={stat.title}>
        <Group justify="apart">
          <div>
            <Text c="dimmed" tt="uppercase" fw={700} fz="xs">
              {stat.title}
            </Text>
            <Text fw={700} fz="xl">
              {stat.value}
            </Text>
          </div>
          <ThemeIcon
            color="gray"
            variant="light"
            style={{
              color: isPositive
                ? "var(--mantine-color-teal-6)"
                : "var(--mantine-color-red-6)",
            }}
            size={38}
            radius="md"
          >
            <DiffIcon size="1.8rem" stroke={1.5} />
          </ThemeIcon>
        </Group>
      </Paper>
    );
  });

  return (
    <Container py={15}>
      <SimpleGrid cols={{ base: 1, sm: 3 }}>{stats}</SimpleGrid>
    </Container>
  );
}

export default Summary;
