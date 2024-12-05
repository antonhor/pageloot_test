import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

export interface Transaction {
  id: number;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  transactions$ = this.transactionsSubject.asObservable();

  constructor() {
    const savedTransactions: Transaction[] = JSON.parse(localStorage.getItem('transactions') || '[]');
    this.transactionsSubject.next(savedTransactions);
  }

  /**
   * Return all transactions
   * @return {Observable<Transaction[]>}
   */
  getTransactions(): Observable<Transaction[]> {
    return this.transactions$;
  }

  /**
   * Add new transaction and call saveToLocalStorage method
   * @param {Transaction} transaction
   */
  addTransaction(transaction: Transaction): void {
    const currentTransactions: Transaction[] = this.transactionsSubject.getValue();
    const updatedTransactions: Transaction[] = [...currentTransactions, transaction];
    this.transactionsSubject.next(updatedTransactions);
    TransactionService.saveToLocalStorage(updatedTransactions);
  }

  /**
   * Update local storage
   * @param {Transaction[]} transactions
   */
  static saveToLocalStorage(transactions: Transaction[]): void {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }

  /**
   * Return current user balance
   * @return {Observable<number>}
   */
  getBalance(): Observable<number> {
    return this.transactions$.pipe(
      map(transactions =>
        transactions.reduce((balance, transaction) => {
          return transaction.type === 'income'
            ? balance + transaction.amount
            : balance - transaction.amount;
        }, 0)
      )
    );
  }
}

