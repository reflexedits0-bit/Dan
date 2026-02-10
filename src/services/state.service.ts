
import { Injectable, signal, effect } from '@angular/core';
import { auth, db } from './firebase.config';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { ref, onValue, push, set, update, get } from 'firebase/database';

// --- Interfaces ---
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'reward' | 'security';
  title: string;
  message: string;
  timestamp: number;
}

export interface Mail {
  id: string;
  sender: 'System' | 'Admin';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

export interface Mission {
  id: string;
  title: string;
  target: number;
  current: number;
  reward: number; // XP
  claimed: boolean;
  icon: string;
}

export interface Friend {
  uid: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'playing';
}

export interface BattlePass {
  level: number;
  currentXP: number;
  maxXP: number;
  isPremium: boolean;
}

export interface Tournament {
  id: string;
  title: string;
  type: 'Solo' | 'Duo' | 'Squad';
  prizePool: number;
  entryFee: number;
  time: string;
  date: string;
  status: 'Open' | 'Full' | 'Started';
  perKill: number;
  filledSlots: number;
  totalSlots: number;
  map: string;
  participants?: Record<string, boolean>;
  createdBy?: string;
}

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  desc: string;
  date: number;
  utr?: string;
  screenshot?: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  depositBalance: number;
  winningsBalance: number;
  wins: number;
  matches: number;
  avatar: string;
  referralCode?: string;
  clan?: string;
  level?: number;
  exp?: number;
  inventory?: Record<string, boolean>; // itemId: true
  equippedAvatar?: string;
  equippedFrame?: string;
  equippedTitle?: string;
  transactions?: Record<string, Transaction>;
  kycStatus?: 'pending' | 'verified' | 'rejected' | 'none';
  // New Fields
  ffUid?: string;
  phone?: string;
  referredBy?: string;
  // Sentinel AI Security Fields
  walletPin?: string; // 4-digit security pin
  sentinelStatus?: 'clean' | 'flagged' | 'banned';
}

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  image: string;
  type: 'avatar' | 'frame' | 'title' | 'crate';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  description?: string;
}

export interface Clan {
  id: string;
  name: string;
  tag: string;
  members: number;
  logo: string;
  slogan: string;
  owner: string;
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  // Auth State
  currentUser = signal<User | null>(null);
  userProfile = signal<UserProfile | null>(null);
  loading = signal<boolean>(true);

  // App Data
  tournaments = signal<Tournament[]>([]);
  leaderboard = signal<UserProfile[]>([]);
  clans = signal<Clan[]>([]);
  
  // --- New Advanced State ---
  notifications = signal<Notification[]>([]);
  mails = signal<Mail[]>([]);

  missions = signal<Mission[]>([
    { id: 'm1', title: 'Play 1 Match', target: 1, current: 0, reward: 100, claimed: false, icon: 'fa-gamepad' },
    { id: 'm2', title: 'Get 5 Kills', target: 5, current: 2, reward: 250, claimed: false, icon: 'fa-skull' },
    { id: 'm3', title: 'Win a Tournament', target: 1, current: 0, reward: 1000, claimed: false, icon: 'fa-trophy' }
  ]);
  battlePass = signal<BattlePass>({ level: 12, currentXP: 450, maxXP: 1000, isPremium: false });
  friends = signal<Friend[]>([
    { uid: 'f1', name: 'CyberWolf', avatar: '🐺', status: 'online' },
    { uid: 'f2', name: 'NeonViper', avatar: '🐍', status: 'playing' },
    { uid: 'f3', name: 'GhostRider', avatar: '💀', status: 'offline' }
  ]);
  
  shopItems = signal<ShopItem[]>([
    { id: 'crate_1', name: 'Neon Crate', price: 100, type: 'crate', image: '📦', rarity: 'Rare', description: 'Contains random avatars.' },
    { id: 'av_1', name: 'Samurai', price: 500, type: 'avatar', image: '👺', rarity: 'Legendary' },
    { id: 'fr_1', name: 'Gold Frame', price: 300, type: 'frame', image: '🖼️', rarity: 'Epic' },
    { id: 'ti_1', name: 'Sniper King', price: 150, type: 'title', image: '👑', rarity: 'Rare' },
  ]);

  darkMode = signal<boolean>(false);

