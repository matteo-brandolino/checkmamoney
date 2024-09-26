import { Button, Group, NumberInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import SelectCreatable from "../selectCreatable";
import { DateInput } from "@mantine/dates";
import { convertToDateString } from "../../lib/helper";

export default function AddTransaction() {
  const form = useForm({
    mode: "controlled",
    initialValues: {
      description: "",
      category: "extra",
      date: new Date().toISOString().slice(0, 10),
      amount: 0,
    },

    // validate: {
    //   email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    // },
  });

  const onChangeField = (newValue: string | number | Date) => {
    console.log(newValue);
    form.setFieldValue("category", newValue as string);
  };
  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <Textarea
        radius="md"
        label="Description"
        withAsterisk
        placeholder="Add a description..."
        key={form.key("description")}
        {...form.getInputProps("description")}
      />

      <SelectCreatable onChangeField={onChangeField} rowValueId={0} rowId={0} />
      <DateInput
        valueFormat="YYYY MMM DD"
        value={new Date(form.values.date)}
        label="Date input"
        placeholder="Date input"
        onChange={(e) =>
          e && form.setFieldValue("date", convertToDateString(e.toISOString()))
        }
      />

      <NumberInput
        variant="unstyled"
        radius="md"
        label="Input label"
        withAsterisk
        placeholder="Input placeholder"
        onChange={(e) => form.setFieldValue("amount", e as number)}
      />

      <Group justify="flex-end" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
}
