import { Button, Checkbox, Input, Table, rem } from "@mantine/core";
import { DataObject } from "../App";
import { useState } from "react";
import classes from "./TransactionTable.module.css";
import { IconSquareRoundedX } from "@tabler/icons-react";
import cx from "clsx";

type TransactionTableProps = {
  header: string[];
  data: DataObject[];
  onChangeField: (newValue: string, key: string, index: number) => void;
  deleteRow: (index: number) => void;
  onChangeColumnField: (oldColumnName: string, newColumnName: string) => void;
};

export default function TransactionTable({
  header,
  data,
  onChangeField,
  deleteRow,
}: TransactionTableProps) {
  const [selection, setSelection] = useState([0]);

  const toggleRow = (id: number) =>
    setSelection((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  const toggleAll = () =>
    setSelection((current) =>
      current.length === data.length ? [] : data.map((_, i) => i)
    );
  const deleteRowAndClearSelection = (index: number) => {
    deleteRow(index);
    setSelection([]);
  };
  const rows = data.map((row, id) => {
    const selected = selection.includes(id);
    const keys = Object.keys(row);
    return (
      <Table.Tr key={id} className={cx({ [classes.rowSelected]: selected })}>
        <Table.Td>
          <Checkbox
            checked={selection.includes(id)}
            onChange={() => toggleRow(id)}
          />
        </Table.Td>
        {keys.map((k, i) => (
          <Table.Td key={i}>
            <Input
              variant="unstyled"
              value={row[k] as string}
              onChange={(e) => onChangeField(e.target.value, k, id)}
            />
          </Table.Td>
        ))}
        <Table.Td>
          <Button
            variant="transparent"
            onClick={() => deleteRowAndClearSelection(id)}
          >
            <IconSquareRoundedX color="red" />
          </Button>
        </Table.Td>
      </Table.Tr>
    );
  });
  console.log(selection);

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
            {header &&
              header.map((h, i) => (
                <Table.Th key={i}>
                  <Input
                    variant="unstyled"
                    value={h}
                    onChange={(e) => onChangeColumnField(h)}
                  />
                </Table.Th>
              ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
