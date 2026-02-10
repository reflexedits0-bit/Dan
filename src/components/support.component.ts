
import { Component, signal, inject, viewChild, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StateService } from '../services/state.service';
// FIX: Import FormControl and remove FormBuilder
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-support',
  imports: [RouterLink, ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto p-6 min-h-screen bg-gray-50 dark:bg-dark-bg animate-in fade-in duration-300 pb-24 flex flex-col w-full">
       <div class="flex items-center gap-4 mb-8">
        <button routerLink="/" class="w-10 h-10 rounded-xl bg-white dark:bg-dark-surface text-gray-800 dark:text-white border border-gray-200 dark:border-dark-border flex items-center justify-center shadow-sm">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <h2 class="font-gaming font-black text-xl uppercase italic text-gray-800 dark:text-white">Help <span class="text-teal-500">Center</span></h2>
      </div>

      <!-- Main Action Grid -->
      <div class="grid grid-cols-2 gap-4 mb-8">
          <!-- WhatsApp Button -->
          <a href="https://wa.me/919999999999" target="_blank" class="bg-[#25D366] p-6 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-lg shadow-green-500/20 active:scale-95 transition-transform text-white">
              <i class="fa-brands fa-whatsapp text-4xl"></i>
              <span class="font-gaming font-black text-xs uppercase tracking-widest">WhatsApp</span>
          </a>
          
          <!-- Report Problem Button -->
          <button (click)="openTicketModal.set(true)" class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-100 dark:border-dark-border flex flex-col items-center justify-center gap-3 shadow-sm active:scale-95 transition-transform group">
              <i class="fa-solid fa-triangle-exclamation text-3xl text-red-500 group-hover:scale-110 transition-transform"></i>
              <span class="font-ui font-bold text-xs uppercase tracking-widest text-gray-600 dark:text-gray-300">Report Issue</span>
          </button>
      </div>

      <h3 class="font-ui font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">FAQ</h3>
      
      <div class="space-y-3">
          <div class="bg-white dark:bg-dark-surface p-4 rounded-xl border border-gray-100 dark:border-dark-border">
              <h4 class="font-bold text-sm text-gray-800 dark:text-white mb-2">How do I withdraw money?</h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">Go to your Wallet > Withdraw. Requests are processed within 24 hours via UPI.</p>
          </div>
          <div class="bg-white dark:bg-dark-surface p-4 rounded-xl border border-gray-100 dark:border-dark-border">
              <h4 class="font-bold text-sm text-gray-800 dark:text-white mb-2">Tournament ID Password?</h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">ID and Password are shared 15 minutes before match start time in the Tournament Detail page.</p>
          </div>
          <div class="bg-white dark:bg-dark-surface p-4 rounded-xl border border-gray-100 dark:border-dark-border">
              <h4 class="font-bold text-sm text-gray-800 dark:text-white mb-2">Game Crash Issue?</h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">If the game crashes, we are not responsible. Ensure stable internet connection.</p>
          </div>
      </div>

      <!-- Report Issue Modal -->
      @if (openTicketModal()) {
         <div class="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-6">
             <!-- Backdrop -->
             <div class="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" (click)="openTicketModal.set(false)"></div>
             
             <!-- Modal Container -->
             <div class="relative w-full md:max-w-lg bg-white dark:bg-dark-surface rounded-t-[2rem] md:rounded-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col md:border md:border-gray-200 md:dark:border-dark-border md:h-auto md:max-h-[90vh]">
                
                <div class="shrink-0 p-6 pb-4 border-b border-gray-100 dark:border-dark-border">
                    <div class="w-12 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 md:hidden"></div>
                    <div class="flex justify-between items-center">
                      <h3 class="font-gaming font-black text-xl text-gray-900 dark:text-white uppercase">Submit Ticket</h3>
                      <button (click)="openTicketModal.set(false)" class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 cursor-pointer">
                          <i class="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                </div>

                <div class="flex-1 overflow-y-auto p-6 space-y-4 pb-8">
                     <div>
                        <label class="block text-[10px] font-ui font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Describe your issue</label>
                        <textarea [formControl]="descControl" class="w-full h-24 bg-gray-100 dark:bg-[#151515] rounded-xl p-4 font-ui text-sm outline-none border border-gray-200 dark:border-dark-border focus:border-red-500 text-gray-900 dark:text-white resize-none" placeholder="Please provide details regarding your problem..."></textarea>
                     </div>

                     <div>
                        <label class="block text-[10px] font-ui font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Upload Screenshot</label>
                        <div class="relative w-full h-24 bg-gray-100 dark:bg-[#151515] border-2 border-dashed border-gray-200 dark:border-dark-border rounded-xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-red-500 transition-colors">
                            @if (screenshotPreview()) {
                                <img [src]="screenshotPreview()" class="absolute inset-0 w-full h-full object-cover rounded-xl opacity-70">
                                <span class="relative z-10 font-bold text-xs text-white bg-black/50 px-2 py-1 rounded">Change</span>
                            } @else {
                                <i class="fa-solid fa-image text-2xl mb-2"></i>
                                <span class="text-[10px] font-bold uppercase">Attach Image</span>
                            }
                            <input type="file" (change)="onFileSelected($event)" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer">
                        </div>
                     </div>
                     
                     <button (click)="submitTicket()" [disabled]="submitting()" class="w-full h-14 bg-red-600 text-white rounded-xl font-gaming font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-red-700 !mt-6">
                       @if (submitting()) {
                          <i class="fa-solid fa-circle-notch animate-spin"></i> Sending...
                       } @else {
                          Submit Report
                       }
                     </button>
                </div>

             </div>
         </div>
      }
    </div>
  `
})
export class SupportComponent {
  state = inject(StateService);
  
  openTicketModal = signal(false);
  // FIX: Instantiate FormControl directly instead of using FormBuilder
  descControl = new FormControl('', Validators.required);
  screenshotPreview = signal<string | null>(null);
  submitting = signal(false);

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

  async submitTicket() {
      if (this.descControl.invalid) {
          this.state.notify('Missing Info', 'Please describe the issue.', 'error');
          return;
      }
      if (!this.screenshotPreview()) {
          this.state.notify('Missing Info', 'Please attach a screenshot.', 'error');
          return;
      }

      this.submitting.set(true);
      try {
          await this.state.reportIssue(this.descControl.value!, this.screenshotPreview()!);
          this.openTicketModal.set(false);
          this.descControl.reset();
          this.screenshotPreview.set(null);
      } catch (e) {
          // Handled by service
      } finally {
          this.submitting.set(false);
      }
  }
}
