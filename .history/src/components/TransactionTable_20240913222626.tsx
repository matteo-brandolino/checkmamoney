import { Table, Progress, Anchor, Text, Group } from "@mantine/core";
import classes from "./TransactionTable.module.css";
import { DataObject } from "../App";

const data = [
  {
    title: "Foundation",
    author: "Isaac Asimov",
    year: 1951,
    reviews: { positive: 2223, negative: 259 },
  },
  {
    title: "Frankenstein",
    author: "Mary Shelley",
    year: 1818,
    reviews: { positive: 5677, negative: 1265 },
  },
  {
    title: "Solaris",
    author: "Stanislaw Lem",
    year: 1961,
    reviews: { positive: 3487, negative: 1845 },
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    year: 1965,
    reviews: { positive: 8576, negative: 663 },
  },
  {
    title: "The Left Hand of Darkness",
    author: "Ursula K. Le Guin",
    year: 1969,
    reviews: { positive: 6631, negative: 993 },
  },
  {
    title: "A Scanner Darkly",
    author: "Philip K Dick",
    year: 1977,
    reviews: { positive: 8124, negative: 1847 },
  },
];

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
            <Table.Th>Book title</Table.Th>
            <Table.Th>Year</Table.Th>
            <Table.Th>Author</Table.Th>
            <Table.Th>Reviews</Table.Th>
            <Table.Th>Reviews distribution</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
