import * as react_jsx_runtime from 'react/jsx-runtime';
import React, { ReactNode } from 'react';

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
    flush?: boolean;
    formatValue?: (value: number | null | undefined) => string;
    calculateTotal?: (monthId: string, rows: RowData[]) => number;
    showVariableColumn?: boolean;
    sourceFileIds?: string[];
    onViewSource?: (fileIds: string[]) => void;
}

declare const MonthlyTable: ({ title, months, rows, onRowsChange, sections, headerBg, headerText, defaultCollapsed, forceExpanded, flush, formatValue, calculateTotal, showVariableColumn, sourceFileIds, onViewSource, }: MonthlyTableProps) => react_jsx_runtime.JSX.Element;

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
    flush?: boolean;
    formatCurrency?: (value: number | null | undefined) => string;
    sourceFileIds?: string[];
    onViewSource?: (fileIds: string[]) => void;
}
declare const DebtsTable: ({ title, entries, onEntriesChange, summary, headerBg, headerText, defaultCollapsed, forceExpanded, flush, formatCurrency, sourceFileIds, onViewSource, }: DebtsTableProps) => react_jsx_runtime.JSX.Element;

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
    flush?: boolean;
    sourceFileIds?: string[];
    onViewSource?: (fileIds: string[]) => void;
}
declare const BoletasTable: ({ title, months, totales, headerBg, headerText, defaultCollapsed, forceExpanded, flush, sourceFileIds, onViewSource, }: BoletasTableProps) => react_jsx_runtime.JSX.Element;

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
    flush?: boolean;
    sourceFileIds?: string[];
    onViewSource?: (fileIds: string[]) => void;
}
declare const TributarioTable: ({ title, entries, headerBg, headerText, defaultCollapsed, forceExpanded, flush, sourceFileIds, onViewSource, }: TributarioTableProps) => react_jsx_runtime.JSX.Element;

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

type VehiculoRow = {
    id: string;
    marca: string;
    modelo: string;
    monto: number | null;
    anio: number | null;
};
interface VehiculosTableProps {
    rows: VehiculoRow[];
    onRowsChange: (rows: VehiculoRow[]) => void;
    formatCurrency?: (value: number | null | undefined) => string;
    headerBg?: string;
    headerText?: string;
    emptyMessage?: string;
    addLabel?: string;
}

declare const VehiculosTable: ({ rows, onRowsChange, formatCurrency, headerBg, headerText, emptyMessage, addLabel, }: VehiculosTableProps) => react_jsx_runtime.JSX.Element;

type InversionRow = {
    id: string;
    institucion: string;
    tipo: string;
    monto: number | null;
    fecha: string;
};
interface InversionesTableProps {
    rows: InversionRow[];
    onRowsChange: (rows: InversionRow[]) => void;
    formatCurrency?: (value: number | null | undefined) => string;
    headerBg?: string;
    headerText?: string;
    emptyMessage?: string;
    addLabel?: string;
}

declare const InversionesTable: ({ rows, onRowsChange, formatCurrency, headerBg, headerText, emptyMessage, addLabel, }: InversionesTableProps) => react_jsx_runtime.JSX.Element;

type DeudaConsumoRow = {
    id: string;
    institucion: string;
    tipo_deuda: string;
    saldo_deuda_uf: number | null;
    saldo_deuda_pesos: number | null;
    monto_cuota: number | null;
    cuotas_pagadas: number | null;
    cuotas_total: number | null;
};
interface DeudasConsumoTableProps {
    rows: DeudaConsumoRow[];
    onRowsChange: (rows: DeudaConsumoRow[]) => void;
    formatCurrency?: (value: number | null | undefined) => string;
    ufValue?: number | null;
    castigo?: number;
    headerBg?: string;
    headerText?: string;
}

declare const DeudasConsumoTable: ({ rows, onRowsChange, formatCurrency, ufValue, castigo, headerBg, headerText, }: DeudasConsumoTableProps) => react_jsx_runtime.JSX.Element;

