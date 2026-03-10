import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

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
    isVariable?: boolean;
    deletedAt?: string;
    deletionReason?: string;
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
    showVariableColumn?: boolean;
    sourceFileIds?: string[];
    onViewSource?: (fileIds: string[]) => void;
}

declare const MonthlyTable: ({ title, months, rows, onRowsChange, sections, headerBg, headerText, defaultCollapsed, forceExpanded, formatValue, calculateTotal, showVariableColumn, sourceFileIds, onViewSource, }: MonthlyTableProps) => react_jsx_runtime.JSX.Element;

declare const generateLastNMonths: (count: number) => Month[];

type DebtEntry = {
    id: string;
    entidad: string;
    tipo: string;
    deuda_total: number | null;
    vigente: number | null;
    atraso_30_59?: number | null;
    atraso_60_89?: number | null;
    atraso_90_mas?: number | null;
    sourceFileId?: string;
};
interface DebtsTableProps {
    title: string;
    entries: DebtEntry[];
    onEntriesChange: (entries: DebtEntry[]) => void;
    summary?: {
        rut?: string;
        nombre?: string;
        deuda_total?: number;
        fecha_informe?: string;
    };
    headerBg?: string;
    headerText?: string;
    defaultCollapsed?: boolean;
    forceExpanded?: boolean;
    formatCurrency?: (value: number | null | undefined) => string;
    sourceFileIds?: string[];
    onViewSource?: (fileIds: string[]) => void;
}
declare const DebtsTable: ({ title, entries, onEntriesChange, summary, headerBg, headerText, defaultCollapsed, forceExpanded, formatCurrency, sourceFileIds, onViewSource, }: DebtsTableProps) => react_jsx_runtime.JSX.Element;

type BoletaMonth = {
    periodo: string;
    mes: string;
    hasData: boolean;
    boletas: number | null;
    bruto: number | null;
    retencion: number | null;
    liquido: number | null;
};
interface BoletasTableProps {
    title: string;
    months: BoletaMonth[];
    totales?: {
        boletas_vigentes?: number;
        honorario_bruto?: number;
        retencion_terceros?: number;
        retencion_contribuyente?: number;
        total_liquido?: number;
    };
    headerBg?: string;
    headerText?: string;
    defaultCollapsed?: boolean;
    forceExpanded?: boolean;
    sourceFileIds?: string[];
    onViewSource?: (fileIds: string[]) => void;
}
declare const BoletasTable: ({ title, months, totales, headerBg, headerText, defaultCollapsed, forceExpanded, sourceFileIds, onViewSource, }: BoletasTableProps) => react_jsx_runtime.JSX.Element;

type TributarioEntry = {
    id: string;
    source: 'carpeta-tributaria' | 'balance-anual';
    label: string;
    rut?: string;
    nombre?: string;
    actividades?: string[];
    empresa?: string;
    year?: string;
    ingresos?: number | null;
    egresos?: number | null;
    sourceFileId?: string;
};
interface TributarioTableProps {
    title: string;
    entries: TributarioEntry[];
    headerBg?: string;
    headerText?: string;
    defaultCollapsed?: boolean;
    forceExpanded?: boolean;
    sourceFileIds?: string[];
    onViewSource?: (fileIds: string[]) => void;
}
declare const TributarioTable: ({ title, entries, headerBg, headerText, defaultCollapsed, forceExpanded, sourceFileIds, onViewSource, }: TributarioTableProps) => react_jsx_runtime.JSX.Element;

type AssetRowData = {
    id: string;
    label: string;
    type: 'asset';
    value: number | null;
    description?: string;
};
interface AssetTableProps {
    rows: AssetRowData[];
    onRowsChange: (rows: AssetRowData[]) => void;
    formatCurrency: (value: number | null | undefined) => string;
    placeholder?: string;
    onViewSource?: (fileIds: string[]) => void;
}
declare const AssetTable: ({ rows, onRowsChange, formatCurrency, placeholder, onViewSource }: AssetTableProps) => react_jsx_runtime.JSX.Element;

interface Column {
    label: string;
    align?: 'left' | 'right' | 'center';
}
interface ReportTableProps<T> {
    columns: Column[];
    items: T[];
    renderRow: (item: T, index: number) => ReactNode;
    emptyMessage: string;
    totalLabel: string;
    totalValue: ReactNode;
    totalBg: string;
    totalText: string;
}
declare function ReportTable<T>({ columns, items, renderRow, emptyMessage, totalLabel, totalValue, totalBg, totalText }: ReportTableProps<T>): react_jsx_runtime.JSX.Element;

interface FinalResultsValues {
    renta_liquida_ajustada_comprador?: number | null;
    renta_liquida_ajustada_codeudor?: number | null;
    /** Array of adjusted incomes for multiple codeudores (codeudor1, codeudor2, etc.) */
    rentas_codeudores?: (number | null)[];
    total_rentas?: number | null;
    dividendo_hipotecario?: number | null;
    indice_carga_hipotecaria?: number | null;
    indice_carga_financiera_conjunta?: number | null;
    evaluacion_realizada_por?: string;
}
interface CodeudorIncomeInfo {
    name: string;
    calculatedIncome: number;
}
interface PromptOptions {
    message: string;
    title?: string;
    defaultValue?: string;
    type?: 'text' | 'number';
    icon?: string;
}
interface FinalResultsCompactProps {
    values: FinalResultsValues;
    onChange: (key: string, value: number | string | null | (number | null)[]) => void;
    calculatedDebtorIncome?: number;
    /** @deprecated Use codeudorIncomes array instead */
    calculatedCodebtorIncome?: number;
    /** Array of codeudor income info (name + calculated income) */
    codeudorIncomes?: CodeudorIncomeInfo[];
    calculatedDebts?: number;
    /** Prompt function for editing index values. If not provided, indices are display-only. */
    prompt?: (options: PromptOptions) => Promise<string | null>;
}
declare const FinalResultsCompact: ({ values, onChange, calculatedDebtorIncome, calculatedCodebtorIncome, codeudorIncomes, calculatedDebts, prompt, }: FinalResultsCompactProps) => react_jsx_runtime.JSX.Element;

export { type AssetRowData, AssetTable, type AssetTableProps, type BoletaMonth, BoletasTable, type BoletasTableProps, type CodeudorIncomeInfo, type Column, type DebtEntry, DebtsTable, type DebtsTableProps, FinalResultsCompact, type FinalResultsCompactProps, type FinalResultsValues, type Month, type MonthlyTableProps, type PromptOptions, ReportTable, type ReportTableProps, type RowData, type RowType, type TributarioEntry, TributarioTable, type TributarioTableProps, MonthlyTable as default, generateLastNMonths };
