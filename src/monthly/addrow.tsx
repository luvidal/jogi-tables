import React from 'react'
import EditableCell from '../common/editablecell'
import { T } from '../common/styles'
import { isSubtractType } from './helpers'
import type { Month, SectionDef } from './types'

interface AddRowProps {
    section: SectionDef
    months: Month[]
    labelValue: string
    onLabelChange: (value: string) => void
    onAddRow: (label: string) => void
    onAddRowWithValue: (monthId: string, value: number | null) => void
}

const AddRow = ({
    section,
    months,
    labelValue,
    onLabelChange,
    onAddRow,
    onAddRowWithValue,
}: AddRowProps) => {
    const subtract = isSubtractType(section.type)
    const bgClass = subtract
        ? 'bg-red-50/30 border-red-100'
        : 'bg-gray-50/30 border-gray-100'

    return (
        <tr className={`border-b border-dashed ${bgClass}`}>
            <td className="px-4 py-1.5" style={{ width: '180px' }}>
                <input
                    type="text"
                    placeholder={section.placeholder}
                    value={labelValue}
                    onChange={(e) => onLabelChange(e.target.value)}
                    className={`w-full ${T.input} text-gray-500 placeholder-gray-300`}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && labelValue.trim()) {
                            onAddRow(labelValue)
                        }
                    }}
                />
            </td>
            {months.map((p) => (
                <EditableCell
                    key={p.id}
                    value={null}
                    onChange={(v) => onAddRowWithValue(p.id, v as number | null)}
                    isDeduction={subtract}
                    hasData={false}
                    width="110px"
                    type="currency"
                />
            ))}
            <td style={{ width: '40px' }}></td>
        </tr>
    )
}

export default AddRow
