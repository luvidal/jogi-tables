import { describe, it, expect } from 'vitest'
import React from 'react'
import { render } from '@testing-library/react'
import MonthlyTable from '../src/monthly'
import DebtsTable from '../src/debts'
import TributarioTable from '../src/tributario'
import BoletasTable from '../src/boletas'
import type { RowData, Month } from '../src/monthly/types'
import type { DebtEntry } from '../src/debts'
import type { TributarioEntry } from '../src/tributario'
import type { BoletaMonth } from '../src/boletas'

// ============================================================================
// Test data — 12 months with lots of rows
// ============================================================================

const MONTHS_12: Month[] = Array.from({ length: 12 }, (_, i) => ({
    id: `2025-${String(i + 1).padStart(2, '0')}`,
    label: ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'][i],
}))

const MONTHS_6: Month[] = MONTHS_12.slice(0, 6)

const makeValues = (months: Month[], base: number) =>
    Object.fromEntries(months.map(m => [m.id, base + Math.floor(Math.random() * 100_000)]))

const INCOME_ROWS: RowData[] = [
    { id: 'r1', label: 'Sueldo Base', type: 'income', values: makeValues(MONTHS_12, 1_500_000) },
    { id: 'r2', label: 'Gratificación', type: 'income', values: makeValues(MONTHS_12, 250_000) },
    { id: 'r3', label: 'Bono Producción', type: 'income', isVariable: true, values: makeValues(MONTHS_12, 120_000) },
    { id: 'r4', label: 'Horas Extra', type: 'income', isVariable: true, values: makeValues(MONTHS_12, 85_000) },
    { id: 'r5', label: 'Comisiones', type: 'income', isVariable: true, values: makeValues(MONTHS_12, 200_000) },
    { id: 'r6', label: 'Colación', type: 'income', values: makeValues(MONTHS_12, 60_000) },
    { id: 'r7', label: 'Movilización', type: 'income', values: makeValues(MONTHS_12, 45_000) },
    { id: 'r8', label: 'Viático', type: 'income', values: makeValues(MONTHS_12, 30_000) },
    { id: 'r9', label: 'AFP', type: 'deduction', values: makeValues(MONTHS_12, 187_500) },
    { id: 'r10', label: 'Salud', type: 'deduction', values: makeValues(MONTHS_12, 105_000) },
    { id: 'r11', label: 'Impuesto Único', type: 'deduction', values: makeValues(MONTHS_12, 45_000) },
    { id: 'r12', label: 'Seguro Cesantía', type: 'deduction', values: makeValues(MONTHS_12, 9_000) },
    { id: 'r13', label: 'Anticipo', type: 'deduction', values: makeValues(MONTHS_12, 50_000) },
    { id: 'r14', label: 'Préstamo', type: 'deduction', values: makeValues(MONTHS_12, 50_000) },
]

const DEBT_ENTRIES: DebtEntry[] = [
    { id: 'd1', entidad: 'Banco Estado', tipo: 'Hipotecario', deuda_total: 85_000_000, vigente: 83_500_000, atraso_30_59: 1_200_000 },
    { id: 'd2', entidad: 'Banco Chile', tipo: 'Consumo', deuda_total: 4_500_000, vigente: 4_200_000, atraso_90_mas: 100_000 },
    { id: 'd3', entidad: 'Banco Santander', tipo: 'Automotriz', deuda_total: 12_000_000, vigente: 11_800_000 },
    { id: 'd4', entidad: 'Scotiabank', tipo: 'Consumo', deuda_total: 2_300_000, vigente: 2_100_000 },
    { id: 'd5', entidad: 'BCI', tipo: 'Comercial', deuda_total: 15_000_000, vigente: 14_500_000, atraso_60_89: 500_000 },
    { id: 'd6', entidad: 'Banco Falabella', tipo: 'Consumo', deuda_total: 1_800_000, vigente: 1_800_000 },
    { id: 'd7', entidad: 'BICE', tipo: 'Leasing', deuda_total: 8_000_000, vigente: 7_500_000 },
    { id: 'd8', entidad: 'Cooperativa', tipo: 'Consumo', deuda_total: 900_000, vigente: 900_000 },
]

