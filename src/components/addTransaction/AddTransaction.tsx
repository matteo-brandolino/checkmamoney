import {
  Button,
  Container,
  Flex,
  Grid,
  Input,
  NumberInput,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import SelectCreatable from "../selectCreatable";
import { convertToDateString } from "../../lib/helper";
import Database from "@tauri-apps/plugin-sql";
import { DateInput } from "@mantine/dates";
import { useState } from "react";
import { IconPlus } from "@tabler/icons-react";

type AddButtonType = {
  onClick?: () => void;
};

const AddButton = ({ onClick }: AddButtonType) => {
  return (
    <Button
      radius="xl"
      rightSection={<IconPlus size={14} />}
      type={onClick ? "button" : "submit"}
      onClick={onClick}
    >
      Add
    </Button>
  );
};

export default function AddTransaction() {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    mode: "controlled",
    initialValues: {
      description: "",
      category: "extra",
      date: new Date().toISOString().slice(0, 10),
      amount: 0,
    },
  });

  const onChangeField = (newValue: string | number | Date) => {
    console.log(newValue);
    form.setFieldValue("category", newValue as string);
  };

  const saveSingleTransaction = async (values: {
    description: string;
    category: string;
    date: string;
    amount: number;
  }) => {
    const { date, amount, description, category } = values;

    console.log(`Saving ${JSON.stringify(values)}`);

    const db = await Database.load(
      "postgresql://postgres:checkmamoney@localhost:5432/checkmamoney"
    );

    const result = await db.execute(
      "INSERT INTO normalized_transaction (date, amount, description, category) VALUES ($1::date, $2, $3, $4)",
      [date, amount, description, category]
    );
    console.log("Insert normalized transaction successful:", result);

    setIsOpen(false);

    form.reset();
  };
  return (
    <>
      {isOpen ? (
        <form
          onSubmit={form.onSubmit((values) => saveSingleTransaction(values))}
        >
          <Flex justify="space-between" align="center">
            <div>
              <Input.Label required>Category</Input.Label>
              <SelectCreatable
                onChangeField={onChangeField}
                rowValueId={0}
                rowId={0}
              />
            </div>
            <Container>
              <TextInput
                withAsterisk
                radius="md"
                label="Description"
                key={form.key("description")}
                placeholder="Add a description..."
                {...form.getInputProps("description")}
              />
            </Container>
            <Container>
              <DateInput
                valueFormat="YYYY MMM DD"
                value={new Date(form.values.date)}
                label="Date input"
                placeholder="Date input"
                onChange={(e) =>
                  e &&
                  form.setFieldValue(
                    "date",
                    convertToDateString(e.toISOString())
                  )
                }
              />
            </Container>
            <Container>
              <NumberInput
                variant="unstyled"
                radius="md"
                label="Amount"
                withAsterisk
                value={0}
                onChange={(e) => form.setFieldValue("amount", e as number)}
              />
            </Container>
            <div>
              <AddButton />
            </div>
          </Flex>
        </form>
      ) : (
        <AddButton onClick={() => setIsOpen(true)} />
      )}
    </>
  );
}
