import * as react_jsx_runtime from 'react/jsx-runtime';
import React$1 from 'react';

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
    naturaleza?: 'Imponible' | 'No imponible' | 'Legal' | 'Otro';
    deletedAt?: string;
    deletionReason?: string;
};
type Month = {
    id: string;
    label: string;
    sourceFileId?: string;
};
interface RentaTableProps {
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
    showClassificationColumns?: boolean;
    sourceFileIds?: string[];
    onViewSource?: (fileIds: string[]) => void;
    reliquidacion?: Record<string, ReliquidacionBreakdown>;
}
/** Reliquidación breakdown for a single month (passed from host app) */
interface ReliquidacionBreakdown {
    rentaFija: number;
    rentaVariable: number;
    imponibleFijo: number;
    imponibleVariable: number;
    noImponibleFijo: number;
    noImponibleVariable: number;
    cotizPreviFija: number;
    cotizSaludFija: number;
    cotizCesantiaFija: number;
    impuestoFijo: number;
    descuentosOtrosFijos: number;
    liquidoTotal: number;
}

declare const RentaTable: ({ title, months, rows, onRowsChange, sections, headerBg, headerText, defaultCollapsed, forceExpanded, flush, formatValue, calculateTotal, showVariableColumn, showClassificationColumns, sourceFileIds, onViewSource, reliquidacion, }: RentaTableProps) => react_jsx_runtime.JSX.Element;

declare const generateLastNMonths: (count: number) => Month[];

type SoftDeletable = {
    deletedAt?: string;
    deletionReason?: string;
};

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
} & SoftDeletable;
interface DeudasTableProps {
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
declare const DeudasTable: ({ title, entries, onEntriesChange, summary, headerBg, headerText, defaultCollapsed, forceExpanded, flush, formatCurrency, sourceFileIds, onViewSource, }: DeudasTableProps) => react_jsx_runtime.JSX.Element;

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
} & SoftDeletable;
interface VehiculosTableProps {
    rows: VehiculoRow[];
    onRowsChange: (rows: VehiculoRow[]) => void;
    formatCurrency?: (value: number | null | undefined) => string;
    headerBg?: string;
    headerText?: string;
    title?: React.ReactNode;
}

declare const VehiculosTable: ({ rows, onRowsChange, formatCurrency, headerBg, headerText, title, }: VehiculosTableProps) => react_jsx_runtime.JSX.Element;

type InversionRow = {
    id: string;
    institucion: string;
    tipo: string;
    monto: number | null;
    fecha: string;
} & SoftDeletable;
interface InversionesTableProps {
    rows: InversionRow[];
    onRowsChange: (rows: InversionRow[]) => void;
    formatCurrency?: (value: number | null | undefined) => string;
    headerBg?: string;
    headerText?: string;
    title?: React.ReactNode;
}

declare const InversionesTable: ({ rows, onRowsChange, formatCurrency, headerBg, headerText, title, }: InversionesTableProps) => react_jsx_runtime.JSX.Element;

type DeudaConsumoRow = {
    id: string;
    institucion: string;
    tipo_deuda: string;
    saldo_deuda_uf: number | null;
    saldo_deuda_pesos: number | null;
    monto_cuota: number | null;
    cuota_estimated?: boolean;
    castigo_pct?: number;
    cuota_source_file_id?: string;
    cuotas_pagadas: number | null;
    cuotas_total: number | null;
    sourceFileId?: string;
} & SoftDeletable;
interface DeudasConsumoTableProps {
    rows: DeudaConsumoRow[];
    onRowsChange: (rows: DeudaConsumoRow[]) => void;
    formatCurrency?: (value: number | null | undefined) => string;
    ufValue?: number | null;
    castigo?: number;
    headerBg?: string;
    headerText?: string;
    onViewSource?: (fileIds: string[]) => void;
}

declare const DeudasConsumoTable: ({ rows, onRowsChange, formatCurrency, ufValue, castigo, headerBg, headerText, onViewSource, }: DeudasConsumoTableProps) => react_jsx_runtime.JSX.Element;

type PropiedadRow = {
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
    sourceFileId?: string;
} & SoftDeletable;
interface HipotecarioOption {
    entidad: string;
    saldo_pesos: number | null;
    saldo_uf: number | null;
    monto_cuota: number | null;
}
interface PropiedadesTableProps {
    rows: PropiedadRow[];
    onRowsChange: (rows: PropiedadRow[]) => void;
    formatCurrency?: (value: number | null | undefined) => string;
    ufValue?: number | null;
    capRate?: number;
    factorDescuento?: number;
    headerBg?: string;
    headerText?: string;
    onViewSource?: (fileIds: string[]) => void;
    title?: React.ReactNode;
    /** CMF hipotecario entries available for matching to properties via dropdown */
    hipotecarioOptions?: HipotecarioOption[];
}

