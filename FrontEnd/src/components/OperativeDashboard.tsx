import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { LogOut, Clock, CheckCircle2 } from 'lucide-react';
import { CalendarHoursEntry } from './CalendarHoursEntry';
import { CalendarInstructions } from './CalendarInstructions';
import { HoursHistoryByDate } from './HoursHistoryByDate';
import { Alert, AlertDescription } from './ui/alert';
import type { User } from '../App';

interface OperativeDashboardProps {
  user: User;
  onLogout: () => void;
}

export interface SimpleHoursRecord {
  clienteId: string;
  clienteNombre: string;
  elementoPEP: string;
  horas: number;
  fecha: string;
  areaCliente?: string;
}

export function OperativeDashboard({ user, onLogout }: OperativeDashboardProps) {
  const [hoursRecords, setHoursRecords] = useState<SimpleHoursRecord[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock data - en producción vendría del backend
  const mockClientes = [
    { id: 'C001', nombre: 'Cliente A', elementoPEP: 'PEP-001', areas: ['Desarrollo', 'Soporte'] },
    { id: 'C002', nombre: 'Cliente B', elementoPEP: 'PEP-002', areas: ['Consultoría', 'Capacitación'] },
    { id: 'C003', nombre: 'Cliente C', elementoPEP: 'PEP-003', areas: ['Desarrollo', 'Consultoría', 'Soporte'] },
    { id: 'C004', nombre: 'Cliente D', elementoPEP: 'PEP-004', areas: ['Mantenimiento', 'Soporte'] },
  ];

  const handleSaveHours = (clienteId: string, horas: number, fecha: Date, areaCliente?: string) => {
    const cliente = mockClientes.find(c => c.id === clienteId);
    if (cliente) {
      const newRecord: SimpleHoursRecord = {
        clienteId,
        clienteNombre: cliente.nombre,
        elementoPEP: cliente.elementoPEP,
        horas,
        fecha: fecha.toISOString().split('T')[0],
        areaCliente,
      };
      setHoursRecords([...hoursRecords, newRecord]);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const totalHorasHoy = hoursRecords
    .filter(r => r.fecha === new Date().toISOString().split('T')[0])
    .reduce((sum, record) => sum + record.horas, 0);

  const totalHoras = hoursRecords.reduce((sum, record) => sum + record.horas, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900">Registro de Horas</h1>
              <p className="text-sm text-gray-500">Bienvenido, {user.nombre}</p>
            </div>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Success Message */}
          {showSuccess && (
            <Alert className="bg-[#bbd531]/20 border-[#bbd531]">
              <CheckCircle2 className="h-4 w-4 text-[#303483]" />
              <AlertDescription className="text-[#303483]">
                Horas registradas correctamente
              </AlertDescription>
            </Alert>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Horas Hoy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-[#303483] mr-3" />
                  <span className="text-3xl">{totalHorasHoy}h</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Total Horas Registradas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-[#bbd531] mr-3" />
                  <span className="text-3xl">{totalHoras}h</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Instructions */}
          <CalendarInstructions />

          {/* Hours Entry */}
          <CalendarHoursEntry 
            clientes={mockClientes}
            onSave={handleSaveHours}
            existingRecords={hoursRecords}
          />

          {/* Recent Records */}
          {hoursRecords.length > 0 && (
            <HoursHistoryByDate records={hoursRecords} />
          )}
        </div>
      </main>
    </div>
  );
}
