import { useState } from 'react';
import { message } from '@tauri-apps/plugin-dialog';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function PasswordChange() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const changePassword = async () => {
    if (!newPassword || !confirmNewPassword) {
      await message('Both password fields are required.', { title: 'New Password Error' });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      await message('Passwords do not match', { title: 'New Password Error' });
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      await message(error.message, { title: 'New Password Error' });
      return;
    }

    await message('Password updated successfully!', { title: 'Password Updated!' });
    setNewPassword('');
    setConfirmNewPassword('');
  };

  return (
    <section className="new-password-container">
      <label htmlFor="new-password">New Password:</label>
      <input
        type="password"
        name="new-password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <label htmlFor="confirm-new-password">Confirm New Password:</label>
      <input
        type="password"
        name="confirm-new-password"
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
      />
      <button onClick={changePassword}>Change Password</button>
    </section>
  );
}
