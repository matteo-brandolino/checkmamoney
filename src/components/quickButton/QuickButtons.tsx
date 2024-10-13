import { Container, Group } from "@mantine/core";
import AddTransaction from "../addTransaction/AddTransaction";
import TransactionTableContainer from "../transactionTable";

function QuickButtons() {
  return (
    <Container>
      <Group justify="flex-end">
        <TransactionTableContainer />
        <AddTransaction />
      </Group>
    </Container>
  );
}

export default QuickButtons;