const TRIBUTARIO_ENTRIES: TributarioEntry[] = [
    { id: 't1', source: 'balance-anual', label: 'Balance', empresa: 'Constructora SpA', year: '2024', ingresos: 450_000_000, egresos: 380_000_000 },
    { id: 't2', source: 'balance-anual', label: 'Balance', empresa: 'Inversiones Ltda.', year: '2023', ingresos: 120_000_000, egresos: 95_000_000 },
    { id: 't3', source: 'carpeta-tributaria', label: 'Carpeta', rut: '12.345.678-9', nombre: 'Juan Pérez', actividades: ['Construcción'] },
]

const BOLETA_MONTHS: BoletaMonth[] = MONTHS_12.map((m, i) => ({
    periodo: m.id,
    mes: ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'][i],
    hasData: true,
    boletas: 3 + i,
    bruto: 1_000_000 + i * 100_000,
    retencion: 100_000 + i * 10_000,
    liquido: 900_000 + i * 90_000,
}))

// ============================================================================
// Helper: find scroll container and verify structure
// ============================================================================

/**
 * Verifies that header and body tables share the same scroll container.
 * This prevents the bug where header columns scroll independently from body columns.
 */
function findScrollContainer(container: HTMLElement): HTMLElement | null {
    // The scroll container should have overflow-x: auto (or overflow: auto)
    const divs = container.querySelectorAll('div')
    for (const div of divs) {
        if (div.className.includes('overflow-x-auto')) return div
    }
    return null
}

function getTablesInContainer(scrollContainer: HTMLElement): HTMLTableElement[] {
    return Array.from(scrollContainer.querySelectorAll('table'))
}

// ============================================================================
// Tests
// ============================================================================

