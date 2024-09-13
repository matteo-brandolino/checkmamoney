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

  const rows = data.map((row) => {
    const keys = Object.keys(row);
    return (
      <Table.Tr key={row.title}>
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
          <Table.Tr>
            {header && header.map((h, i) => <Table.Th key={i}>{h}</Table.Th>)}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
