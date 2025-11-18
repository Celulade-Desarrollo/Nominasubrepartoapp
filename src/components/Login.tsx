import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { LogIn } from 'lucide-react';

interface LoginProps {
  onLogin: (cedula: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [cedula, setCedula] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cedula.trim()) {
      onLogin(cedula.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#303483] to-[#1f2456] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-[#303483] rounded-full flex items-center justify-center">
              <LogIn className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-center">
            Sistema de Subreparto de Nómina
          </CardTitle>
          <CardDescription className="text-center">
            Ingrese su cédula para acceder al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cedula">Cédula</Label>
              <Input
                id="cedula"
                type="text"
                placeholder="Ingrese su cédula"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Iniciar Sesión
            </Button>
          </form>

          <div className="mt-6 p-4 bg-[#bbd531]/10 border border-[#bbd531]/30 rounded-lg">
            <p className="text-xs text-gray-600 mb-2">Usuarios de prueba:</p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• 123456 - Administrativo</li>
              <li>• 234567 - Coordinador</li>
              <li>• 345678 - Operativo</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
