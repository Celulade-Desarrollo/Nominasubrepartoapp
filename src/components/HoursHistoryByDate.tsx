import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

interface HoursRecord {
  clienteId: string;
  clienteNombre: string;
  elementoPEP?: string;
  horas: number;
  fecha: string;
  areaCliente?: string;
}

interface HoursHistoryByDateProps {
  records: HoursRecord[];
}

export function HoursHistoryByDate({ records }: HoursHistoryByDateProps) {
  // Agrupar registros por fecha
  const groupedByDate = records.reduce((acc, record) => {
    const fecha = record.fecha;
    if (!acc[fecha]) {
      acc[fecha] = [];
    }
    acc[fecha].push(record);
    return acc;
  }, {} as Record<string, HoursRecord[]>);

  // Ordenar fechas de más reciente a más antigua
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  if (records.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">No hay registros de horas</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial por Fecha</CardTitle>
        <CardDescription>
          Horas registradas organizadas por día
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedDates.map((fecha) => {
            const dayRecords = groupedByDate[fecha];
            const totalHorasDelDia = dayRecords.reduce((sum, r) => sum + r.horas, 0);
            const formattedDate = format(new Date(fecha + 'T00:00:00'), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });

            return (
              <div key={fecha} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3 pb-3 border-b">
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 text-[#303483] mr-2" />
                    <h3 className="capitalize text-gray-900">{formattedDate}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-[#303483]">{totalHorasDelDia}h</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {dayRecords.map((record, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-gray-900">{record.clienteNombre}</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {record.elementoPEP && (
                            <span className="text-sm text-gray-500">{record.elementoPEP}</span>
                          )}
                          {record.areaCliente && (
                            <span className="text-sm text-[#303483] bg-[#303483]/10 px-2 py-0.5 rounded">
                              {record.areaCliente}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-900">{record.horas}h</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
