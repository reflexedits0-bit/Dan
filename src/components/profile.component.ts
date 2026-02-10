
import { Component, inject, signal } from '@angular/core';
import { StateService } from '../services/state.service';
import { RouterLink } from '@angular/router';
// FIX: Import FormGroup/FormControl and remove FormBuilder
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, ReactiveFormsModule, NgClass],
  template: `
    <div class="flex flex-col min-h-screen relative pb-32">
      
      <!-- Identity Card -->
      <div class="px-5 pt-8 animate-in slide-in-from-top duration-500">
        <div class="relative bg-white dark:bg-dark-surface dark:border-dark-border border border-gray-100 rounded-[2rem] p-8 shadow-xl shadow-blue-50/50 dark:shadow-none overflow-hidden group w-full md:max-w-2xl md:mx-auto text-center">
          
          <!-- Background Decoration -->
          <div class="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>
          
          <div class="relative z-10 flex flex-col items-center">
            
            <!-- AVATAR RE-DESIGN: Sharp, Techy, No Blur, No Level -->
            <div class="relative w-28 h-28 mb-4">
                 <!-- Spinning Rings -->
                 <div class="absolute inset-0 rounded-full border-[2px] border-transparent border-t-blue-500 border-b-purple-500 animate-[spin_3s_linear_infinite]"></div>
                 <div class="absolute inset-2 rounded-full border-[2px] border-transparent border-l-yellow-400 border-r-pink-500 animate-[spin_4s_linear_infinite_reverse]"></div>
                 
                 <!-- Main Avatar Container (Sharp edges/borders) -->
                 <div class="absolute inset-3 rounded-full bg-gradient-to-tr from-gray-100 to-white dark:from-[#1a1a1a] dark:to-[#0a0a0a] flex items-center justify-center shadow-inner z-10">
                     <span class="font-gaming font-black text-4xl text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-purple-600 uppercase">
                        {{ state.userProfile()?.name?.charAt(0) }}
                     </span>
                 </div>
            </div>
            
            <h3 class="font-gaming font-black text-2xl text-gray-900 dark:text-white uppercase tracking-tight mb-1">{{ state.userProfile()?.name }}</h3>
            
            @if(state.userProfile()?.ffUid) {
               <p class="text-[10px] font-ui font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">FF UID: {{ state.userProfile()?.ffUid }}</p>
            } @else {
               <p class="text-[10px] font-ui font-bold text-gray-400 uppercase tracking-widest opacity-50">NO UID LINKED</p>
            }

            <!-- SENTINEL AI STATUS BADGE -->
            <div class="mt-3">
               @if (state.userProfile()?.sentinelStatus === 'clean' || !state.userProfile()?.sentinelStatus) {
                  <div class="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full shadow-sm">
                    <i class="fa-solid fa-shield-halved text-green-500 text-xs"></i>
                    <span class="text-[9px] font-bold uppercase tracking-widest text-green-500">Sentinel Protected</span>
                  </div>
               }
            </div>

            <button (click)="openEdit()" class="mt-5 px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-transform flex items-center gap-2">
                <i class="fa-solid fa-pen-to-square"></i> Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-6 animate-in fade-in duration-500 mt-6">
        
        <!-- Refer & Earn -->
        <div class="px-5 w-full md:max-w-4xl md:mx-auto">
            <div class="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                <div class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div class="flex justify-between items-center relative z-10">
                    <div>
                        <h3 class="font-gaming font-black text-lg uppercase italic">Refer & Earn</h3>
                        <p class="text-xs opacity-80 mb-3 font-ui">Both get ₹5 instantly.</p>
                    </div>
                    <i class="fa-solid fa-gift text-4xl opacity-50"></i>
                </div>
                <div class="bg-black/20 rounded-xl p-3 flex justify-between items-center border border-white/10 backdrop-blur-sm">
                    <span class="font-mono font-bold text-lg tracking-widest">{{ state.userProfile()?.referralCode || '----' }}</span>
                    <button (click)="copyCode()" class="bg-white text-blue-600 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest active:scale-95 transition-transform">
                        <i class="fa-regular fa-copy mr-1"></i> Copy
                    </button>
                </div>
            </div>
        </div>

        <!-- Social Media Grid -->
        <div class="px-5 w-full md:max-w-4xl md:mx-auto">
            <div class="grid grid-cols-4 gap-3">
               <a href="#" target="_blank" class="flex flex-col items-center justify-center gap-2 p-3 bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm active:scale-95 transition-transform">
                  <i class="fa-brands fa-youtube text-2xl text-red-600"></i>
                  <span class="text-[9px] font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400">YouTube</span>
               </a>
               <a href="#" target="_blank" class="flex flex-col items-center justify-center gap-2 p-3 bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm active:scale-95 transition-transform">
                  <i class="fa-brands fa-instagram text-2xl text-pink-600"></i>
                  <span class="text-[9px] font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400">Insta</span>
               </a>
               <a href="#" target="_blank" class="flex flex-col items-center justify-center gap-2 p-3 bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm active:scale-95 transition-transform">
                  <i class="fa-brands fa-telegram text-2xl text-blue-500"></i>
                  <span class="text-[9px] font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400">Telegram</span>
               </a>
               <button (click)="shareApp()" class="flex flex-col items-center justify-center gap-2 p-3 bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm active:scale-95 transition-transform">
                  <i class="fa-solid fa-share-nodes text-2xl text-green-500"></i>
                  <span class="text-[9px] font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400">Share</span>
               </button>
            </div>
        </div>

        <!-- Stats Grid -->
        <div class="px-5 w-full md:max-w-4xl md:mx-auto pb-6">
           <div class="grid grid-cols-3 gap-3">
               <div class="bg-gradient-to-b from-white to-gray-50 dark:from-dark-surface dark:to-black p-4 rounded-2xl border border-gray-200 dark:border-dark-border text-center shadow-sm relative overflow-hidden">
                  <div class="absolute top-0 left-0 w-full h-0.5 bg-blue-400"></div>
                  <h4 class="font-gaming text-2xl font-black text-gray-800 dark:text-white">{{ state.userProfile()?.wins || 0 }}</h4>
                  <p class="text-[9px] font-ui font-bold text-gray-400 uppercase tracking-widest mt-1">Victories</p>
               </div>
               <div class="bg-gradient-to-b from-white to-gray-50 dark:from-dark-surface dark:to-black p-4 rounded-2xl border border-gray-200 dark:border-dark-border text-center shadow-sm relative overflow-hidden">
                  <div class="absolute top-0 left-0 w-full h-0.5 bg-purple-400"></div>
                  <h4 class="font-gaming text-2xl font-black text-gray-800 dark:text-white">{{ state.userProfile()?.matches || 0 }}</h4>
                  <p class="text-[9px] font-ui font-bold text-gray-400 uppercase tracking-widest mt-1">Matches</p>
               </div>
               <div class="bg-gradient-to-b from-white to-gray-50 dark:from-dark-surface dark:to-black p-4 rounded-2xl border border-gray-200 dark:border-dark-border text-center shadow-sm relative overflow-hidden">
                  <div class="absolute top-0 left-0 w-full h-0.5 bg-pink-400"></div>
                  <h4 class="font-gaming text-2xl font-black text-gray-800 dark:text-white">{{ state.userProfile()?.exp || 0 }}</h4>
                  <p class="text-[9px] font-ui font-bold text-gray-400 uppercase tracking-widest mt-1">Total XP</p>
               </div>
           </div>
        </div>
      </div>

      <!-- EDIT PROFILE BOTTOM SHEET / CENTER MODAL (Robust Responsive) -->
      @if (isEditing()) {
          <div class="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6">
             <!-- Backdrop -->
             <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" (click)="isEditing.set(false)"></div>
             
             <!-- Sheet Content (Flex Column) -->
             <div class="relative w-full md:max-w-lg bg-white dark:bg-dark-surface rounded-t-[2rem] md:rounded-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 h-[85vh] md:h-auto md:max-h-[90vh] flex flex-col md:border md:border-gray-200 md:dark:border-dark-border">
                
                <!-- Fixed Header -->
                <div class="shrink-0 p-8 pb-4">
                  <div class="w-12 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6 md:hidden"></div>
                  <div class="flex items-center justify-between">
                      <h3 class="font-gaming font-black text-xl text-gray-900 dark:text-white uppercase">Update Identity</h3>
                      <button (click)="isEditing.set(false)" class="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
                          <i class="fa-solid fa-xmark"></i>
                      </button>
                  </div>
                </div>

                <!-- Scrollable Form -->
                <div class="flex-1 overflow-y-auto px-8 pb-4">
                  <form [formGroup]="editForm" class="flex flex-col gap-4">
                      <div class="space-y-1">
                          <label class="text-[10px] font-bold font-ui uppercase tracking-widest text-gray-500 dark:text-gray-400 ml-1">Codename (Name)</label>
                          <input formControlName="name" class="w-full h-14 bg-gray-100 dark:bg-[#151515] text-gray-900 dark:text-white rounded-xl px-4 font-gaming text-sm outline-none border border-gray-200 dark:border-dark-border focus:border-blue-500 placeholder-gray-400">
                      </div>

                      <div class="space-y-1">
                          <label class="text-[10px] font-bold font-ui uppercase tracking-widest text-gray-500 dark:text-gray-400 ml-1">Free Fire UID</label>
                          <input formControlName="ffUid" type="number" class="w-full h-14 bg-gray-100 dark:bg-[#151515] text-gray-900 dark:text-white rounded-xl px-4 font-mono text-sm outline-none border border-gray-200 dark:border-dark-border focus:border-blue-500 placeholder-gray-400" placeholder="123456789">
                      </div>

                      <div class="space-y-1">
                          <label class="text-[10px] font-bold font-ui uppercase tracking-widest text-gray-500 dark:text-gray-400 ml-1">Comms Link (Phone)</label>
                          <input formControlName="phone" type="tel" class="w-full h-14 bg-gray-100 dark:bg-[#151515] text-gray-900 dark:text-white rounded-xl px-4 font-mono text-sm outline-none border border-gray-200 dark:border-dark-border focus:border-blue-500 placeholder-gray-400" placeholder="+91 99999 99999">
                      </div>
                  </form>
                </div>
                
                <!-- Fixed Footer Button (Bottom Safe Area) -->
                <div class="shrink-0 p-8 pt-4 border-t border-gray-100 dark:border-dark-border bg-white dark:bg-dark-surface pb-10 rounded-b-[2rem] md:rounded-b-3xl">
                    <button (click)="saveProfile()" [disabled]="saving()" class="w-full h-14 bg-black dark:bg-blue-600 text-white rounded-xl font-gaming font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
                        @if (saving()) {
                            <i class="fa-solid fa-circle-notch animate-spin"></i> Saving...
                        } @else {
                            Save Changes
                        }
                    </button>
                </div>
             </div>
          </div>
      }
    </div>
  `
})
export class ProfileComponent {
  state = inject(StateService);
  
