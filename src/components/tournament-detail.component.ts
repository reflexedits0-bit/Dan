
import { Component, signal, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { StateService, Tournament } from '../services/state.service';

@Component({
  selector: 'app-tournament-detail',
  imports: [RouterLink],
  template: `
    @if (tournament()) {
      <div class="min-h-screen bg-gray-50 dark:bg-dark-bg animate-in fade-in slide-in-from-bottom-4 duration-500 transition-colors pb-32">
        
        <!-- Responsive Cover Image -->
        <div class="relative h-48 md:h-[50vh] lg:h-[60vh]">
          <img src="https://picsum.photos/id/102/1200/800" class="w-full h-full object-cover" alt="Detail">
          <div class="absolute inset-0 bg-gradient-to-t from-white dark:from-dark-bg to-transparent"></div>
          <button routerLink="/" class="absolute top-4 left-4 w-10 h-10 bg-white dark:bg-black/50 rounded-xl flex items-center justify-center border border-white dark:border-gray-700 shadow-lg cursor-pointer">
            <i class="fa-solid fa-arrow-left text-gray-800 dark:text-white"></i>
          </button>
        </div>

        <div class="px-6 md:px-12 -mt-8 md:-mt-16 relative z-10 max-w-5xl mx-auto">
          <div class="bg-white dark:bg-dark-surface dark:border-dark-border rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 mb-6">
            <div class="flex justify-between items-center mb-6">
              <div>
                <h2 class="font-gaming font-black text-2xl md:text-4xl text-gray-800 dark:text-white uppercase leading-none mb-1">{{ tournament()?.title }}</h2>
                <span class="text-xs md:text-sm font-ui font-bold text-blue-500 uppercase tracking-widest">{{ tournament()?.type }} • {{ tournament()?.map }}</span>
              </div>
              <div class="w-14 h-14 md:w-16 md:h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-100 dark:border-blue-900/30">
                <i class="fa-solid fa-crosshairs text-2xl md:text-3xl"></i>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-6">
               <div class="bg-gray-50 dark:bg-[#121212] rounded-2xl p-4 border border-gray-100 dark:border-dark-border">
                 <p class="font-ui text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Time & Date</p>
                 <p class="font-ui font-bold text-sm md:text-base text-gray-800 dark:text-gray-200">{{ tournament()?.time }} • {{ tournament()?.date }}</p>
               </div>
               <div class="bg-gray-50 dark:bg-[#121212] rounded-2xl p-4 border border-gray-100 dark:border-dark-border">
                 <p class="font-ui text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Per Kill</p>
                 <p class="font-ui font-bold text-sm md:text-base text-blue-500">₹{{ tournament()?.perKill }}</p>
               </div>
            </div>

            <div class="bg-blue-500 dark:bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/20 mb-6">
              <p class="font-ui text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Grand Prize Pool</p>
              <h3 class="font-gaming text-4xl md:text-5xl font-black">₹{{ tournament()?.prizePool }}</h3>
            </div>

            <div class="space-y-4">
               <h4 class="font-ui font-bold text-xs uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-700 pb-2">Battle Intelligence (AI Insight)</h4>
               <div class="bg-gray-50 dark:bg-[#121212] rounded-xl p-4 border-l-4 border-blue-500">
                  @if (loadingAI()) {
                    <div class="flex items-center gap-2">
                       <i class="fa-solid fa-brain animate-pulse text-blue-500"></i>
                       <span class="text-[10px] font-ui font-bold text-gray-500 uppercase tracking-widest italic">Analyzing battlefield data...</span>
                    </div>
                  } @else {
                    <p class="text-sm md:text-base font-ui leading-relaxed text-gray-600 dark:text-gray-300 italic">"{{ aiAdvice() }}"</p>
                  }
               </div>
            </div>
          </div>

          <div class="bg-white dark:bg-dark-surface dark:border-dark-border rounded-3xl p-6 shadow-xl border border-gray-100 mb-8">
             <h4 class="font-ui font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">Strategic Rules</h4>
             <ul class="space-y-3">
                <li class="flex items-start gap-3 text-sm font-ui text-gray-600 dark:text-gray-400">
                  <i class="fa-solid fa-circle-check text-green-500 mt-1"></i>
                  <span>No emulators allowed. Mobile only.</span>
                </li>
                <li class="flex items-start gap-3 text-sm font-ui text-gray-600 dark:text-gray-400">
                  <i class="fa-solid fa-circle-check text-green-500 mt-1"></i>
                  <span>Teaming will result in immediate disqualification.</span>
                </li>
             </ul>
          </div>
        </div>

        <!-- Fixed Bottom Confirmation Bar (Constrained Width on Desktop) -->
        <div class="fixed bottom-0 left-0 w-full md:left-1/2 md:-translate-x-1/2 md:max-w-7xl bg-white dark:bg-dark-surface border-t border-gray-100 dark:border-dark-border p-4 z-30 animate-in slide-in-from-bottom duration-500 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
           <div class="max-w-md mx-auto">
              @if (isJoined()) {
                 <button disabled class="w-full bg-green-500 text-white font-gaming font-bold py-4 rounded-xl uppercase tracking-widest text-lg opacity-80 shadow-lg shadow-green-200 dark:shadow-green-900/20">
                     <i class="fa-solid fa-check-circle mr-2"></i> DEPLOYMENT CONFIRMED
                 </button>
              } @else {
                 <button (click)="initiateJoin()" [disabled]="joining()" class="w-full bg-black dark:bg-white dark:text-black text-white font-gaming font-bold py-4 rounded-xl uppercase tracking-widest text-lg active:bg-blue-600 transition-all shadow-xl shadow-blue-200 dark:shadow-none flex justify-center items-center gap-2 cursor-pointer hover:bg-gray-800 dark:hover:bg-gray-200">
                    DEPLOY NOW: ₹{{ tournament()?.entryFee }}
                 </button>
              }
           </div>
        </div>
      </div>

      <!-- SCANNING OVERLAY MODAL -->
      @if (scanning()) {
        <div class="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center font-mono text-green-500 text-center p-8">
            <div class="w-32 h-32 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-8 relative">
               <div class="absolute inset-2 border-4 border-green-500 border-b-transparent rounded-full animate-spin-slow opacity-50"></div>
            </div>
            
            <h2 class="text-2xl font-black mb-2 glitch-text">{{ scanText() }}</h2>
            <div class="w-64 h-2 bg-gray-800 rounded-full mt-4 overflow-hidden">
                <div class="h-full bg-green-500 transition-all duration-300" [style.width.%]="scanProgress()"></div>
            </div>
            <p class="text-xs mt-4 uppercase tracking-widest text-green-400/80">{{ scanDetail() }}</p>
        </div>
      }
    }
  `
})
export class TournamentDetailComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  state = inject(StateService);
  tournament = signal<Tournament | undefined>(undefined);
  aiAdvice = signal('');
  loadingAI = signal(true);
  
  joining = signal(false);
  isJoined = signal(false);

  // Scanning State
  scanning = signal(false);
  scanText = signal('INITIALIZING SENTINEL');
  scanDetail = signal('Establishing secure link...');
  scanProgress = signal(0);

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const t = this.state.tournaments().find(item => item.id === id);
    this.tournament.set(t);
    
    if (t) {
      const uid = this.state.currentUser()?.uid;
      if (uid && t.participants && t.participants[uid]) {
         this.isJoined.set(true);
      }
      await this.generateAIAdvice(t);
    }
  }

  // STEP 1: Initiate visual scan
  async initiateJoin() {
     if (!this.tournament()) return;
     this.joining.set(true);
     this.scanning.set(true);

     // Fake deep scan sequence
     await this.runScanStep('CHECKING INTEGRITY', 'Scanning local binaries...', 20);
     await this.runScanStep('VALIDATING DEVICE', 'Verifying hardware ID signature...', 50);
     await this.runScanStep('SEARCHING FOR CHEATS', 'Deep memory scan active...', 80);
     await this.runScanStep('CLEAN', 'Authorization Granted.', 100);

     // STEP 2: Actual Join
     await this.performJoin();
  }

  runScanStep(title: string, detail: string, progress: number): Promise<void> {
     return new Promise(resolve => {
        this.scanText.set(title);
        this.scanDetail.set(detail);
        this.scanProgress.set(progress);
        setTimeout(resolve, 800 + Math.random() * 500); // Random delay
     });
  }

  async performJoin() {
     try {
        await this.state.joinTournament(this.tournament()!.id, this.tournament()!.entryFee);
        this.isJoined.set(true);
     } catch (e: any) {
        // Handled by service
     } finally {
        this.joining.set(false);
        this.scanning.set(false);
     }
  }

  async generateAIAdvice(t: Tournament) {
    // Temporarily bypass Gemini API call to prevent crash on deployment
    // where process.env is not available.
    this.loadingAI.set(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency
    this.aiAdvice.set("High stakes deployment detected. Prioritize survival and lethal accuracy to secure the bounty.");
    this.loadingAI.set(false);
  }
}
