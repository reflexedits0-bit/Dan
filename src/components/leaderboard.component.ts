
import { Component, inject, computed } from '@angular/core';
import { StateService } from '../services/state.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-leaderboard',
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-dark-bg animate-in fade-in duration-300 pb-28 flex flex-col">
       
       <!-- Enhanced 3D Header & Podium Area -->
       <div class="relative bg-blue-600 dark:bg-blue-700 pb-16 pt-8 px-6 rounded-b-[3rem] shadow-2xl overflow-hidden shrink-0 z-10">
          
          <!-- Background FX -->
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.2)_0%,rgba(0,0,0,0)_60%)]"></div>
          <div class="absolute -top-20 -left-20 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl"></div>
          <div class="absolute top-0 right-0 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl"></div>

          <!-- Top Nav -->
          <div class="relative z-20 flex items-center gap-4 mb-8">
             <button routerLink="/" class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 active:scale-95 transition-transform shadow-lg">
                 <i class="fa-solid fa-arrow-left text-white"></i>
             </button>
             <h2 class="font-gaming font-black text-2xl uppercase italic text-white drop-shadow-md tracking-wide">
                 Global <span class="text-cyan-300">Ranking</span>
             </h2>
          </div>
          
          <!-- 3D Podium Layout -->
          <div class="relative z-10 flex justify-center items-end gap-2 mt-6 h-48 perspective-1000">
             
             <!-- Rank 2 (Silver) -->
             <div class="flex flex-col items-center relative z-10 transform translate-x-2">
                 <div class="w-20 h-20 rounded-full border-[3px] border-gray-300 bg-gray-800 flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.3)] relative group">
                     <span class="text-3xl">{{ topThree()[1]?.avatar || '🥈' }}</span>
                     <div class="absolute -bottom-3 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow-md uppercase tracking-widest">#2</div>
                 </div>
                 <div class="mt-4 text-center">
                    <p class="font-ui font-bold text-xs text-white/90 truncate w-20">{{ topThree()[1]?.name || 'N/A' }}</p>
                    <p class="font-gaming font-bold text-sm text-gray-200">{{ topThree()[1]?.wins || 0 }} <span class="text-[9px]">WINS</span></p>
                 </div>
                 <!-- Podium Base -->
                 <div class="w-20 h-16 bg-gradient-to-b from-gray-400 to-gray-600 rounded-t-lg mt-2 opacity-80 shadow-lg transform perspective-origin-bottom rotate-x-12"></div>
             </div>
             
             <!-- Rank 1 (Gold) - Elevated & Centered -->
             <div class="flex flex-col items-center relative z-20 -mb-2 transform scale-110">
                 <i class="fa-solid fa-crown text-3xl text-yellow-300 mb-2 animate-bounce drop-shadow-[0_0_10px_rgba(253,224,71,0.6)]"></i>
                 <div class="w-24 h-24 rounded-full border-[4px] border-yellow-400 bg-gray-900 flex items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.4)] relative">
                     <span class="text-4xl">{{ topThree()[0]?.avatar || '🥇' }}</span>
                     <div class="absolute -bottom-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-[10px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-widest border border-yellow-200">#1</div>
                 </div>
                 <div class="mt-4 text-center">
                    <p class="font-ui font-bold text-sm text-white truncate w-24 drop-shadow-sm">{{ topThree()[0]?.name || 'N/A' }}</p>
                    <p class="font-gaming font-black text-lg text-yellow-300 drop-shadow-sm">{{ topThree()[0]?.wins || 0 }} <span class="text-[10px] font-medium text-yellow-100">WINS</span></p>
                 </div>
                 <!-- Podium Base -->
                 <div class="w-24 h-24 bg-gradient-to-b from-yellow-500 via-yellow-600 to-yellow-700 rounded-t-xl mt-2 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
                    <div class="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer"></div>
                    <i class="fa-solid fa-trophy text-yellow-900/30 text-4xl"></i>
                 </div>
             </div>

             <!-- Rank 3 (Bronze) -->
             <div class="flex flex-col items-center relative z-10 transform -translate-x-2">
                 <div class="w-20 h-20 rounded-full border-[3px] border-orange-400 bg-gray-800 flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.3)] relative">
                     <span class="text-3xl">{{ topThree()[2]?.avatar || '🥉' }}</span>
                     <div class="absolute -bottom-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md uppercase tracking-widest">#3</div>
                 </div>
                 <div class="mt-4 text-center">
                    <p class="font-ui font-bold text-xs text-white/90 truncate w-20">{{ topThree()[2]?.name || 'N/A' }}</p>
                    <p class="font-gaming font-bold text-sm text-orange-200">{{ topThree()[2]?.wins || 0 }} <span class="text-[9px]">WINS</span></p>
                 </div>
                 <!-- Podium Base -->
                 <div class="w-20 h-12 bg-gradient-to-b from-orange-500 to-orange-700 rounded-t-lg mt-2 opacity-80 shadow-lg"></div>
             </div>

          </div>
       </div>

       <!-- Scrollable List Area -->
       <div class="flex-1 px-4 -mt-6 relative z-0 pt-8 flex flex-col gap-3 max-w-4xl mx-auto w-full">
          @for (user of otherPlayers(); track $index) {
             <div class="bg-white dark:bg-dark-surface dark:border-dark-border border border-gray-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm active:scale-95 transition-transform">
                <div class="w-8 text-center font-gaming font-bold text-gray-400 text-sm">#{{ $index + 4 }}</div>
                
                <div class="w-12 h-12 rounded-full bg-gray-100 dark:bg-[#151515] flex items-center justify-center text-lg border border-gray-200 dark:border-gray-700">
                   {{ user.avatar?.[0] || 'A' }}
                </div>
                
                <div class="flex-1 min-w-0">
                   <h4 class="font-ui font-bold text-sm text-gray-800 dark:text-white truncate">{{ user.name }}</h4>
                   <div class="flex items-center gap-2 mt-0.5">
                      <span class="text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-white/5 px-1.5 py-0.5 rounded">{{ user.matches || 0 }} Matches</span>
                      <span class="text-[9px] font-bold text-purple-500 uppercase tracking-widest bg-purple-50 dark:bg-purple-900/20 px-1.5 py-0.5 rounded">{{ user.level || 1 }} Lvl</span>
                   </div>
                </div>
                
                <div class="text-right shrink-0">
                   <p class="font-gaming font-black text-lg text-blue-500">{{ user.wins || 0 }}</p>
                   <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Victories</p>
                </div>
             </div>
          } @empty {
             <div class="text-center py-10 text-gray-400 font-ui text-sm uppercase tracking-widest">
                No other agents found.
             </div>
          }
       </div>
    </div>
  `
})
export class LeaderboardComponent {
  state = inject(StateService);

  // Computed to safely get top 3, filling with dummies if empty for design showcase
  topThree = computed(() => {
     const real = this.state.leaderboard();
     const dummies = [
        { name: 'Alpha', wins: 99, avatar: '🦁' },
        { name: 'Bravo', wins: 88, avatar: '🐯' },
        { name: 'Charlie', wins: 77, avatar: '🐻' }
     ];
     // Merge real data with dummies if real data is insufficient
     const combined = [...real];
     if (combined.length < 3) {
        for(let i = combined.length; i < 3; i++) {
           combined.push(dummies[i] as any);
        }
     }
     return combined.slice(0, 3);
  });

  otherPlayers = computed(() => {
     const real = this.state.leaderboard();
     if (real.length > 3) {
        return real.slice(3);
     }
     // If not enough real players, generate some fake ones for layout demo
     return Array.from({length: 5}, (_, i) => ({
        name: `Agent ${i + 400}`,
        wins: 50 - i * 2,
        matches: 100,
        level: 10,
        avatar: '👤'
     }));
  });
}
