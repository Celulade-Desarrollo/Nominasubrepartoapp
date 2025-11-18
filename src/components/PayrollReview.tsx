import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface PayrollEntry {
  id: string;
  empleadoNombre: string;
  empleadoCedula: string;
  totalHoras: number;
  clientes: string[];
  status: 'pending' | 'approved' | 'rejected';
  fecha: string;
}

export function PayrollReview() {
  const [entries, setEntries] = useState<PayrollEntry[]>([
    {
      id: '1',
      empleadoNombre: 'Juan Pérez',
      empleadoCedula: '111222333',
      totalHoras: 40,
      clientes: ['Cliente A', 'Cliente B'],
      status: 'pending',
      fecha: '2025-10-29',
    },
    {
      id: '2',
      empleadoNombre: 'María González',
      empleadoCedula: '444555666',
      totalHoras: 35,
      clientes: ['Cliente A', 'Cliente C'],
      status: 'pending',
      fecha: '2025-10-29',
    },
    {
      id: '3',
      empleadoNombre: 'Carlos Rodríguez',
      empleadoCedula: '777888999',
      totalHoras: 38,
      clientes: ['Cliente B'],
      status: 'approved',
      fecha: '2025-10-28',
    },
  ]);

  const handleApprove = (id: string) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, status: 'approved' as const } : entry
    ));
  };

  const handleReject = (id: string) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, status: 'rejected' as const } : entry
    ));
  };

  const pendingCount = entries.filter(e => e.status === 'pending').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revisión y Confirmación de Nómina</CardTitle>
        <CardDescription>
          Revisa y confirma los valores ingresados por los empleados
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingCount > 0 && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Tienes {pendingCount} entrada{pendingCount !== 1 ? 's' : ''} pendiente{pendingCount !== 1 ? 's' : ''} por revisar
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {entries.map(entry => (
            <div key={entry.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-gray-900">{entry.empleadoNombre}</h3>
                  <p className="text-sm text-gray-500">
                    Cédula: {entry.empleadoCedula} • Fecha: {entry.fecha}
                  </p>
                </div>
                {entry.status === 'approved' ? (
                  <Badge className="bg-[#bbd531] text-[#303483] hover:bg-[#bbd531]/90">
                    Aprobado
                  </Badge>
                ) : entry.status === 'rejected' ? (
                  <Badge variant="destructive">
                    Rechazado
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    Pendiente
                  </Badge>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Total de Horas:</span>
                  <span className="text-gray-900">{entry.totalHoras}h</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-sm text-gray-600">Clientes:</span>
                  <div className="text-right">
                    {entry.clientes.map((cliente, idx) => (
                      <p key={idx} className="text-sm text-gray-900">{cliente}</p>
                    ))}
                  </div>
                </div>
              </div>

              {entry.status === 'pending' && (
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleApprove(entry.id)}
                    className="flex-1"
                    size="sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Aprobar
                  </Button>
                  <Button 
                    onClick={() => handleReject(entry.id)}
                    variant="destructive"
                    className="flex-1"
                    size="sm"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Rechazar
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {entries.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No hay entradas de nómina para revisar
          </p>
        )}
      </CardContent>
    </Card>
  );
}
