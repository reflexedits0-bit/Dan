
import { Component, inject, signal, computed } from '@angular/core';
import { StateService, Transaction } from '../services/state.service';
import { RouterLink } from '@angular/router';
// FIX: Import FormControl and remove FormBuilder
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-wallet',
  imports: [RouterLink, ReactiveFormsModule, DatePipe, NgClass],
  template: `
    <div class="px-6 pt-2 pb-32 flex flex-col gap-6 animate-in fade-in duration-500 min-h-screen transition-colors duration-300">
      
      <!-- Digital Card -->
      <div class="relative bg-black rounded-[2rem] p-8 text-white shadow-2xl shadow-blue-500/20 overflow-hidden border border-gray-800 group md:max-w-2xl md:mx-auto w-full">
        <!-- Holographic Effect -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-600/30 to-purple-600/30 -mr-20 -mt-20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
        <div class="absolute bottom-0 left-0 w-40 h-40 bg-pink-600/20 -ml-10 -mb-10 rounded-full blur-2xl"></div>
        
        <!-- Card Content -->
        <div class="relative z-10">
          <div class="flex justify-between items-start mb-4">
            <div class="w-12 h-8 rounded bg-gradient-to-r from-yellow-200 to-yellow-500 opacity-80"></div>
            <span class="font-gaming font-bold italic text-white/50 tracking-widest">ARENA PASS</span>
          </div>

          <p class="font-ui text-[10px] font-bold uppercase tracking-[0.3em] text-blue-200 mb-2">Total Balance</p>
          <div class="flex items-baseline gap-1 mb-4">
            <span class="font-ui text-2xl font-bold text-blue-400">₹</span>
            <h3 class="font-gaming text-5xl font-black tracking-tight drop-shadow-lg">{{ totalBalance() }}</h3>
          </div>

          <div class="flex justify-between text-xs font-ui font-bold border-t border-white/10 pt-3">
             <p>Deposit: <span class="text-gray-300">₹{{ state.userProfile()?.depositBalance || 0 }}</span></p>
             <p>Winnings: <span class="text-green-400">₹{{ state.userProfile()?.winningsBalance || 0 }}</span></p>
          </div>

          <div class="grid grid-cols-2 gap-3 mt-6">
            <button (click)="openModal('add')" class="bg-white text-black font-ui font-bold py-3.5 rounded-xl uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-white/10 hover:bg-gray-50">
              <i class="fa-solid fa-plus text-blue-500"></i> Add Funds
            </button>
            <button (click)="openModal('withdraw')" class="bg-white/10 border border-white/20 text-white font-ui font-bold py-3.5 rounded-xl uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-white/20">
              <i class="fa-solid fa-arrow-up-right-from-square text-pink-400"></i> Withdraw
            </button>
          </div>
        </div>
      </div>

      <!-- Transaction List - Detailed History -->
      <div class="md:max-w-4xl md:mx-auto w-full">
        <div class="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-dark-border pb-2">
           <h3 class="font-ui font-bold text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">Transaction History</h3>
           <button (click)="toggleLimit()" class="text-[10px] font-bold text-blue-500 uppercase hover:text-blue-600 transition-colors">
              {{ limit() === 5 ? 'View All' : 'Show Less' }}
           </button>
        </div>
        
        <div class="flex flex-col gap-3">
          @for (t of visibleTransactions(); track t.id) {
            <div class="flex items-center justify-between p-4 bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border rounded-2xl shadow-sm hover:border-blue-100 transition-colors cursor-pointer group">
              <div class="flex items-center gap-4">
                <div [class]="t.type === 'credit' ? 'bg-green-50 dark:bg-green-900/20 text-green-500 border-green-100 dark:border-green-900/30' : 'bg-red-50 dark:bg-red-900/20 text-red-500 border-red-100 dark:border-red-900/30'" class="w-12 h-12 rounded-2xl border flex items-center justify-center text-lg group-hover:scale-105 transition-transform shrink-0">
                  <i [class]="t.type === 'credit' ? 'fa-solid fa-arrow-down' : 'fa-solid fa-arrow-up'"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-ui font-bold text-sm text-gray-800 dark:text-gray-200 truncate">{{ t.desc }}</p>
                  <div class="flex flex-wrap items-center gap-2 mt-1">
                    <p class="text-[10px] font-ui font-semibold text-gray-400 uppercase tracking-widest">
                      {{ t.date | date:'mediumDate' }} <span class="mx-1">•</span> {{ t.date | date:'shortTime' }}
                    </p>
                    @if(t.utr) {
                        <span class="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[9px] font-mono text-gray-500 border border-gray-200 dark:border-gray-700">UTR: {{t.utr}}</span>
                    }
                  </div>
                </div>
              </div>
              <div class="text-right shrink-0 ml-4">
                <p [class]="t.type === 'credit' ? 'text-green-500' : 'text-red-500'" class="font-gaming font-bold text-base">
                  {{ t.type === 'credit' ? '+' : '-' }}₹{{ t.amount }}
                </p>
                <div class="flex items-center justify-end gap-1.5 text-[9px] font-ui font-bold text-gray-300 uppercase tracking-widest italic mt-1">
                  @if (t.desc.includes('Pending')) {
                      <span class="text-yellow-500">Processing</span> <i class="fa-regular fa-clock text-yellow-500"></i>
                  } @else {
                      <span class="text-gray-400">Success</span> <i class="fa-solid fa-check-circle text-gray-300"></i>
                  }
                </div>
              </div>
            </div>
          } @empty {
            <div class="col-span-full py-12 text-center text-gray-400 font-ui font-bold text-xs uppercase tracking-widest flex flex-col items-center gap-3">
               <div class="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <i class="fa-solid fa-receipt text-xl text-gray-300"></i>
               </div>
               No transactions found.
            </div>
          }
        </div>
      </div>

      <!-- Robust Responsive Modal: Bottom Sheet (Mobile) -> Center Modal (Desktop) -->
      @if (modalType() !== 'none') {
        <div class="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-6">
           <!-- Backdrop -->
           <div class="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" (click)="closeModal()"></div>
           
           <!-- Modal Container -->
           <div class="relative w-full md:max-w-lg bg-white dark:bg-dark-surface rounded-t-[2rem] md:rounded-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] flex flex-col md:border md:border-gray-200 md:dark:border-dark-border">
              
              <!-- Fixed Header -->
              <div class="shrink-0 p-6 pb-2 border-b border-gray-100 dark:border-dark-border">
                  <div class="w-12 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 md:hidden"></div>
                  <div class="flex justify-between items-center">
                    <h3 class="font-gaming font-black text-xl text-gray-900 dark:text-white uppercase">
                        {{ modalType() === 'add' ? 'Secure Deposit' : 'Withdraw Funds' }}
                    </h3>
                    <button (click)="closeModal()" class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                  </div>
              </div>

              <!-- Scrollable Body -->
              <div class="flex-1 overflow-y-auto p-6 space-y-6">
                  <!-- Content for Add Funds -->
                  @if (modalType() === 'add') {
                     <div class="space-y-4">
                         <div>
                            <label class="block text-[10px] font-ui font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Select Amount</label>
                            <div class="flex gap-2 mb-3">
                               @for(amt of [20, 50, 100]; track amt) {
                                   <button 
                                     (click)="amountControl.setValue(amt)" 
                                     class="px-4 py-2 rounded-lg text-xs font-bold font-ui border transition-colors"
                                     [class]="amountControl.value === amt 
                                        ? 'bg-black text-white dark:bg-blue-600 dark:text-white border-transparent shadow-lg' 
                                        : 'bg-gray-100 text-gray-900 dark:bg-[#151515] dark:text-gray-400 border-gray-200 dark:border-dark-border hover:bg-gray-200 dark:hover:bg-gray-800'"
                                   >
                                     ₹{{amt}}
                                   </button>
                               }
                            </div>
                            <input [formControl]="amountControl" type="number" class="w-full h-14 bg-gray-100 dark:bg-[#151515] rounded-xl px-4 font-gaming text-lg outline-none border border-gray-200 dark:border-dark-border focus:border-blue-500 text-gray-900 dark:text-white" placeholder="Min ₹20">
                            <p class="text-[10px] text-gray-400 mt-2 text-right">Min Deposit: ₹20</p>
                         </div>

                         <div class="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/20 text-center">
                            <p class="text-[10px] font-bold text-yellow-600 dark:text-yellow-500 uppercase tracking-widest mb-1">Scan to Pay</p>
                            <p class="font-mono text-sm text-gray-800 dark:text-white mb-2">upi@axisbank</p>
                            <div class="w-full h-px bg-yellow-200 dark:bg-yellow-800 mb-2"></div>
                            <p class="text-[10px] text-gray-500">Pay via GPay / PhonePe / Paytm</p>
                         </div>

                         <div>
                            <label class="block text-[10px] font-ui font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Transaction ID / UTR</label>
                            <input [formControl]="utrControl" type="text" class="w-full h-12 bg-gray-100 dark:bg-[#151515] rounded-xl px-4 font-mono text-sm outline-none border border-gray-200 dark:border-dark-border focus:border-blue-500 text-gray-900 dark:text-white" placeholder="Enter 12-digit UTR">
                         </div>

                         <div>
                            <label class="block text-[10px] font-ui font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Upload Screenshot</label>
                            <div class="relative w-full h-32 bg-gray-100 dark:bg-[#151515] border-2 border-dashed border-gray-200 dark:border-dark-border rounded-xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-blue-500 transition-colors">
                                @if (screenshotPreview()) {
                                    <img [src]="screenshotPreview()" class="absolute inset-0 w-full h-full object-cover rounded-xl opacity-50">
                                    <span class="relative z-10 font-bold text-xs text-white bg-black/50 px-2 py-1 rounded">Change</span>
                                } @else {
                                    <i class="fa-solid fa-cloud-arrow-up text-2xl mb-2"></i>
                                    <span class="text-[10px] font-bold uppercase">Tap to Upload</span>
                                }
                                <input type="file" (change)="onFileSelected($event)" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer">
                            </div>
                         </div>
                     </div>
                  } 
                  <!-- Content for Withdraw -->
                  @else {
                     <div class="space-y-4">
                         <div>
                            <label class="block text-[10px] font-ui font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Select Amount</label>
                            <div class="flex gap-2 mb-3">
                               @for(amt of [100, 200, 500]; track amt) {
                                   <button 
                                     (click)="amountControl.setValue(amt)" 
                                     class="px-4 py-2 rounded-lg text-xs font-bold font-ui border transition-colors"
                                     [class]="amountControl.value === amt 
                                        ? 'bg-black text-white dark:bg-blue-600 dark:text-white border-transparent shadow-lg' 
                                        : 'bg-gray-100 text-gray-900 dark:bg-[#151515] dark:text-gray-400 border-gray-200 dark:border-dark-border hover:bg-gray-200 dark:hover:bg-gray-800'"
                                   >
                                     ₹{{amt}}
                                   </button>
                               }
                            </div>
                            <input [formControl]="amountControl" type="number" class="w-full h-14 bg-gray-100 dark:bg-[#151515] rounded-xl px-4 font-gaming text-lg outline-none border border-gray-200 dark:border-dark-border focus:border-blue-500 text-gray-900 dark:text-white" placeholder="Min ₹100">
                            <div class="flex justify-between text-[10px] text-gray-400 mt-2">
                                <span>Min Withdraw: ₹100</span>
                                <span class="text-green-500">Withdrawable: ₹{{ state.userProfile()?.winningsBalance || 0 }}</span>
                            </div>
                         </div>

                         <div>
                            <label class="block text-[10px] font-ui font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Upload Payment QR</label>
                            <div class="relative w-full h-32 bg-gray-100 dark:bg-[#151515] border-2 border-dashed border-gray-200 dark:border-dark-border rounded-xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-blue-500 transition-colors">
                                @if (screenshotPreview()) {
                                    <img [src]="screenshotPreview()" class="absolute inset-0 w-full h-full object-cover rounded-xl opacity-50">
                                    <span class="relative z-10 font-bold text-xs text-white bg-black/50 px-2 py-1 rounded">Change</span>
                                } @else {
                                    <i class="fa-solid fa-qrcode text-2xl mb-2"></i>
                                    <span class="text-[10px] font-bold uppercase">Upload QR</span>
                                }
                                <input type="file" (change)="onFileSelected($event)" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer">
                            </div>
                            <p class="text-[9px] text-gray-400 mt-2">Upload your UPI QR Code to receive payment.</p>
                         </div>
                     </div>
                  }
              </div>

              <!-- Fixed Footer Button -->
              <div class="shrink-0 p-6 pt-4 border-t border-gray-100 dark:border-dark-border bg-white dark:bg-dark-surface pb-8 md:pb-6 rounded-b-[2rem] md:rounded-b-3xl">
                <!-- BUTTON STYLE CHANGE FOR WITHDRAW: GREEN BACKGROUND -->
                <button (click)="processAction()" [disabled]="processing()" 
                  [class]="modalType() === 'withdraw' ? 'bg-green-600 hover:bg-green-700 shadow-green-500/20' : 'bg-black dark:bg-blue-600 hover:bg-gray-900 dark:hover:bg-blue-700'"
                  class="w-full h-14 text-white rounded-xl font-gaming font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
                   @if (processing()) {
                      <i class="fa-solid fa-circle-notch animate-spin"></i> Processing...
                   } @else {
                      {{ modalType() === 'add' ? 'Submit Request' : 'Confirm Withdrawal' }}
                   }
                </button>
              </div>

           </div>
        </div>
      }
    </div>
  `
})
export class WalletComponent {
  state = inject(StateService);
  
