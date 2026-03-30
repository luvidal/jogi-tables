import AssetTable from '../assets/assettable'
import type { ColumnDef } from '../assets/types'
import type { VehiculoRow, VehiculosTableProps } from './types'

const columns: ColumnDef[] = [
    { key: 'marca', label: 'Marca', type: 'text', width: '160px', isLabel: true, placeholder: 'Marca' },
    { key: 'modelo', label: 'Modelo', type: 'text', width: '140px', placeholder: 'Modelo' },
    { key: 'monto', label: 'Monto $', type: 'currency', width: '120px' },
    { key: 'anio', label: 'Año', type: 'number', width: '80px', align: 'center' },
]

const VehiculosTable = ({
    rows,
    onRowsChange,
    formatCurrency,
    colorScheme,
    headerBg,
    headerText,
    title,
}: VehiculosTableProps) => (
    <AssetTable<VehiculoRow>
        columns={columns}
        rows={rows}
        onRowsChange={onRowsChange}
        idPrefix="vh"
        addPlaceholder="Agregar vehículo..."
        formatCurrency={formatCurrency}
        colorScheme={colorScheme}
        headerBg={headerBg}
        headerText={headerText}
        title={title}
    />
)

export default VehiculosTable
