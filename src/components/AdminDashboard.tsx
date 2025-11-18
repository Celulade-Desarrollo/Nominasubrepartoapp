import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LogOut, Upload, FileSpreadsheet, Calculator } from 'lucide-react';
import { ExcelUpload } from './ExcelUpload';
import { QuickAdd } from './QuickAdd';
import { PayrollDistribution } from './PayrollDistribution';
import { PayrollClosure } from './PayrollClosure';
import type { User } from '../App';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export interface Employee {
  cedula: string;
  nombre: string;
  unidadNegocio: string;
  salarioBruto: number;
}

export interface Cliente {
  id: string;
  nombre: string;
  elementoPEP: string;
  areas: string[]; // Áreas o procesos del cliente
}

export interface HorasTrabajadas {
  empleadoCedula: string;
  clienteId: string;
  horas: number;
  fecha: string;
  areaCliente?: string; // Área del cliente o proceso
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [horasTrabajadas, setHorasTrabajadas] = useState<HorasTrabajadas[]>([]);

  const handleExcelUpload = (data: Employee[]) => {
    setEmployees(data);
  };

  const handleAddEmployee = (employee: Employee) => {
    setEmployees([...employees, employee]);
  };

  const handleAddCliente = (cliente: Cliente) => {
    setClientes([...clientes, cliente]);
  };

  const handleAddHoras = (horas: HorasTrabajadas) => {
    setHorasTrabajadas([...horasTrabajadas, horas]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900">Panel Administrativo</h1>
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
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload">
              <Upload className="w-4 h-4 mr-2" />
              Cargar Datos
            </TabsTrigger>
            <TabsTrigger value="clients">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Clientes
            </TabsTrigger>
            <TabsTrigger value="distribution">
              <Calculator className="w-4 h-4 mr-2" />
              Distribución
            </TabsTrigger>
            <TabsTrigger value="closure">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Cierre
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cargar Archivo Maestro</CardTitle>
                <CardDescription>
                  Sube el archivo Excel con la información de empleados y nómina
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ExcelUpload onUpload={handleExcelUpload} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Agregado Rápido</CardTitle>
                <CardDescription>
                  Agrega empleados manualmente de forma rápida
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QuickAdd onAdd={handleAddEmployee} />
              </CardContent>
            </Card>

            {employees.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Empleados Cargados ({employees.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Cédula</th>
                          <th className="text-left p-2">Nombre</th>
                          <th className="text-left p-2">Unidad de Negocio</th>
                          <th className="text-left p-2">Salario Bruto</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.map((emp, idx) => (
                          <tr key={idx} className="border-b">
                            <td className="p-2">{emp.cedula}</td>
                            <td className="p-2">{emp.nombre}</td>
                            <td className="p-2">{emp.unidadNegocio}</td>
                            <td className="p-2">${emp.salarioBruto.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="clients">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Clientes y Elementos PEP</CardTitle>
                <CardDescription>
                  Administra clientes y sus elementos PEP
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <QuickAdd 
                  onAdd={handleAddCliente} 
                  type="cliente"
                />

                {clientes.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">ID</th>
                          <th className="text-left p-2">Nombre Cliente</th>
                          <th className="text-left p-2">Elemento PEP</th>
                          <th className="text-left p-2">Áreas/Procesos</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clientes.map((cliente, idx) => (
                          <tr key={idx} className="border-b">
                            <td className="p-2">{cliente.id}</td>
                            <td className="p-2">{cliente.nombre}</td>
                            <td className="p-2">{cliente.elementoPEP}</td>
                            <td className="p-2">
                              <div className="flex flex-wrap gap-1">
                                {cliente.areas.map((area, aIdx) => (
                                  <span key={aIdx} className="inline-flex items-center px-2 py-1 rounded-md bg-[#303483]/10 text-[#303483] text-sm">
                                    {area}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="distribution">
            <PayrollDistribution 
              employees={employees}
              clientes={clientes}
              horasTrabajadas={horasTrabajadas}
            />
          </TabsContent>

          <TabsContent value="closure">
            <PayrollClosure 
              employees={employees}
              clientes={clientes}
              horasTrabajadas={horasTrabajadas}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
