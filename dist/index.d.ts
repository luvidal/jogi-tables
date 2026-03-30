import * as react_jsx_runtime from 'react/jsx-runtime';
import React$1, { ReactNode } from 'react';

/**
 * ColorScheme — single source of truth for table section coloring.
 *
 * Consumers pass one `colorScheme` prop instead of separate headerBg/headerText.
 * The library applies it consistently to headers, footers, borders, and accents.
 */
interface ColorScheme {
    /** Header/footer background — e.g. 'bg-rose-50' */
    bg: string;
    /** Header/footer text + icon color — e.g. 'text-rose-700' */
    text: string;
    /** Section border — e.g. 'border-rose-200' */
    border: string;
}
/** Neutral fallback when no scheme is provided */
declare const DEFAULT_SCHEME: ColorScheme;
/**
 * Resolve color scheme from new `colorScheme` prop or legacy `headerBg`/`headerText`.
 * Priority: colorScheme > headerBg/headerText > defaultScheme
 */
declare function resolveColors(colorScheme?: ColorScheme, headerBg?: string, headerText?: string, defaultScheme?: ColorScheme): ColorScheme;

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
    legalType?: 'afp' | 'salud' | 'cesantia' | 'impuesto';
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
    colorScheme?: ColorScheme;
    /** @deprecated Use colorScheme instead */
    headerBg?: string;
    /** @deprecated Use colorScheme instead */
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

declare const RentaTable: ({ title, months, rows, onRowsChange, sections, colorScheme: colorSchemeProp, headerBg: headerBgProp, headerText: headerTextProp, defaultCollapsed, forceExpanded, flush, formatValue, calculateTotal, showVariableColumn, showClassificationColumns, sourceFileIds, onViewSource, reliquidacion, }: RentaTableProps) => react_jsx_runtime.JSX.Element;

declare const generateLastNMonths: (count: number) => Month[];

type SoftDeletable = {
    deletedAt?: string;
    deletionReason?: string;
};

type DeudaRow = {
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
interface DeudasTableProps {
    rows: DeudaRow[];
    onRowsChange: (rows: DeudaRow[]) => void;
    formatCurrency?: (value: number | null | undefined) => string;
    ufValue?: number | null;
    castigo?: number;
    colorScheme?: ColorScheme;
    /** @deprecated Use colorScheme instead */
    headerBg?: string;
    /** @deprecated Use colorScheme instead */
    headerText?: string;
    onViewSource?: (fileIds: string[]) => void;
}

declare const DeudasTable: ({ rows, onRowsChange, formatCurrency, ufValue, castigo, colorScheme: colorSchemeProp, headerBg: headerBgProp, headerText: headerTextProp, onViewSource, }: DeudasTableProps) => react_jsx_runtime.JSX.Element;

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
    colorScheme?: ColorScheme;
    /** @deprecated Use colorScheme instead */
    headerBg?: string;
    /** @deprecated Use colorScheme instead */
    headerText?: string;
    defaultCollapsed?: boolean;
    forceExpanded?: boolean;
    flush?: boolean;
    sourceFileIds?: string[];
    onViewSource?: (fileIds: string[]) => void;
    onRemoveMonth?: (periodo: string) => void;
    /** Periodos excluded from summary calculations — columns are dimmed and clickable to toggle */
    excludedMonths?: string[];
    onToggleMonth?: (periodo: string) => void;
}
declare const BoletasTable: ({ title, months, colorScheme: colorSchemeProp, headerBg: headerBgProp, headerText: headerTextProp, defaultCollapsed, forceExpanded, flush, sourceFileIds, onViewSource, excludedMonths, onToggleMonth, }: BoletasTableProps) => react_jsx_runtime.JSX.Element;

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
    colorScheme?: ColorScheme;
    /** @deprecated Use colorScheme instead */
    headerBg?: string;
    /** @deprecated Use colorScheme instead */
    headerText?: string;
    defaultCollapsed?: boolean;
    forceExpanded?: boolean;
    flush?: boolean;
    sourceFileIds?: string[];
    onViewSource?: (fileIds: string[]) => void;
}
declare const TributarioTable: ({ title, entries, colorScheme: colorSchemeProp, headerBg: headerBgProp, headerText: headerTextProp, defaultCollapsed, forceExpanded, flush, sourceFileIds, onViewSource, }: TributarioTableProps) => react_jsx_runtime.JSX.Element;

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
    colorScheme?: ColorScheme;
    /** @deprecated Use colorScheme instead */
    headerBg?: string;
    /** @deprecated Use colorScheme instead */
    headerText?: string;
    title?: React.ReactNode;
}

