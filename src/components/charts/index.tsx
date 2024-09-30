import { PieChart } from "@mantine/charts";
import { Group, Table, Text } from "@mantine/core";
import Summary from "./Summary";
import { MonthType } from "../../@types";
const data = [
  { name: "USA", value: 400, color: "indigo.6" },
  { name: "India", value: 300, color: "yellow.6" },
  { name: "Japan", value: 300, color: "teal.6" },
  { name: "Other", value: 200, color: "gray.6" },
];
const elements = [
  { position: 6, mass: 12.011, symbol: "C", name: "Carbon" },
  { position: 7, mass: 14.007, symbol: "N", name: "Nitrogen" },
  { position: 39, mass: 88.906, symbol: "Y", name: "Yttrium" },
  { position: 56, mass: 137.33, symbol: "Ba", name: "Barium" },
  { position: 58, mass: 140.12, symbol: "Ce", name: "Cerium" },
];
function Charts({ month }: { month: MonthType }) {
  const rows = elements.map((element) => (
    <Table.Tr key={element.name}>
      <Table.Td>{element.position}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.symbol}</Table.Td>
      <Table.Td>{element.mass}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Summary month={month} />
      <Group gap={50}>
        <div>
          <Text fz="xs" mb="sm" ta="center">
            Entrate
          </Text>
          <PieChart
            data={data}
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
                <Table.Th>Symbol</Table.Th>
                <Table.Th>Atomic mass</Table.Th>
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
            data={data}
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
                <Table.Th>Symbol</Table.Th>
                <Table.Th>Atomic mass</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </div>
      </Group>
    </>
  );
}

export default Charts;
