import { faGear, faHouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <nav className="header">
      <Link to="/">
        <FontAwesomeIcon icon={faHouse} />
      </Link>

      <Link to="/settings">
        <FontAwesomeIcon icon={faGear} />
      </Link>

      {/* if not logged in */}
      {/* Log in */}
      {/* Settings? */}
      {/* if logged in */}
      {/* Email */}
      {/* links to settings/user page */}
    </nav>
  );
}
