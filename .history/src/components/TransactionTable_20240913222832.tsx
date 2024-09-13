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
  const rows = data.map((row) => {
    const keys = Object.keys(row);
    return (
      <Table.Tr key={row.title}>
        {keys.map((k) => (
          <Table.Td>{row[k]}</Table.Td>
        ))}
      </Table.Tr>
    );
  });

  return (
    <Table.ScrollContainer minWidth={800}>
      <Table verticalSpacing="xs">
        <Table.Thead>
          <Table.Tr>
            {header && header.map((h) => <Table.Th>{h}</Table.Th>)}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