  isEditing = signal(false);
  saving = signal(false);

  // FIX: Instantiate FormGroup directly instead of using FormBuilder
  editForm = new FormGroup({
      name: new FormControl('', Validators.required),
      ffUid: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
      phone: new FormControl('', [Validators.pattern('^[0-9]{10}$')])
  });

  openEdit() {
      const p = this.state.userProfile();
      if (p) {
          this.editForm.patchValue({
              name: p.name,
              ffUid: p.ffUid || '',
              phone: p.phone || ''
          });
      }
      this.isEditing.set(true);
  }

  async saveProfile() {
      if (this.editForm.invalid) {
          this.state.notify('Error', 'Please check your inputs.', 'error');
          return;
      }
      
      this.saving.set(true);
      try {
          await this.state.updateProfile(this.editForm.value as any);
          this.isEditing.set(false);
      } catch (e) {
          // Handled by service
      } finally {
          this.saving.set(false);
      }
  }

  async shareApp() {
      // Use a safe URL for sharing to prevent 'Invalid URL' errors
      const url = 'https://arena-ar.web.app';
      const shareData = {
          title: 'Arena AR',
          text: 'Join me on Arena AR - The best esports tournament app!',
          url: url
      };

      try {
          if (navigator.share) {
              await navigator.share(shareData);
          } else {
              throw new Error('Web Share API not supported');
          }
      } catch (err) {
          // Fallback to clipboard if share fails or is not supported
          navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
          this.state.notify('Copied', 'Link copied to clipboard', 'success');
      }
  }

  copyCode() {
      const code = this.state.userProfile()?.referralCode;
      if (code) {
          navigator.clipboard.writeText(code);
          this.state.notify('Copied', 'Referral code copied!', 'success');
      }
  }
}
