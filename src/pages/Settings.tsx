import { useSessionStore } from '../stores/useSessionStore';
import SettingsForm from '../components/settings/SettingsForm';
import AutoDeleteSettings from '../components/settings/AutoDeleteSettings';
import ExpiryPopupToggle from '../components/settings/ExpiryPopupToggle';
import AutoSyncToggle from '../components/settings/AutoSyncToggle';
import PasswordChange from '../components/settings/PasswordChange';
import UserInfo from '../components/settings/UserInfo';
import UpdateAndWipeButtons from '../components/settings/UpdateAndWipeButtons';

export default function Settings() {
  const session = useSessionStore((s) => s.session);

  return (
    <main className="settings">
      <h1>Settings</h1>
      <p style={{ fontSize: '12px' }}>
        Settings are automatically saved locally
      </p>

      <SettingsForm />
      <AutoDeleteSettings />
      <ExpiryPopupToggle />
      <AutoSyncToggle />
      <UpdateAndWipeButtons />
      {session && <UserInfo session={session} />}
      {session && <PasswordChange />}

      <section className="information">
        <p>Amethyst To Do List</p>
        <p>Developed by Amethyst Software (Waleed R.)</p>
        <p>Beta - v0.3.3</p>
      </section>
    </main>
  );
}
