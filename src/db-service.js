export class DBService {

  constructor(Model) {
    this.Model = Model;
    this.transactionsToRedo;
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
    this.getValidTransactions(logs);
    const operations = this.getOperations()
   
    for (const operation of operations) {
      await this.insert(operation)
    }
  }

  getValidTransactions(logs) {
    let startCheckpoint = false;
    let endCheckpoint;
    let transactionsPending = new Set();
    const transactionList = {};

    for (const item of logs) {

      if (item.includes('start')) {
        if (transactionsPending.size > 0) {
          const [trans] = item.match(/T\d/g);
          transactionsPending.delete(trans);
          if (transactionsPending.size === 0) break;
        }
        continue;
      }

      if (item.includes('End Checkpoint') || item.includes('End CKPT')) {
        endCheckpoint = true;
        continue;
      }

      if (item.includes('Start Checkpoint') || item.includes('Start CKPT')) {
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

    this.transactionsToRedo = transactionList;
  }

  willItBeRedo() {
    for (const transaction in this.transactionsToRedo) {
      console.log(`Transação ${transaction} realizou Redo`);
    }    
  }

  doNotWillBeRedo(logs) {
    const arr = []
    for (const transaction in this.transactionsToRedo) {
      arr.push(transaction)
    }
    
    for (const log of logs) {
      if (log.includes('start')) {
        const [transaction] = log.match(/T\d/);
        if (!arr.includes(transaction)) {
          console.log(`Transação ${transaction} não realizou Redo`);
        }
      }
    }
  }

  getOperations() {
    let transactions = this.transactionsToRedo;

    transactions = Object.entries(transactions);
    transactions.reverse();

    transactions = transactions.map((transaction) => {
      const { operations } = transaction[1];
      return operations;
    })

    transactions = transactions.reduce((prev, current) => {
      current.reverse();
      return [...prev, ...current];
    }, [])

    return transactions.map((operation) => {
      operation = operation.replace(' ', '');
      const [, id, column, value] = operation.split(',');
      return { id: Number(id), column, value: Number(value) };
    })
  }

  async finalPrint() {
    const data = await this.Model.findAll();
    for (const { id, A } of data) {
      console.log(`${id},A=${A}`);
    }
    for (const { id, B } of data) {
      console.log(`${id},B=${B}`);
    }
  }
}