  modalType = signal<'none' | 'add' | 'withdraw'>('none');
  // FIX: Instantiate FormControl directly instead of using FormBuilder
  amountControl = new FormControl(0, [Validators.required, Validators.min(1)]);
  // FIX: Instantiate FormControl directly instead of using FormBuilder
  utrControl = new FormControl('', []);
  
  processing = signal(false);
  screenshotPreview = signal<string | null>(null);
  limit = signal(5);

  totalBalance = computed(() => {
      const profile = this.state.userProfile();
      if (!profile) return 0;
      return profile.depositBalance + profile.winningsBalance;
  });

  transactions = computed(() => {
     const tMap = this.state.userProfile()?.transactions;
     if (!tMap) return [];
     return Object.values(tMap).sort((a: Transaction, b: Transaction) => b.date - a.date);
  });

  visibleTransactions = computed(() => {
     return this.transactions().slice(0, this.limit());
  });

  toggleLimit() {
     this.limit.update(val => val === 5 ? 50 : 5);
  }

  openModal(type: 'add' | 'withdraw') {
     this.modalType.set(type);
     this.amountControl.setValue(type === 'add' ? 20 : 100);
     this.utrControl.setValue('');
     this.screenshotPreview.set(null);
  }

  closeModal() {
     this.modalType.set('none');
  }

