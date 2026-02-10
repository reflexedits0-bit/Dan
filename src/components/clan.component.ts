
import { Component, inject, signal } from '@angular/core';
import { StateService } from '../services/state.service';
import { RouterLink } from '@angular/router';
// FIX: Import FormControl and remove FormBuilder
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-clan',
  imports: [RouterLink, ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto p-6 min-h-screen bg-gray-50 dark:bg-dark-bg animate-in fade-in duration-300 pb-24 w-full">
       <div class="flex items-center gap-4 mb-8">
        <button routerLink="/" class="w-10 h-10 rounded-xl bg-white dark:bg-dark-surface text-gray-800 dark:text-white border border-gray-200 dark:border-dark-border flex items-center justify-center shadow-sm">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <h2 class="font-gaming font-black text-xl uppercase italic text-gray-800 dark:text-white">Clan <span class="text-purple-500">System</span></h2>
      </div>

      <!-- User Clan Status -->
      @if (state.userProfile()?.clan) {
         <div class="bg-purple-600 rounded-2xl p-6 text-white text-center mb-8 relative overflow-hidden shadow-xl">
            <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <h3 class="font-gaming font-black text-2xl uppercase mb-2">Member of Clan</h3>
            <p class="font-ui font-bold text-sm opacity-90">ID: {{ state.userProfile()?.clan }}</p>
         </div>
      } @else {
         <!-- Create Clan CTA -->
         <div class="bg-gray-900 rounded-2xl p-6 text-white text-center mb-8 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
            <div class="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/50">
                <i class="fa-solid fa-plus text-2xl"></i>
            </div>
            <h3 class="font-gaming font-bold text-lg mb-2">Start Your Legacy</h3>
            <p class="font-ui text-xs opacity-70 mb-4 max-w-xs mx-auto">Create a clan, recruit members, and dominate the guild wars.</p>
            <button (click)="openCreateModal.set(true)" class="bg-white text-black font-ui font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl active:scale-95 transition-transform">Create Clan (₹5000)</button>
         </div>
      }

      <h3 class="font-ui font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">Recommended Clans</h3>

      <div class="flex flex-col gap-4">
         @for (clan of state.clans(); track clan.id) {
            <div class="bg-white dark:bg-dark-surface dark:border-dark-border border border-gray-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
               <div class="w-14 h-14 rounded-xl bg-gray-50 dark:bg-[#151515] flex items-center justify-center text-2xl border border-gray-100 dark:border-dark-border">
                  {{ clan.logo }}
               </div>
               <div class="flex-1">
                  <h4 class="font-gaming font-bold text-base text-gray-800 dark:text-white">{{ clan.name }} <span class="text-purple-500 text-xs">[{{ clan.tag }}]</span></h4>
                  <p class="text-[10px] font-ui text-gray-500 dark:text-gray-400 italic">"{{ clan.slogan }}"</p>
                  <p class="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider"><i class="fa-solid fa-user-group mr-1"></i> {{ clan.members }}/50 Members</p>
               </div>
               
               @if (state.userProfile()?.clan === clan.id) {
                  <span class="text-[10px] font-bold text-purple-500 uppercase tracking-widest bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded">Joined</span>
               } @else if (!state.userProfile()?.clan) {
                  <button (click)="join(clan.id)" class="bg-purple-50 dark:bg-purple-900/20 text-purple-500 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-purple-100 dark:border-purple-900/30 active:scale-95 transition-transform">Join</button>
               }
            </div>
         }
      </div>

      <!-- Create Clan Modal (Bottom Sheet Style) -->
      @if (openCreateModal()) {
         <div class="fixed inset-0 z-50 flex items-end justify-center">
             <!-- Backdrop -->
            <div class="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" (click)="openCreateModal.set(false)"></div>
            
            <div class="relative w-full md:max-w-lg bg-white dark:bg-dark-surface rounded-t-[2rem] p-8 pb-16 shadow-2xl animate-in slide-in-from-bottom duration-300">
                <div class="w-12 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6"></div>

                <div class="flex justify-between items-center mb-6">
                    <h3 class="font-gaming font-black text-xl text-gray-800 dark:text-white uppercase">New Clan</h3>
                    <button (click)="openCreateModal.set(false)" class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                
                <div class="space-y-4 mb-6">
                    <div>
                        <label class="text-[10px] font-ui font-bold uppercase tracking-widest text-gray-400">Clan Name</label>
                        <input [formControl]="nameControl" class="w-full h-12 bg-gray-50 dark:bg-[#151515] rounded-xl px-4 font-bold text-sm border border-gray-200 dark:border-dark-border dark:text-white outline-none focus:border-purple-500">
                    </div>
                    <div>
                        <label class="text-[10px] font-ui font-bold uppercase tracking-widest text-gray-400">Tag (3-4 chars)</label>
                        <input [formControl]="tagControl" maxlength="4" class="w-full h-12 bg-gray-50 dark:bg-[#151515] rounded-xl px-4 font-bold text-sm border border-gray-200 dark:border-dark-border dark:text-white outline-none focus:border-purple-500 uppercase">
                    </div>
                </div>

                <button (click)="create()" [disabled]="creating()" class="w-full h-14 bg-purple-600 text-white rounded-xl font-gaming font-bold uppercase tracking-widest shadow-lg flex items-center justify-center gap-2">
                    @if(creating()) { <i class="fa-solid fa-circle-notch animate-spin"></i> } @else { Create for ₹5000 }
                </button>
            </div>
         </div>
      }
    </div>
  `
})
export class ClanComponent {
  state = inject(StateService);
  
  openCreateModal = signal(false);
  // FIX: Instantiate FormControl directly instead of using FormBuilder
  nameControl = new FormControl('', Validators.required);
  // FIX: Instantiate FormControl directly instead of using FormBuilder
  tagControl = new FormControl('', [Validators.required, Validators.maxLength(4)]);
  creating = signal(false);

  async create() {
      if (this.nameControl.invalid || this.tagControl.invalid) return;
      this.creating.set(true);

      try {
          await this.state.createClan(this.nameControl.value!, this.tagControl.value!);
          this.openCreateModal.set(false);
      } catch (e: any) {
         // Service handles notification
      } finally {
          this.creating.set(false);
      }
  }

  async join(clanId: string) {
      if (!confirm("Join this clan?")) return;
      try {
          await this.state.joinClan(clanId);
      } catch (e: any) {
         // Service handles notification
      }
  }
}
