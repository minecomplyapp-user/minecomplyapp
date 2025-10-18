import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return result;
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    const fullName = [firstName, lastName].filter(Boolean).join(' ').trim() || undefined;
    // nag add ko first name and last name sa metadata they have it in their figma eh
    // supabase impleementation nalang kuwang
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName || undefined,
          last_name: lastName || undefined,
          full_name: fullName || undefined,
        },
      },
    });

    try {
      const user = (result as any)?.data?.user;
      if (user && user.id) {
        await supabase.from('profiles').upsert(
          {
            id: user.id,
            first_name: firstName || null,
            last_name: lastName || null,
            full_name: fullName || (user?.email || '').split('@')[0],
            email: user?.email || email,
            verified: !!user?.email_confirmed_at,
          },
          { onConflict: 'id' }
        );
      }
    } catch (err) {
      console.error('Failed to create profile row after signup', err);
    }

    return result;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user: session?.user ?? null,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
