
import { Component, signal, inject, computed } from '@angular/core';
import { StateService } from '../services/state.service';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterLink, NgClass],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-6 pb-32">
      
      <!-- Banner Hero: Responsive Height -->
      <div class="relative h-56 md:h-96 rounded-2xl overflow-hidden shadow-xl shadow-gray-200 dark:shadow-none border border-white dark:border-gray-800 group">
        <img src="https://picsum.photos/id/2/1200/800" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Banner">
        <!-- Clean dark overlay instead of gradient -->
        <div class="absolute inset-0 bg-black/40"></div>
        
        <div class="absolute inset-0 p-6 md:p-12 flex flex-col justify-center items-start">
          <div class="flex items-center gap-2 mb-2 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
             <span class="w-2 h-2 rounded-full bg-green-50 animate-pulse"></span>
             <span class="text-white font-ui font-bold text-[10px] md:text-xs uppercase tracking-widest">Live Event</span>
          </div>
          <h2 class="font-gaming text-3xl md:text-6xl font-black text-white leading-none uppercase mb-4 drop-shadow-lg">
            NEON<br/><span class="text-blue-400">UPRISING</span>
          </h2>
          <div class="inline-flex items-center gap-2 bg-yellow-500/20 px-3 py-1 rounded-md border border-yellow-500/30 backdrop-blur-sm">
            <i class="fa-solid fa-trophy text-yellow-400 text-xs md:text-sm"></i>
            <span class="font-ui font-bold text-xs md:text-sm text-yellow-100">Mega Prizes</span>
          </div>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="sticky top-20 lg:top-0 z-20 transition-colors duration-300 -mx-4 px-4 py-2 bg-gray-50 dark:bg-dark-bg">
        <div class="bg-white dark:bg-dark-surface p-1 rounded-xl flex items-center border border-gray-100 dark:border-dark-border w-full shadow-sm">
          @for (tab of tabs; track tab.key) {
            <button 
              (click)="activeTab.set(tab.key)"
              [class]="activeTab() === tab.key ? 'bg-black dark:bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'"
              class="flex-1 py-2 px-3 rounded-lg font-ui font-bold text-[10px] md:text-xs transition-all tracking-wider uppercase"
            >
              {{ tab.label }}
            </button>
          }
        </div>
      </div>

      <!-- Tournament List Section -->
      <div>
        <div class="flex items-center justify-between border-l-[3px] border-blue-500 pl-3 mb-4">
          <h3 class="font-gaming font-black text-lg md:text-2xl text-gray-800 dark:text-white uppercase italic tracking-tighter">
            Active <span class="text-blue-500">Operations</span>
          </h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (t of filteredTournaments(); track t.id) {
            <div [routerLink]="['/tournament', t.id]" class="bg-white dark:bg-dark-surface dark:border-dark-border rounded-2xl border border-gray-100 p-4 shadow-sm active:scale-95 transition-transform cursor-pointer relative overflow-hidden group tap-highlight-transparent hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-900">
              
              <!-- STATUS BADGES (Corner) -->
              <div class="absolute top-0 right-0 z-10">
                 @if (t.status === 'Open') {
                    @if ((t.filledSlots / t.totalSlots) > 0.8) {
                        <div class="bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest shadow-md flex items-center gap-1">
                            <i class="fa-solid fa-fire animate-pulse"></i> Filling Fast
                        </div>
                    } @else {
                        <div class="bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest shadow-md flex items-center gap-1">
                            <i class="fa-solid fa-circle-check"></i> Open
                        </div>
                    }
                 } @else {
                    <div class="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest shadow-md">
                        {{ t.status === 'Full' ? 'HOUSEFULL' : 'Started' }}
                    </div>
                 }
              </div>

              <!-- Content Row -->
              <div class="flex gap-4 mt-2">
                 <!-- Map Icon/Image -->
                 <div class="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700 relative">
                    <img [src]="'https://picsum.photos/id/' + (t.id.charCodeAt(0) % 50 + 10) + '/200/200'" class="w-full h-full object-cover">
                 </div>
                 
                 <!-- Details -->
                 <div class="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                        <h4 class="font-gaming font-black text-base md:text-lg text-gray-800 dark:text-white uppercase truncate">{{ t.title }}</h4>
                        <div class="flex items-center gap-2 mt-0.5">
                            <span class="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-100 dark:bg-white/5 px-1.5 py-0.5 rounded">{{ t.map }}</span>
                            <span class="text-[10px] font-bold text-blue-500 uppercase tracking-wide bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded">{{ t.type }}</span>
                        </div>
                    </div>
                    
                    <div class="flex items-end justify-between mt-2">
                        <div>
                             <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Prize Pool</p>
                             <p class="font-gaming font-black text-lg text-gray-800 dark:text-white leading-none">₹{{ t.prizePool }}</p>
                        </div>
                        <div class="text-right">
                             <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Entry</p>
                             <p class="font-gaming font-black text-lg text-green-600 dark:text-green-500 leading-none">₹{{ t.entryFee }}</p>
                        </div>
                    </div>
                 </div>
              </div>

              <!-- Progress Bar -->
              <div class="mt-4">
                 <div class="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    <span>Slots: {{ t.filledSlots }}/{{ t.totalSlots }}</span>
                    <span [class]="(t.filledSlots / t.totalSlots) > 0.8 ? 'text-orange-500' : 'text-green-500'">
                       {{ ((t.filledSlots / t.totalSlots) * 100).toFixed(0) }}% Filled
                    </span>
                 </div>
                 <div class="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500" 
                         [style.width.%]="(t.filledSlots / t.totalSlots) * 100"
                         [class]="(t.filledSlots / t.totalSlots) > 0.8 ? 'bg-orange-500' : 'bg-green-500'">
                    </div>
                 </div>
              </div>

            </div>
          } @empty {
            <div class="col-span-full py-16 text-center text-gray-400 dark:text-gray-500 font-ui font-bold text-sm uppercase tracking-widest flex flex-col items-center gap-4">
               <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                   <i class="fa-solid fa-radar text-2xl opacity-50"></i>
               </div>
               No active operations found in this sector.
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {
  state = inject(StateService);
  activeTab = signal('all');

  tabs = [
    { key: 'all', label: 'All' },
    { key: 'Solo', label: 'Solo' },
    { key: 'Duo', label: 'Duo' },
    { key: 'Squad', label: 'Squad' }
  ];

  filteredTournaments = computed(() => {
    const all = this.state.tournaments();
    if (this.activeTab() === 'all') return all;
    return all.filter(t => t.type === this.activeTab());
  });
}
