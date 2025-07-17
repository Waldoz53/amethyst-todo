import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function UserInfo({ session }: { session: any }) {
  const logOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log('Log out error!');
    }
  };

  return (
    <section className="user-info">
      <p>
        Logged in:&nbsp;<strong>{session.user.email}</strong>
      </p>
      <button onClick={logOut}>Log Out</button>
    </section>
  );
}
