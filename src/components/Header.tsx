import { faGear, faHouse, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { useSessionStore } from '../stores/useSessionStore';

export default function Header() {
  const session = useSessionStore((s) => s.session);

  return (
    <nav>
      <Link to="/">
        <FontAwesomeIcon icon={faHouse} />
      </Link>

      <Link to="/settings">
        <FontAwesomeIcon icon={faGear} />
      </Link>

      {!session && (
        <Link to="/login">
          <FontAwesomeIcon icon={faUser} />
        </Link>
      )}
    </nav>
  );
}
