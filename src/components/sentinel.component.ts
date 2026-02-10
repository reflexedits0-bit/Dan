
import { Component, inject, signal, computed } from '@angular/core';
import { StateService } from '../services/state.service';
import { RouterLink } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-sentinel',
  imports: [RouterLink, DatePipe, NgClass],
  template: `
    <div class="min-h-screen bg-black text-green-500 font-mono p-4 flex flex-col pb-24 relative overflow-hidden">
      <!-- Matrix/Grid Background -->
      <div class="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      
      <!-- Scan Line -->
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent h-[10%] w-full animate-scan pointer-events-none"></div>

      <div class="relative z-10">
        <div class="flex items-center justify-between mb-8 border-b border-green-500/30 pb-4">
          <div class="flex items-center gap-3">
             <i class="fa-solid fa-shield-halved text-2xl animate-pulse"></i>
             <div>
                <h1 class="font-black text-xl tracking-widest uppercase">SENTINEL <span class="text-white">AI</span></h1>
                <p class="text-[10px] text-green-400/70">v4.2.0 • WATCHDOG ACTIVE</p>
             </div>
          </div>
          <button routerLink="/" class="w-10 h-10 border border-green-500/30 flex items-center justify-center hover:bg-green-500/10 text-green-500">
             <i class="fa-solid fa-power-off"></i>
          </button>
        </div>

        <!-- Status Card -->
        <div class="border border-green-500/50 bg-green-500/5 p-6 mb-6 relative group overflow-hidden">
            <div class="absolute top-0 right-0 p-2 text-[10px] uppercase font-bold text-green-600">Sys_ID: {{ state.currentUser()?.uid?.substring(0,8) }}</div>
            
            <h2 class="text-sm font-bold uppercase tracking-widest mb-4">Integrity Status</h2>
            
            <div class="flex items-center gap-4 mb-4">
               <div class="w-20 h-20 rounded-full border-4 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(0,255,0,0.3)]"
                    [class.border-green-500]="status() === 'clean'"
                    [class.text-green-500]="status() === 'clean'"
                    [class.border-red-500]="status() === 'banned'"
                    [class.text-red-500]="status() === 'banned'"
                    [class.border-yellow-500]="status() === 'flagged'"
                    [class.text-yellow-500]="status() === 'flagged'">
                   <i [class]="statusIcon()"></i>
               </div>
               <div>
                  <div class="text-2xl font-black uppercase tracking-tighter"
                       [class.text-green-500]="status() === 'clean'"
                       [class.text-red-500]="status() === 'banned'"
                       [class.text-yellow-500]="status() === 'flagged'">
                       {{ status() === 'clean' ? 'SECURE' : status() }}
                  </div>
                  <p class="text-xs text-green-400/60">Last Scan: {{ lastScan | date:'mediumTime' }}</p>
               </div>
            </div>

            <div class="space-y-2 text-xs font-bold uppercase tracking-widest text-green-400/80">
               <div class="flex justify-between border-b border-green-500/20 pb-1">
                  <span>Memory Integrity</span>
                  <span>[ OK ]</span>
               </div>
               <div class="flex justify-between border-b border-green-500/20 pb-1">
                  <span>Network Traffic</span>
                  <span>[ ENCRYPTED ]</span>
               </div>
               <div class="flex justify-between border-b border-green-500/20 pb-1">
                  <span>Emulator Check</span>
                  <span>[ PASS ]</span>
               </div>
            </div>
        </div>

        <!-- Action Console -->
        <div class="grid grid-cols-2 gap-4 mb-6">
            <button (click)="runDiagnostics()" [disabled]="scanning()" class="border border-green-500/50 bg-black hover:bg-green-500/10 p-4 flex flex-col items-center gap-2 transition-all active:scale-95">
                <i class="fa-solid fa-microchip text-2xl" [class.animate-spin]="scanning()"></i>
                <span class="text-[10px] font-bold uppercase tracking-widest">
                   {{ scanning() ? 'SCANNING...' : 'DIAGNOSTICS' }}
                </span>
            </button>
            <div class="border border-green-500/50 bg-black p-4 flex flex-col items-center gap-2 opacity-50">
                <i class="fa-solid fa-database text-2xl"></i>
                <span class="text-[10px] font-bold uppercase tracking-widest">LOGS (LOCKED)</span>
            </div>
        </div>

        <!-- Logs Terminal -->
        <div class="border border-green-500/30 bg-black p-4 h-48 overflow-y-auto font-mono text-[10px] leading-relaxed relative">
           <div class="absolute top-0 right-0 bg-green-500 text-black px-1 font-bold">TERMINAL</div>
           @for (log of logs(); track $index) {
              <div class="mb-1"><span class="text-green-700">{{ log.time }}</span> > {{ log.msg }}</div>
           }
           <div class="animate-pulse">_</div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    @keyframes scan {
      0% { top: -10%; }
      100% { top: 110%; }
    }
    .animate-scan {
      animation: scan 3s linear infinite;
    }
  `]
})
export class SentinelComponent {
  state = inject(StateService);
  scanning = signal(false);
  lastScan = new Date();
  logs = signal<{time: string, msg: string}[]>([
     { time: '00:00:01', msg: 'Sentinel Watchdog initialized.' },
     { time: '00:00:02', msg: 'Connected to secure server node.' },
     { time: '00:00:05', msg: 'Monitoring active processes...' }
  ]);

  status = computed(() => this.state.userProfile()?.sentinelStatus || 'clean');

  statusIcon() {
     switch(this.status()) {
         case 'clean': return 'fa-solid fa-check';
         case 'flagged': return 'fa-solid fa-triangle-exclamation';
         case 'banned': return 'fa-solid fa-skull';
         default: return 'fa-solid fa-question';
     }
  }

  runDiagnostics() {
     this.scanning.set(true);
     this.addLog('Initiating deep scan sequence...');
     
     setTimeout(() => this.addLog('Checking file integrity...'), 800);
     setTimeout(() => this.addLog('Verifying hardware signature...'), 1500);
     setTimeout(() => this.addLog('Analyzing heuristic patterns...'), 2400);
     
     setTimeout(() => {
         this.scanning.set(false);
         this.addLog('Scan Complete. No anomalies detected.');
         this.lastScan = new Date();
     }, 3000);
  }

  addLog(msg: string) {
      const time = new Date().toLocaleTimeString('en-US', {hour12: false});
      this.logs.update(prev => [...prev, { time, msg }]);
  }
}