declare const VehiculosTable: ({ rows, onRowsChange, formatCurrency, colorScheme, headerBg, headerText, title, }: VehiculosTableProps) => react_jsx_runtime.JSX.Element;

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
    colorScheme?: ColorScheme;
    /** @deprecated Use colorScheme instead */
    headerBg?: string;
    /** @deprecated Use colorScheme instead */
    headerText?: string;
    title?: React.ReactNode;
}

declare const InversionesTable: ({ rows, onRowsChange, formatCurrency, colorScheme, headerBg, headerText, title, }: InversionesTableProps) => react_jsx_runtime.JSX.Element;

type PropiedadRow = {
    id: string;
    direccion: string;
    comuna: string;
    valor_uf: number | null;
    valor_pesos: number | null;
    arriendo_real: number | null;
    arriendo_futuro: number | null;
} & SoftDeletable;
interface PropiedadesTableProps {
    rows: PropiedadRow[];
    onRowsChange: (rows: PropiedadRow[]) => void;
    formatCurrency?: (value: number | null | undefined) => string;
    ufValue?: number | null;
    capRate?: number;
    factorDescuento?: number;
    colorScheme?: ColorScheme;
    /** @deprecated Use colorScheme instead */
    headerBg?: string;
    /** @deprecated Use colorScheme instead */
    headerText?: string;
    title?: React.ReactNode;
}

declare const PropiedadesTable: ({ rows, onRowsChange, formatCurrency, ufValue, capRate, factorDescuento, colorScheme, headerBg, headerText, title, }: PropiedadesTableProps) => react_jsx_runtime.JSX.Element;

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

type AssetRow = {
    id: string;
} & SoftDeletable & Record<string, unknown>;
interface ColumnDef {
    key: string;
    label: string;
    type: 'text' | 'currency' | 'number';
    width: string;
    align?: 'left' | 'right' | 'center';
    placeholder?: string;
    isLabel?: boolean;
    /** Key of the paired UF/CLP field shown when currency toggle switches */
    ufPair?: string;
    /** Return class to apply when cell value is auto-computed */
    autoComputedClass?: (row: Record<string, unknown>) => string;
}
interface AssetTableProps<T extends AssetRow = AssetRow> {
    columns: ColumnDef[];
    rows: T[];
    onRowsChange: (rows: T[]) => void;
    idPrefix: string;
    addPlaceholder?: string;
    formatCurrency?: (value: number | null | undefined) => string;
    colorScheme?: ColorScheme;
    /** @deprecated Use colorScheme instead */
    headerBg?: string;
    /** @deprecated Use colorScheme instead */
    headerText?: string;
    title?: React.ReactNode;
    /** UF value — enables UF/$ toggle when columns have ufPair */
    ufValue?: number | null;
    /** Auto-conversion rules (UF↔CLP) */
    conversionRules?: AutoConvertRule[];
    /** Auto-compute rules */
    computeRules?: AutoComputeRule[];
}

declare function AssetTable<T extends AssetRow>({ columns, rows, onRowsChange, idPrefix, addPlaceholder, formatCurrency, colorScheme: colorSchemeProp, headerBg: headerBgProp, headerText: headerTextProp, title, ufValue, conversionRules, computeRules, }: AssetTableProps<T>): react_jsx_runtime.JSX.Element;

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

type SummaryRowType = 'subheader' | 'data' | 'total' | 'grandtotal';
type SummaryRowFormat = 'currency' | 'percent' | 'integer';
interface SummaryRow {
    label: string;
    values: (number | null)[];
    type: SummaryRowType;
    format?: SummaryRowFormat;
    fieldKey?: string;
}
interface SummaryTableProps {
    columnHeaders: string[];
    rows: SummaryRow[];
    colorScheme?: ColorScheme;
    /** Extra column rendered before data columns (e.g., castigo input) */
    extraColumn?: {
        header: string;
        width?: string;
        render: (row: SummaryRow, index: number) => ReactNode;
    };
    /** Rendered after the label text (e.g., warning icon) */
    renderLabelSuffix?: (row: SummaryRow, index: number) => ReactNode;
    /** Column width for data columns */
    columnWidth?: string;
}

declare const SummaryTable: ({ columnHeaders, rows, extraColumn, renderLabelSuffix, columnWidth, colorScheme }: SummaryTableProps) => react_jsx_runtime.JSX.Element;

interface DeclaracionColumn {
    key: string;
    label: string;
}
interface DeclaracionRow {
    key: string;
    label: string;
    /** Whether this row should be included in the sum total */
    summed?: boolean;
}
interface DeclaracionTableProps {
    columns: DeclaracionColumn[];
    rows: DeclaracionRow[];
    /** Row data: rows × columns matrix. data[rowKey][colKey] = value */
    data: Record<string, Record<string, number | null>>;
    /** Total row config. When provided, shows a sum row at the bottom using only `summed` rows. */
    totalLabel?: string;
    formatCurrency: (value: number) => string;
    colorScheme?: ColorScheme;
    sourceFileIds?: string[];
    onViewSource?: (fileIds: string[]) => void;
}