describe('Table scroll alignment', () => {
    // ── MonthlyTable ──

    describe('MonthlyTable', () => {
        it('header and body tables share the same scroll container (12 months)', () => {
            const { container } = render(
                <MonthlyTable
                    title="Test"
                    months={MONTHS_12}
                    rows={INCOME_ROWS}
                    onRowsChange={() => {}}
                    sections={[
                        { type: 'income', placeholder: 'Ingreso...' },
                        { type: 'deduction', placeholder: 'Descuento...' },
                    ]}
                />
            )
            const scrollContainer = findScrollContainer(container)
            expect(scrollContainer).not.toBeNull()

            const tables = getTablesInContainer(scrollContainer!)
            expect(tables.length).toBeGreaterThanOrEqual(2) // header table + body table

            // Both tables must be direct descendants of the same scroll container subtree
            for (const table of tables) {
                expect(scrollContainer!.contains(table)).toBe(true)
            }
        })

        it('header and body tables have matching column count (12 months)', () => {
            const { container } = render(
                <MonthlyTable
                    title="Test"
                    months={MONTHS_12}
                    rows={INCOME_ROWS}
                    onRowsChange={() => {}}
                    sections={[
                        { type: 'income', placeholder: 'Ingreso...' },
                        { type: 'deduction', placeholder: 'Descuento...' },
                    ]}
                />
            )
            const scrollContainer = findScrollContainer(container)!
            const tables = getTablesInContainer(scrollContainer)

            // Header table: first row has label + 12 months + spacer = 14 cells
            const headerCells = tables[0].querySelectorAll('tr:first-child td')
            expect(headerCells.length).toBe(14) // 1 label + 12 months + 1 spacer

            // Body table should also have 14 columns per data row
            const bodyRow = tables[1].querySelector('tbody tr')
            if (bodyRow) {
                const bodyCells = bodyRow.querySelectorAll('td')
                expect(bodyCells.length).toBe(14)
            }
        })

        it('works with 6 months', () => {
            const rows6 = INCOME_ROWS.slice(0, 4).map(r => ({
                ...r,
                values: makeValues(MONTHS_6, 100_000),
            }))
            const { container } = render(
                <MonthlyTable title="Test" months={MONTHS_6} rows={rows6} onRowsChange={() => {}} />
            )
            const scrollContainer = findScrollContainer(container)
            expect(scrollContainer).not.toBeNull()

            const tables = getTablesInContainer(scrollContainer!)
            expect(tables.length).toBeGreaterThanOrEqual(2)

            const headerCells = tables[0].querySelectorAll('tr:first-child td')
            expect(headerCells.length).toBe(8) // 1 label + 6 months + 1 spacer
        })

        it('flush mode still has scroll container', () => {
            const { container } = render(
                <MonthlyTable
                    title="Flush Test"
                    months={MONTHS_12}
                    rows={INCOME_ROWS.slice(0, 4)}
                    onRowsChange={() => {}}
                    flush
                />
            )
            const scrollContainer = findScrollContainer(container)
            expect(scrollContainer).not.toBeNull()

            const tables = getTablesInContainer(scrollContainer!)
            expect(tables.length).toBeGreaterThanOrEqual(2)
        })

        it('showVariableColumn does not break scroll alignment', () => {
            const { container } = render(
                <MonthlyTable
                    title="Variable Test"
                    months={MONTHS_12}
                    rows={INCOME_ROWS}
                    onRowsChange={() => {}}
                    sections={[
                        { type: 'income', placeholder: 'Ingreso...' },
                        { type: 'deduction', placeholder: 'Descuento...' },
                    ]}
                    showVariableColumn
                />
            )
            const scrollContainer = findScrollContainer(container)
            expect(scrollContainer).not.toBeNull()

            const tables = getTablesInContainer(scrollContainer!)
            expect(tables.length).toBeGreaterThanOrEqual(2)
            for (const table of tables) {
                expect(scrollContainer!.contains(table)).toBe(true)
            }
        })

        it('renders all 12 month headers with totals', () => {
            const { container } = render(
                <MonthlyTable
                    title="Test"
                    months={MONTHS_12}
                    rows={INCOME_ROWS}
                    onRowsChange={() => {}}
                    sections={[
                        { type: 'income', placeholder: 'Ingreso...' },
                        { type: 'deduction', placeholder: 'Descuento...' },
                    ]}
                />
            )
            // Each month label should appear in the header
            for (const m of MONTHS_12) {
                expect(container.textContent).toContain(m.label)
            }
        })

        it('renders all data rows', () => {
            const { container } = render(
                <MonthlyTable
                    title="Test"
                    months={MONTHS_12}
                    rows={INCOME_ROWS}
                    onRowsChange={() => {}}
                    sections={[
                        { type: 'income', placeholder: 'Ingreso...' },
                        { type: 'deduction', placeholder: 'Descuento...' },
                    ]}
                />
            )
            // Row labels are in <input> elements, check via value attribute
            const inputs = container.querySelectorAll('input[type="text"]')
            const inputValues = Array.from(inputs).map(i => (i as HTMLInputElement).value)
            for (const row of INCOME_ROWS) {
                expect(inputValues).toContain(row.label)
            }
        })
    })

    // ── DebtsTable ──

    describe('DebtsTable', () => {
        it('header and body tables share the same scroll container', () => {
            const { container } = render(
                <DebtsTable
                    title="Deudas"
                    entries={DEBT_ENTRIES}
                    onEntriesChange={() => {}}
                />
            )
            const scrollContainer = findScrollContainer(container)
            expect(scrollContainer).not.toBeNull()

            const tables = getTablesInContainer(scrollContainer!)
            expect(tables.length).toBeGreaterThanOrEqual(2)

            for (const table of tables) {
                expect(scrollContainer!.contains(table)).toBe(true)
            }
        })

        it('renders all debt entries', () => {
            const { container } = render(
                <DebtsTable
                    title="Deudas"
                    entries={DEBT_ENTRIES}
                    onEntriesChange={() => {}}
                />
            )
            // Entry labels are in <input> elements
            const inputs = container.querySelectorAll('input[type="text"]')
            const inputValues = Array.from(inputs).map(i => (i as HTMLInputElement).value)
            for (const entry of DEBT_ENTRIES) {
                expect(inputValues).toContain(entry.entidad)
            }
        })

        it('shows atraso column when late payments exist', () => {
            const { container } = render(
                <DebtsTable
                    title="Deudas"
                    entries={DEBT_ENTRIES}
                    onEntriesChange={() => {}}
                />
            )
            expect(container.textContent).toContain('Atraso')
        })
    })

    // ── TributarioTable ──

    describe('TributarioTable', () => {
        it('header and body tables share the same scroll container', () => {
            const { container } = render(
                <TributarioTable
                    title="Tributario"
                    entries={TRIBUTARIO_ENTRIES}
                />
            )
            const scrollContainer = findScrollContainer(container)
            expect(scrollContainer).not.toBeNull()

            const tables = getTablesInContainer(scrollContainer!)
            expect(tables.length).toBeGreaterThanOrEqual(2)

            for (const table of tables) {
                expect(scrollContainer!.contains(table)).toBe(true)
            }
        })

        it('renders all entries', () => {
            const { container } = render(
                <TributarioTable
                    title="Tributario"
                    entries={TRIBUTARIO_ENTRIES}
                />
            )
            expect(container.textContent).toContain('Constructora SpA')
            expect(container.textContent).toContain('Inversiones Ltda.')
        })
    })

    // ── BoletasTable ──

    describe('BoletasTable', () => {
        it('has a scroll container wrapping the table', () => {
            const { container } = render(
                <BoletasTable
                    title="Boletas"
                    months={BOLETA_MONTHS}
                />
            )
            const scrollContainer = findScrollContainer(container)
            expect(scrollContainer).not.toBeNull()

            // BoletasTable header is a div (not a table), body is a single table
            const tables = getTablesInContainer(scrollContainer!)
            expect(tables.length).toBeGreaterThanOrEqual(1)
        })

        it('renders all 12 months as rows', () => {
            const { container } = render(
                <BoletasTable
                    title="Boletas"
                    months={BOLETA_MONTHS}
                />
            )
            expect(container.textContent).toContain('Enero')
            expect(container.textContent).toContain('Diciembre')
        })
    })
})

