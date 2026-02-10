
import { Component, signal, inject, effect, computed, AfterViewInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { StateService } from './services/state.service';
import { AuthComponent } from './components/auth.component';
import { NgClass, DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AuthComponent, NgClass, DatePipe],
  template: `
    <!-- SENTINEL OMNI-LOCK: GLOBAL LOCKDOWN OVERLAY -->
    @if (state.userProfile()?.sentinelStatus === 'banned') {
      <div class="fixed inset-0 z-[9999] bg-black text-red-600 flex flex-col items-center justify-center font-mono p-10 text-center overflow-hidden">
         <!-- Glitch Background -->
         <div class="absolute inset-0 bg-[url('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3Z6eXF6eXF6eXF6eXF6eXF6eXF6eXF6eXF6eXF6eXF6eXF6/oEI9uBVPHe9MI/giphy.gif')] opacity-10 bg-cover bg-center mix-blend-screen pointer-events-none"></div>
         
         <i class="fa-solid fa-triangle-exclamation text-8xl mb-6 animate-pulse"></i>
         <h1 class="text-6xl font-black mb-4 glitch-text" style="text-shadow: 2px 2px white;">ACCESS DENIED</h1>
         <div class="border-2 border-red-600 p-6 rounded-none bg-red-900/20 backdrop-blur-md max-w-xl w-full">
            <h2 class="text-2xl font-bold mb-4 border-b border-red-600 pb-2">OMNI-LOCK PROTOCOL ACTIVATED</h2>
            <p class="text-sm mb-4 uppercase tracking-widest">
               Your device signature has been flagged for violation of the Fair Play Policy.
               <br/><br/>
               REASON: SECURITY INTEGRITY FAILURE
            </p>
            <div class="font-mono text-xs text-red-400 mt-4">
               SESSION ID: {{ state.userProfile()?.uid }} <br/>
               TERMINATION CODE: 0xDEAD_BEEF
            </div>
         </div>
         <button (click)="state.logout()" class="mt-8 px-8 py-3 bg-red-600 text-black font-bold uppercase tracking-widest hover:bg-red-500 transition-colors">
            ACKNOWLEDGE & TERMINATE
         </button>
      </div>
    }

    @if (!state.currentUser()) {
      <app-auth></app-auth>
    } @else {
      <!-- Main Layout Wrapper: Now a flex-row on desktop -->
      <div class="h-screen w-full bg-gray-50 dark:bg-dark-bg relative transition-colors duration-500 ease-in-out flex flex-col lg:flex-row">
        
        <!-- DESKTOP SIDEBAR NAVIGATION -->
        <nav class="hidden lg:flex w-24 flex-col items-center gap-2 py-6 bg-white dark:bg-dark-surface border-r border-gray-100 dark:border-dark-border shrink-0">
          
          <a routerLink="/" class="flex flex-col items-center text-center gap-2 group mb-4">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <span class="font-gaming font-black text-3xl text-white">AR</span>
              </div>
          </a>
        
          <a routerLink="/" routerLinkActive="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" [routerLinkActiveOptions]="{exact: true}" class="w-[90%] flex flex-col items-center justify-center gap-1 py-3 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group cursor-pointer rounded-xl">
            <i class="fa-solid fa-house text-2xl"></i>
            <span class="font-ui font-semibold text-[10px] uppercase tracking-wider">Home</span>
          </a>
          
          <a routerLink="/my-tournaments" routerLinkActive="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" class="w-[90%] flex flex-col items-center justify-center gap-1 py-3 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group cursor-pointer rounded-xl">
            <i class="fa-solid fa-crosshairs text-2xl"></i>
            <span class="font-ui font-semibold text-[10px] uppercase tracking-wider">Matches</span>
          </a>
          
          <a routerLink="/shop" routerLinkActive="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" class="w-[90%] flex flex-col items-center justify-center gap-1 py-3 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group cursor-pointer rounded-xl">
             <i class="fa-solid fa-store text-2xl"></i>
             <span class="font-ui font-semibold text-[10px] uppercase tracking-wider">Store</span>
          </a>

          <a routerLink="/wallet" routerLinkActive="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" class="w-[90%] flex flex-col items-center justify-center gap-1 py-3 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group cursor-pointer rounded-xl">
            <i class="fa-solid fa-wallet text-2xl"></i>
            <span class="font-ui font-semibold text-[10px] uppercase tracking-wider">Vault</span>
          </a>
          
          <a routerLink="/profile" routerLinkActive="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" class="w-[90%] flex flex-col items-center justify-center gap-1 py-3 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group cursor-pointer rounded-xl">
            <i class="fa-solid fa-user-astronaut text-2xl"></i>
            <span class="font-ui font-semibold text-[10px] uppercase tracking-wider">Profile</span>
          </a>
          
          <div class="flex-grow"></div>
        
          <button (click)="menuOpen.set(true)" class="w-[90%] flex flex-col items-center justify-center gap-1 py-3 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group cursor-pointer rounded-xl">
            <i class="fa-solid fa-bars-staggered text-2xl"></i>
            <span class="font-ui font-semibold text-[10px] uppercase tracking-wider">Menu</span>
          </button>
        </nav>

        <!-- Main Content Area -->
        <div class="flex-1 flex flex-col overflow-hidden h-full">
          <!-- Header (Fixed Top) -->
          <header class="h-20 shrink-0 flex items-center justify-between px-4 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md z-40 border-b border-gray-100 dark:border-dark-border sticky top-0 transition-colors duration-500">
            
            <div class="flex items-center gap-3">
               <!-- ENLARGED MENU BUTTON (Mobile Only) -->
               <button (click)="menuOpen.set(true)" class="w-14 h-14 rounded-full bg-transparent active:bg-gray-100 dark:active:bg-gray-800 flex items-center justify-center relative active:scale-95 transition-transform tap-highlight-transparent lg:hidden">
                  <i class="fa-solid fa-bars-staggered text-3xl text-gray-800 dark:text-white"></i>
               </button>
  
              <!-- Brand Title (Slightly larger on desktop) -->
              <h1 class="font-gaming font-black text-xl lg:text-2xl italic tracking-tighter text-gray-900 dark:text-white flex flex-col leading-none">
                <span>ARENA <span class="text-blue-600">AR</span></span>
                <!-- System Pulse -->
                <span class="text-[8px] font-ui font-bold text-green-500 tracking-[0.2em] animate-pulse flex items-center gap-1">
                   <span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span> SYSTEM ONLINE
                </span>
              </h1>
            </div>
            
            <div class="flex items-center gap-3">
              <!-- Wallet Display -->
              <div routerLink="/wallet" class="bg-black/5 dark:bg-white/10 pl-3 pr-4 py-1.5 rounded-full flex items-center gap-2 active:scale-95 transition-transform cursor-pointer border border-transparent active:border-blue-500/30 hover:bg-black/10 dark:hover:bg-white/20">
                <i class="fa-solid fa-wallet text-blue-600 dark:text-blue-400 text-lg"></i>
                <span class="font-gaming font-bold text-sm text-gray-900 dark:text-white tracking-wide">{{ (state.userProfile()?.depositBalance || 0) + (state.userProfile()?.winningsBalance || 0) }}</span>
              </div>
              
              <!-- Mail Button -->
               <button (click)="mailOpen.set(true)" class="w-10 h-10 rounded-full flex items-center justify-center relative active:scale-95 transition-transform tap-highlight-transparent">
                  <i class="fa-regular fa-envelope text-xl text-gray-600 dark:text-gray-300"></i>
               </button>
            </div>
          </header>
  
          <!-- Main Content -->
          <main class="flex-1 overflow-y-auto overflow-x-hidden pb-24 lg:pb-6 touch-pan-y overscroll-y-contain no-scrollbar">
            <router-outlet></router-outlet>
          </main>
        </div>

        <!-- CUSTOM TOAST NOTIFICATION (MATCHING SCREENSHOT) -->
        <div class="fixed top-24 left-4 right-4 lg:left-auto lg:w-96 z-[100] flex flex-col gap-3 pointer-events-none">
          @for (n of state.notifications(); track n.id) {
             <div class="pointer-events-auto w-full bg-[#1e1e24] text-white rounded-lg shadow-2xl flex items-center overflow-hidden animate-in slide-in-from-top-4 duration-300 border-l-[6px]"
                  [class.border-red-600]="n.type === 'error' || n.type === 'security'"
                  [class.border-green-500]="n.type === 'success' || n.type === 'reward'"
                  [class.border-blue-500]="n.type === 'info'"
                  [class.bg-red-950]="n.type === 'security'">
                
                <div class="p-4 flex items-center justify-center">
                   <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                        [class.bg-red-600]="n.type === 'error' || n.type === 'security'"
                        [class.text-white]="n.type === 'error' || n.type === 'security'"
                        [class.bg-green-500]="n.type === 'success' || n.type === 'reward'"
                        [class.bg-blue-500]="n.type === 'info'">
                      <i [class]="(n.type === 'error' || n.type === 'security') ? 'fa-solid fa-triangle-exclamation' : n.type === 'success' ? 'fa-solid fa-check' : 'fa-solid fa-info'"></i>
                   </div>
                </div>

                <div class="py-3 pr-4 flex-1 min-w-0">
                   <h4 class="font-gaming font-bold text-sm text-white tracking-wide mb-0.5">{{ n.title }}</h4>
                   <p class="font-ui text-xs text-gray-400 font-medium leading-tight">{{ n.message }}</p>
                </div>
             </div>
          }
        </div>

        <!-- Bottom Nav (Mobile Only) -->
        <nav class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full md:max-w-7xl h-[80px] bg-white dark:bg-dark-surface border-t-2 border-red-500 flex items-center justify-between px-2 z-50 transform-gpu will-change-transform pb-2 touch-manipulation transition-colors duration-500 lg:hidden">
          
          <a routerLink="/" routerLinkActive="text-blue-600 dark:text-blue-400" [routerLinkActiveOptions]="{exact: true}" class="flex-1 flex flex-col items-center justify-center gap-1 h-full text-gray-500 dark:text-gray-400 active:scale-90 tap-highlight-transparent group cursor-pointer">
            <i class="fa-solid fa-house text-xl group-active:text-blue-500 transition-colors"></i>
            <span class="font-ui font-semibold text-[10px] uppercase tracking-wider">Home</span>
          </a>
          
          <a routerLink="/my-tournaments" routerLinkActive="text-blue-600 dark:text-blue-400" class="flex-1 flex flex-col items-center justify-center gap-1 h-full text-gray-500 dark:text-gray-400 active:scale-90 tap-highlight-transparent group cursor-pointer">
            <i class="fa-solid fa-crosshairs text-xl group-active:text-blue-500 transition-colors"></i>
            <span class="font-ui font-semibold text-[10px] uppercase tracking-wider">Matches</span>
          </a>
          
          <a routerLink="/shop" routerLinkActive="text-blue-600 dark:text-blue-400" class="flex-1 flex flex-col items-center justify-center gap-1 h-full text-gray-500 dark:text-gray-400 active:scale-90 tap-highlight-transparent group cursor-pointer">
             <i class="fa-solid fa-store text-xl group-active:text-blue-500 transition-colors"></i>
             <span class="font-ui font-semibold text-[10px] uppercase tracking-wider">Store</span>
          </a>

          <a routerLink="/wallet" routerLinkActive="text-blue-600 dark:text-blue-400" class="flex-1 flex flex-col items-center justify-center gap-1 h-full text-gray-500 dark:text-gray-400 active:scale-90 tap-highlight-transparent group cursor-pointer">
            <i class="fa-solid fa-wallet text-xl group-active:text-blue-500 transition-colors"></i>
            <span class="font-ui font-semibold text-[10px] uppercase tracking-wider">Vault</span>
          </a>
          
          <a routerLink="/profile" routerLinkActive="text-blue-600 dark:text-blue-400" class="flex-1 flex flex-col items-center justify-center gap-1 h-full text-gray-500 dark:text-gray-400 active:scale-90 tap-highlight-transparent group cursor-pointer">
            <i class="fa-solid fa-user-astronaut text-xl group-active:text-blue-500 transition-colors"></i>
            <span class="font-ui font-semibold text-[10px] uppercase tracking-wider">Profile</span>
          </a>
        </nav>

        <!-- Side Drawer Menu -->
        @if (menuOpen()) {
          <div class="fixed inset-0 z-[60] flex">
            <!-- Backdrop -->
            <div class="absolute inset-0 bg-black/60 transition-opacity backdrop-blur-sm" (click)="menuOpen.set(false)"></div>
            
            <!-- Drawer -->
            <div class="relative w-[80%] max-w-xs h-full bg-white dark:bg-dark-surface shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
              
              <!-- Menu Header -->
              <div class="p-6 pt-12 border-b border-gray-100 dark:border-dark-border">
                  <h3 class="font-gaming font-black text-xl italic text-gray-900 dark:text-white uppercase tracking-tighter">
                    Main <span class="text-blue-500">Menu</span>
                  </h3>
              </div>

              <!-- Menu Links -->
              <div class="flex-1 overflow-y-auto p-4 space-y-1">
                 
                 <a (click)="menuOpen.set(false)" routerLink="/vip" class="relative overflow-hidden rounded-2xl my-4 group block active:scale-95 transition-transform shadow-lg shadow-yellow-500/20">
                    <div class="absolute inset-0 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 bg-size-200 animate-shimmer"></div>
                    <div class="relative p-3 flex items-center justify-between z-10">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                                <i class="fa-solid fa-crown text-white text-lg animate-bounce drop-shadow-md"></i>
                            </div>
                            <div>
                                <h4 class="font-gaming font-black text-sm uppercase text-white drop-shadow-sm">Purchase VIP</h4>
                                <p class="text-[9px] font-bold text-white/90">Unlock Golden Benefits</p>
                            </div>
                        </div>
                        <i class="fa-solid fa-chevron-right text-white/80"></i>
                    </div>
                 </a>

                 <p class="px-4 py-2 mt-2 text-[10px] font-ui font-bold text-gray-400 uppercase tracking-widest">Legal & Info</p>
                 <a (click)="menuOpen.set(false)" routerLink="/info/about" class="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 transition-colors">
                    <i class="fa-solid fa-circle-info text-lg w-6 text-center text-gray-400"></i>
                    <span class="font-ui font-bold text-sm uppercase tracking-wider">About App</span>
                 </a>
                 <a (click)="menuOpen.set(false)" routerLink="/info/rules" class="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 transition-colors">
                    <i class="fa-solid fa-book text-lg w-6 text-center text-gray-400"></i>
                    <span class="font-ui font-bold text-sm uppercase tracking-wider">Game Rules</span>
                 </a>
                 <a (click)="menuOpen.set(false)" routerLink="/info/app-rules" class="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 transition-colors">
                    <i class="fa-solid fa-shield-halved text-lg w-6 text-center text-gray-400"></i>
                    <span class="font-ui font-bold text-sm uppercase tracking-wider">App Rules</span>
                 </a>
                 
                 <a (click)="menuOpen.set(false)" routerLink="/info/privacy" class="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 transition-colors">
                    <i class="fa-solid fa-user-shield text-lg w-6 text-center text-gray-400"></i>
                    <span class="font-ui font-bold text-sm uppercase tracking-wider">Privacy Policy</span>
                 </a>
                 <a (click)="menuOpen.set(false)" routerLink="/info/fairplay" class="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 transition-colors">
                    <i class="fa-solid fa-hand-fist text-lg w-6 text-center text-gray-400"></i>
                    <span class="font-ui font-bold text-sm uppercase tracking-wider">Fair Play</span>
                 </a>
                 <a (click)="menuOpen.set(false)" routerLink="/info/terms" class="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 transition-colors">
                    <i class="fa-solid fa-scale-balanced text-lg w-6 text-center text-gray-400"></i>
                    <span class="font-ui font-bold text-sm uppercase tracking-wider">Terms & Conditions</span>
                 </a>

                 <p class="px-4 py-2 mt-2 text-[10px] font-ui font-bold text-gray-400 uppercase tracking-widest">System</p>
                 <a (click)="menuOpen.set(false)" routerLink="/support" class="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 transition-colors">
                    <i class="fa-solid fa-headset text-lg w-6 text-center text-teal-500"></i>
                    <span class="font-ui font-bold text-sm uppercase tracking-wider">Support Center</span>
                 </a>
              </div>

              <!-- Bottom Actions -->
              <div class="p-6 border-t border-gray-100 dark:border-dark-border space-y-3 bg-white dark:bg-dark-surface pb-10">
                <button (click)="toggleTheme()" class="w-full text-left p-4 rounded-2xl bg-gray-50 dark:bg-[#151515] border border-gray-100 dark:border-dark-border flex items-center justify-between text-sm font-ui font-bold text-gray-700 dark:text-gray-200 active:scale-[0.98] transition-transform">
                    <span class="flex items-center gap-3">
                       <i [class]="state.darkMode() ? 'fa-solid fa-sun text-yellow-500' : 'fa-solid fa-moon text-blue-500'"></i>
                       {{ state.darkMode() ? 'Light Mode' : 'Dark Mode' }}
                    </span>
                    <i class="fa-solid fa-toggle-on text-2xl text-gray-300" [class.text-blue-500]="state.darkMode()"></i>
                </button>

                <button (click)="logoutConfirmOpen.set(true); menuOpen.set(false)" class="w-full text-left p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 text-red-500 border border-red-100 dark:border-red-900/20 flex items-center gap-3 text-sm font-ui font-bold active:scale-[0.98] transition-transform">
                  <i class="fa-solid fa-power-off"></i> Log Out
                </button>
              </div>
            </div>
          </div>
        }

        <!-- Logout Confirmation Bottom Sheet -->
        @if (logoutConfirmOpen()) {
           <div class="fixed inset-0 z-[70] flex items-end justify-center">
               <div class="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" (click)="logoutConfirmOpen.set(false)"></div>
               <div class="relative w-full md:max-w-lg bg-white dark:bg-dark-surface rounded-t-[2rem] p-8 pb-10 animate-in slide-in-from-bottom duration-300 shadow-2xl">
                   <div class="w-12 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6"></div>
                   <h3 class="font-gaming font-black text-xl text-center text-gray-800 dark:text-white uppercase mb-2">End Session?</h3>
                   <p class="text-center text-gray-500 dark:text-gray-400 font-ui text-sm mb-8">Are you sure you want to log out?</p>
                   
                   <div class="flex gap-4">
                       <button (click)="logoutConfirmOpen.set(false)" class="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white font-gaming font-bold py-4 rounded-xl uppercase tracking-widest text-sm active:scale-95 transition-transform">
                           Cancel
                       </button>
                       <button (click)="state.logout(); logoutConfirmOpen.set(false)" class="flex-1 bg-red-500 text-white font-gaming font-bold py-4 rounded-xl uppercase tracking-widest text-sm active:scale-95 transition-transform shadow-lg shadow-red-500/30">
                           Log Out
                       </button>
                   </div>
               </div>
           </div>
        }

        <!-- Mail Bottom Sheet -->
        @if (mailOpen()) {
           <div class="fixed inset-0 z-[60] flex flex-col justify-end">
              <div class="absolute inset-0 bg-black/60 transition-opacity backdrop-blur-sm" (click)="mailOpen.set(false)"></div>
              <div class="relative w-full md:max-w-2xl md:mx-auto bg-white dark:bg-dark-surface rounded-t-[2rem] max-h-[70vh] overflow-y-auto animate-in slide-in-from-bottom duration-300 shadow-2xl pb-8">
                 <div class="sticky top-0 bg-white dark:bg-dark-surface z-10 p-6 border-b border-gray-100 dark:border-dark-border flex items-center justify-between rounded-t-[2rem]">
                    <h3 class="font-gaming font-black text-xl text-gray-800 dark:text-white uppercase">Mailbox</h3>
                    <button (click)="mailOpen.set(false)" class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 active:scale-90 transition-transform">
                       <i class="fa-solid fa-xmark"></i>
                    </button>
                 </div>
                 
                 <div class="p-6 space-y-4">
                    @for(mail of visibleMails(); track mail.id) {
                      <div class="flex gap-4 items-start p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20">
                         <div class="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0">
                            <i class="fa-solid fa-robot"></i>
                         </div>
                         <div>
                            <p class="font-ui font-bold text-sm text-gray-800 dark:text-white">{{ mail.title }}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ mail.message }}</p>
                            <p class="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">{{ mail.timestamp | date:'short' }}</p>
                         </div>
                      </div>
                    } @empty {
                       <div class="text-center py-10">
                          <p class="text-sm text-gray-400">Your mailbox is empty.</p>
                       </div>
                    }
                 </div>
              </div>
           </div>
        }

      </div>
    }
  `
})
export class AppComponent implements AfterViewInit {
  state = inject(StateService);
  menuOpen = signal(false);
  mailOpen = signal(false);
  logoutConfirmOpen = signal(false);

  visibleMails = computed(() => {
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    return this.state.mails().filter(m => now - m.timestamp < twentyFourHours);
  });

  toggleTheme() {
    this.state.setTheme(!this.state.darkMode());
  }

  ngAfterViewInit(): void {
    // A small delay to ensure content is painted before removing splash
    setTimeout(() => {
      const splashElement = document.getElementById('splash-screen');
      if (splashElement) {
        splashElement.style.opacity = '0';
        // Remove from DOM after transition to prevent it from blocking interactions
        setTimeout(() => splashElement.remove(), 500); 
      }
    }, 100);
  }
}