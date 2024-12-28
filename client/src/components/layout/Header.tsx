import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { removeAuthToken } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeAuthToken();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path) ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-primary";
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <nav className="flex items-center space-x-4 lg:space-x-6">
            <Link
              to="/leads"
              className={`text-sm font-medium transition-colors ${isActive('/leads')}`}
            >
              Leads
            </Link>
            <Link
              to="/contacts"
              className={`text-sm font-medium transition-colors ${isActive('/contacts')}`}
            >
              Contacts
            </Link>
          </nav>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
} 