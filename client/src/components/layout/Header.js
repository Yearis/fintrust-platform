import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="logo">FinTrust</div>
      <nav>
        {user ? (
          <>
            <span>Welcome, {user.name}</span>
            <Button onClick={logout}>Logout</Button>
          </>
        ) : null}
      </nav>
    </header>
  );
};

export default Header;