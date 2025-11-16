import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import Constants from "expo-constants";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  profile: any | null;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
    options?: {
      phoneNumber?: string;
      mailingAddress?: string;
      fax?: string;
      position?: string;
    }
  ) => Promise<any>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateLocalProfile: (patch: Partial<any>) => void;
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
  const [profile, setProfile] = useState<any | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      // attempt to load profile for the initial session
      if (session?.user?.id) {
        refreshProfile().catch(() => {});
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
      if (session?.user?.id) {
        refreshProfile().catch(() => {});
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    try {
      // After login, sync metadata into profiles to ensure names/fields are present
      if (!result.error) {
        const u = result?.data?.user as any;
        if (u?.id) {
          const meta = (u.user_metadata || {}) as Record<string, any>;
          await supabase.from("profiles").upsert(
            {
              id: u.id,
              email: u.email || null,
              first_name: meta.first_name ?? null,
              last_name: meta.last_name ?? null,
              full_name:
                meta.full_name ?? ((u.email || "").split("@")[0] || null),
              mailing_address: meta.mailing_address ?? null,
              phone_number: meta.phone_number ?? null,
              fax: meta.fax ?? null,
              position: meta.position ?? null,
              verified: !!u.email_confirmed_at,
            },
            { onConflict: "id" }
          );
        }
      }
    } catch (e) {
      // best-effort sync; ignore failures
      console.warn("Post-login profile sync skipped:", e);
    }
    return result;
  };

  const signUp = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
    options?: {
      phoneNumber?: string;
      mailingAddress?: string;
      fax?: string;
      position?: string;
    }
  ) => {
    const fullName =
      [firstName, lastName].filter(Boolean).join(" ").trim() || undefined;
    const phoneNumber = options?.phoneNumber;
    const mailingAddress = options?.mailingAddress;
    const fax = options?.fax;
    const position = options?.position;
    // nag add ko first name and last name sa metadata they have it in their figma eh
    // supabase impleementation nalang kuwang
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          (Constants.expoConfig as any)?.extra?.confirmationRedirectUrl ||
          undefined,
        data: {
          first_name: firstName || undefined,
          last_name: lastName || undefined,
          full_name: fullName || undefined,
          phone_number: phoneNumber || undefined,
          mailing_address: mailingAddress || undefined,
          fax: fax || undefined,
          position: position || undefined,
        },
      },
    });

    // Detect the common Supabase quirk: when the email is already registered,
    // signUp can return a user with an empty identities array and no error.
    // Treat that as a duplicate email error so the UI can show the right message.
    try {
      const maybeUser: any = (result as any)?.data?.user;
      const identities = maybeUser?.identities;
      if (
        !result.error &&
        maybeUser &&
        Array.isArray(identities) &&
        identities.length === 0
      ) {
        // Return a result-like object with an error to indicate duplication
        return {
          ...result,
          error: new Error("User already registered"),
        } as unknown as typeof result;
      }
    } catch (e) {
      // no-op: fallback to normal flow
    }

    try {
      const user = (result as any)?.data?.user;
      if (user && user.id) {
        await supabase.from("profiles").upsert(
          {
            id: user.id,
            first_name: firstName || null,
            last_name: lastName || null,
            full_name: fullName || (user?.email || "").split("@")[0],
            email: user?.email || email,
            phone_number: phoneNumber || null,
            mailing_address: mailingAddress || null,
            fax: fax || null,
            position: position || null,
            verified: !!user?.email_confirmed_at,
          },
          { onConflict: "id" }
        );
        // refresh cached profile after signup
        try {
          await refreshProfile();
        } catch (e) {}
      }
    } catch (err) {
      console.error("Failed to create profile row after signup", err);
    }

    return result;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const refreshProfile = async () => {
    try {
      const uid = session?.user?.id;
      if (!uid) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", uid)
        .single();
      if (error && (error as any).code !== "PGRST116") throw error;
      let final = data || null;
      // If no first/last but user metadata is available, derive them for display
      const u = session?.user as any;
      if (final) {
        if ((!final.first_name || !final.last_name) && u) {
          const meta = u.user_metadata || {};
          const derivedFirst = final.first_name || meta.first_name || null;
          const derivedLast = final.last_name || meta.last_name || null;
          final = { ...final, first_name: derivedFirst, last_name: derivedLast };
        }
      } else if (u) {
        const meta = u.user_metadata || {};
        const derivedFirst = meta.first_name || null;
        const derivedLast = meta.last_name || null;
        final = {
          id: u.id,
          email: u.email || null,
          first_name: derivedFirst,
          last_name: derivedLast,
        };
      }
      setProfile(final || null);
    } catch (e) {
      console.warn("Failed to refresh profile", e);
    }
  };

  const updateLocalProfile = (patch: Partial<any>) => {
    setProfile((prev) => ({ ...(prev || {}), ...(patch || {}) }));
  };

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
    updateLocalProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
