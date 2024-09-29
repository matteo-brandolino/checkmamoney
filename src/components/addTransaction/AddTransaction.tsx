import { Button, Grid, Input, NumberInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import SelectCreatable from "../selectCreatable";
import { DateInput } from "@mantine/dates";
import { convertToDateString } from "../../lib/helper";
import Database from "@tauri-apps/plugin-sql";

export default function AddTransaction() {
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

    form.reset();
  };
  return (
    <form onSubmit={form.onSubmit((values) => saveSingleTransaction(values))}>
      <Grid justify="flex-start" align="end" px={15}>
        <Grid.Col span={{ base: 12, md: 2 }}>
          <Input.Label required>Category</Input.Label>
          <SelectCreatable
            onChangeField={onChangeField}
            rowValueId={0}
            rowId={0}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 2 }}>
          <TextInput
            withAsterisk
            radius="md"
            label="Description"
            key={form.key("description")}
            placeholder="Add a description..."
            {...form.getInputProps("description")}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 2 }}>
          <DateInput
            valueFormat="YYYY MMM DD"
            value={new Date(form.values.date)}
            label="Date input"
            placeholder="Date input"
            onChange={(e) =>
              e &&
              form.setFieldValue("date", convertToDateString(e.toISOString()))
            }
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 2 }}>
          <NumberInput
            variant="unstyled"
            radius="md"
            label="Amount"
            withAsterisk
            value={0}
            onChange={(e) => form.setFieldValue("amount", e as number)}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 2 }}>
          <Button type="submit">Add</Button>
        </Grid.Col>
      </Grid>
    </form>
  );
}
