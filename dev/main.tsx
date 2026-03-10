import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import MonthlyTable from '../src/index'
import type { RowData, Month } from '../src'
import './tailwind.css'

// ============================================================================
// Mock data
// ============================================================================

const MONTHS: Month[] = [
    { id: '2026-01', label: 'ENE' },
    { id: '2026-02', label: 'FEB' },
    { id: '2026-03', label: 'MAR' },
]

const INITIAL_ROWS: RowData[] = [
    {
        id: 'r1',
        label: 'Sueldo Base',
        type: 'income',
        values: { '2026-01': 1_500_000, '2026-02': 1_500_000, '2026-03': 1_550_000 },
    },
    {
        id: 'r2',
        label: 'Gratificación',
        type: 'income',
        values: { '2026-01': 250_000, '2026-02': 250_000, '2026-03': 250_000 },
    },
    {
        id: 'r3',
        label: 'Bono Producción',
        type: 'income',
        isVariable: true,
        values: { '2026-01': 120_000, '2026-02': null, '2026-03': 180_000 },
    },
    {
        id: 'r4',
        label: 'Horas Extra',
        type: 'income',
        isVariable: true,
        values: { '2026-01': 85_000, '2026-02': 120_000, '2026-03': null },
    },
    {
        id: 'r5',
        label: 'Comisiones',
        type: 'income',
        isVariable: true,
        values: { '2026-01': 200_000, '2026-02': 150_000, '2026-03': 310_000 },
    },
    {
        id: 'r6',
        label: 'Asignación Colación',
        type: 'income',
        values: { '2026-01': 60_000, '2026-02': 60_000, '2026-03': 60_000 },
    },
    {
        id: 'r7',
        label: 'AFP',
        type: 'deduction',
        values: { '2026-01': 187_500, '2026-02': 187_500, '2026-03': 193_750 },
    },
    {
        id: 'r8',
        label: 'Salud',
        type: 'deduction',
        values: { '2026-01': 105_000, '2026-02': 105_000, '2026-03': 108_500 },
    },
    {
        id: 'r9',
        label: 'Impuesto Único',
        type: 'deduction',
        values: { '2026-01': 45_000, '2026-02': 42_000, '2026-03': 48_000 },
    },
    {
        id: 'r10',
        label: 'Seguro Cesantía',
        type: 'deduction',
        values: { '2026-01': 9_000, '2026-02': 9_000, '2026-03': 9_300 },
    },
    {
        id: 'r11',
        label: 'Anticipo',
        type: 'deduction',
        values: { '2026-01': null, '2026-02': 200_000, '2026-03': null },
    },
    {
        id: 'r12',
        label: 'Préstamo Empresa',
        type: 'deduction',
        values: { '2026-01': 50_000, '2026-02': 50_000, '2026-03': 50_000 },
    },
]

const DEBT_ROWS: RowData[] = [
    {
        id: 'd1',
        label: 'Crédito Hipotecario',
        type: 'debt',
        values: { '2026-01': 450_000, '2026-02': 450_000, '2026-03': 450_000 },
    },
    {
        id: 'd2',
        label: 'Crédito Automotriz',
        type: 'debt',
        values: { '2026-01': 180_000, '2026-02': 180_000, '2026-03': 180_000 },
    },
]

const EMPTY_ROWS: RowData[] = []

// ============================================================================
// Scenarios
// ============================================================================

function Scenario({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">{title}</h2>
            {children}
        </div>
    )
}

function IncomeTable() {
    const [rows, setRows] = useState<RowData[]>(INITIAL_ROWS)
    return (
        <MonthlyTable
            title="Renta Líquida Titular"
            months={MONTHS}
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

function DebtTable() {
    const [rows, setRows] = useState<RowData[]>(DEBT_ROWS)
    return (
        <MonthlyTable
            title="Deudas Mensuales"
            months={MONTHS}
            rows={rows}
            onRowsChange={setRows}
            sections={[
                { type: 'debt', placeholder: 'Agregar deuda...' },
            ]}
            headerBg="bg-red-50"
            headerText="text-red-700"
        />
    )
}

function EmptyTable() {
    const [rows, setRows] = useState<RowData[]>(EMPTY_ROWS)
    return (
        <MonthlyTable
            title="Tabla Vacía"
            months={MONTHS}
            rows={rows}
            onRowsChange={setRows}
            headerBg="bg-gray-100"
            headerText="text-gray-700"
        />
    )
}

function ReadOnlyTable() {
    return (
        <MonthlyTable
            title="Renta Codeudor (solo lectura)"
            months={MONTHS}
            rows={INITIAL_ROWS.slice(0, 3)}
            onRowsChange={() => {}}
            sections={[
                { type: 'income', placeholder: 'Agregar ingreso...' },
            ]}
            headerBg="bg-blue-50"
            headerText="text-blue-700"
            forceExpanded
        />
    )
}

function AutoMonthsTable() {
    const [rows, setRows] = useState<RowData[]>([
        { id: 'a1', label: 'Ingreso 1', type: 'add', values: {} },
        { id: 'a2', label: 'Gasto 1', type: 'subtract', values: {} },
    ])
    return (
        <MonthlyTable
            title="Auto-generar 3 meses"
            months={3}
            rows={rows}
            onRowsChange={setRows}
        />
    )
}

// ============================================================================
// App
// ============================================================================

function App() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-xl font-bold text-gray-800 mb-6">MonthlyTable — Visual Test Page</h1>
            <p className="text-sm text-gray-500 mb-8">
                Interactive test scenarios. Try: editing cells, adding rows, selecting &amp; grouping,
                dragging to reorder, keyboard navigation (click a cell, then arrow keys).
            </p>

            <Scenario title="1. Income + Deductions (2 sections, subtotals)">
                <IncomeTable />
            </Scenario>

            <Scenario title="2. Debts (single section, no subtotals)">
                <DebtTable />
            </Scenario>

            <Scenario title="3. Empty table (add rows from scratch)">
                <EmptyTable />
            </Scenario>

            <Scenario title="4. Read-only / Force expanded (print mode)">
                <ReadOnlyTable />
            </Scenario>

            <Scenario title="5. Auto-generate months (months={3})">
                <AutoMonthsTable />
            </Scenario>
        </div>
    )
}

createRoot(document.getElementById('root')!).render(<App />)
