import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const AuthContext = createContext(null);
const demoSessionKey = 'baeback-demo-session';

export const demoAccounts = {
  user: {
    email: 'user@baeback.local',
    password: 'user123456',
    profile: {
      id: 'demo-user',
      full_name: 'BaeBack User',
      role: 'user',
      location: 'Bandung',
      badge: 'helpful_member',
      kindness_points: 120,
      rating_average: 4.8,
    },
  },
  admin: {
    email: 'admin@baeback.local',
    password: 'admin123456',
    profile: {
      id: 'demo-admin',
      full_name: 'BaeBack Admin',
      role: 'admin',
      location: 'Bandung',
      badge: 'trusted_donor',
      kindness_points: 260,
      rating_average: 5,
    },
  },
};

function createDemoSession(accountKey) {
  const account = demoAccounts[accountKey];
  if (!account) return null;

  return {
    user: {
      id: account.profile.id,
      email: account.email,
      user_metadata: { full_name: account.profile.full_name },
    },
  };
}

function createDemoProfile(accountKey) {
  const account = demoAccounts[accountKey];
  return account ? { ...account.profile } : null;
}

function readStoredDemoSession() {
  if (typeof window === 'undefined') return null;

  const storedKey = window.localStorage.getItem(demoSessionKey);
  return storedKey ? createDemoSession(storedKey) : null;
}

function persistDemoSession(accountKey) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(demoSessionKey, accountKey);
}

function clearDemoSession() {
  if (typeof window === 'undefined') return;

  window.localStorage.removeItem(demoSessionKey);
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(isSupabaseConfigured ? null : readStoredDemoSession());
  const [profile, setProfile] = useState(isSupabaseConfigured ? null : createDemoProfile(typeof window !== 'undefined' ? window.localStorage.getItem(demoSessionKey) : null));
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return undefined;
    }

    let mounted = true;

    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session);
      if (data.session?.user) {
        await ensureProfile(data.session.user);
      }
      setLoading(false);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user) {
        await ensureProfile(nextSession.user);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function ensureProfile(user) {
    if (!supabase || !user) return null;

    const { data: existing } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (existing) {
      setProfile(existing);
      return existing;
    }

    const payload = {
      id: user.id,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Pengguna BaeBack',
      role: 'user',
      badge: 'new_donor',
      kindness_points: 0,
    };

    const { data } = await supabase.from('profiles').insert(payload).select('*').single();
    setProfile(data || payload);
    return data || payload;
  }

  async function signIn(email, password) {
    if (!supabase) {
      const matchedAccountKey = Object.entries(demoAccounts).find(([, account]) => account.email === email && account.password === password)?.[0];

      if (!matchedAccountKey) {
        return { error: new Error('Akun demo tidak ditemukan. Gunakan email dan kata sandi demo yang tersedia.') };
      }

      const nextSession = createDemoSession(matchedAccountKey);
      setSession(nextSession);
      setProfile(createDemoProfile(matchedAccountKey));
      persistDemoSession(matchedAccountKey);
      return { data: nextSession };
    }

    return supabase.auth.signInWithPassword({ email, password });
  }

  async function signUp(email, password, fullName) {
    if (!supabase) return { error: new Error('Mode demo tidak mendukung registrasi. Gunakan akun user atau admin demo yang tersedia.') };
    return supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
  }

  async function signOut() {
    if (!supabase) {
      setSession(null);
      setProfile(null);
      clearDemoSession();
      return;
    }

    await supabase.auth.signOut();
  }

  // Increment kindness points locally when Supabase is not configured.
  function incrementKindnessPointsLocal(amount = 1, userId = null) {
    if (isSupabaseConfigured) return;
    setProfile((p) => {
      if (!p) return p;
      // only modify current user's profile
      if (userId && p.id !== userId) return p;
      return { ...p, kindness_points: (p.kindness_points || 0) + amount };
    });
  }

  const value = useMemo(
    () => ({
      session,
      user: session?.user || null,
      profile,
      loading,
      isAuthenticated: Boolean(session?.user),
      isAdmin: profile?.role === 'admin',
      incrementKindnessPointsLocal,
      signIn,
      signUp,
      signOut,
      demoAccounts,
    }),
    [session, profile, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider.');
  }
  return context;
}
