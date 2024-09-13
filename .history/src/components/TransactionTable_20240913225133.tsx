import { Checkbox, Table, rem } from "@mantine/core";
import { DataObject } from "../App";
import { useState } from "react";
import classes from "./TableSelection.module.css";
import cx from "clsx";
import "./TransactionTable.module.css";

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
  const [selection, setSelection] = useState(["1s"]);

  const toggleRow = (id: string) =>
    setSelection((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  const toggleAll = () =>
    setSelection((current) =>
      current.length === data.length ? [] : data.map((d, i) => i)
    );
  const rows = data.map((row, id) => {
    const selected = selection.includes(id.toString());
    const keys = Object.keys(row);
    return (
      <Table.Tr
        key={row.id}
        className={cx({ [classes.rowSelected]: selected })}
      >
        <Table.Td>
          <Checkbox
            checked={selection.includes(id.toString())}
            onChange={() => toggleRow(id.toString())}
          />
        </Table.Td>
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
            <Table.Th style={{ width: rem(40) }}>
              <Checkbox
                onChange={toggleAll}
                checked={selection.length === data.length}
                indeterminate={
                  selection.length > 0 && selection.length !== data.length
                }
              />
            </Table.Th>
            {header && header.map((h, i) => <Table.Th key={i}>{h}</Table.Th>)}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
