
import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StateService } from '../services/state.service';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-info',
  imports: [RouterLink, TitleCasePipe],
  template: `
    <div class="max-w-4xl mx-auto p-6 min-h-screen bg-gray-50 dark:bg-dark-bg animate-in fade-in duration-300 pb-24 w-full">
      <div class="flex items-center gap-4 mb-8">
        <button routerLink="/" class="w-10 h-10 rounded-xl bg-white dark:bg-dark-surface text-gray-800 dark:text-white border border-gray-200 dark:border-dark-border flex items-center justify-center shadow-sm">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <h2 class="font-gaming font-black text-xl uppercase italic text-gray-800 dark:text-white">{{ title() }}</h2>
      </div>

      <div class="bg-white dark:bg-dark-surface dark:border-dark-border rounded-3xl p-6 shadow-xl border border-gray-100 prose dark:prose-invert max-w-none">
          <p class="font-ui text-base font-bold text-gray-800 dark:text-gray-100 whitespace-pre-line leading-loose tracking-wide">
              {{ content() }}
          </p>
      </div>
    </div>
  `
})
export class InfoComponent {
  route = inject(ActivatedRoute);
  state = inject(StateService);

  type = computed(() => this.route.snapshot.paramMap.get('type') || '');
  
  title = computed(() => {
      switch(this.type()) {
          case 'privacy': return 'Privacy Policy';
          case 'terms': return 'Terms & Conditions';
          case 'fairplay': return 'Fair Play Policy';
          case 'about': return 'About Us';
          case 'rules': return 'Game Rules';
          case 'app-rules': return 'App Rules';
          default: return 'Information';
      }
  });

  content = computed(() => {
     switch(this.type()) {
        case 'privacy': 
            return `Effective Date: October 2023

1. **Information Collection**
We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us. This includes:
- Username, Email address, and Password.
- Payment information (UPI IDs, transaction screenshots) for processing withdrawals and deposits.
- Device information and IP address for security purposes.

2. **Use of Information**
We use your information to:
- Facilitate tournament participation and prize distribution.
- Prevent fraud and cheating (Fair Play).
- Improve app performance and user experience.
- Communicate updates and promotional offers.

3. **Data Security**
We implement industry-standard security measures to protect your data. Passwords are encrypted, and payment details are processed via secure channels. However, no method of transmission over the internet is 100% secure.

4. **Third-Party Services**
We may use third-party services (like Firebase) for authentication and database management. These services have their own privacy policies.

5. **Contact Us**
For privacy concerns, please contact our support team directly within the app.`;

        case 'terms':
            return `**Terms of Service**

1. **Acceptance of Terms**
By accessing Arena AR, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the app.

2. **Eligibility**
- You must be at least 18 years old to participate in cash tournaments.
- Users from states where online gaming is prohibited (e.g., Assam, Odisha, Telangana, Nagaland, Sikkim, Andhra Pradesh) are not allowed to join paid contests.

3. **User Account**
You are responsible for maintaining the confidentiality of your account credentials. You are liable for all activities that occur under your account.

4. **Deposits and Withdrawals**
- All deposits are final and non-refundable.
- Withdrawals are subject to verification and may take up to 24-48 hours.
- We reserve the right to cancel withdrawals if suspicious activity is detected.

5. **Platform Rights**
Arena AR reserves the right to suspend or ban any user found violating rules, cheating, or engaging in abusive behavior without refund.`;

        case 'fairplay':
            return `**Fair Play Policy**

To ensure a competitive and fair environment, Arena AR enforces strict rules:

1. **Cheating & Hacking**
- Use of aimbots, wallhacks, speed hacks, or any third-party scripts is strictly prohibited.
- Modifying game files to gain an advantage is banned.

2. **Teaming**
- Teaming up with other players in Solo mode is strictly forbidden.
- Helping opponents to rank up (win-trading) will result in a permanent ban.

3. **Emulators**
- Unless specified otherwise, Emulator players are NOT allowed in mobile-only tournaments.
- Detection of emulator usage will lead to disqualification.

4. **Abuse**
- Verbal abuse, harassment, or hate speech in chat or support channels will not be tolerated.

**Consequences:**
Violation of any Fair Play rule results in immediate account suspension and forfeiture of wallet balance.`;

        case 'about':
            return `**About Arena AR**

Arena AR is a next-generation esports tournament platform designed for competitive mobile gamers. We bridge the gap between casual play and professional esports.

**Our Mission**
To provide a secure, transparent, and high-quality platform where gamers can showcase their skills and earn real rewards.

**Features**
- Automated Tournament Management
- Real-time Wallet System
- Secure Payments via UPI
- Advanced Anti-Cheat Detection (Manual Review)
- 24/7 Support

**Version:** 2.0.1
**Developer:** Arena AR`;

        case 'rules':
            return `**In-Game Tournament Rules**

1. **Lobby Entry**
- Room ID and Password will be shared inside the app 10-15 minutes before the match start time.
- Do not share the Room ID/Pass with non-registered players.

2. **Match Settings**
- Map: Specified in Tournament Details (Bermuda/Purgatory/Alpine).
- Mode: Solo, Duo, or Squad as per event.
- Gun Properties: Standard competitive settings.

3. **Scoring System**
- Placement Points + Kill Points determine the winner.
- Points table varies per tournament (check details).

4. **Disconnection**
- If you disconnect during the match, no refund will be provided.
- If the game server crashes for everyone, the match will be rehosted.`;

        case 'app-rules':
            return `**Application Usage Rules**

1. **Profile Verification**
- You must provide accurate Free Fire UIDs. Mismatched UIDs in the lobby may be kicked.
- Profile names should not contain offensive language.

2. **Wallet Usage**
- Minimum Deposit: ₹20
- Minimum Withdrawal: ₹100
- You cannot withdraw "Bonus" cash; it can only be used for entry fees.
- Winnings are fully withdrawable.

3. **Screenshot Upload**
- For withdrawals, a valid QR code must be uploaded.
- For deposits, a valid payment screenshot with a visible UTR/Reference ID is mandatory. Fake screenshots lead to a ban.

4. **Multiple Accounts**
- Creating multiple accounts to exploit referral bonuses is prohibited.
- Only one account per device is allowed.`;

        default: return "Content not found.";
     }
  });
}
