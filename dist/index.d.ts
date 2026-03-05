import * as react_jsx_runtime from 'react/jsx-runtime';

type RowType = 'add' | 'subtract' | 'income' | 'deduction' | 'debt';
type RowData = {
    id: string;
    label: string;
    type: RowType;
    values: Record<string, number | null>;
    sourceFileId?: string;
    isDefault?: boolean;
    groupId?: string;
    isGroup?: boolean;
    collapsed?: boolean;
    order?: number;
};
type Month = {
    id: string;
    label: string;
    sourceFileId?: string;
};
interface MonthlyTableProps {
    title: string;
    months?: number | Month[];
    rows: RowData[];
    onRowsChange: (rows: RowData[]) => void;
    sections?: Array<{
        type: RowType;
        placeholder: string;
    }>;
    headerBg?: string;
    headerText?: string;
    defaultCollapsed?: boolean;
    forceExpanded?: boolean;
    formatValue?: (value: number | null | undefined) => string;
    calculateTotal?: (monthId: string, rows: RowData[]) => number;
    sourceFileIds?: string[];
    onViewSource?: (fileIds: string[]) => void;
}

declare const generateLastNMonths: (count: number) => Month[];

declare const MonthlyTable: ({ title, months, rows, onRowsChange, sections, headerBg, headerText, defaultCollapsed, forceExpanded, formatValue, calculateTotal, sourceFileIds, onViewSource, }: MonthlyTableProps) => react_jsx_runtime.JSX.Element;

export { type Month, type MonthlyTableProps, type RowData, type RowType, MonthlyTable as default, generateLastNMonths };
