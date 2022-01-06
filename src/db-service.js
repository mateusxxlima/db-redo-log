export class DBService {

  constructor(Model) {
    this.Model = Model;
  }

  async loadTableToDatabase(table) {
    for (const item of table) {
      await this.insert(item);
    }
  }

  async insert({ column, id, value }) {
    const data = await this.Model.findByPk(id);
    if (data) this.Model.update({ [column]: value }, { where: { id } });
    else await this.Model.create({ id, [column]: value });
  }

  async redo(logs) {
    let transactions = this.getValidTransactions(logs);
    transactions = Object.entries(transactions);
    transactions.reverse()
    console.log(transactions)
  }

  getValidTransactions(logs) {
    let endCheckpoint;
    let transactionsPending = new Set();
    let startCheckpoint = false;
    const transactionList = {};
    logs = logs.reverse()

    for (const item of logs) {
      console.log(item)

      if (item.includes('start')) {
        if (transactionsPending.size > 0) {
          const [trans] = item.match(/T\d/g);
          transactionsPending.delete(trans);
          if (transactionsPending.size === 0) break;
        }
        continue;
      }

      if (item.includes('End Checkpoint')) {
        endCheckpoint = true;
        continue;
      }

      if (item.includes('Start Checkpoint')) {
        if (endCheckpoint) {
          const transactions = item.match(/T\d/g);
          if (!transactions) break;
          transactions.forEach(trans => {
            if (transactionList[trans])
              transactionsPending.add(trans)
          })
          startCheckpoint = true;
          endCheckpoint = false;
          if (transactionsPending.size === 0) break;
        }
        continue;
      }

      const [transaction] = item.match(/T\d/);

      if (item.includes('commit') && !startCheckpoint) {
        transactionList[transaction] = { operations: [] };
        continue;
      }

      if (transactionList[transaction]?.operations) {
        transactionList[transaction].operations.push(item)
      }
    }

    return transactionList
  }
}