type BienRaizRow = {
    id: string;
    direccion: string;
    comuna: string;
    valor_uf: number | null;
    valor_pesos: number | null;
    arriendo_real: number | null;
    arriendo_futuro: number | null;
    institucion: string;
    tipo_deuda: string;
    saldo_deuda_uf: number | null;
    saldo_deuda_pesos: number | null;
    monto_cuota: number | null;
    cuotas_pagadas: number | null;
    cuotas_total: number | null;
};
interface BienesRaicesTableProps {
    rows: BienRaizRow[];
    onRowsChange: (rows: BienRaizRow[]) => void;
    formatCurrency?: (value: number | null | undefined) => string;
    ufValue?: number | null;
    capRate?: number;
    factorDescuento?: number;
    headerBg?: string;
    headerText?: string;
}

declare const BienesRaicesTable: ({ rows, onRowsChange, formatCurrency, ufValue, capRate, factorDescuento, headerBg, headerText, }: BienesRaicesTableProps) => react_jsx_runtime.JSX.Element;

interface ActivosSummaryItem {
    label: string;
    value: number | null;
    count: number;
}
interface ActivosSummaryProps {
    items: ActivosSummaryItem[];
    totalLabel?: string;
    formatCurrency?: (value: number | null | undefined) => string;
    colorScheme?: {
        totalBg: string;
        totalBorder: string;
        totalText: string;
        totalValueText: string;
    };
}
declare const ActivosSummary: ({ items, totalLabel, formatCurrency, colorScheme, }: ActivosSummaryProps) => react_jsx_runtime.JSX.Element;

declare const SourceIcon: ({ fileIds, onViewSource, className, }: {
    fileIds?: string[];
    onViewSource?: (ids: string[]) => void;
    className?: string;
}) => react_jsx_runtime.JSX.Element | null;
interface TableShellProps {
    headerBg?: string;
    headerText?: string;
    defaultCollapsed?: boolean;
    forceExpanded?: boolean;
    disableToggle?: boolean;
    flush?: boolean;
    renderHeader: (ctx: {
        isExpanded: boolean;
    }) => React.ReactNode;
    children: React.ReactNode;
    renderAfterContent?: (ctx: {
        isExpanded: boolean;
    }) => React.ReactNode;
    contentClassName?: string;
    contentProps?: React.HTMLAttributes<HTMLDivElement>;
}
declare const TableShell: ({ headerBg, headerText, defaultCollapsed, forceExpanded, disableToggle, flush, renderHeader, children, renderAfterContent, contentClassName, contentProps, }: TableShellProps) => react_jsx_runtime.JSX.Element;

type AutoConvertRule = {
    source: string;
    target: string;
    formula: (value: number, params: Record<string, number>) => number;
    precision?: number;
};
type AutoComputeRule = {
    target: string;
    depends: string[];
    condition?: (row: Record<string, any>) => boolean;
    formula: (row: Record<string, any>, params: Record<string, number>) => number | null;
};
/**
 * Apply auto-conversions after a field edit.
 * Given the edited field and its new value, applies matching conversion rules
 * (e.g. UF→CLP or CLP→UF) and returns the updated row.
 */
declare function applyAutoConversions<T extends Record<string, any>>(row: T, editedField: string, editedValue: any, rules: AutoConvertRule[], params: Record<string, number>): T;
/**
 * Apply auto-compute rules after a field edit.
 * Checks which compute rules depend on the edited field, evaluates conditions,
 * and applies formulas to compute derived values.
 */
declare function applyAutoCompute<T extends Record<string, any>>(row: T, editedField: string, rules: AutoComputeRule[], params: Record<string, number>): T;

export { ActivosSummary, type ActivosSummaryItem, type ActivosSummaryProps, type AssetRowData, AssetTable, type AssetTableProps, type AutoComputeRule, type AutoConvertRule, type BienRaizRow, BienesRaicesTable, type BienesRaicesTableProps, type BoletaMonth, BoletasTable, type BoletasTableProps, type CodeudorIncomeInfo, type Column, type DebtEntry, DebtsTable, type DebtsTableProps, type DeudaConsumoRow, DeudasConsumoTable, type DeudasConsumoTableProps, FinalResultsCompact, type FinalResultsCompactProps, type FinalResultsValues, type InversionRow, InversionesTable, type InversionesTableProps, type Month, type MonthlyTableProps, type PromptOptions, ReportTable, type ReportTableProps, type RowData, type RowType, SourceIcon, TableShell, type TableShellProps, type TributarioEntry, TributarioTable, type TributarioTableProps, type VehiculoRow, VehiculosTable, type VehiculosTableProps, applyAutoCompute, applyAutoConversions, MonthlyTable as default, generateLastNMonths };
