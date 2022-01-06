import { readFileSync } from 'fs';

export class ReadFiles {

  readTableFile() {
    const tableInBuffer = readFileSync('./table.txt');
    const tableData = tableInBuffer.toString().split('\n')
    return tableData.map((item) => {
      const [column, id, value] = item.replace('\r', '').trim().split(/\W/);
      return { column, id: Number(id), value: Number(value) }
    })
  }

  readLogFile() {
    const logInBuffer = readFileSync('./log.log');
    const logData = logInBuffer.toString().split(/\n/);
    return logData
      .map((item) => item.trim().replace(/\r|>|</g, ''))
      .filter((item) => item)
  }
}