declare const DeclaracionTable: ({ columns, rows, data, totalLabel, formatCurrency, colorScheme: colorSchemeProp, sourceFileIds, onViewSource, }: DeclaracionTableProps) => react_jsx_runtime.JSX.Element;

interface EditableCellProps {
    value: number | string | null | undefined;
    onChange: (value: number | string | null) => void;
    type?: 'text' | 'number' | 'currency' | 'percent';
    isDeduction?: boolean;
    hasData?: boolean;
    className?: string;
    width?: string;
    align?: 'left' | 'center' | 'right';
    placeholder?: string;
    /** Callback to view source document - shows Eye icon on hover */
    onViewSource?: () => void;
    /** Render as div instead of td (for non-table contexts) */
    asDiv?: boolean;
    /** Show focus ring (keyboard navigation) */
    focused?: boolean;
    /** Called when cell is clicked (for focus tracking) */
    onCellFocus?: () => void;
    /** Called after edit commit to navigate to next cell (Tab→right, Enter→down) */
    onNavigate?: (direction: 'up' | 'down' | 'left' | 'right') => void;
    /** Increment to trigger edit externally (keyboard Enter/F2 on focused cell) */
    requestEdit?: number;
    /** Increment to clear the cell value (keyboard Delete/Backspace on focused cell) */
    requestClear?: number;
    /** Initial value for type-to-edit (the character pressed to start editing) */
    editInitialValue?: string | null;
}
/**
 * EditableCell - An inline-editable table cell
 *
 * Click to select (focus ring), double-click/Enter/F2/type to edit.
 * IMPORTANT: This component uses a fixed-size container to prevent layout shifts
 * when toggling between display and edit modes. The input is absolutely positioned
 * within a fixed-height container so clicking to edit does NOT scramble/shift
 * the table layout.
 */
declare const EditableCell: ({ value, onChange, type, isDeduction, hasData, className, width, align, placeholder, onViewSource, asDiv, focused, onCellFocus, onNavigate, requestEdit, requestClear, editInitialValue, }: EditableCellProps) => react_jsx_runtime.JSX.Element;

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
    renderCells?: (row: T) => React.ReactNode;
}
declare function RecycleBin<T extends RecycleBinRow>({ deletedRows, getLabel, onRestore, renderCells }: RecycleBinProps<T>): react_jsx_runtime.JSX.Element | null;

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
    colorScheme?: ColorScheme;
    /** @deprecated Use colorScheme instead */
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
declare const TableShell: ({ colorScheme: colorSchemeProp, headerBg: headerBgProp, defaultCollapsed, forceExpanded, disableToggle, flush, renderHeader, children, renderAfterContent, contentClassName, contentProps, }: TableShellProps) => react_jsx_runtime.JSX.Element;

declare const generateId: (prefix: string) => string;
declare const formatDeletedDate: (iso: string) => string;
declare const MONTH_LABELS: Record<string, string>;
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

declare const CurrencyToggle: ({ value, onChange }: {
    value: "uf" | "clp";
    onChange: (v: "uf" | "clp") => void;
}) => react_jsx_runtime.JSX.Element;

export { ActivosSummary, type ActivosSummaryItem, type ActivosSummaryProps, AssetTable, type AssetTableProps, type AutoComputeRule, type AutoConvertRule, type BoletaMonth, BoletasTable, type BoletasTableProps, type CodeudorIncomeInfo, type ColorScheme, type ColumnDef, CurrencyToggle, DEFAULT_SCHEME, type DeclaracionColumn, type DeclaracionRow, DeclaracionTable, type DeclaracionTableProps, DeleteDialog, type DeudaRow, DeudasTable, type DeudasTableProps, EditableCell, FinalResultsCompact, type FinalResultsCompactProps, type FinalResultsValues, type InversionRow, InversionesTable, type InversionesTableProps, MONTH_LABELS, type Month, type PromptOptions, type PropiedadRow, PropiedadesTable, type PropiedadesTableProps, RecycleBin, type ReliquidacionBreakdown, type RentaTableProps, type RowData, type RowType, type SoftDeletable, SourceIcon, type SummaryRow, type SummaryRowFormat, type SummaryRowType, SummaryTable, type SummaryTableProps, TableShell, type TableShellProps, type TributarioEntry, TributarioTable, type TributarioTableProps, type VehiculoRow, VehiculosTable, type VehiculosTableProps, applyAutoCompute, applyAutoConversions, RentaTable as default, defaultFormatCurrency, displayCurrency, displayCurrencyCompact, formatDeletedDate, generateId, generateLastNMonths, resolveColors, useSoftDelete };
