
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-vip',
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative overflow-hidden pb-10">
      
      <!-- Ambient Background -->
      <div class="absolute inset-0 bg-gradient-to-b from-yellow-600/20 via-black to-black z-0 pointer-events-none"></div>
      <div class="absolute top-[-20%] left-[-20%] w-[140%] h-[60%] bg-[radial-gradient(circle,rgba(255,215,0,0.15)_0%,rgba(0,0,0,0)_60%)] z-0 pointer-events-none"></div>

      <!-- Header -->
      <div class="relative z-10 px-6 pt-6 flex justify-between items-center bg-[#0a0a0a]/50 backdrop-blur-sm sticky top-0 pb-4 border-b border-white/5">
        <button routerLink="/" class="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 active:scale-95 transition-transform">
           <i class="fa-solid fa-xmark text-gray-300"></i>
        </button>
        <h2 class="font-gaming font-black text-xl text-yellow-500 tracking-widest uppercase">VIP Access</h2>
        <div class="w-10"></div> <!-- Spacer -->
      </div>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col items-center justify-center px-6 text-center">
         <div class="flex flex-col items-center justify-center py-16">
           <div class="w-24 h-24 bg-gray-900/40 rounded-full flex items-center justify-center mb-6 relative border border-yellow-500/20">
               <div class="absolute inset-0 border-2 border-t-yellow-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin"></div>
               <i class="fa-solid fa-crown text-3xl text-yellow-400 dark:text-yellow-500"></i>
           </div>
           
           <h4 class="font-gaming font-black text-5xl text-white uppercase tracking-widest animate-pulse">
              Coming Soon
           </h4>
       </div>
      </div>
    </div>
  `
})
export class VipComponent {}
