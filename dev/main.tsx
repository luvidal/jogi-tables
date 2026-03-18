import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import MonthlyTable from '../src/index'
import { DebtsTable, BoletasTable, TributarioTable } from '../src/index'
import type { RowData, Month, DebtEntry, BoletaMonth, TributarioEntry } from '../src'
import './tailwind.css'

// ============================================================================
// 12-month data for horizontal scroll testing
// ============================================================================

const MONTHS_12: Month[] = [
    { id: '2025-01', label: 'ENE' },
    { id: '2025-02', label: 'FEB' },
    { id: '2025-03', label: 'MAR' },
    { id: '2025-04', label: 'ABR' },
    { id: '2025-05', label: 'MAY' },
    { id: '2025-06', label: 'JUN' },
    { id: '2025-07', label: 'JUL' },
    { id: '2025-08', label: 'AGO' },
    { id: '2025-09', label: 'SEP' },
    { id: '2025-10', label: 'OCT' },
    { id: '2025-11', label: 'NOV' },
    { id: '2025-12', label: 'DIC' },
]

const MONTHS_3: Month[] = [
    { id: '2026-01', label: 'ENE' },
    { id: '2026-02', label: 'FEB' },
    { id: '2026-03', label: 'MAR' },
]

// Helper: random value between min and max
const rv = (min: number, max: number) => Math.round(min + Math.random() * (max - min))

// Generate values for all months
const allMonthValues = (min: number, max: number, sparse = false) => {
    const values: Record<string, number | null> = {}
    for (const m of MONTHS_12) {
        values[m.id] = sparse && Math.random() < 0.2 ? null : rv(min, max)
    }
    return values
}

// ============================================================================
// MonthlyTable data — 12 months, many rows
// ============================================================================

const INCOME_ROWS_12: RowData[] = [
    { id: 'r1', label: 'Sueldo Base', type: 'income', values: allMonthValues(1_400_000, 1_600_000) },
    { id: 'r2', label: 'Gratificación Legal', type: 'income', values: allMonthValues(200_000, 260_000) },
    { id: 'r3', label: 'Bono Producción', type: 'income', isVariable: true, values: allMonthValues(80_000, 200_000, true) },
    { id: 'r4', label: 'Horas Extra', type: 'income', isVariable: true, values: allMonthValues(50_000, 150_000, true) },
    { id: 'r5', label: 'Comisiones', type: 'income', isVariable: true, values: allMonthValues(100_000, 350_000, true) },
    { id: 'r6', label: 'Asignación Colación', type: 'income', values: allMonthValues(55_000, 65_000) },
    { id: 'r7', label: 'Asignación Movilización', type: 'income', values: allMonthValues(40_000, 50_000) },
    { id: 'r8', label: 'Bono Incentivo (asistencia)', type: 'income', values: allMonthValues(30_000, 45_000) },
    { id: 'r9', label: 'Viático', type: 'income', values: allMonthValues(20_000, 80_000, true) },
    { id: 'r10', label: 'Asignación Familiar', type: 'income', values: allMonthValues(10_000, 15_000) },
    { id: 'r11', label: 'AFP Cotización Obligatoria', type: 'deduction', values: allMonthValues(150_000, 210_000) },
    { id: 'r12', label: 'Salud (Isapre/Fonasa)', type: 'deduction', values: allMonthValues(90_000, 130_000) },
    { id: 'r13', label: 'Impuesto Único', type: 'deduction', values: allMonthValues(35_000, 55_000) },
    { id: 'r14', label: 'Seguro Cesantía', type: 'deduction', values: allMonthValues(7_000, 12_000) },
    { id: 'r15', label: 'Anticipo', type: 'deduction', values: allMonthValues(0, 200_000, true) },
    { id: 'r16', label: 'Préstamo Empresa', type: 'deduction', values: allMonthValues(40_000, 60_000) },
    { id: 'r17', label: 'Descuento Adm.', type: 'deduction', values: allMonthValues(5_000, 15_000) },
    { id: 'r18', label: 'Cuota Sindical', type: 'deduction', values: allMonthValues(8_000, 12_000) },
]

// ============================================================================
// BoletasTable data — 12 months
// ============================================================================

const BOLETA_MONTHS: BoletaMonth[] = MONTHS_12.map(m => ({
    periodo: m.id,
    mes: ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'][parseInt(m.id.split('-')[1]) - 1],
    hasData: Math.random() > 0.1,
    boletas: rv(2, 8),
    bruto: rv(800_000, 2_500_000),
    retencion: rv(80_000, 300_000),
    liquido: rv(600_000, 2_200_000),
}))

// ============================================================================
// DebtsTable data — many entries with late payments
// ============================================================================

