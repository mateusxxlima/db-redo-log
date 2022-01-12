

export class File {

  constructor(fileInBuffer) {
    this.file = fileInBuffer.toString().split('\n');
    this.table = this.getTable();
    this.logs = this.getLogs();
  }

  getTable() {
    const table = [];
    for (const value of this.file) {
      if(value === '\r') break;
      table.push(value);
    }
    
    return table.map((item) => {
      const [column, id, value] = item.replace('\r', '').trim().split(/\W/);
      return { column, id: Number(id), value: Number(value) }
    })
  }

  getLogs() {
    const logs = [];
    this.file.reverse();
    for (const value of this.file) {
      if(value === '\r') break;
      logs.push(value);
    }

    return logs
      .map((item) => item.trim().replace(/\r|>|</g, ''))
      .filter((item) => item)
  }
}