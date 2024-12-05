import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { Transaction, TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = ['name', 'amount', 'type', 'category', 'date'];
  dataSource: MatTableDataSource<Transaction>;
  private transactionsSubscription!: Subscription;

  transactionTypes = [
    { label: 'income', value: 'income' },
    { label: 'expense', value: 'expense' }
  ];

  categories = [
    { label: 'Groceries', value: 'Groceries' },
    { label: 'Salary', value: 'Salary' },
    { label: 'Entertainment', value: 'Entertainment' },
  ];

  transactionTypeFilter: string = '';
  categoryFilter: string = '';

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private transactionService: TransactionService) {
    this.dataSource = new MatTableDataSource<Transaction>([]);
  }

  ngOnInit(): void {
    this.transactionsSubscription = this.transactionService.getTransactions().subscribe(transactions => {
      this.dataSource.data = transactions;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;

    this.sort.sortChange.subscribe(() => {
      this.saveTransactionsToLocalStorage();
    });
  }

  /**
   * Apply filters to data source
   * @private
   */
  private applyFilters(): void {
    this.dataSource.filterPredicate = (data: Transaction, filter: string) => {
      const [typeFilter, categoryFilter]: [string, string] = filter.split('-') as [string, string];

      const matchType: boolean = typeFilter ? data.type.toLowerCase().includes(typeFilter.toLowerCase()) : true;
      const matchCategory: boolean = categoryFilter ? data.category.toLowerCase().includes(categoryFilter.toLowerCase()) : true;
      return matchType && matchCategory;
    };

    this.dataSource.filter = `${this.transactionTypeFilter}-${this.categoryFilter}`;
  }

  /**
   * Handle user select new transaction type
   * @param {string} type
   */
  onTransactionTypeFilterChange(type: string): void {
    this.transactionTypeFilter = type;
    this.applyFilters();
  }

  /**
   * Handle user select new category type
   * @param {string} category
   */
  onCategoryFilterChange(category: string): void {
    this.categoryFilter = category;
    this.applyFilters();
  }

  ngOnDestroy(): void {
    if (this.transactionsSubscription) {
      this.transactionsSubscription.unsubscribe();
    }
  }

  /**
   * Update sort data and call saveToLocalStorage method
   * @private
   */
  private saveTransactionsToLocalStorage(): void {
    this.dataSource.sortData(this.dataSource.data, this.sort);
    const sortedTransactions: Transaction[] = this.dataSource.data;
    TransactionService.saveToLocalStorage(sortedTransactions);
  }
}
