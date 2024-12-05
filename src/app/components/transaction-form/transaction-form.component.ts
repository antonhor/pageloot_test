import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionService, Transaction } from '../../services/transaction.service';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css']
})
export class TransactionFormComponent {
  transactionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService
  ) {
    this.transactionForm = this.fb.group({
      name: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0.01), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      type: ['income', Validators.required],
      category: ['', Validators.required],
      date: [new Date().toISOString().substring(0, 10), Validators.required],
    });
  }

  /**
   * React when user click submit button
   */
  onSubmit(): void {
    if (this.transactionForm.valid) {
      const transaction: Transaction = {
        id: Date.now().toString(),
        ...this.transactionForm.value,
      };
      this.transactionService.addTransaction(transaction);
      this.transactionForm.reset({ type: 'income', date: new Date().toISOString().substring(0, 10) });
    } else {
      this.transactionForm.markAllAsTouched();
    }
  }

  /**
   * Check is field is valid
   * @param {string} field
   * @return {boolean}
   */
  isFieldInvalid(field: string): boolean {
    const control: AbstractControl | null = this.transactionForm.get(field);
    return Boolean(control?.invalid && control?.touched);
  }
}

