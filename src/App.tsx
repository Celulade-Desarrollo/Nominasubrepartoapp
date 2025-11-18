import { useState } from 'react';
import { Login } from './components/Login';
import { AdminDashboard } from './components/AdminDashboard';
import { CoordinatorDashboard } from './components/CoordinatorDashboard';
import { OperativeDashboard } from './components/OperativeDashboard';

export type UserProfile = 'administrativo' | 'coordinador' | 'operativo' | null;

export interface User {
  cedula: string;
  nombre: string;
  perfil: UserProfile;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (cedula: string) => {
    // Mock user data - in production this would come from backend
    const mockUsers: Record<string, User> = {
      '123456': { cedula: '123456', nombre: 'Admin Usuario', perfil: 'administrativo' },
      '234567': { cedula: '234567', nombre: 'Coordinador Usuario', perfil: 'coordinador' },
      '345678': { cedula: '345678', nombre: 'Operativo Usuario', perfil: 'operativo' },
    };

    const foundUser = mockUsers[cedula];
    if (foundUser) {
      setUser(foundUser);
    } else {
      alert('Cédula no encontrada');
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user.perfil === 'administrativo' && (
        <AdminDashboard user={user} onLogout={handleLogout} />
      )}
      {user.perfil === 'coordinador' && (
        <CoordinatorDashboard user={user} onLogout={handleLogout} />
      )}
      {user.perfil === 'operativo' && (
        <OperativeDashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}
