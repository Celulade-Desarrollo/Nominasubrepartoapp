import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { LogOut, Clock, CheckCircle } from 'lucide-react';
import { CalendarHoursEntry } from './CalendarHoursEntry';
import { CalendarInstructions } from './CalendarInstructions';
import { HoursHistoryByDate } from './HoursHistoryByDate';
import { PayrollReview } from './PayrollReview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import type { User } from '../App';

interface CoordinatorDashboardProps {
  user: User;
  onLogout: () => void;
}

export interface HoursRecord {
  clienteId: string;
  clienteNombre: string;
  horas: number;
  fecha: string;
  areaCliente?: string;
}

export function CoordinatorDashboard({ user, onLogout }: CoordinatorDashboardProps) {
  const [hoursRecords, setHoursRecords] = useState<HoursRecord[]>([]);

  const mockClientes = [
    { id: 'C001', nombre: 'Cliente A', elementoPEP: 'PEP-001', areas: ['Desarrollo', 'Soporte'] },
    { id: 'C002', nombre: 'Cliente B', elementoPEP: 'PEP-002', areas: ['Consultoría', 'Capacitación'] },
    { id: 'C003', nombre: 'Cliente C', elementoPEP: 'PEP-003', areas: ['Desarrollo', 'Consultoría', 'Soporte'] },
  ];

  const handleSaveHours = (clienteId: string, horas: number, fecha: Date, areaCliente?: string) => {
    const cliente = mockClientes.find(c => c.id === clienteId);
    if (cliente) {
      const newRecord: HoursRecord = {
        clienteId,
        clienteNombre: cliente.nombre,
        horas,
        fecha: fecha.toISOString().split('T')[0],
        areaCliente,
      };
      setHoursRecords([...hoursRecords, newRecord]);
    }
  };

  const totalHoras = hoursRecords.reduce((sum, record) => sum + record.horas, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900">Panel de Coordinador</h1>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="hours" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="hours">
              <Clock className="w-4 h-4 mr-2" />
              Mis Horas
            </TabsTrigger>
            <TabsTrigger value="review">
              <CheckCircle className="w-4 h-4 mr-2" />
              Revisar Nómina
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hours" className="space-y-6">
            <CalendarInstructions />
            
            <CalendarHoursEntry 
              clientes={mockClientes}
              onSave={handleSaveHours}
              existingRecords={hoursRecords}
            />

            {hoursRecords.length > 0 && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Resumen Total</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 bg-[#bbd531]/10 border border-[#bbd531]/30 rounded-lg">
                      <div className="flex items-center">
                        <Clock className="w-8 h-8 text-[#303483] mr-3" />
                        <span className="text-gray-700">Total de horas registradas</span>
                      </div>
                      <span className="text-2xl text-[#303483]">{totalHoras}h</span>
                    </div>
                  </CardContent>
                </Card>
                <HoursHistoryByDate records={hoursRecords} />
              </>
            )}
          </TabsContent>

          <TabsContent value="review">
            <PayrollReview />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
