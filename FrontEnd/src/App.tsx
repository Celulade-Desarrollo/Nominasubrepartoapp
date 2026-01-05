import { useState } from 'react';
import { Login } from './components/Login';
import { AdminDashboard } from './components/AdminDashboard';
import { CoordinatorDashboard } from './components/CoordinatorDashboard';
import { OperativeDashboard } from './components/OperativeDashboard';
import { loginUser, type Usuario } from './services/api';

export type UserProfile = 'administrativo' | 'coordinador' | 'operativo' | null;

export interface User {
  id: string;
  cedula: string;
  nombre: string;
  perfil: UserProfile;
  rol: number;
}

// Map rol IDs to profile names (based on roles table)
const rolToProfile: Record<number, UserProfile> = {
  1: 'operativo',      // usuario
  2: 'coordinador',    // coordinador
  3: 'administrativo', // administrador
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (cedula: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const documentoId = parseInt(cedula, 10);
      if (isNaN(documentoId)) {
        setError('La cédula debe ser un número');
        setIsLoading(false);
        return;
      }

      const usuario = await loginUser(documentoId, password);

      if (usuario) {
        setUser({
          id: usuario.id,
          cedula: usuario.documento_id.toString(),
          nombre: usuario.nombre_usuario,
          perfil: rolToProfile[usuario.rol] || 'operativo',
          rol: usuario.rol,
        });
      } else {
        setError('Cédula o contraseña incorrecta');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setError(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} isLoading={isLoading} error={error} />;
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
