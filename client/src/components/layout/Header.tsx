import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { removeAuthToken } from '../../utils/auth';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeAuthToken();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <nav className="flex gap-6">
            <Link
              to="/leads"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/leads') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Leads
            </Link>
            <Link
              to="/contacts"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/contacts') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Contacts
            </Link>
            <Link
              to="/performance"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/performance') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Performance
            </Link>
          </nav>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
} 