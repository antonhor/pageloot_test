import { Component, OnInit, OnDestroy } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-transaction-summary',
  templateUrl: './transaction-summary.component.html',
  styleUrls: ['./transaction-summary.component.css']
})
export class TransactionSummaryComponent implements OnInit, OnDestroy {
  balance: number = 0;
  private balanceSubscription!: Subscription;

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.balanceSubscription = this.transactionService.getBalance().subscribe(
      (balance) => {
        this.balance = balance;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.balanceSubscription) {
      this.balanceSubscription.unsubscribe();
    }
  }
}

