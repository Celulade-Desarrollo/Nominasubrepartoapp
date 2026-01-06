import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Download, Loader2, Calendar, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { reportesAPI, companiesAPI, usuariosAPI, type Reporte, type Company, type Usuario } from '../services/api';

interface ReportSummary {
    cliente: string;
    nombre_company: string;
    elemento_pep: string;
    total_horas: number;
    empleados: {
        documento_id: number;
        nombre: string;
        horas: number;
    }[];
}

export function ReportDownload() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [preview, setPreview] = useState<ReportSummary[]>([]);
    const [showPreview, setShowPreview] = useState(false);

    // Set default dates (current month)
    useEffect(() => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        setDateFrom(firstDay.toISOString().split('T')[0]);
        setDateTo(lastDay.toISOString().split('T')[0]);
    }, []);

    const generateReport = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch all required data
            const [reportes, companies, usuarios] = await Promise.all([
                reportesAPI.getAll(),
                companiesAPI.getAll(),
                usuariosAPI.getAll()
            ]);

            // Filter reports by date range and only approved ones (aprobado === 1)
            const filteredReportes = reportes.filter((r: Reporte) => {
                const reportDate = r.fecha_trabajada ? new Date(r.fecha_trabajada) : new Date(r.created_at);
                const from = new Date(dateFrom);
                const to = new Date(dateTo);
                to.setHours(23, 59, 59, 999);

                return reportDate >= from && reportDate <= to && r.aprobado === 1;
            });

            if (filteredReportes.length === 0) {
                setError('No hay reportes aprobados en el rango de fechas seleccionado');
                setPreview([]);
                setShowPreview(false);
                return;
            }

            // Group by company
            const reportsByCompany = new Map<string, Reporte[]>();

            filteredReportes.forEach((reporte: Reporte) => {
                const key = reporte.cliente;
                if (!reportsByCompany.has(key)) {
                    reportsByCompany.set(key, []);
                }
                reportsByCompany.get(key)!.push(reporte);
            });

            // Build summary
            const summary: ReportSummary[] = [];

            reportsByCompany.forEach((reportes, clienteId) => {
                const company = companies.find((c: Company) => c.elemento_pep === clienteId);

                // Group by employee
                const employeeHours = new Map<number, { nombre: string; horas: number }>();

                reportes.forEach((r: Reporte) => {
                    const docId = r.documento_id;
                    const usuario = usuarios.find((u: Usuario) => u.documento_id === docId);

                    if (!employeeHours.has(docId)) {
                        employeeHours.set(docId, {
                            nombre: usuario?.nombre_usuario || `Empleado ${docId}`,
                            horas: 0
                        });
                    }
                    employeeHours.get(docId)!.horas += r.horas;
                });

                const empleados = Array.from(employeeHours.entries()).map(([docId, data]) => ({
                    documento_id: docId,
                    nombre: data.nombre,
                    horas: data.horas
                }));

                const totalHoras = empleados.reduce((sum, e) => sum + e.horas, 0);

                summary.push({
                    cliente: clienteId,
                    nombre_company: company?.nombre_company || clienteId,
                    elemento_pep: company?.elemento_pep || clienteId,
                    total_horas: totalHoras,
                    empleados
                });
            });

            setPreview(summary);
            setShowPreview(true);

        } catch (err) {
            console.error('Error generating report:', err);
            setError('Error al generar el reporte');
        } finally {
            setLoading(false);
        }
    };

    const downloadCSV = () => {
        if (preview.length === 0) return;

        // Build CSV content
        const lines: string[] = [];

        // Header
        lines.push('Empresa,Elemento PEP,Total Horas,Documento Empleado,Nombre Empleado,Horas Empleado');

        // Data rows
        preview.forEach(company => {
            company.empleados.forEach((emp, idx) => {
                lines.push([
                    idx === 0 ? `"${company.nombre_company}"` : '',
                    idx === 0 ? `"${company.elemento_pep}"` : '',
                    idx === 0 ? company.total_horas.toString() : '',
                    emp.documento_id.toString(),
                    `"${emp.nombre}"`,
                    emp.horas.toString()
                ].join(','));
            });
            // Add empty row between companies
            lines.push('');
        });

        // Add totals
        const grandTotal = preview.reduce((sum, c) => sum + c.total_horas, 0);
        lines.push(`TOTAL GENERAL,,,,,${grandTotal}`);

        const csvContent = lines.join('\n');
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `reporte_horas_${dateFrom}_a_${dateTo}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            {/* Date Range Selection */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[#303483]" />
                        Seleccionar Período
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4 items-end">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Desde</label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="px-3 py-2 border rounded-md"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Hasta</label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="px-3 py-2 border rounded-md"
                            />
                        </div>
                        <Button
                            onClick={generateReport}
                            disabled={loading || !dateFrom || !dateTo}
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <FileSpreadsheet className="w-4 h-4 mr-2" />
                            )}
                            Generar Reporte
                        </Button>
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-center gap-2 text-yellow-800">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Preview and Download */}
            {showPreview && preview.length > 0 && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Vista Previa del Reporte</CardTitle>
                        <Button onClick={downloadCSV} className="bg-[#303483] hover:bg-[#252a6b]">
                            <Download className="w-4 h-4 mr-2" />
                            Descargar CSV
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="text-left p-3 font-semibold">Empresa</th>
                                        <th className="text-left p-3 font-semibold">Elemento PEP</th>
                                        <th className="text-right p-3 font-semibold">Total Horas</th>
                                        <th className="text-left p-3 font-semibold">Documento</th>
                                        <th className="text-left p-3 font-semibold">Empleado</th>
                                        <th className="text-right p-3 font-semibold">Horas</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {preview.map((company, companyIdx) => (
                                        company.empleados.map((emp, empIdx) => (
                                            <tr
                                                key={`${companyIdx}-${empIdx}`}
                                                className={`border-b ${empIdx === 0 ? 'bg-[#bbd531]/10' : ''}`}
                                            >
                                                <td className="p-3 font-medium">
                                                    {empIdx === 0 ? company.nombre_company : ''}
                                                </td>
                                                <td className="p-3 text-gray-600">
                                                    {empIdx === 0 ? company.elemento_pep : ''}
                                                </td>
                                                <td className="p-3 text-right font-semibold text-[#303483]">
                                                    {empIdx === 0 ? company.total_horas : ''}
                                                </td>
                                                <td className="p-3">{emp.documento_id}</td>
                                                <td className="p-3">{emp.nombre}</td>
                                                <td className="p-3 text-right">{emp.horas}</td>
                                            </tr>
                                        ))
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-[#303483] text-white">
                                        <td colSpan={2} className="p-3 font-bold">TOTAL GENERAL</td>
                                        <td className="p-3 text-right font-bold">
                                            {preview.reduce((sum, c) => sum + c.total_horas, 0)}
                                        </td>
                                        <td colSpan={3}></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <p className="mt-4 text-sm text-gray-500">
                            * Solo se incluyen reportes aprobados en el período seleccionado
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