// ============================================================================
// Structural tests — no overflow-hidden on the scroll container
// ============================================================================

describe('TableShell scroll structure', () => {
    it('scroll container does not have overflow-hidden class', () => {
        const { container } = render(
            <MonthlyTable
                title="Test"
                months={MONTHS_12}
                rows={INCOME_ROWS.slice(0, 2)}
                onRowsChange={() => {}}
            />
        )
        const scrollContainer = findScrollContainer(container)
        expect(scrollContainer).not.toBeNull()
        // overflow-hidden should NOT be on the same element as overflow-x-auto
        expect(scrollContainer!.className).not.toContain('overflow-hidden')
    })

    it('scroll container does not have overflow-hidden class (flush mode)', () => {
        const { container } = render(
            <MonthlyTable
                title="Test"
                months={MONTHS_12}
                rows={INCOME_ROWS.slice(0, 2)}
                onRowsChange={() => {}}
                flush
            />
        )
        const scrollContainer = findScrollContainer(container)
        expect(scrollContainer).not.toBeNull()
        expect(scrollContainer!.className).not.toContain('overflow-hidden')
    })

    it('rounded corners wrapper is separate from scroll container', () => {
        const { container } = render(
            <MonthlyTable
                title="Test"
                months={MONTHS_12}
                rows={INCOME_ROWS.slice(0, 2)}
                onRowsChange={() => {}}
            />
        )
        const scrollContainer = findScrollContainer(container)
        expect(scrollContainer).not.toBeNull()

        // The parent of the scroll container should have the rounded corners
        const parent = scrollContainer!.parentElement
        expect(parent).not.toBeNull()
        expect(parent!.className).toContain('rounded-xl')
    })
})
