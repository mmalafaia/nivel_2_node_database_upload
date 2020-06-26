import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  categoryTitle: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    categoryTitle,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    if (!['income', 'outcome'].includes(type)) {
      throw new AppError('Transaction type is invalid');
    }

    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError('You do not have enough balance');
    }

    const categoryRepository = getRepository(Category);

    let category = await categoryRepository.findOne({ title: categoryTitle });

    if (!category) {
      category = new Category();
      category.title = categoryTitle;
      category = await categoryRepository.save(category);
    }

    const transaction = new Transaction();

    transaction.title = title;
    transaction.value = value;
    transaction.type = type;
    transaction.category = category;

    return transactionsRepository.save(transaction);
  }
}

export default CreateTransactionService;
