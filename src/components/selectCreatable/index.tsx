import { useState } from "react";
import { Combobox, InputBase, useCombobox } from "@mantine/core";

type SelectCreatableProps = {
  onChangeField: (newValue: string, i: number, index: number) => void;
  rowValueId: number;
  rowId: number;
  rowValue?: string;
};
export default function SelectCreatable({
  onChangeField,
  rowValueId,
  rowId,
  rowValue,
}: SelectCreatableProps) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const initialValues = [
    "banca",
    "extra",
    "auto",
    "lavoro",
    "famiglia",
    "sport",
    "salute/benessere",
    "casa",
    "telefono",
    "abbonamenti",
    "spesa",
    "tasse",
    "viaggi",
  ];
  const [data, setData] = useState([...initialValues, rowValue]);
  const [value, setValue] = useState<string | null>(
    rowValue ?? initialValues[1]
  );
  const [search, setSearch] = useState(rowValue ?? initialValues[1]);

  const exactOptionMatch = data.some((item) => item === search);
  const filteredOptions = exactOptionMatch
    ? data
    : data.filter(
        (item) =>
          item &&
          item.toLowerCase().includes(search ? search.toLowerCase().trim() : "")
      );

  const options = filteredOptions.map((item) =>
    item ? (
      <Combobox.Option value={item} key={item}>
        {item}
      </Combobox.Option>
    ) : null
  );

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        if (val === "$create") {
          setData((current) => [...current, search]);
          setValue(search || "");
          search && onChangeField(search, rowValueId, rowId);
        } else {
          setValue(val);
          onChangeField(val, rowValueId, rowId);
          setSearch(val);
        }

        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          rightSection={<Combobox.Chevron />}
          value={search}
          onChange={(event) => {
            combobox.openDropdown();
            combobox.updateSelectedOptionIndex();
            setSearch(event.currentTarget.value);
            onChangeField(event.currentTarget.value, rowValueId, rowId);
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => {
            combobox.closeDropdown();
            setSearch(value || "");
            onChangeField(value || "", rowValueId, rowId);
          }}
          placeholder="Search value"
          rightSectionPointerEvents="none"
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {options}
          {!exactOptionMatch && search && search.trim().length > 0 && (
            <Combobox.Option value="$create">+ Create {search}</Combobox.Option>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
