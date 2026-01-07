import { useState, useEffect } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { AdminDashboard } from "./components/AdminDashboard";
import { CoordinatorDashboard } from "./components/CoordinatorDashboard";
import { OperativeDashboard } from "./components/OperativeDashboard";
import { loginRequest } from "./auth/msalConfig";
import { loginUser, type Usuario } from "./services/api";

export type UserProfile = "administrativo" | "coordinador" | "operativo" | null;

export interface User {
  id: string;
  cedula: string;
  nombre: string;
  perfil: UserProfile;
  rol: number;
  email: string;
}

const rolToProfile: Record<number, UserProfile> = {
  1: "operativo",
  2: "coordinador",
  3: "administrativo",
};

export default function App() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cuando el usuario se autentica con Microsoft, buscamos su info en nuestra BD
  useEffect(() => {
    const loadUserFromDatabase = async () => {
      // Si no está autenticado con Microsoft o ya tenemos el usuario cargado, no hacemos nada
      if (!isAuthenticated || !accounts[0] || user) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Obtenemos el email del usuario autenticado con Microsoft
        const microsoftUser = accounts[0];
        const email = microsoftUser.username; // Este es el email corporativo

        // Buscamos el usuario en nuestra base de datos por su email
        // Necesitarás crear esta función en tu api.ts
        const usuario = await loginUser(email, "password");

        if (usuario) {
          setUser({
            id: usuario.id,
            cedula: usuario.documento_id.toString(),
            nombre: usuario.nombre_usuario,
            perfil: rolToProfile[usuario.rol] || "operativo",
            rol: usuario.rol,
            email: email,
          });
        } else {
          // El usuario se autenticó con Microsoft pero no existe en nuestra BD
          // Esto puede pasar si es un empleado nuevo que aún no fue registrado
          setError(
            "Tu cuenta de Microsoft no está registrada en el sistema de nómina. Contacta al administrador."
          );
        }
      } catch (err) {
        setError("Error al cargar los datos del usuario");
        console.error("Error loading user data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromDatabase();
  }, [isAuthenticated, accounts, user]);

  // Función para iniciar sesión con Microsoft
  const handleLogin = async () => {
    try {
      await instance.loginPopup(loginRequest);
      // El useEffect de arriba se encargará de cargar el usuario
    } catch (err) {
      console.error("Error durante el login:", err);
      setError("Error al iniciar sesión con Microsoft");
    }
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    setUser(null);
    setError(null);
    instance.logoutPopup();
  };

  // Pantalla de carga mientras verificamos la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  // Si no está autenticado, mostramos el botón de login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-8">Sistema de Nómina</h1>

        <button
          onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-700 text-black font-semibold py-3 px-6 rounded-lg flex items-center gap-2"
        >
          {/* Icono de Microsoft (opcional) */}
          <svg className="w-5 h-5" viewBox="0 0 21 21">
            <rect x="1" y="1" width="9" height="9" fill="#f25022" />
            <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
            <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
            <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
          </svg>
          Iniciar Sesión con Microsoft
        </button>

        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>
    );
  }

  // Autenticado con Microsoft pero sin datos de nuestra BD todavía
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        {error ? (
          <>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleLogout}
              className="text-blue-600 hover:underline"
            >
              Cerrar sesión e intentar con otra cuenta
            </button>
          </>
        ) : (
          <p className="text-gray-600">Cargando datos del usuario...</p>
        )}
      </div>
    );
  }

  // Usuario autenticado y con datos cargados - mostramos el dashboard correspondiente
  return (
    <div className="min-h-screen bg-gray-50">
      {user.perfil === "administrativo" && (
        <AdminDashboard user={user} onLogout={handleLogout} />
      )}
      {user.perfil === "coordinador" && (
        <CoordinatorDashboard user={user} onLogout={handleLogout} />
      )}
      {user.perfil === "operativo" && (
        <OperativeDashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}
