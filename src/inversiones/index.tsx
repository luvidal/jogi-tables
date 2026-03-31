import AssetTable from '../assets/assettable'
import type { ColumnDef } from '../assets/types'
import type { InversionRow, InversionesTableProps } from './types'

const columns: ColumnDef[] = [
    { key: 'institucion', label: 'Institución', type: 'text', width: '160px', isLabel: true, placeholder: 'Institución' },
    { key: 'tipo', label: 'Tipo Inversión', type: 'text', width: '140px', placeholder: 'Tipo' },
    { key: 'monto', label: 'Monto $', type: 'currency', width: '120px' },
    { key: 'fecha', label: 'Fecha', type: 'text', width: '100px', placeholder: 'Fecha' },
]

const InversionesTable = ({
    rows,
    onRowsChange,
    formatCurrency,
    colorScheme,
    headerBg,
    headerText,
    title,
}: InversionesTableProps) => (
    <AssetTable<InversionRow>
        columns={columns}
        rows={rows}
        onRowsChange={onRowsChange}
        idPrefix="inv"
        addPlaceholder="Agregar inversión..."
        formatCurrency={formatCurrency}
        colorScheme={colorScheme}
        headerBg={headerBg}
        headerText={headerText}
        title={title}
    />
)

export default InversionesTable
