import { useMemo } from 'react'
import AssetTable from '../assets/assettable'
import type { ColumnDef } from '../assets/types'
import type { AutoConvertRule, AutoComputeRule } from '../common/autoconvert'
import type { PropiedadRow, PropiedadesTableProps } from './types'

// TODO(jogi): plug UF/$ selector — AssetTable renders CurrencyToggle when ufValue
// is provided and columns have ufPair. The consumer passes ufValue from context.

const PropiedadesTable = ({
    rows,
    onRowsChange,
    formatCurrency,
    ufValue,
    capRate = 0.05,
    factorDescuento = 0.10,
    headerBg = 'bg-amber-50',
    headerText = 'text-amber-700',
    title,
}: PropiedadesTableProps) => {
    const columns: ColumnDef[] = [
        { key: 'direccion', label: 'Dirección', type: 'text', width: '140px', isLabel: true, placeholder: 'Dirección' },
        { key: 'comuna', label: 'Comuna', type: 'text', width: '100px', placeholder: 'Comuna' },
        {
            key: 'valor_uf', label: 'Valor UF', type: 'number', width: '100px',
            ufPair: 'valor_pesos',
            autoComputedClass: (row) => (ufValue && row.valor_uf != null && row.valor_pesos != null) ? 'italic text-amber-500' : '',
        },
        { key: 'arriendo_real', label: 'Arr. Real $', type: 'currency', width: '100px' },
        {
            key: 'arriendo_futuro', label: 'Arr. Fut $', type: 'currency', width: '100px',
            autoComputedClass: (row) => (ufValue && row.valor_uf != null) ? 'italic text-amber-500' : '',
        },
    ]

    const conversionRules: AutoConvertRule[] = useMemo(() => ufValue ? [
        { source: 'valor_uf', target: 'valor_pesos', formula: (v: number) => v * ufValue, precision: 0 },
        { source: 'valor_pesos', target: 'valor_uf', formula: (v: number) => v / ufValue, precision: 2 },
    ] : [], [ufValue])

    const computeRules: AutoComputeRule[] = useMemo(() => ufValue ? [
        {
            target: 'arriendo_futuro',
            depends: ['valor_uf', 'valor_pesos'],
            condition: (row: Record<string, unknown>) => row.arriendo_futuro == null,
            formula: (row: Record<string, unknown>) => {
                const valorUf = row.valor_uf as number | null
                if (!valorUf || !capRate) return null
                return Math.round(valorUf * capRate / 12 * (1 - factorDescuento) * ufValue)
            },
        },
    ] : [], [ufValue, capRate, factorDescuento])

    return (
        <AssetTable<PropiedadRow>
            columns={columns}
            rows={rows}
            onRowsChange={onRowsChange}
            idPrefix="br"
            addPlaceholder="Agregar propiedad..."
            formatCurrency={formatCurrency}
            headerBg={headerBg}
            headerText={headerText}
            title={title}
            ufValue={ufValue}
            conversionRules={conversionRules}
            computeRules={computeRules}
        />
    )
}

export default PropiedadesTable