  onFileSelected(event: any) {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
              this.screenshotPreview.set(e.target.result);
          };
          reader.readAsDataURL(file);
      }
  }

  async processAction() {
     if (this.amountControl.invalid || this.amountControl.value! <= 0) {
        this.state.notify('Invalid Amount', 'Enter a valid amount.', 'error');
        return;
     }

     const amount = this.amountControl.value!;

     if (this.modalType() === 'add') {
         if (amount < 20) {
            this.state.notify('Min Deposit Limit', 'Minimum deposit is ₹20.', 'error');
            return;
         }
         if(!this.utrControl.value || this.utrControl.value!.length < 6) {
             this.state.notify('Invalid UTR', 'Please enter a valid Transaction ID.', 'error');
             return;
         }
         if(!this.screenshotPreview()) {
             this.state.notify('Missing Proof', 'Please upload a screenshot.', 'error');
             return;
         }
     } else if (this.modalType() === 'withdraw') {
         if (amount < 100) {
             this.state.notify('Min Withdraw Limit', 'Minimum withdrawal is ₹100.', 'error');
             return;
         }
         if(amount > (this.state.userProfile()?.winningsBalance || 0)) {
            this.state.notify('Insufficient Winnings', 'You can only withdraw from your winnings balance.', 'error');
            return;
         }
         if(!this.screenshotPreview()) {
             this.state.notify('Missing QR', 'Please upload your Payment QR Code.', 'error');
             return;
         }
     }

     this.processing.set(true);
     
     try {
        if (this.modalType() === 'add') {
           await new Promise(r => setTimeout(r, 1500));
           await this.state.addFunds(amount, this.utrControl.value!, this.screenshotPreview()!);
        } else {
           await this.state.withdrawFunds(amount, this.screenshotPreview()!);
        }
        this.closeModal();
     } catch (e: any) {
        // Notification handled in service
     } finally {
        this.processing.set(false);
     }
  }
}
