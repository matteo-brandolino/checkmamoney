import { Container, Flex } from "@mantine/core";
import { MonthPickerInput } from "@mantine/dates";
import { MonthType } from "../../@types";

type MonthPickerProps = {
  month: MonthType;
  setMonth: React.Dispatch<React.SetStateAction<MonthType>>;
};
function MonthPicker({ month, setMonth }: MonthPickerProps) {
  return (
    <Container size="96%" py={15}>
      <Flex justify={{ sm: "end" }}>
        <MonthPickerInput
          type="multiple"
          label="Pick dates range"
          placeholder="Pick dates range"
          value={month}
          onChange={setMonth}
        />
      </Flex>
    </Container>
  );
}

export default MonthPicker;