const DEBT_ENTRIES: DebtEntry[] = [
    { id: 'd1', entidad: 'Banco Estado', tipo: 'Hipotecario', deuda_total: 85_000_000, vigente: 83_500_000, atraso_30_59: 1_200_000, atraso_60_89: 300_000 },
    { id: 'd2', entidad: 'Banco Chile', tipo: 'Consumo', deuda_total: 4_500_000, vigente: 4_200_000, atraso_30_59: 200_000, atraso_90_mas: 100_000 },
    { id: 'd3', entidad: 'Banco Santander', tipo: 'Automotriz', deuda_total: 12_000_000, vigente: 11_800_000 },
    { id: 'd4', entidad: 'Scotiabank', tipo: 'Consumo', deuda_total: 2_300_000, vigente: 2_100_000, atraso_30_59: 200_000 },
    { id: 'd5', entidad: 'Banco BCI', tipo: 'Comercial', deuda_total: 15_000_000, vigente: 14_500_000, atraso_60_89: 500_000 },
    { id: 'd6', entidad: 'Banco Falabella', tipo: 'Consumo', deuda_total: 1_800_000, vigente: 1_800_000 },
    { id: 'd7', entidad: 'Banco BICE', tipo: 'Leasing', deuda_total: 8_000_000, vigente: 7_500_000, atraso_90_mas: 500_000 },
    { id: 'd8', entidad: 'Cooperativa de Ahorro', tipo: 'Consumo', deuda_total: 900_000, vigente: 900_000 },
    { id: 'd9', entidad: 'Banco Security', tipo: 'Hipotecario', deuda_total: 45_000_000, vigente: 44_000_000 },
    { id: 'd10', entidad: 'Banco Itaú', tipo: 'Consumo', deuda_total: 3_200_000, vigente: 3_000_000, atraso_30_59: 200_000 },
]

// ============================================================================
// TributarioTable data — many entries
// ============================================================================

const TRIBUTARIO_ENTRIES: TributarioEntry[] = [
    { id: 't1', source: 'balance-anual', label: 'Balance 2024', empresa: 'Constructora Los Andes SpA', year: '2024', ingresos: 450_000_000, egresos: 380_000_000 },
    { id: 't2', source: 'balance-anual', label: 'Balance 2023', empresa: 'Constructora Los Andes SpA', year: '2023', ingresos: 380_000_000, egresos: 320_000_000 },
    { id: 't3', source: 'balance-anual', label: 'Balance 2024', empresa: 'Inversiones Montaña Ltda.', year: '2024', ingresos: 120_000_000, egresos: 95_000_000 },
    { id: 't4', source: 'carpeta-tributaria', label: 'Carpeta Tributaria', rut: '12.345.678-9', nombre: 'Juan Pérez', actividades: ['Construcción general', 'Venta al por mayor', 'Arriendo inmuebles'] },
    { id: 't5', source: 'carpeta-tributaria', label: 'Carpeta Tributaria', rut: '98.765.432-1', nombre: 'María González', actividades: ['Consultoría profesional'] },
]

// ============================================================================
// Boletas as MonthlyTable (how Situacion renders them) — 12 months
// ============================================================================

const BOLETA_MONTHLY_ROWS: RowData[] = [
    { id: 'b1', label: 'Honorario Bruto', type: 'income', values: allMonthValues(800_000, 2_500_000) },
    { id: 'b2', label: 'Otros Ingresos', type: 'income', values: allMonthValues(100_000, 500_000, true) },
    { id: 'b3', label: 'Retención (10.75%)', type: 'deduction', values: allMonthValues(80_000, 300_000) },
    { id: 'b4', label: 'Cotización Previsional', type: 'deduction', values: allMonthValues(60_000, 200_000) },
]

const INCOME_3MONTH_ROWS: RowData[] = INCOME_ROWS_12.slice(0, 6).map(r => ({
    ...r,
    values: Object.fromEntries(MONTHS_3.map(m => [m.id, rv(100_000, 2_000_000)])),
}))

// ============================================================================
// Scenarios
// ============================================================================

