import "../styles/login.css"
import { createClient } from '@supabase/supabase-js';
import { message } from '@tauri-apps/plugin-dialog';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function Login() {
  const [signUpMode, setSignUpMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function login() {
    if (!isValidEmail(email)) {
      await message('Email must be in the "email@domain.com" format', {
        title: 'Invalid Email',
      });
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (!error) {
      console.log('User logged in as: ', email);
      navigate('/');
    } else {
      console.log(error.message);
      await message(`${error.message}`, { title: 'Login Error' });
    }

    setPassword('');
  }

  async function signUp() {
    if (!isValidEmail(email)) {
      await message('Email must be in the "email@domain.com" format', {
        title: 'Invalid Email',
      });
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (!error) {
      console.log('User SIGNED up as: ', email);
      navigate('/');
    } else {
      console.log(error.message);
      await message(`${error.message}`, { title: 'Sign Up Error' });
    }

    setPassword('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (signUpMode) {
      signUp();
    } else {
      login();
    }
  }

  function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  return (
    <main className="login">
      <h1>{!signUpMode ? 'Login' : 'Sign Up'}</h1>
      <p>Login to sync your to do list across platforms</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />

        <button type="submit">{!signUpMode ? 'Login' : 'Sign Up'}</button>
      </form>

      <br />
      <button onClick={() => setSignUpMode(!signUpMode)}>
        {!signUpMode
          ? "Don't have an account? Sign up here!"
          : 'Already have an account? Log in here!'}
      </button>
    </main>
  );
}
