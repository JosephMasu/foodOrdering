import {
    createContext,
    PropsWithChildren,
    useEffect,
    useState,
  } from "react";
  import { supabase } from "../lib/supabase";
  import { Session } from "@supabase/supabase-js";
  
  type AuthData = {
    session: Session | null;
    profile: any;
    loading: boolean;
    isAdmin: boolean;
  };
  
  // ✅ Export the context separately
  export const AuthContext = createContext<AuthData>({
    session: null,
    loading: true,
    profile: null,
    isAdmin: false,
  });
  
  export default function AuthProvider({ children }: PropsWithChildren) {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any | null>(null);
  
    useEffect(() => {
      const fetchSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);

        if (session) {
          // fetch profile
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          setProfile(data || null);
        }
        setLoading(false);
      };
      fetchSession();
  
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });
  
      return () => subscription.unsubscribe();
    }, []);

    console.log(profile);
  
    return (
      <AuthContext.Provider value={{ session, loading, profile, isAdmin: profile?.group === 'ADMIN' }}>
        {children}
      </AuthContext.Provider>
    );
  }
  