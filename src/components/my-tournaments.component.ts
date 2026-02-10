
import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-my-tournaments',
  imports: [RouterLink],
  template: `
     <div class="max-w-4xl mx-auto px-4 py-4 flex flex-col gap-4 min-h-screen w-full bg-gray-50 dark:bg-dark-bg animate-in fade-in duration-300">
      
      <!-- Moved Content Up (Removed Header) -->
      <div class="flex flex-col gap-4">
        @for (t of myTournaments(); track t.id) {
          <div [routerLink]="['/tournament', t.id]" class="bg-white dark:bg-dark-surface dark:border-dark-border rounded-2xl border border-gray-100 p-4 shadow-sm active:scale-95 transition-transform cursor-pointer relative overflow-hidden tap-highlight-transparent">
            <div class="flex justify-between items-start mb-2">
               <div>
                  <h4 class="font-ui font-bold text-base text-gray-800 dark:text-gray-200">{{ t.title }}</h4>
                  <span class="text-[10px] font-ui font-bold text-blue-500 uppercase tracking-widest">{{ t.type }} • {{ t.map }}</span>
               </div>
               <div class="bg-green-100 text-green-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
                  JOINED
               </div>
            </div>
            <div class="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
               <p class="font-gaming font-bold text-sm dark:text-white">ID: {{ t.id.substring(1) }}...</p>
               <p class="font-ui text-xs font-bold text-gray-500">{{ t.time }} • {{ t.date }}</p>
            </div>
          </div>
        } @empty {
          <div class="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-600 gap-4 mt-10">
            <div class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <i class="fa-solid fa-folder-open text-2xl"></i>
            </div>
            <p class="font-ui font-bold text-sm uppercase tracking-widest">No active deployments found.</p>
            <button routerLink="/" class="text-blue-500 font-bold text-sm uppercase tracking-wide border-b border-blue-500 pb-0.5">Join a Tournament</button>
          </div>
        }
      </div>
     </div>
  `
})
export class MyTournamentsComponent {
  state = inject(StateService);
  
  myTournaments = computed(() => {
    const uid = this.state.currentUser()?.uid;
    if (!uid) return [];
    return this.state.tournaments().filter(t => t.participants && t.participants[uid]);
  });
}