declare const PropiedadesTable: ({ rows, onRowsChange, formatCurrency, ufValue, capRate, factorDescuento, headerBg, headerText, onViewSource, title, hipotecarioOptions, }: PropiedadesTableProps) => react_jsx_runtime.JSX.Element;

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

interface DeleteDialogProps {
    count: number;
    onConfirm: (reason: string) => void;
    onCancel: () => void;
}
declare const DeleteDialog: ({ count, onConfirm, onCancel }: DeleteDialogProps) => react_jsx_runtime.JSX.Element;

type RecycleBinRow = {
    id: string;
} & SoftDeletable;
interface RecycleBinProps<T extends RecycleBinRow> {
    deletedRows: T[];
    getLabel: (row: T) => string;
    onRestore: (id: string) => void;
}
declare function RecycleBin<T extends RecycleBinRow>({ deletedRows, getLabel, onRestore }: RecycleBinProps<T>): react_jsx_runtime.JSX.Element | null;

type SoftDeletableRow = {
    id: string;
} & SoftDeletable;
declare function useSoftDelete<T extends SoftDeletableRow>(rows: T[], onRowsChange: (rows: T[]) => void): {
    activeRows: T[];
    deletedRows: T[];
    deleteTargetId: string | null;
    requestDelete: (id: string) => void;
    confirmDelete: (reason: string) => void;
    cancelDelete: () => void;
    restoreRow: (id: string) => void;
};

declare const SourceIcon: ({ fileIds, onViewSource, className, }: {
    fileIds?: string[];
    onViewSource?: (ids: string[]) => void;
    className?: string;
}) => react_jsx_runtime.JSX.Element | null;
interface TableShellProps {
    headerBg?: string;
    defaultCollapsed?: boolean;
    forceExpanded?: boolean;
    disableToggle?: boolean;
    flush?: boolean;
    renderHeader: (ctx: {
        isExpanded: boolean;
    }) => React$1.ReactNode;
    children: React$1.ReactNode;
    renderAfterContent?: (ctx: {
        isExpanded: boolean;
    }) => React$1.ReactNode;
    contentClassName?: string;
    contentProps?: React$1.HTMLAttributes<HTMLDivElement>;
}
declare const TableShell: ({ headerBg, defaultCollapsed, forceExpanded, disableToggle, flush, renderHeader, children, renderAfterContent, contentClassName, contentProps, }: TableShellProps) => react_jsx_runtime.JSX.Element;

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

declare const displayCurrency: (value: number | undefined | null) => string;
/**
 * Compact currency: rounds to nearest thousand and displays without decimals.
 * 1_393_231 → "$1.393", 539_000 → "$539", 150 → "$0"
 */
/**
 * Full currency with em-dash for null/undefined.
 * 1_500_000 → "$ 1.500.000", null → "—"
 */
declare const defaultFormatCurrency: (value: number | null | undefined) => string;
declare const displayCurrencyCompact: (value: number | undefined | null, isDeduction?: boolean) => string;

export { ActivosSummary, type ActivosSummaryItem, type ActivosSummaryProps, type AutoComputeRule, type AutoConvertRule, type BoletaMonth, BoletasTable, type BoletasTableProps, type CodeudorIncomeInfo, type DebtEntry, DeleteDialog, type DeudaConsumoRow, DeudasConsumoTable, type DeudasConsumoTableProps, DeudasTable, type DeudasTableProps, FinalResultsCompact, type FinalResultsCompactProps, type FinalResultsValues, type HipotecarioOption, type InversionRow, InversionesTable, type InversionesTableProps, type Month, type PromptOptions, type PropiedadRow, PropiedadesTable, type PropiedadesTableProps, RecycleBin, type ReliquidacionBreakdown, type RentaTableProps, type RowData, type RowType, type SoftDeletable, SourceIcon, TableShell, type TableShellProps, type TributarioEntry, TributarioTable, type TributarioTableProps, type VehiculoRow, VehiculosTable, type VehiculosTableProps, applyAutoCompute, applyAutoConversions, RentaTable as default, defaultFormatCurrency, displayCurrency, displayCurrencyCompact, generateLastNMonths, useSoftDelete };