function Scenario({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
    return (
        <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">{title}</h2>
            {description
                ? <p className="text-xs text-gray-400 mb-3">{description}</p>
                : <div className="mb-3" />}
            {children}
        </div>
    )
}

// ── MonthlyTable scenarios ──

function IncomeTable12Months() {
    const [rows, setRows] = useState<RowData[]>(INCOME_ROWS_12)
    return (
        <MonthlyTable
            title="Renta Líquida Titular"
            months={MONTHS_12}
            rows={rows}
            onRowsChange={setRows}
            sections={[
                { type: 'income', placeholder: 'Agregar ingreso...' },
                { type: 'deduction', placeholder: 'Agregar descuento...' },
            ]}
            headerBg="bg-emerald-50"
            headerText="text-emerald-700"
            showVariableColumn
        />
    )
}

function IncomeTable3Months() {
    const [rows, setRows] = useState<RowData[]>(INCOME_3MONTH_ROWS)
    return (
        <MonthlyTable
            title="Renta (3 meses — no debería necesitar scroll)"
            months={MONTHS_3}
            rows={rows}
            onRowsChange={setRows}
            sections={[
                { type: 'income', placeholder: 'Agregar ingreso...' },
                { type: 'deduction', placeholder: 'Agregar descuento...' },
            ]}
            headerBg="bg-blue-50"
            headerText="text-blue-700"
        />
    )
}

function BoletasMonthly12() {
    const [rows, setRows] = useState<RowData[]>(BOLETA_MONTHLY_ROWS)
    return (
        <MonthlyTable
            title="Boletas 2025"
            months={MONTHS_12}
            rows={rows}
            onRowsChange={setRows}
            sections={[
                { type: 'income', placeholder: 'Agregar ingreso...' },
                { type: 'deduction', placeholder: 'Agregar descuento...' },
            ]}
            headerBg="bg-orange-50"
            headerText="text-orange-700"
        />
    )
}

function FlushMonthly12() {
    const [rows, setRows] = useState<RowData[]>(INCOME_ROWS_12.slice(0, 8))
    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
            <MonthlyTable
                title="Flush mode (inside accordion)"
                months={MONTHS_12}
                rows={rows}
                onRowsChange={setRows}
                sections={[
                    { type: 'income', placeholder: 'Agregar ingreso...' },
                    { type: 'deduction', placeholder: 'Agregar descuento...' },
                ]}
                headerBg="bg-purple-50"
                headerText="text-purple-700"
                flush
                showVariableColumn
            />
        </div>
    )
}

// ── BoletasTable scenario ──

function BoletasTableScenario() {
    return (
        <BoletasTable
            title="Boletas de Honorarios 2025"
            months={BOLETA_MONTHS}
            headerBg="bg-orange-50"
            headerText="text-orange-700"
        />
    )
}

// ── DebtsTable scenario ──

function DebtsTableScenario() {
    const [entries, setEntries] = useState<DebtEntry[]>(DEBT_ENTRIES)
    return (
        <DebtsTable
            title="Deudas Financieras"
            entries={entries}
            onEntriesChange={setEntries}
            headerBg="bg-rose-50"
            headerText="text-rose-700"
        />
    )
}

// ── TributarioTable scenario ──

function TributarioTableScenario() {
    return (
        <TributarioTable
            title="Información Tributaria"
            entries={TRIBUTARIO_ENTRIES}
            headerBg="bg-amber-50"
            headerText="text-amber-700"
        />
    )
}

// ============================================================================
// App
// ============================================================================

function App() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-xl font-bold text-gray-800 mb-2">MonthlyTable — Scroll & Alignment Tests</h1>
            <p className="text-sm text-gray-500 mb-8">
                Verify that header columns (month totals) scroll in sync with body columns.
                Scroll right on 12-month tables — headers and data must stay aligned.
            </p>

            <Scenario title="1. MonthlyTable — 12 months (scroll test)" description="18 rows across 12 months. Header should scroll with body. Try scrolling right.">
                <IncomeTable12Months />
            </Scenario>

            <Scenario title="2. MonthlyTable — 3 months (no scroll needed)" description="Baseline: no horizontal scroll needed. Should render normally.">
                <IncomeTable3Months />
            </Scenario>

            <Scenario title="3. Boletas as MonthlyTable — 12 months" description="Boletas section in Situacion uses MonthlyTable. 4 rows across 12 months.">
                <BoletasMonthly12 />
            </Scenario>

            <Scenario title="4. MonthlyTable flush mode — 12 months" description="flush=true, inside a parent container (like DocSections accordion). Same scroll test.">
                <FlushMonthly12 />
            </Scenario>

            <Scenario title="5. BoletasTable — 12 months vertical" description="BoletasTable has vertical layout (months as rows). Header is a simple bar, no column alignment issue.">
                <BoletasTableScenario />
            </Scenario>

            <Scenario title="6. DebtsTable — many entries with late payments" description="10 debt entries with atraso columns. Header columns should align with body.">
                <DebtsTableScenario />
            </Scenario>

            <Scenario title="7. TributarioTable — mixed entries" description="Balance anual + carpeta tributaria entries. Header columns should align with body.">
                <TributarioTableScenario />
            </Scenario>
        </div>
    )
}

createRoot(document.getElementById('root')!).render(<App />)
