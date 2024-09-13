import { Table } from "@mantine/core";
import { DataObject } from "../App";

type TransactionTableProps = {
  header: string[];
  data: DataObject[];
};

export default function TransactionTable({
  header,
  data,
}: TransactionTableProps) {
  console.log(`header ${JSON.stringify(header)}`);
  console.log(`data ${JSON.stringify(data)}`);

  const rows = data.map((row, i) => {
    const keys = Object.keys(row);
    return (
      <Table.Tr key={i}>
        {keys.map((k, i) => (
          <Table.Td key={i}>{row[k]}</Table.Td>
        ))}
      </Table.Tr>
    );
  });

  return (
    <Table.ScrollContainer minWidth={800}>
      <Table verticalSpacing="xs">
        <Table.Thead>
          <Table.Tr></Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
