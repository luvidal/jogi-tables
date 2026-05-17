import { describe, it, expect } from 'vitest'
import React from 'react'
import { render } from '@testing-library/react'
import RentaTable from '../src/renta'
import CrudTable from '../src/assets/assettable'
import BoletasTable from '../src/boletas'
import DeclaracionTable from '../src/declaracion'
import type { RowData, Month } from '../src/renta/types'
import type { AssetRow, ColumnDef } from '../src/assets/types'
import type { BoletaMonth } from '../src/boletas'
import type { DeclaracionColumn, DeclaracionRow } from '../src/declaracion/types'

const MONTHS_12: Month[] = Array.from({ length: 12 }, (_, i) => ({
    id: `2025-${String(i + 1).padStart(2, '0')}`,
    label: ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'][i],
}))

const makeValues = (base: number) =>
    Object.fromEntries(MONTHS_12.map((m, i) => [m.id, base + i * 10_000]))

const RENTA_ROWS: RowData[] = [
    { id: 'r1', label: 'Sueldo Base', type: 'income', values: makeValues(1_500_000) },
    { id: 'r2', label: 'Gratificación', type: 'income', values: makeValues(250_000) },
    { id: 'r3', label: 'AFP', type: 'deduction', values: makeValues(180_000) },
    { id: 'r4', label: 'Salud', type: 'deduction', values: makeValues(105_000) },
]

type DebtRow = AssetRow & {
    entidad: string
    tipo: string
    deuda_total: number | null
    vigente: number | null
    atraso_30_59: number | null
}

const DEBT_COLUMNS: ColumnDef[] = [
    { key: 'entidad', label: 'Entidad', type: 'text', width: '34%', isLabel: true },
    { key: 'tipo', label: 'Tipo', type: 'text', width: '22%' },
    { key: 'deuda_total', label: 'Deuda total', type: 'currency', width: '22%' },
    { key: 'vigente', label: 'Vigente', type: 'currency', width: '22%' },
    { key: 'atraso_30_59', label: 'Atraso', type: 'currency', width: '18%' },
]

const DEBT_ROWS: DebtRow[] = [
    { id: 'd1', entidad: 'Banco Estado', tipo: 'Hipotecario', deuda_total: 85_000_000, vigente: 83_500_000, atraso_30_59: 1_200_000 },
    { id: 'd2', entidad: 'Banco Chile', tipo: 'Consumo', deuda_total: 4_500_000, vigente: 4_200_000, atraso_30_59: null },
]

const BOLETA_MONTHS: BoletaMonth[] = MONTHS_12.map((m, i) => ({
    periodo: m.id,
    mes: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'][i],
    hasData: true,
    boletas: 3 + i,
    bruto: 1_000_000 + i * 100_000,
    retencion: 100_000 + i * 10_000,
    liquido: 900_000 + i * 90_000,
}))

const DECLARACION_COLUMNS: DeclaracionColumn[] = [
    { key: '2024', label: '2024' },
    { key: '2023', label: '2023' },
]

const DECLARACION_ROWS: DeclaracionRow[] = [
    { key: 'ingresos', label: 'Ingresos', code: '628', summed: true },
    { key: 'egresos', label: 'Egresos', code: '629', summed: true },
]

const DECLARACION_DATA = {
    ingresos: { '2024': 450_000_000, '2023': 380_000_000 },
    egresos: { '2024': 120_000_000, '2023': 95_000_000 },
}

function table(container: HTMLElement): HTMLTableElement {
    const found = container.querySelector('table')
    expect(found).not.toBeNull()
    return found!
}

function inputValues(container: HTMLElement): string[] {
    return Array.from(container.querySelectorAll('input[type="text"]')).map(input => (input as HTMLInputElement).value)
}

describe('Current table structure', () => {
    it('RentaTable renders header and body inside one TableShell table', () => {
        const { container } = render(
            <RentaTable
                title="Renta Liquida Titular"
                months={MONTHS_12}
                rows={RENTA_ROWS}
                onRowsChange={() => {}}
                sections={[
                    { type: 'income', placeholder: 'Agregar ingreso...' },
                    { type: 'deduction', placeholder: 'Agregar descuento...' },
                ]}
            />
        )

        const shell = table(container)
        expect(shell.querySelector('thead')).not.toBeNull()
        expect(shell.querySelector('tbody')).not.toBeNull()
        expect(container.textContent).toContain('ENE')
        expect(container.textContent).toContain('DIC')
        expect(inputValues(container)).toEqual(expect.arrayContaining(RENTA_ROWS.map(row => row.label)))
    })

    it('CrudTable renders configured columns, rows, and footer in one table', () => {
        const { container } = render(
            <CrudTable<DebtRow>
                title="Deudas"
                columns={DEBT_COLUMNS}
                rows={DEBT_ROWS}
                onRowsChange={() => {}}
                idPrefix="debt"
                addPlaceholder="Agregar deuda..."
            />
        )

        const shell = table(container)
        expect(shell.querySelector('tfoot')).not.toBeNull()
        expect(container.textContent).toContain('Deudas')
        expect(container.textContent).toContain('Atraso')
        expect(inputValues(container)).toEqual(expect.arrayContaining(['Banco Estado', 'Banco Chile']))
    })

    it('DeclaracionTable renders code and year columns from declarative data', () => {
        const { container } = render(
            <DeclaracionTable
                columns={DECLARACION_COLUMNS}
                rows={DECLARACION_ROWS}
                data={DECLARACION_DATA}
                formatCurrency={(value) => `$${value.toLocaleString('es-CL')}`}
            />
        )

        table(container)
        expect(container.textContent).toContain('Concepto')
        expect(container.textContent).toMatch(/C.digo/)
        expect(container.textContent).toContain('Ingresos')
        expect(container.textContent).toContain('2024')
    })

    it('BoletasTable renders monthly metrics across the current TableShell', () => {
        const { container } = render(
            <BoletasTable
                title="Boletas"
                months={BOLETA_MONTHS}
            />
        )

        table(container)
        expect(container.textContent).toContain('Boletas')
        expect(container.textContent).toContain('Honor. Bruto')
        expect(container.textContent).toContain('Ene')
        expect(container.textContent).toContain('Dic')
    })
})

describe('TableShell wrapper', () => {
    it('does not put overflow-hidden on the table wrapper', () => {
        const { container } = render(
            <RentaTable
                title="Renta"
                months={MONTHS_12}
                rows={RENTA_ROWS.slice(0, 2)}
                onRowsChange={() => {}}
            />
        )

        const wrapper = table(container).parentElement
        expect(wrapper).not.toBeNull()
        expect(wrapper!.className).not.toContain('overflow-hidden')
    })
})
