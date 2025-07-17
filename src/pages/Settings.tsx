import { useEffect, useState } from 'react';
import { updater } from '../utils/updater';
import { useTodoStore } from '../stores/useTodoStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useSessionStore } from '../stores/useSessionStore';
import { createClient } from '@supabase/supabase-js';
import { confirm, message } from '@tauri-apps/plugin-dialog';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function Settings() {
  const session = useSessionStore((s) => s.session);
  const [checking, setChecking] = useState(false);

  const clearTodos = useTodoStore((s) => s.clearTodos);
  const saveTodos = useTodoStore((s) => s.saveTodos);

  const { settings, updateSettings, saveToFile } = useSettingsStore();
  const [defaultHours, setDefaultHours] = useState(settings.defaultHours);
  const [autoDelete, setAutoDelete] = useState(
    settings.autoDeleteTasksOnComplete
  );
  const [autoDeleteTimer, setAutoDeleteTimer] = useState(
    settings.autoDeleteTimer
  );
  const [enablePopup, setEnablePopup] = useState(
    settings.enablePopupAfterTaskExpiry
  );
  const [autoSync, setAutoSync] = useState(settings.autoSync)

  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  useEffect(() => {
    setDefaultHours(settings.defaultHours);
    setAutoDelete(settings.autoDeleteTasksOnComplete);
    setAutoDeleteTimer(settings.autoDeleteTimer);
    setEnablePopup(settings.enablePopupAfterTaskExpiry);
    setAutoSync(settings.autoSync);
  }, [settings]);

  const handleCheck = async () => {
    setChecking(true);
    await updater();
    setChecking(false);
  };

  const wipeList = async () => {
    clearTodos();
    await saveTodos();
  };

  const handleBlur = () => {
    updateSettings('defaultHours', defaultHours);
    updateSettings('autoDeleteTasksOnComplete', autoDelete);
    updateSettings('autoDeleteTimer', autoDeleteTimer);
    saveToFile();
  };

  const toggleAutoDelete = () => {
    const newValue = !autoDelete;
    setAutoDelete(newValue);
    updateSettings('autoDeleteTasksOnComplete', newValue);
    saveToFile();
  };

  const toggleEnablePopup = () => {
    const newValue = !enablePopup;
    setEnablePopup(newValue);
    updateSettings('enablePopupAfterTaskExpiry', newValue);
    saveToFile();
  };

  const toggleAutoSync = () => {
    const newValue = !autoSync;
    setEnablePopup(newValue);
    updateSettings('autoSync', newValue);
    saveToFile();
  };

  const logOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log('Log out error!');
    }
  };

  const changePassword = async () => {
    if (!newPassword || !confirmNewPassword) {
      console.log('both password fields are required!');
      await message('Both password fields are required.', {
        title: 'New Password Error',
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      console.log('password do not match!');
      await message('Passwords do not match', { title: 'New Password Error' });
      return;
    }

    console.log('passwords match! updating password...');
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) {
      console.log(error.message);
      await message(error.message, { title: 'New Password Error' });
      return;
    }

    await message('Password updated successfully!', {
      title: 'Password Updated!',
    });

    setNewPassword('');
    setConfirmNewPassword('');
  };

  const wipeListRemote = async () => {
    const userId = session?.user.id;

    if (!userId) {
      return;
    }

    const confirmed = await confirm(
      "This action can't be reverted. Are you sure?",
      { title: 'Confirm Delete Data' }
    );
    if (!confirmed) return;

    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('user_id', userId);

    if (error) {
      await message(error.message, { title: 'Error Deleting Data' });
    } else {
      await message('Successfully deleted uploaded data', {
        title: 'Success!',
      });
    }
  };

  return (
    <main className="settings">
      <h1>Settings</h1>
      <p style={{ fontSize: '12px' }}>
        Settings are automatically saved locally
      </p>

      <section className="input-container default-hours">
        <label htmlFor="defaultHours">Default Task Time (in hours):</label>
        <input
          name="defaultHours"
          type="number"
          value={defaultHours}
          onChange={(e) => setDefaultHours(parseInt(e.target.value))}
          onBlur={handleBlur}
        />
      </section>

      <section className="input-container">
        <label htmlFor="autoDelete">
          Automatically delete completed tasks?
        </label>
        <input
          name="autoDelete"
          type="checkbox"
          checked={autoDelete}
          onChange={() => toggleAutoDelete()}
        />

        {autoDelete && (
          <>
            <label htmlFor="autoDeleteTimer">
              Auto Delete Timer (in seconds):
            </label>
            <input
              name="autoDeleteTimer"
              type="number"
              value={autoDeleteTimer}
              onChange={(e) => setAutoDeleteTimer(parseInt(e.target.value))}
              onBlur={handleBlur}
            />
          </>
        )}
      </section>

      <section className="input-container">
        <label htmlFor="expire-notification">
          Send an alert if a task&apos;s timer expires?
        </label>
        <input
          name="expire-notification"
          type="checkbox"
          checked={enablePopup}
          onChange={() => toggleEnablePopup()}
        />
      </section>

      <section className="input-container">
        <label htmlFor="autosync">
          Automatically sync to cloud?
        </label>
        <input
          name="autosync"
          type="checkbox"
          checked={autoSync}
          onChange={() => toggleAutoSync()}
        />
      </section>

      <button onClick={wipeList}>Delete Local List</button>
      {session && (
        <button onClick={wipeListRemote}>Delete Uploaded List</button>
      )}
      <button onClick={handleCheck}>
        {checking ? 'Checking...' : 'Check for Updates'}
      </button>

      {session && (
        <section className="user-info">
          <p>
            Logged in:&nbsp;<strong>{session?.user.email}</strong>
          </p>
          <button onClick={logOut}>Log Out</button>

          <section className="new-password-container">
            <label htmlFor="new-password">New Password:</label>
            <input
              type="password"
              name="new-password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
            />
            <label htmlFor="confirm-new-password">Confirm New Password:</label>
            <input
              type="password"
              name="confirm-new-password"
              value={confirmNewPassword}
              onChange={(e) => {
                setConfirmNewPassword(e.target.value);
              }}
            />
            <button onClick={changePassword}>Change Password</button>
          </section>
        </section>
      )}

      <section className="information">
        <p>Amethyst To Do List</p>
        <p>Developed by Amethyst Software (Waleed R.)</p>
        <p>Beta - v0.3.2</p>
      </section>
    </main>
  );
}
