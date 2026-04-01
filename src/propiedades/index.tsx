import { useMemo } from 'react'
import AssetTable from '../assets/assettable'
import type { ColumnDef } from '../assets/types'
import type { AutoConvertRule, AutoComputeRule } from '../common/autoconvert'
import type { PropiedadRow, PropiedadesTableProps } from './types'


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
            key: 'valor_pesos', label: 'Valor $', type: 'currency',
            ufPair: 'valor_uf', ufPairLabel: 'Valor UF', ufPairType: 'number',
            autoComputedClass: (row) => (ufValue && row.valor_uf != null && row.valor_pesos != null) ? 'text-amber-500' : '',
        },
        {
            key: 'arriendo_real', label: 'Arr. Real $', type: 'currency',
            ufPair: 'arriendo_real_uf', ufPairLabel: 'Arr. Real UF', ufPairType: 'number',
        },
        {
            key: 'arriendo_futuro', label: 'Arr. Fut $', type: 'currency',
            ufPair: 'arriendo_futuro_uf', ufPairLabel: 'Arr. Fut UF', ufPairType: 'number',
            autoComputedClass: (row) => (ufValue && row.valor_uf != null) ? 'text-amber-500' : '',
        },
    ]

    const conversionRules: AutoConvertRule[] = useMemo(() => ufValue ? [
        { source: 'valor_uf', target: 'valor_pesos', formula: (v: number) => v * ufValue, precision: 0 },
        { source: 'valor_pesos', target: 'valor_uf', formula: (v: number) => v / ufValue, precision: 2 },
        { source: 'arriendo_real', target: 'arriendo_real_uf', formula: (v: number) => v / ufValue, precision: 2 },
        { source: 'arriendo_real_uf', target: 'arriendo_real', formula: (v: number) => v * ufValue, precision: 0 },
        { source: 'arriendo_futuro', target: 'arriendo_futuro_uf', formula: (v: number) => v / ufValue, precision: 2 },
        { source: 'arriendo_futuro_uf', target: 'arriendo_futuro', formula: (v: number) => v * ufValue, precision: 0 },
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
        {
            target: 'arriendo_futuro_uf',
            depends: ['valor_uf', 'valor_pesos'],
            condition: (row: Record<string, unknown>) => row.arriendo_futuro == null,
            formula: (row: Record<string, unknown>) => {
                const valorUf = row.valor_uf as number | null
                if (!valorUf || !capRate) return null
                return Math.round(valorUf * capRate / 12 * (1 - factorDescuento) * 100) / 100
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
