import { getCustomRepository, DeleteResult } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  transaction_id: string;
}

class DeleteTransactionService {
  public async execute({ transaction_id }: Request): Promise<DeleteResult> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transaction = await transactionsRepository.findOne(transaction_id);

    if (!transaction) {
      throw new AppError('This transaction does not exists.');
    }

    const deletedTransaction = await transactionsRepository.delete(
      transaction_id,
    );
    return deletedTransaction;
  }
}

export default DeleteTransactionService;
