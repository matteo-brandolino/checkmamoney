import { Table } from "@mantine/core";
import { TopElements } from "../../@types";

function TopTable({ elements }: { elements: TopElements[] }) {
  const renderRows = (elements: TopElements[]) => {
    return elements.map((element, i) => (
      <Table.Tr key={i}>
        <Table.Td>{element.description}</Table.Td>
        <Table.Td>{element.category}</Table.Td>
        <Table.Td>{element.amount}</Table.Td>
      </Table.Tr>
    ));
  };
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Descrizione</Table.Th>
          <Table.Th>Categoria</Table.Th>
          <Table.Th>Importo</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{renderRows(elements)}</Table.Tbody>
    </Table>
  );
}

export default TopTable;
