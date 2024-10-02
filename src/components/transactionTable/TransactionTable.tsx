import { Button, Checkbox, Input, Table, rem } from "@mantine/core";
import { useState } from "react";
import classes from "./TransactionTable.module.css";
import { IconSquareRoundedX } from "@tabler/icons-react";
import cx from "clsx";
import SelectCreatable from "../selectCreatable";
import { DateInput, DateValue } from "@mantine/dates";
import { convertExcelDate } from "../../lib/helper";

type TransactionTableProps = {
  header: string[];
  data: (string | number | Date)[][];
  onChangeField: (
    newValue: string | number | Date,
    i: number,
    index: number
  ) => void;
  deleteRow: (index: number) => void;
  onChangeColumnField: (columnId: number, newColumnName: string) => void;
  deleteColumn: (columnName: number) => void;
};

export default function TransactionTable({
  header,
  data,
  onChangeField,
  deleteRow,
  onChangeColumnField,
  deleteColumn,
}: TransactionTableProps) {
  const [selection, setSelection] = useState<number[]>([]);

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

  const renderInput = (
    header: string,
    rowValueId: number,
    rowId: number,
    rowValue: string | number | DateValue
  ) => {
    if (header === "Categoria") {
      return (
        <SelectCreatable
          onChangeField={onChangeField}
          rowValueId={rowValueId}
          rowId={rowId}
          rowValue={rowValue as string}
        />
      );
    }
    if (header === "Data") {
      return (
        <DateInput
          valueFormat="DD MMM YYYY"
          value={
            typeof rowValue === "number"
              ? convertExcelDate(rowValue)
              : (rowValue as Date)
          }
          onChange={(e) => e && onChangeField(e, rowValueId, rowId)}
          label=""
          placeholder="Date input"
        />
      );
    }
    return (
      <Input
        variant="unstyled"
        value={rowValue as string}
        onChange={(e) => onChangeField(e.target.value, rowValueId, rowId)}
      />
    );
  };
  const rows = data.map((rowValues, rowId) => {
    const selected = selection.includes(rowId);
    return (
      <Table.Tr key={rowId} className={cx({ [classes.rowSelected]: selected })}>
        <Table.Td>
          <Checkbox
            checked={selection.includes(rowId)}
            onChange={() => toggleRow(rowId)}
          />
        </Table.Td>

        {rowValues.map((rowValue, rowValueId) => (
          <Table.Td key={rowValueId}>
            {renderInput(
              header[rowValueId].trim(),
              rowValueId,
              rowId,
              rowValue
            )}
          </Table.Td>
        ))}
        <Table.Td>
          {selection.includes(rowId) && (
            <Button
              variant="transparent"
              onClick={() => deleteRowAndClearSelection(rowId)}
            >
              <IconSquareRoundedX color="red" />
            </Button>
          )}
        </Table.Td>
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
            {header &&
              header.map((h, i) => (
                <Table.Th key={i}>
                  <Input
                    variant="unstyled"
                    value={h}
                    onChange={(e) => onChangeColumnField(i, e.target.value)}
                  />
                  <Button variant="transparent" onClick={() => deleteColumn(i)}>
                    <IconSquareRoundedX color="red" />
                  </Button>
                </Table.Th>
              ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
