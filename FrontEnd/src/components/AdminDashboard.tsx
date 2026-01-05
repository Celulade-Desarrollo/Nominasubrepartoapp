import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LogOut, Upload, FileSpreadsheet, Calculator, Loader2 } from 'lucide-react';
import { ExcelUpload } from './ExcelUpload';
import { QuickAdd } from './QuickAdd';
import { PayrollDistribution } from './PayrollDistribution';
import { PayrollClosure } from './PayrollClosure';
import { ClientesManager } from './ClientesManager';
import { companiesAPI, areasEnCompanyAPI, type Company } from '../services/api';
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
  areas: string[];
}

export interface HorasTrabajadas {
  empleadoCedula: string;
  clienteId: string;
  horas: number;
  fecha: string;
  areaCliente?: string;
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [horasTrabajadas, setHorasTrabajadas] = useState<HorasTrabajadas[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(true);

  // Load clients from API on mount
  useEffect(() => {
    loadClientesFromAPI();
  }, []);

  const loadClientesFromAPI = async () => {
    try {
      setLoadingClientes(true);
      const companies = await companiesAPI.getAll();

      // Convert API companies to Cliente format (with areas)
      const clientesWithAreas: Cliente[] = await Promise.all(
        companies.map(async (company) => {
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
    } catch (err) {
      console.error('Error loading clients:', err);
    } finally {
      setLoadingClientes(false);
    }
  };

  const handleExcelUpload = (data: Employee[]) => {
    setEmployees(data);
  };

  const handleAddEmployee = (employee: Employee) => {
    setEmployees([...employees, employee]);
  };

  const handleAddHoras = (horas: HorasTrabajadas) => {
    setHorasTrabajadas([...horasTrabajadas, horas]);
  };

  const handleCompanyChange = () => {
    // Reload clients when a company is modified
    loadClientesFromAPI();
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
                <QuickAdd onAdd={handleAddEmployee as (data: Employee | Cliente) => void} />
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
                <CardTitle>Gestión de Clientes y Áreas</CardTitle>
                <CardDescription>
                  Administra compañías clientes, elementos PEP y áreas de trabajo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClientesManager onCompanySelect={handleCompanyChange} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="distribution">
            {loadingClientes ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-[#303483]" />
                <span className="ml-2">Cargando datos...</span>
              </div>
            ) : (
              <PayrollDistribution
                employees={employees}
                clientes={clientes}
                horasTrabajadas={horasTrabajadas}
              />
            )}
          </TabsContent>

          <TabsContent value="closure">
            {loadingClientes ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-[#303483]" />
                <span className="ml-2">Cargando datos...</span>
              </div>
            ) : (
              <PayrollClosure
                employees={employees}
                clientes={clientes}
                horasTrabajadas={horasTrabajadas}
              />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

