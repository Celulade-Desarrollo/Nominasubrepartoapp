import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { LogOut, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { CalendarHoursEntry } from './CalendarHoursEntry';
import { CalendarInstructions } from './CalendarInstructions';
import { HoursHistoryByDate } from './HoursHistoryByDate';
import { Alert, AlertDescription } from './ui/alert';
import { companiesAPI, areasEnCompanyAPI, reportesAPI } from '../services/api';
import type { User } from '../App';

interface OperativeDashboardProps {
  user: User;
  onLogout: () => void;
}

export interface SimpleHoursRecord {
  id?: number;
  clienteId: string;
  clienteNombre: string;
  elementoPEP: string;
  horas: number;
  fecha: string;
  areaCliente?: string;
  documentoId?: number;
}

interface Cliente {
  id: string;
  nombre: string;
  elementoPEP: string;
  areas: string[];
}

export function OperativeDashboard({ user, onLogout }: OperativeDashboardProps) {
  const [hoursRecords, setHoursRecords] = useState<SimpleHoursRecord[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load companies and their areas
      const companiesData = await companiesAPI.getAll();

      const clientesWithAreas: Cliente[] = await Promise.all(
        companiesData.map(async (company) => {
          const areasData = await areasEnCompanyAPI.getByCompany(company.id);
          return {
            id: company.id,
            nombre: company.nombre_company,
            elementoPEP: company.elemento_pep,
            areas: areasData.map(a => a.nombre_area || ''),
          };
        })
      );

      setClientes(clientesWithAreas);

      // Load existing reports for this user
      if (user.cedula) {
        const documentoId = parseInt(user.cedula);
        const reportes = await reportesAPI.getByDocumento(documentoId);

        const mappedRecords: SimpleHoursRecord[] = reportes.map(r => ({
          id: r.id,
          clienteId: r.cliente,
          clienteNombre: r.nombre_company || 'Desconocido',
          elementoPEP: '', // We would need to join this or fetch it, currently optional in UI
          horas: parseFloat(r.horas.toString()),
          // Use fecha_trabajada if available, otherwise fallback to created_at
          fecha: r.fecha_trabajada ? new Date(r.fecha_trabajada).toISOString().split('T')[0] : new Date(r.created_at).toISOString().split('T')[0],
          areaCliente: r.nombre_area,
          documentoId: r.documento_id
        }));

        setHoursRecords(mappedRecords);
      }

    } catch (err) {
      console.error('Error loading data:', err);
      setError('Error al cargar datos del servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHours = async (clienteId: string, horas: number, fecha: Date, areaCliente?: string) => {
    try {
      // clienteId receives the elementoPEP now
      const cliente = clientes.find(c => c.elementoPEP === clienteId);
      if (!cliente) return;

      // Find area ID based on name (reverse lookup needed because select uses names)
      // Ideally we should use IDs everywhere, but for now we look it up
      // We need to fetch the specific area-company relation to get the ID
      // This is a bit inefficient, in a refactor we should pass IDs
      let areaTrabajoId = 0;

      if (areaCliente) {
        // We need the UUID to fetch areas, so we use cliente.id
        const areas = await areasEnCompanyAPI.getByCompany(cliente.id);
        const foundArea = areas.find(a => a.nombre_area === areaCliente);
        if (foundArea) {
          areaTrabajoId = foundArea.area_cliente; // ID from the relation table
        }
      }

      await reportesAPI.create({
        horas: horas,
        fecha_trabajada: format(fecha, 'yyyy-MM-dd'),
        cliente: clienteId,
        documento_id: parseInt(user.cedula),
        area_trabajo: areaTrabajoId
      });

      // Update local state
      const newRecord: SimpleHoursRecord = {
        clienteId,
        clienteNombre: cliente.nombre,
        elementoPEP: '', // Keep PEP hidden for operatives as requested
        horas,
        fecha: fecha.toISOString().split('T')[0],
        areaCliente,
      };

      setHoursRecords([...hoursRecords, newRecord]);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

    } catch (err) {
      console.error('Error saving hours:', err);
      setError('Error al guardar el reporte');
    }
  };

  const totalHorasHoy = hoursRecords
    .filter(r => r.fecha === new Date().toISOString().split('T')[0])
    .reduce((sum, record) => sum + record.horas, 0);

  const totalHoras = hoursRecords.reduce((sum, record) => sum + record.horas, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#303483]" />
        <span className="ml-2 text-gray-600">Cargando datos...</span>
      </div>
    );
  }

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
          {/* Messages */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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
            clientes={clientes}
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
