import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';

import Transaction from '../models/Transaction';

interface TransactionDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

interface TransactionsDTO {
  transaction: Array<TransactionDTO>;
}

class ImportTransactionsService {
  async execute(): Promise<Transaction[]> {
    async function loadCSV(filePath: string): Promise<TransactionDTO[]> {
      const readCSVStream = fs.createReadStream(filePath);

      const parseStream = csvParse({
        from_line: 2,
        ltrim: true,
        rtrim: true,
      });

      const parseCSV = readCSVStream.pipe(parseStream);

      const lines = TransactionsDTO();

      parseCSV.on('data', line => {
        lines.push(line);
      });

      await new Promise(resolve => {
        parseCSV.on('end', resolve);
      });

      return lines;
    }

    const csvFilePath = path.resolve(
      __dirname,
      '..',
      'tmp',
      'import_template.csv',
    );

    const data = loadCSV(csvFilePath);

    console.log(data);

    const trans = new Transaction();

    trans.title = data[0].title;

    const transactions = [];

    transactions.push(trans);

    console.log(transactions);

    return transactions;
  }
}

export default ImportTransactionsService;
