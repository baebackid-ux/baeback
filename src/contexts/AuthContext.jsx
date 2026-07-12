import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    if (!user) return null;

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
    return supabase.auth.signInWithPassword({ email, password });
  }

  async function signUp(email, password, fullName) {
    return supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  function incrementKindnessPointsLocal() {
    // No-op in production mode
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

