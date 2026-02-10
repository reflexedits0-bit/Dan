
import { Component, signal, inject } from '@angular/core';
// FIX: Import FormGroup/FormControl and remove FormBuilder
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../services/firebase.config';
import { ref, set } from 'firebase/database';
import { NgStyle, NgClass } from '@angular/common';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, NgStyle, NgClass],
  template: `
    <div class="min-h-screen bg-black text-white relative overflow-hidden font-sans flex flex-col">
      
      <!-- ONBOARDING FLOW -->
      @if (showOnboarding()) {
        <div class="absolute inset-0 z-20 flex flex-col justify-end pb-12 animate-in fade-in duration-700">
          
          <!-- Background Image Slider -->
          <div class="absolute inset-0 z-0">
             @for (slide of slides; track slide.id; let idx = $index) {
                <div [class.opacity-100]="currentSlide() === idx" [class.opacity-0]="currentSlide() !== idx" 
                     class="absolute inset-0 transition-opacity duration-1000 ease-in-out">
                   <img [src]="slide.image" class="w-full h-full object-cover" alt="Wallpaper">
                   <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                </div>
             }
          </div>

          <!-- Content -->
          <div class="relative z-10 px-6 mb-8 w-full max-w-md mx-auto">
            <h1 class="font-gaming font-black text-5xl uppercase leading-[0.9] mb-4 drop-shadow-xl tracking-tighter">
              {{ slides[currentSlide()].title }}
            </h1>
            <p class="font-ui text-gray-300 text-sm font-medium leading-relaxed mb-8 max-w-[90%] tracking-wide">
              {{ slides[currentSlide()].desc }}
            </p>

            <!-- Indicators -->
            <div class="flex gap-2 mb-8">
               @for (slide of slides; track slide.id; let idx = $index) {
                 <div class="h-1 rounded-full transition-all duration-300" 
                      [class.w-8]="currentSlide() === idx" 
                      [class.bg-white]="currentSlide() === idx" 
                      [class.w-2]="currentSlide() !== idx" 
                      [class.bg-white/30]="currentSlide() !== idx"></div>
               }
            </div>

            <!-- Action Button -->
            <button (click)="nextSlide()" class="w-full bg-white text-black font-gaming font-black py-4 rounded-2xl uppercase tracking-widest text-sm flex items-center justify-center gap-3 active:scale-95 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]">
               {{ currentSlide() === slides.length - 1 ? 'INITIALIZE SYSTEM' : 'NEXT PHASE' }}
               <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      } 
      
      <!-- AUTH FLOW (Login / Register / Forgot Password) -->
      @else {
        <div class="min-h-screen w-full relative flex flex-col md:flex-row md:items-center md:justify-center">
           <!-- High Quality Gaming Wallpaper -->
           <div class="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2670&auto=format&fit=crop" class="w-full h-full object-cover opacity-60" alt="Login Background">
            <!-- Gradient Overlay for readability -->
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
          </div>

          <!-- Header (Hidden on desktop in current form, moved inside card/layout) -->
          <div class="relative z-10 pt-16 px-6 text-center md:absolute md:top-8 md:left-8 md:p-0 md:text-left">
             <div class="inline-block p-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 mb-4 shadow-2xl md:hidden">
                <i class="fa-solid fa-gamepad text-4xl text-blue-500"></i>
             </div>
             <h1 class="font-gaming font-black text-4xl italic tracking-tighter text-white">
               ARENA <span class="text-blue-500">AR</span>
             </h1>
          </div>

          <!-- Main Auth Container: Responsive (Bottom Sheet Mobile -> Center Card Desktop) -->
          <div class="relative z-10 flex-1 flex flex-col justify-end md:justify-center md:items-center w-full">
            <div class="bg-gradient-to-b from-gray-900/90 to-black md:from-black/80 md:to-black/80 backdrop-blur-xl rounded-t-[2.5rem] md:rounded-3xl p-8 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-white/10 md:border md:border-white/10 animate-in slide-in-from-bottom duration-500 w-full md:max-w-md">
                
                @if (mode() === 'forgot') {
                    <!-- FORGOT PASSWORD VIEW -->
                    <div class="mb-6 animate-in fade-in slide-in-from-right duration-300">
                        <div class="flex items-center gap-3 mb-2">
                             <button (click)="switchMode('login')" class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                 <i class="fa-solid fa-arrow-left text-xs"></i>
                             </button>
                             <h2 class="font-ui font-bold text-xl text-white">Recovery Protocol</h2>
                        </div>
                        <p class="text-gray-400 text-xs pl-11">Enter your registered email to receive a password reset link.</p>
                    </div>

                    <form [formGroup]="authForm" (ngSubmit)="resetPassword()" class="flex flex-col gap-4 animate-in fade-in duration-500">
                         <div class="group bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus-within:bg-white/10 focus-within:border-blue-500/50 transition-all">
                             <label class="block text-[10px] font-ui font-bold text-gray-400 group-focus-within:text-blue-500 uppercase tracking-widest mb-1 transition-colors">Email ID</label>
                             <input type="email" formControlName="email" class="w-full bg-transparent border-none outline-none text-white font-gaming text-sm placeholder-gray-600" placeholder="EMAIL ADDRESS">
                         </div>

                         <button type="submit" [disabled]="loading()" class="mt-4 h-16 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-gaming font-black text-sm uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                             @if (loading()) {
                                <i class="fa-solid fa-circle-notch animate-spin text-lg"></i>
                             } @else {
                                SEND RECOVERY LINK <i class="fa-solid fa-paper-plane"></i>
                             }
                         </button>
                    </form>

                } @else {
                    <!-- LOGIN / REGISTER VIEW -->
                    <div class="flex items-center justify-between mb-8">
                       <div>
                          <h2 class="font-ui font-bold text-xl text-white">Welcome Back, Agent</h2>
                          <p class="text-gray-400 text-xs mt-1">Enter credentials to access the mainframe.</p>
                       </div>
                       <!-- Native-like Toggle -->
                       <div class="bg-black/50 p-1 rounded-xl flex items-center border border-white/10">
                          <button (click)="switchMode('login')" [class]="mode() === 'login' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-300'" class="px-4 py-2 rounded-lg font-bold text-[10px] uppercase transition-all">Login</button>
                          <button (click)="switchMode('register')" [class]="mode() === 'register' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-300'" class="px-4 py-2 rounded-lg font-bold text-[10px] uppercase transition-all">Register</button>
                       </div>
                    </div>

                    <form [formGroup]="authForm" (ngSubmit)="submit()" class="flex flex-col gap-4">
                      
                      @if (mode() === 'register') {
                        <div class="group bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus-within:bg-white/10 focus-within:border-blue-500/50 transition-all animate-in slide-in-from-left-4 fade-in duration-300">
                           <label class="block text-[10px] font-ui font-bold text-gray-400 group-focus-within:text-blue-500 uppercase tracking-widest mb-1 transition-colors">Codename</label>
                           <input type="text" formControlName="name" class="w-full bg-transparent border-none outline-none text-white font-gaming text-sm placeholder-gray-600" placeholder="ENTER AGENT NAME">
                        </div>

                         <div class="group bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus-within:bg-white/10 focus-within:border-blue-500/50 transition-all animate-in slide-in-from-left-4 fade-in duration-300">
                           <label class="block text-[10px] font-ui font-bold text-gray-400 group-focus-within:text-blue-500 uppercase tracking-widest mb-1 transition-colors">Referral Code (Optional)</label>
                           <input type="text" formControlName="referralCode" class="w-full bg-transparent border-none outline-none text-white font-gaming text-sm placeholder-gray-600" placeholder="ENTER CODE">
                         </div>
                      }

                      <div class="group bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus-within:bg-white/10 focus-within:border-blue-500/50 transition-all">
                         <label class="block text-[10px] font-ui font-bold text-gray-400 group-focus-within:text-blue-500 uppercase tracking-widest mb-1 transition-colors">Email ID</label>
                         <input type="email" formControlName="email" class="w-full bg-transparent border-none outline-none text-white font-gaming text-sm placeholder-gray-600" placeholder="EMAIL ADDRESS">
                      </div>

                      <div class="group bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus-within:bg-white/10 focus-within:border-blue-500/50 transition-all flex items-center gap-2">
                         <div class="flex-1">
                            <label class="block text-[10px] font-ui font-bold text-gray-400 group-focus-within:text-blue-500 uppercase tracking-widest mb-1 transition-colors">Passcode</label>
                            <input [type]="showPassword() ? 'text' : 'password'" formControlName="password" class="w-full bg-transparent border-none outline-none text-white font-gaming text-sm placeholder-gray-600" placeholder="••••••••">
                         </div>
                         <button type="button" (click)="showPassword.set(!showPassword())" class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                            <i [class]="showPassword() ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                         </button>
                      </div>

                      <!-- Forgot Password Link -->
                      @if (mode() === 'login') {
                          <div class="flex justify-end -mt-2">
                              <button type="button" (click)="switchMode('forgot')" class="text-[10px] font-bold text-gray-400 hover:text-blue-400 uppercase tracking-widest transition-colors py-1">
                                  Forgot Password?
                              </button>
                          </div>
                      }

                      @if (mode() === 'register') {
                        <div class="group bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus-within:bg-white/10 focus-within:border-blue-500/50 transition-all animate-in slide-in-from-right-4 fade-in duration-300 flex items-center gap-2">
                           <div class="flex-1">
                              <label class="block text-[10px] font-ui font-bold text-gray-400 group-focus-within:text-blue-500 uppercase tracking-widest mb-1 transition-colors">Confirm Passcode</label>
                              <input [type]="showConfirmPassword() ? 'text' : 'password'" formControlName="confirmPassword" class="w-full bg-transparent border-none outline-none text-white font-gaming text-sm placeholder-gray-600" placeholder="••••••••">
                           </div>
                           <button type="button" (click)="showConfirmPassword.set(!showConfirmPassword())" class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                              <i [class]="showConfirmPassword() ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                           </button>
                        </div>
                      }

                      <button type="submit" [disabled]="loading()"
                        class="mt-4 h-16 rounded-2xl bg-white text-black hover:bg-blue-50 font-gaming font-black text-sm uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                        @if (loading()) {
                          <i class="fa-solid fa-circle-notch animate-spin text-lg"></i>
                        } @else {
                          {{ mode() === 'login' ? 'ACCESS VAULT' : 'INITIATE PROTOCOL' }}
                          <i class="fa-solid fa-fingerprint text-lg"></i>
                        }
                      </button>
                    </form>
                }
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class AuthComponent {
  state = inject(StateService);
  mode = signal<'login' | 'register' | 'forgot'>('login');
  loading = signal(false);
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  
  // Onboarding Logic
  showOnboarding = signal(true);
  currentSlide = signal(0);
  slides = [
    { id: 1, image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2670&auto=format&fit=crop', title: 'Dominate The Arena', desc: 'Join elite tournaments and prove your skills on the battlefield.' },
    { id: 2, image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=2665&auto=format&fit=crop', title: 'Earn Real Rewards', desc: 'Compete for high-stakes prize pools and instant withdrawals.' },
    { id: 3, image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2671&auto=format&fit=crop', title: 'Agent Legacy', desc: 'Build your profile, track stats, and become a legend.' }
  ];

  nextSlide() {
    if (this.currentSlide() < this.slides.length - 1) {
      this.currentSlide.update(c => c + 1);
    } else {
      this.showOnboarding.set(false);
    }
  }
  
  // FIX: Instantiate FormGroup directly instead of using FormBuilder
  authForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl(''),
    referralCode: new FormControl('')
  });

  switchMode(m: 'login' | 'register' | 'forgot') {
    this.mode.set(m);
    this.authForm.reset();
  }

  async resetPassword() {
      const { email } = this.authForm.value;
      if (!email) {
          this.state.notify('Missing Info', 'Please enter your email address.', 'error');
          return;
      }
      
      this.loading.set(true);
      try {
          await sendPasswordResetEmail(auth, email);
          this.state.notify('Link Sent', 'Password reset link sent to your email.', 'success');
          this.switchMode('login');
      } catch (err: any) {
          this.state.notify('Error', this.state.getReadableError(err), 'error');
      } finally {
          this.loading.set(false);
      }
  }

  async submit() {
    const { email, password, confirmPassword, name, referralCode } = this.authForm.value;

    // CLIENT-SIDE VALIDATION
    if (!email) {
       this.state.notify('Missing Info', 'Please enter your email address.', 'error');
       return;
    }
    if (!password) {
       this.state.notify('Security Alert', 'Passcode is required to proceed.', 'error');
       return;
    }

    if (this.mode() === 'register') {
        if (!name) {
           this.state.notify('Missing Identity', 'Agent Codename is required.', 'error');
           return;
        }
        if (password !== confirmPassword) {
           this.state.notify('Mismatch', 'Passcodes do not match.', 'error');
           return;
        }
    }

    this.loading.set(true);
    
    try {
      if (this.mode() === 'login') {
        await signInWithEmailAndPassword(auth, email!, password!);
        this.state.notify('Access Granted', 'Welcome back, Agent.', 'success');
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email!, password!);
        const user = userCred.user;
        await updateProfile(user, { displayName: name });
        // NOTE: User profile creation in the database is now handled by StateService
        // to ensure a single source of truth and correct initial values.
        this.state.notify('Identity Established', 'Profile initialized. Welcome.', 'success');
      }
    } catch (err: any) {
      this.state.notify('Authentication Failed', this.state.getReadableError(err), 'error');
    } finally {
      this.loading.set(false);
    }
  }
}
