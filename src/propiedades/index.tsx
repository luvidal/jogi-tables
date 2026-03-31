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
    colorScheme,
    headerBg,
    headerText,
    title,
}: PropiedadesTableProps) => {
    const columns: ColumnDef[] = [
        { key: 'direccion', label: 'Dirección', type: 'text', isLabel: true, placeholder: 'Dirección' },
        { key: 'comuna', label: 'Comuna', type: 'text', placeholder: 'Comuna' },
        {
            key: 'valor_uf', label: 'Valor UF', type: 'number',
            ufPair: 'valor_pesos',
            autoComputedClass: (row) => (ufValue && row.valor_uf != null && row.valor_pesos != null) ? 'italic text-amber-500' : '',
        },
        { key: 'arriendo_real', label: 'Arr. Real $', type: 'currency' },
        {
            key: 'arriendo_futuro', label: 'Arr. Fut $', type: 'currency',
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
            colorScheme={colorScheme}
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
