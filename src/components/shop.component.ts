
import { Component, inject, signal } from '@angular/core';
import { StateService } from '../services/state.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-shop',
  imports: [RouterLink],
  template: `
    <div class="max-w-4xl mx-auto p-6 min-h-screen bg-gray-50 dark:bg-dark-bg animate-in fade-in duration-300 pb-24 w-full">
       
       <!-- Promo Banner -->
       <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 mb-8 text-white relative overflow-hidden shadow-xl mt-2">
          <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <i class="fa-brands fa-google-play absolute top-4 right-4 text-4xl opacity-20"></i>
          
          <p class="font-ui font-bold text-xs uppercase tracking-widest opacity-80 mb-2">Instant Delivery</p>
          <h3 class="font-gaming font-black text-3xl mb-4 leading-none">GOOGLE PLAY<br/>GIFT CARDS</h3>
          <p class="text-xs max-w-[70%] text-blue-100 mb-0">Use your wallet balance to purchase official redeem codes.</p>
       </div>

       <h3 class="font-ui font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">Available Cards</h3>

       <!-- Coming Soon Placeholder -->
       <div class="flex flex-col items-center justify-center py-16 bg-white dark:bg-dark-surface rounded-3xl border-2 border-dashed border-gray-200 dark:border-dark-border">
           <div class="w-24 h-24 bg-gray-50 dark:bg-black/40 rounded-full flex items-center justify-center mb-6 relative">
               <div class="absolute inset-0 border-2 border-t-blue-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin"></div>
               <i class="fa-solid fa-rocket text-3xl text-gray-400 dark:text-gray-500"></i>
           </div>
           
           <h4 class="font-gaming font-black text-2xl text-gray-800 dark:text-white uppercase tracking-widest mb-2">Coming Soon</h4>
           <p class="font-ui text-xs font-bold text-gray-500 uppercase tracking-wide text-center max-w-[200px] leading-relaxed">
              We are restocking our digital inventory. Check back later.
           </p>
       </div>
    </div>
  `
})
export class ShopComponent {
  state = inject(StateService);
}
