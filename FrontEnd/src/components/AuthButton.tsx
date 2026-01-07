// Componente para manejar login/logout con Microsoft
// Ubicación: src/components/AuthButton.jsx

import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "../auth/msalConfig";

function AuthButton() {
  // useMsal nos da acceso a la instancia de MSAL y las cuentas
  const { instance, accounts } = useMsal();

  // useIsAuthenticated nos dice si hay un usuario autenticado
  const isAuthenticated = useIsAuthenticated();

  const handleLogin = async () => {
    try {
      // loginPopup abre una ventana emergente para el login
      // También existe loginRedirect que redirige la página completa
      await instance.loginPopup(loginRequest);
    } catch (error) {
      console.error("Error durante el login:", error);
    }
  };

  const handleLogout = () => {
    // logoutPopup cierra la sesión en una ventana emergente
    // También existe logoutRedirect
    instance.logoutPopup();
  };

  // Si el usuario está autenticado, mostramos su info y botón de logout
  if (isAuthenticated) {
    // accounts[0] contiene la información del usuario autenticado
    const user = accounts[0];

    return (
      <div>
        <p>Bienvenido, {user.name}</p>
        <p>{user.username}</p>
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </div>
    );
  }

  // Si no está autenticado, mostramos el botón de login
  return <button onClick={handleLogin}>Iniciar Sesión con Microsoft</button>;
}

export default AuthButton;