  constructor() {
    onAuthStateChanged(auth, (user) => {
      this.currentUser.set(user);
      if (user) {
        this.fetchUserProfile(user.uid);
        this._sendWelcomeMail();
      } else {
        this.userProfile.set(null);
        this.loading.set(false);
      }
    });

    const tournamentsRef = ref(db, 'tournaments');
    onValue(tournamentsRef, (snapshot) => {
      const data = snapshot.val();
      const previousList = this.tournaments(); 

      if (data) {
        const list: Tournament[] = Object.keys(data).map(key => ({
          ...data[key],
          id: key,
          filledSlots: data[key].participants ? Object.keys(data[key].participants).length : 0
        }));
        
        if (previousList.length > 0) {
            list.forEach(newItem => {
                const oldItem = previousList.find(i => i.id === newItem.id);
                
                if (oldItem) {
                    if (oldItem.status !== newItem.status) {
                        if (newItem.status === 'Started') {
                            this.notify('OPERATION LIVE', `Tournament ${newItem.title} has commenced. Check credentials immediately.`, 'success');
                        } else if (newItem.status === 'Open' && oldItem.status === 'Full') {
                             this.notify('SLOTS OPEN', `Slots available in ${newItem.title}. Register now!`, 'info');
                        }
                    }
                } else {
                    this.notify('NEW DEPLOYMENT', `${newItem.title} detected in sector. Registration Open.`, 'info');
                }
            });
        }

        this.tournaments.set(list.reverse());
      } else {
        this.tournaments.set([]);
      }
    });

    const usersRef = ref(db, 'users');
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const users = Object.values(data) as UserProfile[];
        users.sort((a, b) => (b.wins || 0) - (a.wins || 0));
        this.leaderboard.set(users.slice(0, 50));
      }
    });

    this.clans.set([
        { id: 'c1', name: 'Team Liquid', tag: 'TL', members: 42, logo: '🐴', slogan: 'Ride the wave.', owner: 'system' },
        { id: 'c2', name: 'Sentinels', tag: 'SEN', members: 38, logo: '🔴', slogan: 'Always watching.', owner: 'system' }
    ]);

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.setTheme(true);
    }
  }

  private _sendWelcomeMail() {
    const welcomeMail: Mail = {
      id: `welcome_${Date.now()}`,
      sender: 'System',
      title: 'Welcome to Arena AR!',
      message: 'Your account is now active. Explore tournaments, prove your skills, and climb the ranks. Good luck, Agent!',
      timestamp: Date.now(),
      read: false
    };
    this.mails.set([welcomeMail]);
  }

  notify(title: string, message: string, type: 'success' | 'error' | 'info' | 'reward' | 'security' = 'info') {
    const id = Date.now().toString();
    const newNotif: Notification = { id, type, title, message, timestamp: Date.now() };
    this.notifications.update(n => [...n, newNotif]);
    setTimeout(() => {
      this.notifications.update(n => n.filter(x => x.id !== id));
    }, 4000);
  }

  getReadableError(err: any): string {
     console.error("System Error:", err); 
     const code = (err?.code || err?.message || 'unknown').toString();
     
     if (code.includes('auth/user-not-found') || code.includes('auth/invalid-credential')) return 'Account not found or password incorrect.';
     if (code.includes('auth/wrong-password')) return 'Incorrect password. Try again.';
     if (code.includes('auth/email-already-in-use')) return 'Email is already registered.';
     if (code.includes('auth/weak-password')) return 'Password must be at least 6 characters.';
     if (code.includes('auth/invalid-email')) return 'Invalid email address format.';
     if (code.includes('auth/network-request-failed')) return 'Connection failed. Check your internet.';
     if (code.includes('auth/too-many-requests')) return 'Too many attempts. Try again later.';
     
     if (code.includes('permission-denied')) return 'Access denied. You do not have permission.';
     if (code.includes('insufficient-funds') || code.includes('Insufficient Funds')) return 'Insufficient funds in your wallet.';
     
     return code.replace('Firebase: ', '').replace('Error: ', '');
  }

  fetchUserProfile(uid: string) {
    const userRef = ref(db, `users/${uid}`);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const name = data.name || 'Agent';
        const updatedData: UserProfile = {
            ...data,
            depositBalance: data.depositBalance || 0,
            winningsBalance: data.winningsBalance || 0,
            level: data.level || 1,
            exp: data.exp || 0,
            referralCode: data.referralCode || uid.substring(0, 6).toUpperCase(),
            avatar: name.charAt(0).toUpperCase(),
            sentinelStatus: data.sentinelStatus || 'clean'
        };
        this.userProfile.set(updatedData);
      } else {
        const userName = this.currentUser()?.displayName || this.currentUser()?.email?.split('@')[0] || 'Agent';
        
        const newProfile: UserProfile = {
          uid,
          name: userName,
          email: this.currentUser()?.email || '',
          depositBalance: 0,
          winningsBalance: 0, 
          wins: 0,
          matches: 0,
          avatar: userName.charAt(0).toUpperCase(),
          level: 1,
          exp: 0,
          kycStatus: 'none',
          transactions: {},
          referralCode: uid.substring(0, 6).toUpperCase(),
          sentinelStatus: 'clean'
        };
        set(userRef, newProfile);
        this.userProfile.set(newProfile);
      }
      this.loading.set(false);
    });
  }

  async updateProfile(data: Partial<UserProfile>) {
      const user = this.currentUser();
      if (!user) return;
      try {
          const userRef = ref(db, `users/${user.uid}`);
          await update(userRef, data);
          if(data.name || data.ffUid) {
             this.notify('Profile Updated', 'Your details have been saved.', 'success');
          }
      } catch (e) {
          this.notify('Update Failed', this.getReadableError(e), 'error');
          throw e;
      }
  }

  setTheme(isDark: boolean) {
    this.darkMode.set(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  async joinTournament(tournamentId: string, fee: number) {
    const user = this.currentUser();
    const profile = this.userProfile();
    
    if (!user || !profile) return false;
    
    if (profile.sentinelStatus === 'banned') {
       throw new Error('SENTINEL_LOCKDOWN');
    }

    try {
        const totalBalance = profile.depositBalance + profile.winningsBalance;
        if (totalBalance < fee) {
            throw new Error("Insufficient Funds");
        }

        const feeFromDeposit = Math.min(profile.depositBalance, fee);
        const newDepositBalance = profile.depositBalance - feeFromDeposit;
        const remainingFee = fee - feeFromDeposit;
        const newWinningsBalance = profile.winningsBalance - remainingFee;

        const userRef = ref(db, `users/${user.uid}`);
        await update(userRef, {
            depositBalance: newDepositBalance,
            winningsBalance: newWinningsBalance,
            matches: profile.matches + 1,
            exp: (profile.exp || 0) + 50
        });
        
        await this.addTransaction(user.uid, 'debit', fee, `Tournament Entry`);
        const participantRef = ref(db, `tournaments/${tournamentId}/participants`);
        await update(participantRef, { [user.uid]: true });
        
        this.notify('Deployed', 'Successfully joined the lobby.', 'success');
        return true;
    } catch (e: any) {
        if(e.message === 'SENTINEL_LOCKDOWN') {
           this.notify('OMNI-LOCK ACTIVE', 'Account Terminated. Contact Admin.', 'security');
        } else {
           this.notify('Access Denied', this.getReadableError(e), 'error');
        }
        throw e;
    }
  }

  async addFunds(amount: number, utr: string, screenshot: string) {
     const user = this.currentUser();
     if (!user) return;
     try {
         await this.addTransaction(user.uid, 'credit', amount, 'Deposit Pending (Admin Verification)', utr, screenshot);
         this.notify('Request Submitted', 'Admin will verify and credit funds.', 'info');
     } catch (e) {
         this.notify('Deposit Failed', this.getReadableError(e), 'error');
         throw e;
     }
  }

  async withdrawFunds(amount: number, qrCode: string) {
     const user = this.currentUser();
     const profile = this.userProfile();
     if (!user || !profile) return;
     try {
         if (profile.winningsBalance < amount) throw new Error("Insufficient Funds");

         const userRef = ref(db, `users/${user.uid}`);
         await update(userRef, { winningsBalance: profile.winningsBalance - amount });
         await this.addTransaction(user.uid, 'debit', amount, 'Withdrawal Request', undefined, qrCode);
         this.notify('Request Sent', 'Withdrawal processing.', 'info');
     } catch (e) {
         this.notify('Withdrawal Failed', this.getReadableError(e), 'error');
         throw e;
     }
  }

  async buyItem(item: ShopItem) {
     const user = this.currentUser();
     const profile = this.userProfile();
     if (!user || !profile) return;
     try {
         const totalBalance = profile.depositBalance + profile.winningsBalance;
         if (totalBalance < item.price) {
             throw new Error("Insufficient Funds");
         }

         const feeFromDeposit = Math.min(profile.depositBalance, item.price);
         const newDepositBalance = profile.depositBalance - feeFromDeposit;
         const remainingFee = item.price - feeFromDeposit;
         const newWinningsBalance = profile.winningsBalance - remainingFee;

         const userRef = ref(db, `users/${user.uid}`);
         await update(userRef, { 
             depositBalance: newDepositBalance,
             winningsBalance: newWinningsBalance 
         });
         
         const invRef = ref(db, `users/${user.uid}/inventory`);
         await update(invRef, { [item.id]: true });

         await this.addTransaction(user.uid, 'debit', item.price, `Shop: ${item.name}`);
         this.notify('Purchase Successful', `${item.name} added to inventory.`, 'success');
     } catch (e) {
         this.notify('Purchase Failed', this.getReadableError(e), 'error');
         throw e;
     }
  }
  
  // FIX: Add createClan method
  async createClan(name: string, tag: string) {
    const user = this.currentUser();
    const profile = this.userProfile();
    if (!user || !profile) {
        this.notify('Authentication Error', 'You must be logged in.', 'error');
        throw new Error("User not authenticated.");
    }
    if (profile.clan) {
        this.notify('Action Failed', 'You are already in a clan.', 'error');
        throw new Error("You are already in a clan.");
    }

    const fee = 5000;
    const totalBalance = profile.depositBalance + profile.winningsBalance;
    if (totalBalance < fee) {
        this.notify('Insufficient Funds', `Creating a clan costs ₹${fee}.`, 'error');
        throw new Error("Insufficient Funds");
    }

    try {
        // Deduct fee
        const feeFromDeposit = Math.min(profile.depositBalance, fee);
        const newDepositBalance = profile.depositBalance - feeFromDeposit;
        const remainingFee = fee - feeFromDeposit;
        const newWinningsBalance = profile.winningsBalance - remainingFee;

        // Create clan
        const clansRef = ref(db, 'clans');
        const newClanRef = push(clansRef);
        const newClanData = {
            id: newClanRef.key!,
            name,
            tag,
            members: 1,
            logo: name.charAt(0).toUpperCase(),
            slogan: 'A new legacy begins.',
            owner: user.uid
        };
        await set(newClanRef, newClanData);

        // Update user profile
        const userRef = ref(db, `users/${user.uid}`);
        await update(userRef, {
            depositBalance: newDepositBalance,
            winningsBalance: newWinningsBalance,
            clan: newClanData.id
        });

        await this.addTransaction(user.uid, 'debit', fee, `Created Clan: ${name}`);
        this.notify('Clan Created', `Your clan "${name}" is now active.`, 'success');
    } catch (e) {
        this.notify('Creation Failed', this.getReadableError(e), 'error');
        throw e;
    }
  }

  // FIX: Add joinClan method
  async joinClan(clanId: string) {
    const user = this.currentUser();
    const profile = this.userProfile();
    if (!user || !profile) {
        this.notify('Authentication Error', 'You must be logged in.', 'error');
        throw new Error("User not authenticated.");
    }

    if (profile.clan) {
        this.notify('Action Failed', 'You are already in a clan.', 'error');
        throw new Error("You are already in a clan.");
    }
    
    try {
        const clanRef = ref(db, `clans/${clanId}`);
        const clanSnapshot = await get(clanRef);
        if (!clanSnapshot.exists()) {
            throw new Error("Clan not found.");
        }
        const clanData = clanSnapshot.val();
        if (clanData.members >= 50) {
            throw new Error("Clan is full.");
        }

        // Update user profile
        const userRef = ref(db, `users/${user.uid}`);
        await update(userRef, { clan: clanId });

        // Update clan members count
        await update(clanRef, { members: clanData.members + 1 });

        this.notify('Clan Joined', `You are now a member of ${clanData.name}.`, 'success');
    } catch (e) {
        this.notify('Join Failed', this.getReadableError(e), 'error');
        throw e;
    }
  }

  logout() {
    signOut(auth);
    this.setTheme(false);
  }

  private async addTransaction(uid: string, type: 'credit'|'debit', amount: number, desc: string, utr?: string, screenshot?: string) {
     const transRef = ref(db, `users/${uid}/transactions`);
     const newTrans = push(transRef);
     await set(newTrans, {
         id: newTrans.key,
         type,
         amount,
         desc,
         date: Date.now(),
         utr: utr || null,
         screenshot: screenshot || null
     });
  }

  async reportIssue(description: string, screenshot: string) {
    const user = this.currentUser();
    if (!user) return;
    
    try {
       const ticketsRef = ref(db, 'support_tickets');
       const newTicket = push(ticketsRef);
       await set(newTicket, {
           id: newTicket.key,
           uid: user.uid,
           userEmail: user.email,
           description,
           screenshot,
           status: 'pending',
           timestamp: Date.now()
       });
       this.notify('Ticket Created', 'Support team will check your issue.', 'success');
    } catch (e) {
       this.notify('Error', this.getReadableError(e), 'error');
       throw e;
    }
  }
}
