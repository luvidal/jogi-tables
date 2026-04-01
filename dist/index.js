'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React3 = require('react');
var lucideReact = require('lucide-react');
var jsxRuntime = require('react/jsx-runtime');
var reactDom = require('react-dom');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React3__default = /*#__PURE__*/_interopDefault(React3);

// src/renta/index.tsx

// src/common/styles.ts
var T = {
  // ── Base ──
  table: "w-full text-xs border-separate border-spacing-0",
  // ── Header: accordion bar (TableShell) ──
  headerAccordion: "px-4 py-2.5",
  headerAccordionStat: "px-2 py-2.5 text-right",
  headerTitle: "font-normal text-xs truncate",
  headerStat: "font-normal text-xs",
  headerStatLabel: "font-normal text-xs uppercase",
  // ── Header: column headers (th) ──
  th: "text-gray-500 font-medium text-xs uppercase",
  headerCell: "px-2 py-1.5",
  /** Vertical divider between columns */
  vline: "border-r border-gray-200",
  /** Action column (delete button) — fixed narrow width */
  actionCol: "w-10",
  /** Compact cell padding for small icon/badge columns (80px min) */
  cellCompact: "px-0.5 py-1",
  // ── Body: read-only cells (compact) ──
  cell: "py-1.5 px-3",
  cellValue: "py-1.5 px-3 text-right tabular-nums",
  cellLabel: "overflow-hidden",
  // ── Body: editable cells (taller click targets) ──
  cellEdit: "px-2 py-1.5",
  cellEditLabel: "pl-1 pr-2 py-1.5",
  // ── Totals / footer ──
  totalCell: "px-2 py-1.5",
  totalLabel: "font-medium text-xs",
  totalValue: "font-medium text-xs",
  footerLabel: "font-bold",
  footerValue: "font-bold",
  // ── Inputs (transparent inline) ──
  input: "bg-transparent border-none outline-none text-xs truncate",
  inputLabel: "bg-transparent border-none outline-none text-xs font-medium truncate",
  inputPlaceholder: "bg-transparent border-none outline-none text-xs text-gray-500 placeholder-gray-400 truncate",
  rowLabel: "bg-transparent border-none outline-none text-xs font-medium text-gray-600 truncate",
  /** Data row indent (child rows below subheaders) */
  cellIndent: "pl-6",
  muted: "text-xs text-gray-600",
  empty: "text-xs text-gray-400 italic",
  cardLabel: "text-xs font-medium",
  cardValue: "text-xs font-semibold",
  // ── Row classes ──
  row: "border-b border-gray-100",
  rowBorder: "border-b border-gray-100",
  rowHover: "hover:bg-gray-50",
  rowTotal: "border-b bg-gray-50/80 border-gray-200"};

// src/common/colors.ts
var DEFAULT_SCHEME = {
  bg: "bg-gray-100",
  text: "text-gray-700",
  border: "border-gray-200"
};
function resolveColors(colorScheme, headerBg, headerText, defaultScheme = DEFAULT_SCHEME) {
  if (colorScheme) return colorScheme;
  if (headerBg || headerText) {
    const bg = headerBg || defaultScheme.bg;
    const text = headerText || defaultScheme.text;
    const border = bg.replace("bg-", "border-").replace(/-(50|100)$/, "-200");
    return { bg, text, border };
  }
  return defaultScheme;
}
var SourceIcon = ({
  fileIds,
  onViewSource,
  className
}) => {
  if (!fileIds?.length || !onViewSource) return null;
  return /* @__PURE__ */ jsxRuntime.jsx(
    "button",
    {
      onClick: (e) => {
        e.stopPropagation();
        onViewSource(fileIds);
      },
      className: "p-1 rounded hover:bg-white/50 transition-all opacity-0 group-hover/header:opacity-100",
      title: "Ver documento fuente",
      children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Eye, { size: 14, className })
    }
  );
};
var TableShell = ({
  colorScheme: colorSchemeProp,
  headerBg: headerBgProp = "bg-gray-100",
  headerClassName,
  className,
  renderHeader,
  children,
  renderFooter,
  renderAfterContent
}) => {
  const { bg: headerBg } = resolveColors(colorSchemeProp, headerBgProp);
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: `border-y border-gray-200 mb-3 sm:mb-4 ${className || ""}`, children: [
    /* @__PURE__ */ jsxRuntime.jsxs("table", { className: T.table, children: [
      /* @__PURE__ */ jsxRuntime.jsx("thead", { children: /* @__PURE__ */ jsxRuntime.jsx("tr", { className: `${headerBg} ${headerClassName || ""} group/header`, children: renderHeader() }) }),
      /* @__PURE__ */ jsxRuntime.jsx("tbody", { children }),
      renderFooter && /* @__PURE__ */ jsxRuntime.jsx("tfoot", { children: renderFooter() })
    ] }),
    renderAfterContent?.()
  ] });
};
var tableshell_default = TableShell;

// src/common/utils.ts
var generateId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
var formatDeletedDate = (iso) => {
  const d = new Date(iso);
  const now = /* @__PURE__ */ new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 6e4);
  if (diffMin < 1) return "hace un momento";
  if (diffMin < 60) return `hace ${diffMin} min`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `hace ${diffHrs}h`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `hace ${diffDays}d`;
  return d.toLocaleDateString("es-CL", { day: "numeric", month: "short" });
};
var MONTH_LABELS = {
  enero: "Enero",
  febrero: "Febrero",
  marzo: "Marzo",
  abril: "Abril",
  mayo: "Mayo",
  junio: "Junio",
  julio: "Julio",
  agosto: "Agosto",
  septiembre: "Septiembre",
  octubre: "Octubre",
  noviembre: "Noviembre",
  diciembre: "Diciembre"
};
var displayCurrency = (value) => {
  if (value === void 0 || value === null) return "";
  return `$ ${value.toLocaleString("es-CL")}`;
};
var defaultFormatCurrency = (value) => {
  if (value === void 0 || value === null) return "\u2014";
  return `$ ${value.toLocaleString("es-CL")}`;
};
var displayCurrencyCompact = (value, isDeduction = false) => {
  if (value === void 0 || value === null) return "\u2014";
  const abs = Math.abs(value);
  const sign = isDeduction && value > 0 ? "-" : "";
  const thousands = Math.round(abs / 1e3);
  return `${sign}$${thousands.toLocaleString("es-CL")}`;
};

// src/renta/helpers.ts
var MONTH_NAMES = ["", "ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
var generateLastNMonths = (count) => {
  const months = [];
  const now = /* @__PURE__ */ new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const id = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = MONTH_NAMES[d.getMonth() + 1];
    months.push({ id, label });
  }
  return months;
};
var defaultFormatValue = (value) => {
  return displayCurrencyCompact(value);
};
var isAddType = (type) => type === "add" || type === "income";
var isSubtractType = (type) => type === "subtract" || type === "deduction" || type === "debt";
var rowMatchesSection = (row, sectionType) => {
  if (row.type === sectionType) return true;
  if (sectionType === "add" && row.type === "income") return true;
  if (sectionType === "income" && row.type === "add") return true;
  if (sectionType === "subtract" && (row.type === "deduction" || row.type === "debt")) return true;
  return false;
};
var defaultCalculateTotal = (monthId, rows) => {
  let total = 0;
  for (const row of rows) {
    if (row.isGroup || row.deletedAt) continue;
    const value = row.values[monthId];
    if (value !== null && value !== void 0) {
      if (isAddType(row.type)) {
        total += value;
      } else {
        total -= value;
      }
    }
  }
  return total;
};
var getOrderedItems = (rows, sectionType) => {
  const sectionRows = rows.filter((r) => rowMatchesSection(r, sectionType) && !r.deletedAt);
  const groups = sectionRows.filter((r) => r.isGroup);
  const groupedChildren = sectionRows.filter((r) => r.groupId && !r.isGroup);
  const ungrouped = sectionRows.filter((r) => !r.isGroup && !r.groupId);
  const items = [];
  for (const group of groups) {
    const children = groupedChildren.filter((r) => r.groupId === group.id).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    items.push({ kind: "group", group, children, sortKey: group.order ?? 0 });
  }
  for (const row of ungrouped) {
    items.push({ kind: "row", row, sortKey: row.order ?? 0 });
  }
  items.sort((a, b) => a.sortKey - b.sortKey);
  return items;
};
var computeSectionSubtotal = (rows, sectionType, months) => {
  const sectionRows = rows.filter((r) => rowMatchesSection(r, sectionType) && !r.isGroup && !r.deletedAt);
  const result = {};
  for (const month of months) {
    let sum = 0;
    for (const row of sectionRows) {
      sum += row.values[month.id] ?? 0;
    }
    result[month.id] = sum;
  }
  return result;
};
var computeRentaVariable = (rows, months) => {
  const result = {};
  for (const month of months) {
    let sum = 0;
    for (const row of rows) {
      if (row.isGroup || row.deletedAt || !row.isVariable) continue;
      if (row.naturaleza === "Legal") continue;
      const value = row.values[month.id] ?? 0;
      if (isAddType(row.type)) sum += value;
      else sum -= value;
    }
    result[month.id] = sum;
  }
  return result;
};
var computeGroupValues = (children, months) => {
  const result = {};
  for (const month of months) {
    let sum = 0;
    for (const child of children) {
      sum += child.values[month.id] ?? 0;
    }
    result[month.id] = sum;
  }
  return result;
};
var createGroup = (rows, selectedIds, groupName) => {
  const selected = rows.filter((r) => selectedIds.has(r.id));
  if (selected.length < 2) return rows;
  const groupType = selected[0].type;
  const groupId = `group_${Date.now()}`;
  const firstIdx = rows.findIndex((r) => selectedIds.has(r.id));
  const newRows = rows.map((r, idx) => {
    if (selectedIds.has(r.id)) {
      return { ...r, groupId, order: idx };
    }
    return { ...r, order: idx };
  });
  const groupHeader = {
    id: groupId,
    label: groupName,
    type: groupType,
    values: {},
    isGroup: true,
    collapsed: true,
    order: firstIdx
  };
  newRows.splice(firstIdx, 0, groupHeader);
  return autoUngroup(newRows);
};
var ungroupRows = (rows, groupId) => {
  return rows.filter((r) => r.id !== groupId).map((r) => {
    if (r.groupId === groupId) {
      const { groupId: _, ...rest } = r;
      return rest;
    }
    return r;
  });
};
var autoUngroup = (rows) => {
  const groups = rows.filter((r) => r.isGroup && !r.deletedAt);
  let result = rows;
  for (const group of groups) {
    const children = result.filter((r) => r.groupId === group.id && !r.deletedAt);
    if (children.length < 2) {
      result = ungroupRows(result, group.id);
    }
  }
  return result;
};
var softDeleteRows = (rows, ids, reason) => {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  let result = rows.map((r) => {
    if (!ids.has(r.id)) return r;
    return { ...r, deletedAt: now, deletionReason: reason || void 0 };
  });
  return autoUngroup(result);
};
var restoreRows = (rows, ids) => {
  return rows.map((r) => {
    if (!ids.has(r.id)) return r;
    const { deletedAt: _, deletionReason: __, ...rest } = r;
    return rest;
  });
};
var useIsMobile = () => {
  const [isMobile, setIsMobile] = React3.useState(false);
  React3.useEffect(() => {
    const mql = window.matchMedia("(max-width: 639px)");
    setIsMobile(mql.matches);
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
  return isMobile;
};
var parseCurrency = (value) => {
  const cleaned = value.replace(/[^0-9-]/g, "");
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? null : num;
};
var EditableCell = ({
  value,
  onChange,
  type = "currency",
  isDeduction = false,
  hasData = true,
  className = "",
  align = "right",
  placeholder = "",
  onViewSource,
  asDiv = false,
  focused = false,
  onCellFocus,
  onNavigate,
  requestEdit = 0,
  requestClear = 0,
  editInitialValue
}) => {
  const isMobile = useIsMobile();
  const [isEditing, setIsEditing] = React3.useState(false);
  const [editValue, setEditValue] = React3.useState("");
  const [isHovered, setIsHovered] = React3.useState(false);
  const inputRef = React3.useRef(null);
  const startEdit = (initialValue) => {
    setEditValue(initialValue ?? value?.toString() ?? "");
    setIsEditing(true);
  };
  React3.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (editValue.length <= 1) {
        const len = inputRef.current.value.length;
        inputRef.current.setSelectionRange(len, len);
      } else {
        inputRef.current.select();
      }
    }
  }, [isEditing]);
  const commitEdit = () => {
    setIsEditing(false);
    let newValue = editValue;
    if (type === "number") {
      newValue = editValue === "" ? null : parseInt(editValue, 10);
      if (typeof newValue === "number" && isNaN(newValue)) newValue = null;
    } else if (type === "currency") {
      newValue = parseCurrency(editValue);
    } else if (type === "percent") {
      newValue = editValue === "" ? null : parseFloat(editValue);
      if (typeof newValue === "number" && isNaN(newValue)) newValue = null;
    } else {
      newValue = editValue === "" ? null : editValue;
    }
    if (newValue != value) {
      onChange(newValue);
    }
  };
  const cancelEdit = () => {
    setIsEditing(false);
    setEditValue("");
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitEdit();
      onNavigate?.("down");
    } else if (e.key === "Tab") {
      e.preventDefault();
      commitEdit();
      onNavigate?.(e.shiftKey ? "left" : "right");
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };
  const getDisplayValue = () => {
    if (type === "currency") {
      return displayCurrencyCompact(value, isDeduction);
    }
    if (type === "percent") {
      if (value === null || value === void 0) return "\u2014";
      return `${value}%`;
    }
    return value?.toString() || "\u2014";
  };
  const displayValue = getDisplayValue();
  const colorClass = isDeduction && type === "currency" ? hasData ? "text-rose-600" : "text-gray-300" : hasData ? "text-gray-800" : "text-gray-300";
  const alignClass = align === "left" ? "text-left justify-start" : align === "center" ? "text-center justify-center" : "text-right justify-end";
  const inputAlignClass = align === "left" ? "text-left" : align === "center" ? "text-center" : "text-right";
  const Wrapper = asDiv ? "div" : "td";
  React3.useEffect(() => {
    if (requestEdit > 0 && !isEditing) {
      startEdit(editInitialValue ?? void 0);
    }
  }, [requestEdit]);
  React3.useEffect(() => {
    if (requestClear > 0) {
      onChange(null);
    }
  }, [requestClear]);
  const handleClick = () => {
    if (!isEditing) {
      onCellFocus?.();
    }
  };
  const handleDoubleClick = () => {
    if (!isEditing) {
      onCellFocus?.();
      startEdit();
    }
  };
  const focusRing = focused && !isEditing ? "ring-2 ring-blue-400 ring-inset" : "";
  return /* @__PURE__ */ jsxRuntime.jsx(
    Wrapper,
    {
      className: `${T.cellEdit} cursor-pointer ${focusRing} ${className}`,
      onClick: handleClick,
      onDoubleClick: handleDoubleClick,
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: `h-5 flex items-center ${alignClass} gap-1`, children: [
        onViewSource && (isMobile || isHovered) && !isEditing && /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            onClick: (e) => {
              e.stopPropagation();
              onViewSource();
            },
            className: `p-0.5 rounded hover:bg-gray-200 transition-all shrink-0 ${isMobile ? "opacity-100" : ""}`,
            title: "Ver documento fuente",
            children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Eye, { size: 14, className: "text-gray-400" })
          }
        ),
        isEditing ? /* @__PURE__ */ jsxRuntime.jsx(
          "input",
          {
            ref: inputRef,
            type: "text",
            inputMode: type === "currency" || type === "number" ? "numeric" : void 0,
            value: editValue,
            onChange: (e) => setEditValue(e.target.value),
            onBlur: commitEdit,
            onKeyDown: handleKeyDown,
            className: `w-full ${inputAlignClass} text-xs bg-transparent border-none outline-none`,
            autoComplete: "off"
          }
        ) : /* @__PURE__ */ jsxRuntime.jsx(
          "span",
          {
            className: `text-xs tabular-nums ${colorClass} ${!hasData ? "text-gray-300" : ""}`,
            title: type === "currency" && hasData ? displayCurrency(value) : void 0,
            children: displayValue
          }
        )
      ] })
    }
  );
};
var editablecell_default = EditableCell;
var DeleteRowButton = ({
  onClick,
  isVisible,
  size = "sm",
  title = "Eliminar"
}) => {
  const padding = size === "sm" ? "p-0.5" : "p-1";
  const iconSize = size === "sm" ? 14 : 16;
  return /* @__PURE__ */ jsxRuntime.jsx(
    "button",
    {
      onClick,
      className: `${padding} rounded transition-all shrink-0 ${isVisible ? "opacity-100 text-red-400 hover:text-red-600 hover:bg-red-100" : "opacity-0"}`,
      title,
      children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.X, { size: iconSize })
    }
  );
};
var deletebutton_default = DeleteRowButton;
var naturalezaPill = (n) => {
  switch (n) {
    case "Imponible":
      return { label: "IMP", style: "bg-blue-50 text-blue-600 border border-blue-200" };
    case "No imponible":
      return { label: "NO IMP", style: "bg-gray-50 text-gray-500 border border-gray-200" };
    case "Legal":
      return { label: "LEGAL", style: "bg-green-50 text-green-600 border border-green-200" };
    case "Otro":
      return { label: "OTRO", style: "bg-slate-50 text-slate-500 border border-slate-200" };
    default:
      return { label: "\u2014", style: "bg-gray-50 text-gray-300 border border-gray-100" };
  }
};
var rentaPill = (isVariable, naturaleza) => {
  if (naturaleza === "Legal") return { label: "\u2014", style: "bg-gray-50 text-gray-300 border border-gray-100" };
  return isVariable ? { label: "RV", style: "bg-amber-50 text-amber-600 border border-amber-200" } : { label: "RF", style: "bg-sky-50 text-sky-600 border border-sky-200" };
};
var PILL = "rounded-sm py-0.5 text-[9px] font-semibold cursor-pointer select-none transition-opacity hover:opacity-70 block leading-tight whitespace-nowrap text-center mx-auto px-1.5";
var DataRow = ({
  row,
  months,
  isHovered,
  selected = false,
  anySelected = false,
  selectable = false,
  hoverProps,
  onRemove,
  onToggleSelect,
  onContextMenu,
  onLabelChange,
  onValueChange,
  onViewSource,
  isCellFocused,
  onCellFocus,
  onNavigate,
  editTrigger = 0,
  clearTrigger = 0,
  editInitialValue,
  showVariableColumn = false,
  onToggleVariable,
  showClassificationColumns = false,
  onToggleNaturaleza,
  isDragging = false,
  dropIndicator,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd
}) => {
  const indented = !!row.groupId;
  const subtract = isSubtractType(row.type);
  const rowBg = selected ? "bg-emerald-50/60" : row.isVariable ? subtract ? "bg-amber-50/60 hover:bg-amber-100/50" : "bg-amber-50/40 hover:bg-amber-100/40" : subtract ? "bg-red-50/50 hover:bg-red-100/50" : "hover:bg-gray-50";
  const showCheckbox = selectable && (anySelected || isHovered);
  const dropBorder = dropIndicator === "above" ? "border-t-2 border-t-blue-400" : dropIndicator === "below" ? "border-b-2 border-b-blue-400" : "";
  const handleRowClick = (e) => {
    if (!selectable || !onToggleSelect) return;
    if (!(e.metaKey || e.ctrlKey)) return;
    const target = e.target;
    if (target.closest('input, button, [role="button"]')) return;
    e.preventDefault();
    onToggleSelect();
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "tr",
    {
      className: `border-b border-gray-100 ${rowBg} ${isDragging ? "opacity-40" : ""} ${dropBorder} group`,
      onClick: handleRowClick,
      ...hoverProps,
      onContextMenu,
      onDragOver,
      onDragLeave,
      onDrop,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.cellEditLabel} text-gray-700 ${T.cellLabel} ${showClassificationColumns ? "" : T.vline}`, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: `flex items-center gap-0.5 min-w-0 ${indented ? "pl-4" : ""}`, children: [
          onDragStart && !anySelected && /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              draggable: isHovered,
              onDragStart,
              onDragEnd,
              className: `shrink-0 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 transition-opacity ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`,
              title: "Arrastrar para reordenar",
              children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.GripVertical, { size: 14 })
            }
          ),
          selectable ? /* @__PURE__ */ jsxRuntime.jsx(
            "input",
            {
              type: "checkbox",
              checked: selected,
              onChange: onToggleSelect,
              className: `shrink-0 w-3.5 h-3.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer transition-opacity ${showCheckbox ? "opacity-100" : "opacity-0 pointer-events-none"}`
            }
          ) : null,
          /* @__PURE__ */ jsxRuntime.jsx(
            "input",
            {
              type: "text",
              value: row.label,
              onChange: (e) => onLabelChange(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter") e.target.blur();
              },
              className: `flex-1 min-w-0 ${T.rowLabel}`,
              title: row.label
            }
          ),
          row.sourceFileId && onViewSource && /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              onClick: () => onViewSource([row.sourceFileId]),
              className: `p-1 rounded transition-all shrink-0 ${isHovered ? "opacity-100 text-gray-400 hover:text-gray-600 hover:bg-gray-100" : "opacity-0"}`,
              title: "Ver documento fuente",
              children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Eye, { size: 14 })
            }
          )
        ] }) }),
        showClassificationColumns && (() => {
          const tipo = naturalezaPill(row.naturaleza);
          const renta = rentaPill(row.isVariable, row.naturaleza);
          return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              "td",
              {
                className: `${T.cellCompact} text-center`,
                onClick: (e) => {
                  e.stopPropagation();
                  onToggleNaturaleza?.();
                },
                title: `${row.naturaleza || "Sin tipo"} \u2014 click para cambiar`,
                children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${PILL} ${tipo.style}`, children: tipo.label })
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
              "td",
              {
                className: `${T.cellCompact} text-center ${T.vline}`,
                onClick: (e) => {
                  e.stopPropagation();
                  if (row.naturaleza !== "Legal") onToggleVariable?.();
                },
                title: row.naturaleza === "Legal" ? "Descuento legal" : row.isVariable ? "Variable \u2014 click para cambiar a Fija" : "Fija \u2014 click para cambiar a Variable",
                children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${PILL} ${renta.style}`, children: renta.label })
              }
            )
          ] });
        })(),
        showVariableColumn && !showClassificationColumns && (() => {
          const renta = rentaPill(row.isVariable, void 0);
          return /* @__PURE__ */ jsxRuntime.jsx(
            "td",
            {
              className: `${T.cellCompact} text-center ${T.vline}`,
              onClick: (e) => {
                e.stopPropagation();
                onToggleVariable?.();
              },
              title: row.isVariable ? "Variable \u2014 click para cambiar a Fija" : "Fija \u2014 click para cambiar a Variable",
              children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${PILL} ${renta.style}`, children: renta.label })
            }
          );
        })(),
        months.map((p, mi) => {
          const cellFocused = isCellFocused?.(mi) ?? false;
          const vline = mi < months.length - 1 ? T.vline : "";
          return /* @__PURE__ */ jsxRuntime.jsx(
            editablecell_default,
            {
              value: row.values[p.id] ?? null,
              onChange: (v) => onValueChange(p.id, v),
              isDeduction: subtract,
              hasData: row.values[p.id] !== void 0 && row.values[p.id] !== null,
              className: vline,
              type: "currency",
              onViewSource: p.sourceFileId && onViewSource ? () => onViewSource([p.sourceFileId]) : void 0,
              focused: cellFocused,
              onCellFocus: onCellFocus ? () => onCellFocus(mi) : void 0,
              onNavigate,
              requestEdit: cellFocused ? editTrigger : 0,
              requestClear: cellFocused ? clearTrigger : 0,
              editInitialValue: cellFocused ? editInitialValue : void 0
            },
            p.id
          );
        }),
        /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.actionCol} text-center`, children: /* @__PURE__ */ jsxRuntime.jsx(deletebutton_default, { onClick: onRemove, isVisible: isHovered && !anySelected, title: "Eliminar fila" }) })
      ]
    }
  );
};
var datarow_default = DataRow;
var AddRow = ({
  section,
  months,
  labelValue,
  onLabelChange,
  onAddRow,
  onAddRowWithValue,
  showVariableColumn = false,
  showClassificationColumns = false
}) => {
  const subtract = isSubtractType(section.type);
  const bgClass = subtract ? "bg-red-50/30 border-red-100" : "bg-gray-50/30 border-gray-100";
  return /* @__PURE__ */ jsxRuntime.jsxs("tr", { className: `border-b border-dashed ${bgClass}`, children: [
    /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.cellEdit} ${showClassificationColumns ? "" : T.vline}`, children: /* @__PURE__ */ jsxRuntime.jsx(
      "input",
      {
        type: "text",
        placeholder: section.placeholder,
        value: labelValue,
        onChange: (e) => onLabelChange(e.target.value),
        className: `w-full ${T.input} text-gray-500 placeholder-gray-300`,
        onKeyDown: (e) => {
          if (e.key === "Enter" && labelValue.trim()) {
            onAddRow(labelValue);
          }
        }
      }
    ) }),
    showClassificationColumns && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
      /* @__PURE__ */ jsxRuntime.jsx("td", { className: T.cellCompact }),
      /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.cellCompact} ${T.vline}` })
    ] }),
    showVariableColumn && !showClassificationColumns && /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.cellCompact} text-center ${T.vline}`, children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: T.empty, children: "\u2014" }) }),
    months.map((p, mi) => /* @__PURE__ */ jsxRuntime.jsx(
      editablecell_default,
      {
        value: null,
        onChange: (v) => onAddRowWithValue(p.id, v),
        isDeduction: subtract,
        hasData: false,
        className: mi < months.length - 1 ? T.vline : "",
        type: "currency"
      },
      p.id
    )),
    /* @__PURE__ */ jsxRuntime.jsx("td", { className: T.actionCol })
  ] });
};
var addrow_default = AddRow;
var GroupRow = ({
  group,
  childRows,
  months,
  isHovered,
  forceExpanded,
  formatValue,
  hoverProps,
  onToggleCollapse,
  onUngroup,
  onLabelChange,
  showVariableColumn = false,
  showClassificationColumns = false,
  isDragging = false,
  dropIndicator,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd
}) => {
  const groupValues = React3.useMemo(() => computeGroupValues(childRows, months), [childRows, months]);
  const subtract = isSubtractType(group.type);
  const isExpanded = forceExpanded || !group.collapsed;
  const dropBorder = dropIndicator === "above" ? "border-t-2 border-t-blue-400" : dropIndicator === "below" ? "border-b-2 border-b-blue-400" : "";
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "tr",
    {
      className: `border-b border-gray-200 ${subtract ? "bg-red-50/30" : "bg-gray-50/50"} ${isDragging ? "opacity-40" : ""} ${dropBorder} group`,
      ...hoverProps,
      onDragOver,
      onDragLeave,
      onDrop,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.cellEditLabel} text-gray-700 overflow-hidden ${showClassificationColumns ? "" : T.vline}`, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-0.5 min-w-0", children: [
          onDragStart && /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              draggable: isHovered,
              onDragStart,
              onDragEnd,
              className: `shrink-0 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 transition-opacity ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`,
              title: "Arrastrar para reordenar",
              children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.GripVertical, { size: 14 })
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              onClick: onToggleCollapse,
              className: "p-0.5 rounded shrink-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100",
              title: isExpanded ? "Colapsar grupo" : "Expandir grupo",
              children: isExpanded ? /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronDown, { size: 14 }) : /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronRight, { size: 14 })
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(
            "input",
            {
              type: "text",
              value: group.label,
              onChange: (e) => onLabelChange(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter") e.target.blur();
              },
              className: "flex-1 min-w-0 bg-transparent border-none outline-none text-xs font-semibold text-gray-700 truncate",
              title: group.label
            }
          )
        ] }) }),
        showClassificationColumns && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
          /* @__PURE__ */ jsxRuntime.jsx("td", { className: T.cellCompact }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.cellCompact} ${T.vline}` })
        ] }),
        showVariableColumn && !showClassificationColumns && /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.cellCompact} text-center ${T.vline}`, children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: T.empty, children: "\u2014" }) }),
        months.map((p, mi) => {
          const value = groupValues[p.id] ?? 0;
          const hasValue = value !== 0;
          const vline = mi < months.length - 1 ? T.vline : "";
          return /* @__PURE__ */ jsxRuntime.jsx(
            "td",
            {
              className: `${T.cellEdit} text-right ${vline}`,
              children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "h-5 flex items-center justify-end", children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: `text-xs tabular-nums font-medium ${subtract ? hasValue ? "text-rose-600" : "text-gray-300" : hasValue ? "text-gray-800" : "text-gray-300"}`, children: hasValue ? formatValue(value) : "\u2014" }) })
            },
            p.id
          );
        }),
        /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.actionCol} text-center`, children: isHovered && /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            onClick: onUngroup,
            className: "p-0.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100",
            title: "Desagrupar",
            children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Ungroup, { size: 14 })
          }
        ) })
      ]
    }
  );
};
var grouprow_default = GroupRow;
var DeleteDialog = ({ count, onConfirm, onCancel }) => {
  const [reason, setReason] = React3.useState("");
  const inputRef = React3.useRef(null);
  const cardRef = React3.useRef(null);
  React3.useEffect(() => {
    inputRef.current?.focus();
  }, []);
  React3.useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onCancel]);
  const handleBackdropClick = (e) => {
    if (cardRef.current && !cardRef.current.contains(e.target)) {
      onCancel();
    }
  };
  const handleSubmit = () => {
    onConfirm(reason.trim());
  };
  const dialog = /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm",
      onClick: handleBackdropClick,
      children: /* @__PURE__ */ jsxRuntime.jsxs(
        "div",
        {
          ref: cardRef,
          className: "bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm mx-4 text-center",
          children: [
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex justify-center mb-4", children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "w-14 h-14 rounded-full bg-red-50 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Trash2, { size: 24, className: "text-red-500" }) }) }),
            /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "\xBFCu\xE1l es la raz\xF3n para borrar?" }),
            /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-gray-500 mb-5", children: count === 1 ? "Esta fila se mover\xE1 a la papelera." : `${count} filas se mover\xE1n a la papelera.` }),
            /* @__PURE__ */ jsxRuntime.jsx(
              "textarea",
              {
                ref: inputRef,
                value: reason,
                onChange: (e) => setReason(e.target.value),
                placeholder: "Escribe una raz\xF3n...",
                rows: 2,
                className: "w-full text-sm border border-gray-200 rounded-lg px-3 py-2 mb-5 outline-none focus:border-red-300 focus:ring-1 focus:ring-red-300 resize-none placeholder-gray-400",
                onKeyDown: (e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsxRuntime.jsx(
                "button",
                {
                  onClick: handleSubmit,
                  className: "flex-1 py-2.5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors",
                  children: "Confirmar"
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsx(
                "button",
                {
                  onClick: onCancel,
                  className: "flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors",
                  children: "Cancelar"
                }
              )
            ] })
          ]
        }
      )
    }
  );
  if (typeof document !== "undefined") {
    return reactDom.createPortal(dialog, document.body);
  }
  return dialog;
};
var deletedialog_default = DeleteDialog;
function RecycleBin({ deletedRows, getLabel, onRestore, renderCells }) {
  const [expanded, setExpanded] = React3.useState(false);
  if (deletedRows.length === 0) return null;
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "border-t border-gray-200 bg-gray-50/50", children: [
    /* @__PURE__ */ jsxRuntime.jsxs(
      "button",
      {
        onClick: () => setExpanded(!expanded),
        className: "w-full px-4 py-2 flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 transition-colors",
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Trash2, { size: 12 }),
          /* @__PURE__ */ jsxRuntime.jsxs("span", { children: [
            deletedRows.length,
            " eliminado",
            deletedRows.length !== 1 ? "s" : ""
          ] }),
          expanded ? /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronUp, { size: 12 }) : /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronDown, { size: 12 })
        ]
      }
    ),
    expanded && /* @__PURE__ */ jsxRuntime.jsx("table", { className: T.table, children: /* @__PURE__ */ jsxRuntime.jsx("tbody", { children: deletedRows.map((row) => /* @__PURE__ */ jsxRuntime.jsxs("tr", { className: `${T.rowBorder} opacity-75`, children: [
      /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.cellEditLabel} text-gray-500 ${T.cellLabel}`, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            onClick: () => onRestore(row.id),
            className: "shrink-0 p-1 rounded text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors",
            title: "Restaurar",
            children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Undo2, { size: 13 })
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              className: `${T.rowLabel} line-through text-gray-400 truncate block`,
              title: getLabel(row),
              children: getLabel(row)
            }
          ),
          row.deletedAt && /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "text-[10px] text-gray-400 truncate block", title: row.deletionReason, children: [
            formatDeletedDate(row.deletedAt),
            row.deletionReason && ` \xB7 ${row.deletionReason}`
          ] })
        ] })
      ] }) }),
      renderCells && renderCells(row)
    ] }, row.id)) }) })
  ] });
}
var recyclebin_default = RecycleBin;
var ContextMenu = ({ x, y, canGroup, selectedCount, onGroup, onDeleteSelected, onCancel, onClose }) => {
  const ref = React3.useRef(null);
  React3.useEffect(() => {
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handle);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);
  React3.useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      ref.current.style.left = `${window.innerWidth - rect.width - 8}px`;
    }
    if (rect.bottom > window.innerHeight) {
      ref.current.style.top = `${window.innerHeight - rect.height - 8}px`;
    }
  }, []);
  const menu = /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      ref,
      className: "fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[180px] print:hidden",
      style: { left: x, top: y },
      children: [
        /* @__PURE__ */ jsxRuntime.jsxs(
          "button",
          {
            onClick: () => {
              onGroup();
              onClose();
            },
            disabled: !canGroup,
            className: "w-full px-3 py-1.5 text-left text-xs flex items-center gap-2 hover:bg-gray-50 disabled:text-gray-300 disabled:hover:bg-transparent",
            children: [
              /* @__PURE__ */ jsxRuntime.jsx(lucideReact.FoldVertical, { size: 14 }),
              "Agrupar ",
              selectedCount,
              " filas"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxs(
          "button",
          {
            onClick: () => {
              onDeleteSelected();
              onClose();
            },
            className: "w-full px-3 py-1.5 text-left text-xs flex items-center gap-2 hover:bg-gray-50 text-red-600",
            children: [
              /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Trash2, { size: 14 }),
              "Eliminar ",
              selectedCount,
              " fila",
              selectedCount !== 1 ? "s" : ""
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxs(
          "button",
          {
            onClick: () => {
              onCancel();
              onClose();
            },
            className: "w-full px-3 py-1.5 text-left text-xs flex items-center gap-2 hover:bg-gray-50 text-gray-600",
            children: [
              /* @__PURE__ */ jsxRuntime.jsx(lucideReact.X, { size: 14 }),
              "Cancelar selecci\xF3n"
            ]
          }
        )
      ]
    }
  );
  if (typeof document !== "undefined") {
    return reactDom.createPortal(menu, document.body);
  }
  return menu;
};
var HeaderSelectionBar = ({ selectedCount, canGroup, monthCount, naming, onNamingChange, onGroup, onDeleteSelected, onCancel, showVariableColumn = false, showClassificationColumns = false }) => {
  const [groupName, setGroupName] = React3.useState("");
  const inputRef = React3.useRef(null);
  React3.useEffect(() => {
    if (naming && inputRef.current) {
      inputRef.current.focus();
    }
  }, [naming]);
  React3.useEffect(() => {
    if (selectedCount === 0) {
      setGroupName("");
    }
  }, [selectedCount]);
  const handleSubmit = () => {
    const name = groupName.trim();
    if (name) {
      onGroup(name);
      onNamingChange(false);
      setGroupName("");
    }
  };
  return /* @__PURE__ */ jsxRuntime.jsx(
    "td",
    {
      colSpan: monthCount + 2 + (showClassificationColumns ? 2 : showVariableColumn ? 1 : 0),
      className: "px-4 py-2.5",
      onClick: (e) => e.stopPropagation(),
      children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex items-center gap-2", children: naming ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "input",
          {
            ref: inputRef,
            type: "text",
            value: groupName,
            onChange: (e) => setGroupName(e.target.value),
            placeholder: "Nombre del grupo...",
            className: "text-xs border border-gray-300 bg-white text-gray-800 placeholder-gray-400 rounded px-2 py-1 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 w-44",
            onKeyDown: (e) => {
              e.stopPropagation();
              if (e.key === "Enter") handleSubmit();
              if (e.key === "Escape") {
                onNamingChange(false);
                setGroupName("");
              }
            }
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            onClick: handleSubmit,
            disabled: !groupName.trim(),
            className: "p-1 rounded text-emerald-700 hover:bg-emerald-100 disabled:text-gray-300 disabled:hover:bg-transparent",
            title: "Confirmar",
            children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Check, { size: 14 })
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            onClick: () => {
              onNamingChange(false);
              setGroupName("");
            },
            className: "p-1 rounded text-gray-400 hover:bg-gray-200",
            title: "Cancelar",
            children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.X, { size: 14 })
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "text-xs text-gray-500", children: [
          selectedCount,
          " fila",
          selectedCount !== 1 ? "s" : ""
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            onClick: () => onNamingChange(true),
            disabled: !canGroup,
            className: "text-xs px-3 py-1 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors",
            title: !canGroup && selectedCount < 2 ? "Selecciona al menos 2 filas" : !canGroup ? "Solo puedes agrupar filas del mismo tipo" : "Agrupar filas seleccionadas",
            children: "Agrupar"
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxs(
          "button",
          {
            onClick: onDeleteSelected,
            className: "text-xs px-3 py-1 rounded-full text-red-600 hover:bg-red-100 transition-colors flex items-center gap-1",
            title: "Eliminar filas seleccionadas",
            children: [
              /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Trash2, { size: 12 }),
              "Eliminar"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            onClick: onCancel,
            className: "text-xs px-2 py-1 rounded-full text-gray-500 hover:bg-gray-200 transition-colors",
            children: "Cancelar"
          }
        )
      ] }) })
    }
  );
};
var useGridKeyboard = ({ visibleRowIds, colCount }) => {
  const [focusedCell, setFocusedCell] = React3.useState(null);
  const [editTrigger, setEditTrigger] = React3.useState(0);
  const [clearTrigger, setClearTrigger] = React3.useState(0);
  const [editInitialValue, setEditInitialValue] = React3.useState(null);
  const isFocused = React3.useCallback((rowId, colIndex) => {
    return focusedCell?.rowId === rowId && focusedCell?.colIndex === colIndex;
  }, [focusedCell]);
  const focus = React3.useCallback((rowId, colIndex) => {
    setFocusedCell({ rowId, colIndex });
  }, []);
  const clearFocus = React3.useCallback(() => setFocusedCell(null), []);
  const navigate = React3.useCallback((direction) => {
    setFocusedCell((prev) => {
      if (!prev) return null;
      const rowIdx = visibleRowIds.indexOf(prev.rowId);
      if (rowIdx === -1) return null;
      let newRow = rowIdx;
      let newCol = prev.colIndex;
      switch (direction) {
        case "right":
          if (newCol < colCount - 1) {
            newCol++;
          } else if (newRow < visibleRowIds.length - 1) {
            newRow++;
            newCol = 0;
          }
          break;
        case "left":
          if (newCol > 0) {
            newCol--;
          } else if (newRow > 0) {
            newRow--;
            newCol = colCount - 1;
          }
          break;
        case "down":
          if (newRow < visibleRowIds.length - 1) newRow++;
          break;
        case "up":
          if (newRow > 0) newRow--;
          break;
      }
      return { rowId: visibleRowIds[newRow], colIndex: newCol };
    });
  }, [visibleRowIds, colCount]);
  const navigateAndEdit = React3.useCallback((direction) => {
    navigate(direction);
    setEditInitialValue(null);
    setTimeout(() => setEditTrigger((prev) => prev + 1), 0);
  }, [navigate]);
  const handleContainerKeyDown = React3.useCallback((e) => {
    if (!focusedCell) return;
    const target = e.target;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        navigate("up");
        break;
      case "ArrowDown":
        e.preventDefault();
        navigate("down");
        break;
      case "ArrowLeft":
        e.preventDefault();
        navigate("left");
        break;
      case "ArrowRight":
        e.preventDefault();
        navigate("right");
        break;
      case "Tab":
        e.preventDefault();
        navigate(e.shiftKey ? "left" : "right");
        break;
      case "Enter":
      case "F2":
        e.preventDefault();
        setEditInitialValue(null);
        setEditTrigger((prev) => prev + 1);
        break;
      case "Delete":
      case "Backspace":
        e.preventDefault();
        setClearTrigger((prev) => prev + 1);
        break;
      case "Escape":
        e.preventDefault();
        clearFocus();
        break;
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          setEditInitialValue(e.key);
          setEditTrigger((prev) => prev + 1);
        }
        break;
    }
  }, [focusedCell, navigate, clearFocus]);
  return {
    focusedCell,
    editTrigger,
    clearTrigger,
    editInitialValue,
    isFocused,
    focus,
    clearFocus,
    navigate,
    navigateAndEdit,
    handleContainerKeyDown
  };
};

// src/renta/usekeyboard.ts
var useKeyboard = ({ visibleRowIds, monthCount }) => {
  const grid = useGridKeyboard({ visibleRowIds, colCount: monthCount });
  return {
    ...grid,
    // Alias colIndex as monthIndex for RentaTable compatibility
    get focusedCell() {
      if (!grid.focusedCell) return null;
      return { ...grid.focusedCell, monthIndex: grid.focusedCell.colIndex };
    },
    isFocused: (rowId, monthIndex) => grid.isFocused(rowId, monthIndex),
    focus: (rowId, monthIndex) => grid.focus(rowId, monthIndex)
  };
};
var useDragReorder = () => {
  const [dragRowId, setDragRowId] = React3.useState(null);
  const [dropTargetId, setDropTargetId] = React3.useState(null);
  const [dropPosition, setDropPosition] = React3.useState(null);
  const handleDragStart = React3.useCallback((rowId) => (e) => {
    setDragRowId(rowId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", rowId);
  }, []);
  const handleDragOver = React3.useCallback((rowId) => (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (rowId === dragRowId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const pos = e.clientY < midY ? "above" : "below";
    setDropTargetId(rowId);
    setDropPosition(pos);
  }, [dragRowId]);
  const handleDragLeave = React3.useCallback(() => {
    setDropTargetId(null);
    setDropPosition(null);
  }, []);
  const handleDrop = React3.useCallback((rows, onRowsChange) => (e) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData("text/plain");
    if (!sourceId || !dropTargetId || sourceId === dropTargetId) {
      resetState();
      return;
    }
    const sourceRow = rows.find((r) => r.id === sourceId);
    const targetRow = rows.find((r) => r.id === dropTargetId);
    if (!sourceRow || !targetRow) {
      resetState();
      return;
    }
    if (!isSameFamily(sourceRow, targetRow)) {
      resetState();
      return;
    }
    const targetGroupId = targetRow.isGroup ? targetRow.id : targetRow.groupId ?? null;
    const sourceGroupId = sourceRow.groupId ?? null;
    let workingRows = rows;
    if (targetGroupId !== sourceGroupId) {
      workingRows = workingRows.map((r) => {
        if (r.id !== sourceId) return r;
        return targetGroupId !== null ? { ...r, groupId: targetGroupId } : { ...r, groupId: void 0 };
      });
      workingRows = autoUngroup(workingRows);
    }
    const idsToMove = /* @__PURE__ */ new Set();
    idsToMove.add(sourceId);
    if (sourceRow.isGroup) {
      workingRows.filter((r) => r.groupId === sourceId).forEach((r) => idsToMove.add(r.id));
    }
    const withoutSource = workingRows.filter((r) => !idsToMove.has(r.id));
    const sourceRows = workingRows.filter((r) => idsToMove.has(r.id));
    const targetIdx = withoutSource.findIndex((r) => r.id === dropTargetId);
    if (targetIdx === -1) {
      resetState();
      return;
    }
    const insertIdx = dropPosition === "below" ? targetIdx + 1 : targetIdx;
    const result = [...withoutSource];
    result.splice(insertIdx, 0, ...sourceRows);
    result.forEach((r, i) => {
      r.order = i;
    });
    onRowsChange(result);
    resetState();
  }, [dropTargetId, dropPosition]);
  const handleDragEnd = React3.useCallback(() => {
    resetState();
  }, []);
  function resetState() {
    setDragRowId(null);
    setDropTargetId(null);
    setDropPosition(null);
  }
  return {
    dragRowId,
    dropTargetId,
    dropPosition,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd
  };
};
function isSameFamily(a, b) {
  const isAdd = (t) => t === "add" || t === "income";
  return isAdd(a.type) === isAdd(b.type);
}
function useRowHover() {
  const [hoveredRow, setHoveredRow] = React3.useState(null);
  const getHoverProps = React3.useCallback((id) => ({
    onMouseEnter: () => setHoveredRow(id),
    onMouseLeave: () => setHoveredRow(null)
  }), []);
  const isHovered = React3.useCallback((id) => hoveredRow === id, [hoveredRow]);
  return { hoveredRow, getHoverProps, isHovered };
}
var fmtK = (v) => {
  const sign = v < 0 ? "-" : "";
  const abs = Math.abs(v);
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${sign}$${Math.round(abs / 1e3)}k`;
  return `${sign}$${abs}`;
};
var ReliqInfoTooltip = ({ data, type }) => {
  const lines = type === "fija" ? [
    { label: "Imponible fijo", value: data.imponibleFijo, sign: "+" },
    { label: "No imponible fijo", value: data.noImponibleFijo, sign: "+" },
    { label: "Cotiz. previsional", value: data.cotizPreviFija, sign: "-" },
    { label: "Cotiz. salud", value: data.cotizSaludFija, sign: "-" },
    { label: "Cotiz. cesant\xEDa", value: data.cotizCesantiaFija, sign: "-" },
    { label: "Impuesto (IUSC)", value: data.impuestoFijo, sign: "-" },
    { label: "Otros desc. fijos", value: data.descuentosOtrosFijos, sign: "-" }
  ] : [
    { label: "L\xEDquido total", value: data.liquidoTotal, sign: "+" },
    { label: "Renta fija", value: data.rentaFija, sign: "-" }
  ];
  const result = type === "fija" ? data.rentaFija : data.rentaVariable;
  const isFija = type === "fija";
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "hidden group-hover/reliq:block absolute bottom-full left-0 mb-2 z-50", children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "bg-white text-gray-700 text-[11px] rounded-lg shadow-lg border border-gray-200 px-3 py-2.5 whitespace-nowrap", children: /* @__PURE__ */ jsxRuntime.jsx("table", { className: "border-spacing-0 w-full", children: /* @__PURE__ */ jsxRuntime.jsxs("tbody", { children: [
    /* @__PURE__ */ jsxRuntime.jsx("tr", { children: /* @__PURE__ */ jsxRuntime.jsx("td", { colSpan: 2, className: `pb-1.5 font-semibold text-[11px] text-left ${isFija ? "text-sky-600" : "text-amber-600"}`, children: isFija ? "C\xE1lculo Renta Fija" : "C\xE1lculo Renta Variable" }) }),
    lines.filter((l) => l.value !== 0).map((l, i) => /* @__PURE__ */ jsxRuntime.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntime.jsx("td", { className: "pr-4 py-0.5 text-gray-500 text-left", children: l.label }),
      /* @__PURE__ */ jsxRuntime.jsxs("td", { className: "text-right py-0.5 tabular-nums text-gray-600", children: [
        l.sign === "-" ? "\u2212" : "+",
        fmtK(l.value)
      ] })
    ] }, i)),
    /* @__PURE__ */ jsxRuntime.jsxs("tr", { className: `border-t ${isFija ? "border-sky-200" : "border-amber-200"}`, children: [
      /* @__PURE__ */ jsxRuntime.jsx("td", { className: `pr-4 pt-1.5 font-semibold text-left ${isFija ? "text-sky-700" : "text-amber-700"}`, children: isFija ? "Renta Fija" : "Renta Variable" }),
      /* @__PURE__ */ jsxRuntime.jsx("td", { className: `text-right pt-1.5 font-semibold tabular-nums ${isFija ? "text-sky-700" : "text-amber-700"}`, children: fmtK(result) })
    ] })
  ] }) }) }) });
};
var RentaTable = ({
  title,
  months = 3,
  rows,
  onRowsChange,
  sections,
  colorScheme: colorSchemeProp,
  headerBg: headerBgProp,
  headerText: headerTextProp,
  forceExpanded = false,
  formatValue = defaultFormatValue,
  calculateTotal = defaultCalculateTotal,
  showVariableColumn = false,
  showClassificationColumns = false,
  sourceFileIds,
  onViewSource,
  reliquidacion
}) => {
  const { bg: headerBg, text: headerText } = resolveColors(colorSchemeProp, headerBgProp, headerTextProp);
  const { getHoverProps, isHovered: isRowHovered } = useRowHover();
  const [newRowLabels, setNewRowLabels] = React3.useState({});
  const [selectedRows, setSelectedRows] = React3.useState(/* @__PURE__ */ new Set());
  const [contextMenu, setContextMenu] = React3.useState(null);
  const [naming, setNaming] = React3.useState(false);
  const [deleteTarget, setDeleteTarget] = React3.useState(null);
  const monthsArray = React3.useMemo(() => {
    if (typeof months === "number") return generateLastNMonths(months);
    return months;
  }, [months]);
  const effectiveSections = React3.useMemo(() => {
    if (sections) return sections;
    const hasIncome = rows.some((r) => r.type === "income");
    const hasDeduction = rows.some((r) => r.type === "deduction");
    const hasDebt = rows.some((r) => r.type === "debt");
    const hasAdd = rows.some((r) => r.type === "add");
    const hasSubtract = rows.some((r) => r.type === "subtract");
    const result = [];
    if (hasIncome || hasAdd) result.push({ type: hasIncome ? "income" : "add", placeholder: "Agregar ingreso..." });
    if (hasDeduction) result.push({ type: "deduction", placeholder: "Agregar descuento..." });
    if (hasDebt) result.push({ type: "debt", placeholder: "Agregar deuda..." });
    if (hasSubtract && !hasDeduction && !hasDebt) result.push({ type: "subtract", placeholder: "Agregar descuento..." });
    if (result.length === 0) result.push({ type: "add", placeholder: "Agregar fila..." });
    return result;
  }, [sections, rows]);
  const anySelected = selectedRows.size > 0;
  const visibleRowIds = React3.useMemo(() => {
    const ids = [];
    for (const section of effectiveSections) {
      const items = getOrderedItems(rows, section.type);
      for (const item of items) {
        if (item.kind === "group") {
          const showChildren = forceExpanded || !item.group.collapsed;
          if (showChildren) {
            for (const child of item.children) ids.push(child.id);
          }
        } else {
          ids.push(item.row.id);
        }
      }
    }
    return ids;
  }, [effectiveSections, rows, forceExpanded]);
  const keyboard = useKeyboard({ visibleRowIds, monthCount: monthsArray.length });
  const drag = useDragReorder();
  const expandTimerRef = React3.useRef(null);
  React3.useEffect(() => {
    if (expandTimerRef.current) {
      clearTimeout(expandTimerRef.current);
      expandTimerRef.current = null;
    }
    if (!drag.dropTargetId || forceExpanded) return;
    const target = rows.find((r) => r.id === drag.dropTargetId);
    if (!target?.isGroup || !target.collapsed) return;
    expandTimerRef.current = setTimeout(() => toggleGroupCollapse(target.id), 600);
    return () => {
      if (expandTimerRef.current) {
        clearTimeout(expandTimerRef.current);
        expandTimerRef.current = null;
      }
    };
  }, [drag.dropTargetId]);
  const toggleSelect = React3.useCallback((rowId) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  }, []);
  const clearSelection = React3.useCallback(() => setSelectedRows(/* @__PURE__ */ new Set()), []);
  const canGroup = React3.useMemo(() => {
    if (selectedRows.size < 2) return false;
    const selected = rows.filter((r) => selectedRows.has(r.id));
    if (selected.some((r) => r.isGroup)) return false;
    const types = new Set(selected.map((r) => isAddType(r.type) ? "add" : "subtract"));
    return types.size === 1;
  }, [selectedRows, rows]);
  const handleGroup = React3.useCallback((name) => {
    const newRows = createGroup(rows, selectedRows, name);
    onRowsChange(newRows);
    clearSelection();
    setNaming(false);
  }, [rows, selectedRows, onRowsChange, clearSelection]);
  const handleContextMenu = React3.useCallback((e, rowId) => {
    if (!selectedRows.has(rowId) || selectedRows.size < 2) return;
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, [selectedRows]);
  const startGroupNaming = React3.useCallback(() => {
    setContextMenu(null);
    setNaming(true);
  }, []);
  const updateRowLabel = React3.useCallback((rowId, label) => {
    onRowsChange(rows.map((r) => r.id === rowId ? { ...r, label } : r));
  }, [rows, onRowsChange]);
  const updateRowValue = React3.useCallback((rowId, monthId, value) => {
    onRowsChange(rows.map((r) => {
      if (r.id !== rowId) return r;
      return { ...r, values: { ...r.values, [monthId]: value } };
    }));
  }, [rows, onRowsChange]);
  const requestDelete = React3.useCallback((rowId) => {
    const row = rows.find((r) => r.id === rowId);
    if (!row) return;
    if (row.isGroup) {
      onRowsChange(ungroupRows(rows, rowId));
      return;
    }
    setDeleteTarget(/* @__PURE__ */ new Set([rowId]));
  }, [rows, onRowsChange]);
  const requestDeleteSelected = React3.useCallback(() => {
    setDeleteTarget(new Set(selectedRows));
  }, [selectedRows]);
  const confirmDelete = React3.useCallback((reason) => {
    if (!deleteTarget) return;
    const newRows = softDeleteRows(rows, deleteTarget, reason);
    onRowsChange(newRows);
    clearSelection();
    setDeleteTarget(null);
  }, [rows, deleteTarget, onRowsChange, clearSelection]);
  const handleRestore = React3.useCallback((rowId) => {
    onRowsChange(restoreRows(rows, /* @__PURE__ */ new Set([rowId])));
  }, [rows, onRowsChange]);
  const deletedRows = React3.useMemo(
    () => rows.filter((r) => r.deletedAt && !r.isGroup),
    [rows]
  );
  const toggleGroupCollapse = React3.useCallback((groupId) => {
    onRowsChange(rows.map((r) => r.id === groupId ? { ...r, collapsed: !r.collapsed } : r));
  }, [rows, onRowsChange]);
  const handleUngroup = React3.useCallback((groupId) => {
    onRowsChange(ungroupRows(rows, groupId));
  }, [rows, onRowsChange]);
  const toggleVariable = React3.useCallback((rowId) => {
    onRowsChange(rows.map((r) => r.id === rowId ? { ...r, isVariable: !r.isVariable } : r));
  }, [rows, onRowsChange]);
  const toggleNaturaleza = React3.useCallback((rowId) => {
    onRowsChange(rows.map((r) => {
      if (r.id !== rowId) return r;
      const isIncome = isAddType(r.type);
      const cycle = isIncome ? ["Imponible", "No imponible"] : ["Legal", "Otro"];
      const current = r.naturaleza || cycle[0];
      const idx = cycle.indexOf(current);
      const next = cycle[(idx + 1) % cycle.length];
      return { ...r, naturaleza: next };
    }));
  }, [rows, onRowsChange]);
  const addRow = React3.useCallback((type, label) => {
    if (!label.trim()) return;
    const newRow = { id: `row_${type}_${Date.now()}`, label: label.trim(), type, values: {} };
    setNewRowLabels((prev) => ({ ...prev, [type]: "" }));
    if (isAddType(type)) {
      const subtractIndex = rows.findIndex((r) => isSubtractType(r.type));
      if (subtractIndex === -1) {
        onRowsChange([...rows, newRow]);
      } else {
        const updated = [...rows];
        updated.splice(subtractIndex, 0, newRow);
        onRowsChange(updated);
      }
    } else {
      onRowsChange([...rows, newRow]);
    }
  }, [rows, onRowsChange]);
  const addRowWithValue = React3.useCallback((type, monthId, value) => {
    if (value === null) return;
    const pendingLabel = (newRowLabels[type] || "").trim();
    const defaultLabel = isAddType(type) ? "Nuevo ingreso" : "Nuevo descuento";
    const newRow = { id: `row_${type}_${Date.now()}`, label: pendingLabel || defaultLabel, type, values: { [monthId]: value } };
    setNewRowLabels((prev) => ({ ...prev, [type]: "" }));
    if (isAddType(type)) {
      const subtractIndex = rows.findIndex((r) => isSubtractType(r.type));
      if (subtractIndex === -1) {
        onRowsChange([...rows, newRow]);
      } else {
        const updated = [...rows];
        updated.splice(subtractIndex, 0, newRow);
        onRowsChange(updated);
      }
    } else {
      onRowsChange([...rows, newRow]);
    }
  }, [rows, onRowsChange, newRowLabels]);
  const renderDataRow = (r) => /* @__PURE__ */ jsxRuntime.jsx(
    datarow_default,
    {
      row: r,
      months: monthsArray,
      isHovered: isRowHovered(r.id),
      selected: selectedRows.has(r.id),
      anySelected,
      selectable: !r.isGroup,
      hoverProps: getHoverProps(r.id),
      onRemove: () => requestDelete(r.id),
      onToggleSelect: () => toggleSelect(r.id),
      onContextMenu: (e) => handleContextMenu(e, r.id),
      onLabelChange: (label) => updateRowLabel(r.id, label),
      onValueChange: (monthId, value) => updateRowValue(r.id, monthId, value),
      onViewSource,
      showVariableColumn,
      showClassificationColumns,
      onToggleVariable: () => toggleVariable(r.id),
      onToggleNaturaleza: () => toggleNaturaleza(r.id),
      isCellFocused: (mi) => keyboard.isFocused(r.id, mi),
      onCellFocus: (mi) => keyboard.focus(r.id, mi),
      onNavigate: keyboard.navigate,
      editTrigger: keyboard.editTrigger,
      clearTrigger: keyboard.clearTrigger,
      editInitialValue: keyboard.editInitialValue,
      isDragging: drag.dragRowId === r.id,
      dropIndicator: drag.dropTargetId === r.id ? drag.dropPosition : null,
      onDragStart: drag.handleDragStart(r.id),
      onDragOver: drag.handleDragOver(r.id),
      onDragLeave: drag.handleDragLeave,
      onDrop: drag.handleDrop(rows, onRowsChange),
      onDragEnd: drag.handleDragEnd
    },
    r.id
  );
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      tabIndex: 0,
      onKeyDown: keyboard.handleContainerKeyDown,
      className: "outline-none",
      children: /* @__PURE__ */ jsxRuntime.jsxs(
        tableshell_default,
        {
          headerBg,
          renderHeader: () => anySelected ? /* @__PURE__ */ jsxRuntime.jsx(
            HeaderSelectionBar,
            {
              selectedCount: selectedRows.size,
              canGroup,
              monthCount: monthsArray.length,
              naming,
              onNamingChange: setNaming,
              onGroup: handleGroup,
              onDeleteSelected: requestDeleteSelected,
              onCancel: () => {
                clearSelection();
                setNaming(false);
              },
              showVariableColumn,
              showClassificationColumns
            }
          ) : /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
            /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.headerAccordion} text-left ${showClassificationColumns ? "" : T.vline}`, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${headerText} ${T.headerTitle}`, children: title }),
              /* @__PURE__ */ jsxRuntime.jsx(SourceIcon, { fileIds: sourceFileIds, onViewSource, className: headerText })
            ] }) }),
            showClassificationColumns && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
              /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.cellCompact} text-center`, children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${headerText} text-[10px] font-semibold opacity-60`, children: "Tipo" }) }),
              /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.cellCompact} text-center ${T.vline}`, children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${headerText} text-[10px] font-semibold opacity-60`, children: "Renta" }) })
            ] }),
            showVariableColumn && !showClassificationColumns && /* @__PURE__ */ jsxRuntime.jsx("td", { className: T.vline }),
            monthsArray.map((p) => {
              const total = calculateTotal(p.id, rows);
              const hasValue = total !== 0;
              return /* @__PURE__ */ jsxRuntime.jsxs("td", { className: `${T.headerAccordionStat}`, children: [
                /* @__PURE__ */ jsxRuntime.jsxs("span", { className: `${headerText} ${T.headerStatLabel}`, children: [
                  p.label,
                  ": "
                ] }),
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${T.headerStat} ${hasValue ? headerText : "text-gray-400"}`, children: hasValue ? formatValue(total) : "\u2014" })
              ] }, p.id);
            }),
            /* @__PURE__ */ jsxRuntime.jsx("td", { className: T.actionCol })
          ] }),
          renderAfterContent: () => /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              recyclebin_default,
              {
                deletedRows,
                getLabel: (r) => r.label,
                onRestore: handleRestore,
                renderCells: (row) => {
                  const subtract = isSubtractType(row.type);
                  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
                    showVariableColumn && /* @__PURE__ */ jsxRuntime.jsx("td", { className: T.vline }),
                    monthsArray.map((m, mi) => {
                      const v = row.values[m.id];
                      const hasValue = v != null;
                      const vline = mi < monthsArray.length - 1 ? T.vline : "";
                      return /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.cellEdit} text-right tabular-nums ${vline}`, children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${T.totalValue} ${hasValue ? subtract ? "text-rose-300" : "text-gray-400" : "text-gray-200"}`, children: hasValue ? formatValue(v) : "\u2014" }) }, m.id);
                    }),
                    /* @__PURE__ */ jsxRuntime.jsx("td", { className: T.actionCol })
                  ] });
                }
              }
            ),
            deleteTarget && /* @__PURE__ */ jsxRuntime.jsx(
              deletedialog_default,
              {
                count: deleteTarget.size,
                onConfirm: confirmDelete,
                onCancel: () => setDeleteTarget(null)
              }
            ),
            contextMenu && anySelected && /* @__PURE__ */ jsxRuntime.jsx(
              ContextMenu,
              {
                x: contextMenu.x,
                y: contextMenu.y,
                canGroup,
                selectedCount: selectedRows.size,
                onGroup: startGroupNaming,
                onDeleteSelected: requestDeleteSelected,
                onCancel: clearSelection,
                onClose: () => setContextMenu(null)
              }
            )
          ] }),
          children: [
            effectiveSections.map((section) => {
              const items = getOrderedItems(rows, section.type);
              return /* @__PURE__ */ jsxRuntime.jsxs(React3__default.default.Fragment, { children: [
                items.map((item) => {
                  if (item.kind === "group") {
                    const { group, children: groupChildren } = item;
                    const showChildren = forceExpanded || !group.collapsed;
                    return /* @__PURE__ */ jsxRuntime.jsxs(React3__default.default.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntime.jsx(
                        grouprow_default,
                        {
                          group,
                          childRows: groupChildren,
                          months: monthsArray,
                          isHovered: isRowHovered(group.id),
                          forceExpanded,
                          formatValue,
                          hoverProps: getHoverProps(group.id),
                          onToggleCollapse: () => toggleGroupCollapse(group.id),
                          onUngroup: () => handleUngroup(group.id),
                          onLabelChange: (label) => updateRowLabel(group.id, label),
                          showVariableColumn,
                          showClassificationColumns,
                          isDragging: drag.dragRowId === group.id,
                          dropIndicator: drag.dropTargetId === group.id ? drag.dropPosition : null,
                          onDragStart: drag.handleDragStart(group.id),
                          onDragOver: drag.handleDragOver(group.id),
                          onDragLeave: drag.handleDragLeave,
                          onDrop: drag.handleDrop(rows, onRowsChange),
                          onDragEnd: drag.handleDragEnd
                        }
                      ),
                      showChildren && groupChildren.map((child) => renderDataRow(child))
                    ] }, group.id);
                  }
                  return renderDataRow(item.row);
                }),
                /* @__PURE__ */ jsxRuntime.jsx(
                  addrow_default,
                  {
                    section,
                    months: monthsArray,
                    labelValue: newRowLabels[section.type] || "",
                    onLabelChange: (v) => setNewRowLabels((prev) => ({ ...prev, [section.type]: v })),
                    onAddRow: (label) => addRow(section.type, label),
                    onAddRowWithValue: (monthId, value) => addRowWithValue(section.type, monthId, value),
                    showVariableColumn,
                    showClassificationColumns
                  }
                ),
                effectiveSections.length > 1 && (() => {
                  const subtotals = computeSectionSubtotal(rows, section.type, monthsArray);
                  const isSubtract = isSubtractType(section.type);
                  const label = isSubtract ? "Total descuentos" : "Total haberes";
                  return /* @__PURE__ */ jsxRuntime.jsxs("tr", { className: `${isSubtract ? "bg-red-50/30" : "bg-emerald-50/30"}`, children: [
                    /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.totalCell} border-b border-gray-200 ${showClassificationColumns ? "" : T.vline}`, children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${T.totalLabel}`, children: label }) }),
                    showClassificationColumns && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.cellCompact} border-b border-gray-200` }),
                      /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.cellCompact} border-b border-gray-200 ${T.vline}` })
                    ] }),
                    showVariableColumn && !showClassificationColumns && /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.cellCompact} border-b border-gray-200 ${T.vline}` }),
                    monthsArray.map((p, mi) => {
                      const value = subtotals[p.id] ?? 0;
                      const hasValue = value !== 0;
                      const display = isSubtract ? `-${formatValue(value)}` : formatValue(value);
                      const vline = mi < monthsArray.length - 1 ? T.vline : "";
                      return /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.totalCell} text-right border-b border-gray-200 ${vline}`, children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${T.totalValue} tabular-nums ${hasValue ? "" : "text-gray-300"}`, children: hasValue ? display : "\u2014" }) }, p.id);
                    }),
                    /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.actionCol} border-b border-gray-200` })
                  ] });
                })()
              ] }, section.type);
            }),
            (showVariableColumn || showClassificationColumns) && effectiveSections.length > 1 && (() => {
              const naiveVariable = computeRentaVariable(rows, monthsArray);
              const fmtSigned = (v) => v < 0 ? `-${formatValue(-v)}` : formatValue(v);
              return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
                /* @__PURE__ */ jsxRuntime.jsxs("tr", { className: "border-b border-gray-100 bg-amber-50/30 group/rv", children: [
                  /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.totalCell} ${showClassificationColumns ? "" : T.vline}`, children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${T.totalLabel} text-amber-700`, children: "Renta Variable" }) }),
                  showClassificationColumns && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntime.jsx("td", { className: T.cellCompact }),
                    /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.cellCompact} ${T.vline}` })
                  ] }),
                  showVariableColumn && !showClassificationColumns && /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.cellCompact} text-center ${T.vline}`, children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: T.empty, children: "\u2014" }) }),
                  monthsArray.map((p, mi) => {
                    const rliq = reliquidacion?.[p.id];
                    const value = rliq ? rliq.rentaVariable : naiveVariable[p.id] ?? 0;
                    const hasValue = value !== 0;
                    const vline = mi < monthsArray.length - 1 ? T.vline : "";
                    return /* @__PURE__ */ jsxRuntime.jsxs("td", { className: `${T.totalCell} text-right relative ${vline}`, children: [
                      rliq && hasValue && /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "group/reliq absolute cursor-help opacity-0 group-hover/rv:opacity-100 transition-opacity", style: { top: "9px", left: "12px" }, children: [
                        /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Info, { size: 14, className: "text-gray-400 hover:text-gray-600 p-0.5 rounded hover:bg-gray-200" }),
                        /* @__PURE__ */ jsxRuntime.jsx(ReliqInfoTooltip, { data: rliq, type: "variable" })
                      ] }),
                      /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${T.totalValue} tabular-nums ${hasValue ? "text-amber-700" : "text-gray-300"}`, children: hasValue ? fmtSigned(value) : "\u2014" })
                    ] }, p.id);
                  }),
                  /* @__PURE__ */ jsxRuntime.jsx("td", { className: T.actionCol })
                ] }),
                /* @__PURE__ */ jsxRuntime.jsxs("tr", { className: "border-b border-gray-200 bg-sky-50/30 group/rf", children: [
                  /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.totalCell} ${showClassificationColumns ? "" : T.vline}`, children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${T.totalLabel} text-sky-700`, children: "Renta Fija" }) }),
                  showClassificationColumns && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntime.jsx("td", { className: T.cellCompact }),
                    /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.cellCompact} ${T.vline}` })
                  ] }),
                  showVariableColumn && !showClassificationColumns && /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.cellCompact} text-center ${T.vline}`, children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: T.empty, children: "\u2014" }) }),
                  monthsArray.map((p, mi) => {
                    const rliq = reliquidacion?.[p.id];
                    const fija = rliq ? rliq.rentaFija : calculateTotal(p.id, rows) - (naiveVariable[p.id] ?? 0);
                    const hasValue = fija !== 0;
                    const vline = mi < monthsArray.length - 1 ? T.vline : "";
                    return /* @__PURE__ */ jsxRuntime.jsxs("td", { className: `${T.totalCell} text-right relative ${vline}`, children: [
                      rliq && hasValue && /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "group/reliq absolute cursor-help opacity-0 group-hover/rf:opacity-100 transition-opacity", style: { top: "9px", left: "12px" }, children: [
                        /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Info, { size: 14, className: "text-gray-400 hover:text-gray-600 p-0.5 rounded hover:bg-gray-200" }),
                        /* @__PURE__ */ jsxRuntime.jsx(ReliqInfoTooltip, { data: rliq, type: "fija" })
                      ] }),
                      /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${T.totalValue} tabular-nums ${hasValue ? "text-blue-700" : "text-gray-300"}`, children: hasValue ? fmtSigned(fija) : "\u2014" })
                    ] }, p.id);
                  }),
                  /* @__PURE__ */ jsxRuntime.jsx("td", { className: T.actionCol })
                ] })
              ] });
            })()
          ]
        }
      )
    }
  );
};
var renta_default = RentaTable;

// src/common/autoconvert.ts
function applyAutoConversions(row, editedField, editedValue, rules, params) {
  let result = { ...row, [editedField]: editedValue };
  for (const rule of rules) {
    if (rule.source === editedField && typeof editedValue === "number") {
      const precision = rule.precision ?? 0;
      const converted = rule.formula(editedValue, params);
      result[rule.target] = precision === 0 ? Math.round(converted) : Math.round(converted * Math.pow(10, precision)) / Math.pow(10, precision);
    }
  }
  return result;
}
function applyAutoCompute(row, editedField, rules, params) {
  let result = { ...row };
  for (const rule of rules) {
    if (rule.depends.includes(editedField)) {
      if (!rule.condition || rule.condition(result)) {
        result[rule.target] = rule.formula(result, params);
      }
    }
  }
  return result;
}
function useSoftDelete(rows, onRowsChange) {
  const [deleteTargetId, setDeleteTargetId] = React3.useState(null);
  const activeRows = React3.useMemo(() => rows.filter((r) => !r.deletedAt), [rows]);
  const deletedRows = React3.useMemo(() => rows.filter((r) => !!r.deletedAt), [rows]);
  const requestDelete = React3.useCallback((id) => {
    setDeleteTargetId(id);
  }, []);
  const confirmDelete = React3.useCallback((reason) => {
    if (!deleteTargetId) return;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    onRowsChange(rows.map(
      (r) => r.id === deleteTargetId ? { ...r, deletedAt: now, deletionReason: reason || void 0 } : r
    ));
    setDeleteTargetId(null);
  }, [deleteTargetId, rows, onRowsChange]);
  const cancelDelete = React3.useCallback(() => {
    setDeleteTargetId(null);
  }, []);
  const restoreRow = React3.useCallback((id) => {
    onRowsChange(rows.map((r) => {
      if (r.id !== id) return r;
      const { deletedAt: _, deletionReason: __, ...rest } = r;
      return rest;
    }));
  }, [rows, onRowsChange]);
  return { activeRows, deletedRows, deleteTargetId, requestDelete, confirmDelete, cancelDelete, restoreRow };
}
var useDragReorder2 = () => {
  const [dragRowId, setDragRowId] = React3.useState(null);
  const [dropTargetId, setDropTargetId] = React3.useState(null);
  const [dropPosition, setDropPosition] = React3.useState(null);
  const handleDragStart = React3.useCallback((rowId) => (e) => {
    setDragRowId(rowId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", rowId);
  }, []);
  const handleDragOver = React3.useCallback((rowId) => (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (rowId === dragRowId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    setDropTargetId(rowId);
    setDropPosition(e.clientY < midY ? "above" : "below");
  }, [dragRowId]);
  const handleDrop = React3.useCallback((rows, onRowsChange) => (e) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData("text/plain");
    if (!sourceId || !dropTargetId || sourceId === dropTargetId) {
      resetState();
      return;
    }
    const sourceIdx = rows.findIndex((r) => r.id === sourceId);
    const targetIdx = rows.findIndex((r) => r.id === dropTargetId);
    if (sourceIdx === -1 || targetIdx === -1) {
      resetState();
      return;
    }
    const result = rows.filter((r) => r.id !== sourceId);
    const insertIdx = dropPosition === "below" ? result.findIndex((r) => r.id === dropTargetId) + 1 : result.findIndex((r) => r.id === dropTargetId);
    result.splice(insertIdx, 0, rows[sourceIdx]);
    onRowsChange(result);
    resetState();
  }, [dropTargetId, dropPosition]);
  const handleDragEnd = React3.useCallback(() => {
    resetState();
  }, []);
  function resetState() {
    setDragRowId(null);
    setDropTargetId(null);
    setDropPosition(null);
  }
  return {
    dragRowId,
    dropTargetId,
    dropPosition,
    handleDragStart,
    handleDragOver,
    handleDragLeave: React3.useCallback(() => {
      setDropTargetId(null);
      setDropPosition(null);
    }, []),
    handleDrop,
    handleDragEnd
  };
};
var LINEAS_TC_PATTERN = /l[ií]nea|tarjeta|tc/i;
var DeudasTable = ({
  rows,
  onRowsChange,
  formatCurrency = defaultFormatCurrency,
  ufValue,
  castigo = 0.05,
  colorScheme: colorSchemeProp,
  headerBg: headerBgProp,
  headerText: headerTextProp,
  onViewSource
}) => {
  const { bg: headerBg, text: headerText, border: borderColor } = resolveColors(colorSchemeProp, headerBgProp, headerTextProp);
  const { getHoverProps, isHovered: isRowHovered } = useRowHover();
  const [selectedRows, setSelectedRows] = React3.useState(/* @__PURE__ */ new Set());
  const [newRow, setNewRow] = React3.useState({ institucion: "", tipo_deuda: "" });
  const { activeRows, deletedRows, deleteTargetId, requestDelete, confirmDelete, cancelDelete, restoreRow } = useSoftDelete(rows, onRowsChange);
  const visibleRowIds = React3.useMemo(() => activeRows.map((r) => r.id), [activeRows]);
  const keyboard = useGridKeyboard({ visibleRowIds, colCount: 6 });
  const drag = useDragReorder2();
  const anySelected = selectedRows.size > 0;
  const toggleSelect = React3.useCallback((rowId) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  }, []);
  const clearSelection = React3.useCallback(() => setSelectedRows(/* @__PURE__ */ new Set()), []);
  const requestDeleteSelected = React3.useCallback(() => {
    for (const id of selectedRows) requestDelete(id);
    clearSelection();
  }, [selectedRows, requestDelete, clearSelection]);
  const handleRowClick = React3.useCallback((e, rowId) => {
    if (!(e.metaKey || e.ctrlKey)) return;
    const target = e.target;
    if (target.closest('input, button, [role="button"]')) return;
    e.preventDefault();
    toggleSelect(rowId);
  }, [toggleSelect]);
  const conversionRules = ufValue ? [
    { source: "saldo_deuda_uf", target: "saldo_deuda_pesos", formula: (v) => v * ufValue, precision: 0 },
    { source: "saldo_deuda_pesos", target: "saldo_deuda_uf", formula: (v) => v / ufValue, precision: 2 }
  ] : [];
  const computeRules = [
    {
      target: "monto_cuota",
      depends: ["saldo_deuda_uf", "saldo_deuda_pesos", "tipo_deuda", "castigo_pct"],
      condition: (row) => LINEAS_TC_PATTERN.test(row.tipo_deuda) && row.saldo_deuda_pesos != null,
      formula: (row) => Math.round((row.saldo_deuda_pesos ?? 0) * (row.castigo_pct ?? castigo))
    },
    {
      target: "monto_cuota",
      depends: ["saldo_deuda_uf", "saldo_deuda_pesos", "castigo_pct"],
      condition: (row) => row.cuota_estimated === true && !LINEAS_TC_PATTERN.test(row.tipo_deuda) && row.saldo_deuda_pesos != null,
      formula: (row) => Math.round((row.saldo_deuda_pesos ?? 0) * (row.castigo_pct ?? castigo))
    }
  ];
  const updateField = (id, field, value) => {
    onRowsChange(rows.map((r) => {
      if (r.id !== id) return r;
      let next = applyAutoConversions(r, field, value, conversionRules, {});
      next = applyAutoCompute(next, field, computeRules, {});
      if (field === "monto_cuota") next = { ...next, cuota_estimated: false, castigo_pct: void 0 };
      return next;
    }));
  };
  const addRow = () => {
    if (!newRow.institucion.trim()) return;
    const row = {
      id: generateId("dc"),
      institucion: newRow.institucion.trim(),
      tipo_deuda: newRow.tipo_deuda.trim(),
      saldo_deuda_uf: null,
      saldo_deuda_pesos: null,
      monto_cuota: null,
      cuotas_pagadas: null,
      cuotas_total: null
    };
    setNewRow({ institucion: "", tipo_deuda: "" });
    onRowsChange([...rows, row]);
  };
  const totalSaldoPesos = activeRows.reduce((s, r) => s + (r.saldo_deuda_pesos || 0), 0);
  const totalMontoCuota = activeRows.reduce((s, r) => s + (r.monto_cuota || 0), 0);
  const isAutoComputed = (row, field) => {
    if (field === "saldo_deuda_pesos" && row.saldo_deuda_uf != null && ufValue) return true;
    if (field === "monto_cuota" && LINEAS_TC_PATTERN.test(row.tipo_deuda) && row.saldo_deuda_pesos != null) return true;
    return false;
  };
  const cuotaClassName = (row) => {
    if (isAutoComputed(row, "monto_cuota")) return "italic text-rose-400";
    if (row.cuota_estimated) return "italic text-gray-400";
    return "";
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { onKeyDown: keyboard.handleContainerKeyDown, tabIndex: 0, className: "outline-none", children: /* @__PURE__ */ jsxRuntime.jsxs(
      tableshell_default,
      {
        colorScheme: colorSchemeProp,
        headerClassName: `border-t ${borderColor} ${headerText}`,
        renderHeader: () => anySelected ? /* @__PURE__ */ jsxRuntime.jsx("th", { colSpan: 8, className: `${T.headerCell} text-left`, onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "text-xs text-rose-600", children: [
            selectedRows.size,
            " fila",
            selectedRows.size !== 1 ? "s" : ""
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs(
            "button",
            {
              onClick: requestDeleteSelected,
              className: "text-xs px-3 py-1 rounded-full text-red-600 hover:bg-red-100 transition-colors flex items-center gap-1",
              title: "Eliminar filas seleccionadas",
              children: [
                /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Trash2, { size: 12 }),
                "Eliminar"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              onClick: clearSelection,
              className: "text-xs px-2 py-1 rounded-full text-gray-500 hover:bg-gray-200 transition-colors",
              children: "Cancelar"
            }
          )
        ] }) }) : /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
          /* @__PURE__ */ jsxRuntime.jsx("th", { className: `${T.headerCell} text-left ${T.th} ${headerText} ${T.vline}`, children: "Instituci\xF3n" }),
          /* @__PURE__ */ jsxRuntime.jsx("th", { className: `${T.headerCell} text-left ${T.th} ${headerText} ${T.vline}`, children: "Tipo Deuda" }),
          /* @__PURE__ */ jsxRuntime.jsx("th", { className: `${T.headerCell} text-right ${T.th} ${headerText} ${T.vline}`, children: "Saldo UF" }),
          /* @__PURE__ */ jsxRuntime.jsx("th", { className: `${T.headerCell} text-right ${T.th} ${headerText} ${T.vline}`, children: "Saldo $" }),
          /* @__PURE__ */ jsxRuntime.jsx("th", { className: `${T.headerCell} text-right ${T.th} ${headerText} ${T.vline}`, children: "Cuota $" }),
          /* @__PURE__ */ jsxRuntime.jsx("th", { className: `${T.headerCell} text-center ${T.th} ${headerText} ${T.vline}`, children: "%" }),
          /* @__PURE__ */ jsxRuntime.jsx("th", { className: `${T.headerCell} text-center ${T.th} ${headerText}`, children: "Cuotas" }),
          /* @__PURE__ */ jsxRuntime.jsx("th", { className: T.actionCol })
        ] }),
        renderFooter: () => /* @__PURE__ */ jsxRuntime.jsxs("tr", { className: "font-semibold text-xs", children: [
          /* @__PURE__ */ jsxRuntime.jsx("td", { colSpan: 3, className: `${T.totalCell} ${T.totalLabel} ${T.vline}`, children: "TOTAL" }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.totalCell} text-right ${T.totalValue} ${T.vline}`, children: totalSaldoPesos ? formatCurrency(totalSaldoPesos) : "\u2014" }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.totalCell} text-right ${T.totalValue}`, children: totalMontoCuota ? formatCurrency(totalMontoCuota) : "\u2014" }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { colSpan: 3 })
        ] }),
        renderAfterContent: () => /* @__PURE__ */ jsxRuntime.jsx(recyclebin_default, { deletedRows, getLabel: (r) => r.institucion, onRestore: restoreRow }),
        children: [
          activeRows.map((row) => {
            const hovered = isRowHovered(row.id);
            const selected = selectedRows.has(row.id);
            const showCheckbox = anySelected || hovered;
            const isDragging = drag.dragRowId === row.id;
            const dropBorder = drag.dropTargetId === row.id ? drag.dropPosition === "above" ? "border-t-2 border-t-blue-400" : "border-b-2 border-b-blue-400" : "";
            return /* @__PURE__ */ jsxRuntime.jsxs(
              "tr",
              {
                className: `${T.rowBorder} ${selected ? "bg-rose-50/60" : T.rowHover} ${isDragging ? "opacity-40" : ""} ${dropBorder}`,
                ...getHoverProps(row.id),
                onClick: (e) => handleRowClick(e, row.id),
                onDragOver: drag.handleDragOver(row.id),
                onDragLeave: drag.handleDragLeave,
                onDrop: drag.handleDrop(rows, onRowsChange),
                children: [
                  /* @__PURE__ */ jsxRuntime.jsxs("td", { className: `${T.cellEditLabel} ${T.cellLabel} ${T.vline} relative`, children: [
                    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-0.5 min-w-0", children: [
                      hovered && !anySelected && /* @__PURE__ */ jsxRuntime.jsx(
                        "span",
                        {
                          draggable: true,
                          onDragStart: drag.handleDragStart(row.id),
                          onDragEnd: drag.handleDragEnd,
                          className: "shrink-0 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500",
                          title: "Arrastrar para reordenar",
                          children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.GripVertical, { size: 14 })
                        }
                      ),
                      showCheckbox ? /* @__PURE__ */ jsxRuntime.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: selected,
                          onChange: () => toggleSelect(row.id),
                          className: "shrink-0 w-3.5 h-3.5 rounded border-gray-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                        }
                      ) : null,
                      /* @__PURE__ */ jsxRuntime.jsx(
                        "input",
                        {
                          type: "text",
                          value: row.institucion,
                          onChange: (e) => updateField(row.id, "institucion", e.target.value),
                          className: `flex-1 min-w-0 ${T.inputLabel} ${hovered || showCheckbox ? "" : "pl-1"}`,
                          placeholder: "Instituci\xF3n"
                        }
                      )
                    ] }),
                    hovered && row.sourceFileId && onViewSource && /* @__PURE__ */ jsxRuntime.jsx(
                      "button",
                      {
                        onClick: () => onViewSource([row.sourceFileId]),
                        className: "absolute right-0 top-1/2 -translate-y-1/2 translate-x-[2px] p-0.5 rounded text-rose-400 hover:text-rose-600 hover:bg-rose-100",
                        title: "Ver documento fuente",
                        children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Eye, { size: 14 })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.cellEdit} ${T.vline}`, children: /* @__PURE__ */ jsxRuntime.jsx(
                    "input",
                    {
                      type: "text",
                      value: row.tipo_deuda,
                      onChange: (e) => updateField(row.id, "tipo_deuda", e.target.value),
                      className: `w-full ${T.input} pl-1`,
                      placeholder: "Tipo"
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntime.jsx(
                    editablecell_default,
                    {
                      value: row.saldo_deuda_uf,
                      onChange: (v) => updateField(row.id, "saldo_deuda_uf", v),
                      type: "number",
                      hasData: row.saldo_deuda_uf !== null,
                      className: T.vline,
                      focused: keyboard.isFocused(row.id, 0),
                      onCellFocus: () => keyboard.focus(row.id, 0),
                      onNavigate: keyboard.navigate,
                      requestEdit: keyboard.isFocused(row.id, 0) ? keyboard.editTrigger : 0,
                      requestClear: keyboard.isFocused(row.id, 0) ? keyboard.clearTrigger : 0,
                      editInitialValue: keyboard.isFocused(row.id, 0) ? keyboard.editInitialValue : void 0
                    }
                  ),
                  /* @__PURE__ */ jsxRuntime.jsx(
                    editablecell_default,
                    {
                      value: row.saldo_deuda_pesos,
                      onChange: (v) => updateField(row.id, "saldo_deuda_pesos", v),
                      type: "currency",
                      hasData: row.saldo_deuda_pesos !== null,
                      className: `${T.vline} ${isAutoComputed(row, "saldo_deuda_pesos") ? "italic text-rose-400" : ""}`,
                      focused: keyboard.isFocused(row.id, 1),
                      onCellFocus: () => keyboard.focus(row.id, 1),
                      onNavigate: keyboard.navigate,
                      requestEdit: keyboard.isFocused(row.id, 1) ? keyboard.editTrigger : 0,
                      requestClear: keyboard.isFocused(row.id, 1) ? keyboard.clearTrigger : 0,
                      editInitialValue: keyboard.isFocused(row.id, 1) ? keyboard.editInitialValue : void 0
                    }
                  ),
                  /* @__PURE__ */ jsxRuntime.jsxs("td", { className: `relative ${T.vline}`, children: [
                    /* @__PURE__ */ jsxRuntime.jsx(
                      editablecell_default,
                      {
                        value: row.monto_cuota,
                        onChange: (v) => updateField(row.id, "monto_cuota", v),
                        type: "currency",
                        hasData: row.monto_cuota !== null,
                        className: cuotaClassName(row),
                        focused: keyboard.isFocused(row.id, 2),
                        onCellFocus: () => keyboard.focus(row.id, 2),
                        onNavigate: keyboard.navigate,
                        requestEdit: keyboard.isFocused(row.id, 2) ? keyboard.editTrigger : 0,
                        requestClear: keyboard.isFocused(row.id, 2) ? keyboard.clearTrigger : 0,
                        editInitialValue: keyboard.isFocused(row.id, 2) ? keyboard.editInitialValue : void 0,
                        asDiv: true
                      }
                    ),
                    hovered && row.cuota_estimated && row.saldo_deuda_pesos != null && !row.castigo_pct && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "absolute right-0 top-1/2 -translate-y-1/2 translate-x-[2px] group/info", children: [
                      /* @__PURE__ */ jsxRuntime.jsx("button", { className: "p-0.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100", children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Info, { size: 13 }) }),
                      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "hidden group-hover/info:block absolute bottom-full right-0 mb-1 px-2 py-1 rounded bg-gray-800 text-white text-[10px] whitespace-nowrap z-50 shadow-lg", children: [
                        "Estimado: ",
                        Math.round((row.castigo_pct ?? castigo) * 100),
                        "% de ",
                        formatCurrency(row.saldo_deuda_pesos)
                      ] })
                    ] }),
                    hovered && row.cuota_source_file_id && onViewSource && /* @__PURE__ */ jsxRuntime.jsx(
                      "button",
                      {
                        onClick: () => onViewSource([row.cuota_source_file_id]),
                        className: "absolute right-0 top-1/2 -translate-y-1/2 translate-x-[2px] p-0.5 rounded text-rose-400 hover:text-rose-600 hover:bg-rose-100",
                        title: "Ver documento fuente",
                        children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Eye, { size: 13 })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntime.jsx("td", { className: `text-center ${T.vline}`, children: row.cuota_estimated ? /* @__PURE__ */ jsxRuntime.jsx(
                    editablecell_default,
                    {
                      value: row.castigo_pct != null ? Math.round(row.castigo_pct * 100) : Math.round(castigo * 100),
                      onChange: (v) => updateField(row.id, "castigo_pct", v != null ? v / 100 : castigo),
                      type: "number",
                      hasData: true,
                      align: "center",
                      className: "italic text-gray-400",
                      asDiv: true,
                      focused: keyboard.isFocused(row.id, 3),
                      onCellFocus: () => keyboard.focus(row.id, 3),
                      onNavigate: keyboard.navigate,
                      requestEdit: keyboard.isFocused(row.id, 3) ? keyboard.editTrigger : 0,
                      requestClear: keyboard.isFocused(row.id, 3) ? keyboard.clearTrigger : 0,
                      editInitialValue: keyboard.isFocused(row.id, 3) ? keyboard.editInitialValue : void 0
                    }
                  ) : /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-[11px] text-gray-300", children: "\u2014" }) }),
                  /* @__PURE__ */ jsxRuntime.jsx("td", { className: "text-center text-xs text-gray-500", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-center gap-0.5", children: [
                    /* @__PURE__ */ jsxRuntime.jsx(
                      editablecell_default,
                      {
                        value: row.cuotas_pagadas,
                        onChange: (v) => updateField(row.id, "cuotas_pagadas", v),
                        type: "number",
                        hasData: row.cuotas_pagadas !== null,
                        align: "center",
                        asDiv: true,
                        focused: keyboard.isFocused(row.id, 4),
                        onCellFocus: () => keyboard.focus(row.id, 4),
                        onNavigate: keyboard.navigate,
                        requestEdit: keyboard.isFocused(row.id, 4) ? keyboard.editTrigger : 0,
                        requestClear: keyboard.isFocused(row.id, 4) ? keyboard.clearTrigger : 0,
                        editInitialValue: keyboard.isFocused(row.id, 4) ? keyboard.editInitialValue : void 0
                      }
                    ),
                    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-gray-400", children: "/" }),
                    /* @__PURE__ */ jsxRuntime.jsx(
                      editablecell_default,
                      {
                        value: row.cuotas_total,
                        onChange: (v) => updateField(row.id, "cuotas_total", v),
                        type: "number",
                        hasData: row.cuotas_total !== null,
                        align: "center",
                        asDiv: true,
                        focused: keyboard.isFocused(row.id, 5),
                        onCellFocus: () => keyboard.focus(row.id, 5),
                        onNavigate: keyboard.navigate,
                        requestEdit: keyboard.isFocused(row.id, 5) ? keyboard.editTrigger : 0,
                        requestClear: keyboard.isFocused(row.id, 5) ? keyboard.clearTrigger : 0,
                        editInitialValue: keyboard.isFocused(row.id, 5) ? keyboard.editInitialValue : void 0
                      }
                    )
                  ] }) }),
                  /* @__PURE__ */ jsxRuntime.jsx("td", { className: `text-center ${T.actionCol}`, children: /* @__PURE__ */ jsxRuntime.jsx(deletebutton_default, { onClick: () => requestDelete(row.id), isVisible: hovered && !anySelected }) })
                ]
              },
              row.id
            );
          }),
          /* @__PURE__ */ jsxRuntime.jsxs("tr", { className: `border-b border-dashed ${borderColor.replace("200", "100")} ${headerBg}/20`, children: [
            /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.cellEdit} ${T.vline}`, children: /* @__PURE__ */ jsxRuntime.jsx(
              "input",
              {
                type: "text",
                placeholder: "Agregar deuda...",
                value: newRow.institucion,
                onChange: (e) => setNewRow((prev) => ({ ...prev, institucion: e.target.value })),
                className: `w-full ${T.inputPlaceholder}`,
                onKeyDown: (e) => {
                  if (e.key === "Enter" && newRow.institucion.trim()) addRow();
                }
              }
            ) }),
            /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.cellEdit} ${T.vline}`, children: /* @__PURE__ */ jsxRuntime.jsx(
              "input",
              {
                type: "text",
                placeholder: "Tipo",
                value: newRow.tipo_deuda,
                onChange: (e) => setNewRow((prev) => ({ ...prev, tipo_deuda: e.target.value })),
                className: `w-full ${T.inputPlaceholder}`
              }
            ) }),
            /* @__PURE__ */ jsxRuntime.jsx("td", { className: T.vline }),
            /* @__PURE__ */ jsxRuntime.jsx("td", { className: T.vline }),
            /* @__PURE__ */ jsxRuntime.jsx("td", { className: T.vline }),
            /* @__PURE__ */ jsxRuntime.jsx("td", { className: T.vline }),
            /* @__PURE__ */ jsxRuntime.jsx("td", {}),
            /* @__PURE__ */ jsxRuntime.jsx("td", { className: T.actionCol })
          ] })
        ]
      }
    ) }),
    deleteTargetId && /* @__PURE__ */ jsxRuntime.jsx(deletedialog_default, { count: 1, onConfirm: confirmDelete, onCancel: cancelDelete })
  ] });
};
var deudas_default = DeudasTable;
var ClickableHeader = ({ onClick, borderColor, className, children }) => /* @__PURE__ */ jsxRuntime.jsx(
  "span",
  {
    className: `whitespace-nowrap ${onClick ? `cursor-pointer select-none inline-flex items-center rounded-full border ${borderColor || "border-gray-300"} px-2 py-0.5 -mx-2 -my-0.5 transition-colors` : ""} ${className || ""}`,
    onClick: onClick ? (e) => {
      e.stopPropagation();
      onClick();
    } : void 0,
    children
  }
);
var clickableheader_default = ClickableHeader;
var SHORT_MONTHS = {
  enero: "ENE",
  febrero: "FEB",
  marzo: "MAR",
  abril: "ABR",
  mayo: "MAY",
  junio: "JUN",
  julio: "JUL",
  agosto: "AGO",
  septiembre: "SEP",
  octubre: "OCT",
  noviembre: "NOV",
  diciembre: "DIC"
};
var METRICS = [
  { key: "bruto", label: "Honor. Bruto", color: "text-gray-800", format: (v) => displayCurrencyCompact(v) },
  { key: "retencion", label: "Retenci\xF3n", color: "text-red-700", format: (v) => displayCurrencyCompact(v) },
  { key: "boletas", label: "Boletas Vig.", color: "text-gray-800", format: (v) => v != null ? String(v) : "\u2014" }
];
var BoletasTable = ({
  title,
  months,
  colorScheme: colorSchemeProp,
  headerBg: headerBgProp,
  headerText: headerTextProp,
  sourceFileIds,
  onViewSource,
  excludedMonths,
  onToggleMonth
}) => {
  const { bg: headerBg, text: headerText, border: borderColor } = resolveColors(colorSchemeProp, headerBgProp, headerTextProp);
  const excluded = excludedMonths ?? [];
  return /* @__PURE__ */ jsxRuntime.jsx(
    tableshell_default,
    {
      headerBg,
      renderHeader: () => /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.headerAccordion} text-left ${T.vline}`, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${headerText} ${T.headerTitle}`, children: title }),
          /* @__PURE__ */ jsxRuntime.jsx(SourceIcon, { fileIds: sourceFileIds, onViewSource, className: headerText })
        ] }) }),
        months.map((m) => {
          const isExcluded = excluded.includes(m.periodo);
          const canToggle = !!onToggleMonth;
          const hasValue = m.hasData && m.liquido != null;
          const label = SHORT_MONTHS[m.mes] || m.mes.slice(0, 3).toUpperCase();
          return /* @__PURE__ */ jsxRuntime.jsx(
            "td",
            {
              className: `${T.headerAccordionStat} ${isExcluded ? "opacity-35 line-through" : ""}`,
              children: /* @__PURE__ */ jsxRuntime.jsxs(clickableheader_default, { onClick: canToggle ? () => onToggleMonth(m.periodo) : void 0, borderColor, children: [
                /* @__PURE__ */ jsxRuntime.jsxs("span", { className: `${headerText} ${T.headerStatLabel}`, children: [
                  label,
                  ": "
                ] }),
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${T.headerStat} ${hasValue ? headerText : "text-gray-400"}`, children: hasValue ? displayCurrencyCompact(m.liquido) : "\u2014" })
              ] })
            },
            m.periodo
          );
        })
      ] }),
      children: METRICS.map((metric) => /* @__PURE__ */ jsxRuntime.jsxs("tr", { className: T.rowBorder, children: [
        /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.cell} font-medium ${T.cellLabel} text-gray-600 ${T.vline}`, children: metric.label }),
        months.map((m) => {
          const isExcluded = excluded.includes(m.periodo);
          return /* @__PURE__ */ jsxRuntime.jsx(
            "td",
            {
              className: `${T.cell} text-right ${m.hasData ? metric.color : "text-gray-300"} ${isExcluded ? "opacity-35" : ""}`,
              children: m.hasData ? metric.format(m[metric.key]) : "\u2014"
            },
            m.periodo
          );
        })
      ] }, metric.key))
    }
  );
};
var boletas_default = BoletasTable;
var RiskBadge = ({ value, thresholds }) => {
  if (value === null || value === void 0) return null;
  let badgeClass = "bg-emerald-100 text-emerald-700";
  let badgeText = "OK";
  if (value >= thresholds.danger) {
    badgeClass = "bg-red-100 text-red-700";
    badgeText = "Alto";
  } else if (value >= thresholds.warning) {
    badgeClass = "bg-amber-100 text-amber-700";
    badgeText = "Medio";
  }
  return /* @__PURE__ */ jsxRuntime.jsx("span", { className: `text-xs font-medium px-1.5 py-0.5 rounded ${badgeClass}`, children: badgeText });
};
var FinalResultsCompact = ({
  values,
  onChange,
  calculatedDebtorIncome = 0,
  calculatedCodebtorIncome = 0,
  codeudorIncomes = [],
  calculatedDebts = 0,
  prompt
}) => {
  const debtorIncome = values.renta_liquida_ajustada_comprador ?? (calculatedDebtorIncome > 0 ? Math.round(calculatedDebtorIncome) : null);
  const hasMultipleCodes = codeudorIncomes.length > 0;
  const codeudorIncomesAdjusted = hasMultipleCodes ? codeudorIncomes.map((c, idx) => values.rentas_codeudores?.[idx] ?? (c.calculatedIncome > 0 ? Math.round(c.calculatedIncome) : null)) : [values.renta_liquida_ajustada_codeudor ?? (calculatedCodebtorIncome > 0 ? Math.round(calculatedCodebtorIncome) : null)];
  const totalCodeudorIncome = codeudorIncomesAdjusted.reduce((sum, v) => sum + (v ?? 0), 0);
  const calculatedTotal = (debtorIncome ?? 0) + totalCodeudorIncome;
  const displayTotal = values.total_rentas ?? calculatedTotal;
  const dividendo = values.dividendo_hipotecario ?? 0;
  const totalDebts = calculatedDebts;
  const autoCalculatedCH = displayTotal > 0 ? Math.round(dividendo / displayTotal * 1e4) / 100 : 0;
  const autoCalculatedCF = displayTotal > 0 ? Math.round((dividendo + totalDebts) / displayTotal * 1e4) / 100 : 0;
  const displayCH = values.indice_carga_hipotecaria ?? (autoCalculatedCH > 0 ? autoCalculatedCH : null);
  const displayCF = values.indice_carga_financiera_conjunta ?? (autoCalculatedCF > 0 ? autoCalculatedCF : null);
  const handleEditCH = prompt ? async () => {
    const newVal = await prompt({ message: "Carga Hipotecaria (%)", title: "Editar \xEDndice", defaultValue: displayCH?.toString() || "", type: "number", icon: "Percent" });
    if (newVal !== null) {
      const parsed = parseFloat(newVal);
      onChange("indice_carga_hipotecaria", isNaN(parsed) ? null : parsed);
    }
  } : void 0;
  const handleEditCF = prompt ? async () => {
    const newVal = await prompt({ message: "Carga Financiera Total (%)", title: "Editar \xEDndice", defaultValue: displayCF?.toString() || "", type: "number", icon: "Percent" });
    if (newVal !== null) {
      const parsed = parseFloat(newVal);
      onChange("indice_carga_financiera_conjunta", isNaN(parsed) ? null : parsed);
    }
  } : void 0;
  const clickableClass = prompt ? "cursor-pointer hover:underline" : "";
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "bg-emerald-50 rounded-xl p-4 border border-emerald-200", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-3 flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntime.jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntime.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
        "Rentas L\xEDquidas"
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: T.muted, children: "Comprador" }),
          /* @__PURE__ */ jsxRuntime.jsx(
            editablecell_default,
            {
              value: debtorIncome,
              onChange: (v) => {
                onChange("renta_liquida_ajustada_comprador", v);
                const newTotal = (v ?? 0) + totalCodeudorIncome;
                onChange("total_rentas", newTotal > 0 ? newTotal : null);
              },
              type: "currency",
              className: `text-emerald-700 ${T.cardValue}`,
              asDiv: true
            }
          )
        ] }),
        hasMultipleCodes ? codeudorIncomes.map((codeudor, idx) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${T.muted} truncate max-w-[120px]`, title: codeudor.name, children: codeudorIncomes.length > 1 ? `Codeudor ${idx + 1}` : "Codeudor" }),
          /* @__PURE__ */ jsxRuntime.jsx(
            editablecell_default,
            {
              value: codeudorIncomesAdjusted[idx],
              onChange: (v) => {
                const newCodeudorIncomes = [...codeudorIncomesAdjusted];
                newCodeudorIncomes[idx] = v;
                onChange("rentas_codeudores", newCodeudorIncomes);
                const newTotal = (debtorIncome ?? 0) + newCodeudorIncomes.reduce((sum, val) => sum + (val ?? 0), 0);
                onChange("total_rentas", newTotal > 0 ? newTotal : null);
              },
              type: "currency",
              className: `text-emerald-700 ${T.cardValue}`,
              asDiv: true
            }
          )
        ] }, idx)) : /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: T.muted, children: "Codeudor" }),
          /* @__PURE__ */ jsxRuntime.jsx(
            editablecell_default,
            {
              value: codeudorIncomesAdjusted[0],
              onChange: (v) => {
                onChange("renta_liquida_ajustada_codeudor", v);
                const newTotal = (debtorIncome ?? 0) + (v ?? 0);
                onChange("total_rentas", newTotal > 0 ? newTotal : null);
              },
              type: "currency",
              className: `text-emerald-700 ${T.cardValue}`,
              asDiv: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "border-t border-emerald-300 pt-2 mt-2 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${T.footerLabel} text-emerald-800 text-xs`, children: "TOTAL" }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: `text-emerald-800 ${T.footerValue}`, children: displayCurrencyCompact(displayTotal > 0 ? displayTotal : null) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "bg-sky-50 rounded-xl p-4 border border-sky-200", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "text-xs font-semibold text-sky-700 uppercase tracking-wider mb-3 flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntime.jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntime.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" }) }),
        "Obligaciones"
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: T.muted, children: "Dividendo" }),
          /* @__PURE__ */ jsxRuntime.jsx(
            editablecell_default,
            {
              value: values.dividendo_hipotecario,
              onChange: (v) => onChange("dividendo_hipotecario", v),
              type: "currency",
              className: `text-sky-700 ${T.cardValue}`,
              asDiv: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: T.muted, children: "Deudas" }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: `text-orange-600 ${T.cardValue}`, children: displayCurrencyCompact(totalDebts > 0 ? totalDebts : null) })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "border-t border-sky-300 pt-2 mt-2 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${T.footerLabel} text-sky-800 text-xs`, children: "TOTAL" }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: `text-sky-800 ${T.footerValue}`, children: displayCurrencyCompact(dividendo + totalDebts > 0 ? dividendo + totalDebts : null) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "bg-violet-50 rounded-xl p-4 border border-violet-200", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "text-xs font-semibold text-violet-700 uppercase tracking-wider mb-3 flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntime.jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntime.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }) }),
        "\xCDndices de Carga"
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: T.muted, children: "Hipotecaria" }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              "span",
              {
                className: `text-violet-700 ${T.cardValue} ${clickableClass}`,
                onClick: handleEditCH,
                children: displayCH !== null && displayCH !== void 0 ? `${displayCH}%` : "\u2014"
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(RiskBadge, { value: displayCH, thresholds: { warning: 25, danger: 35 } })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: T.muted, children: "Financiera" }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              "span",
              {
                className: `text-violet-700 ${T.cardValue} ${clickableClass}`,
                onClick: handleEditCF,
                children: displayCF !== null && displayCF !== void 0 ? `${displayCF}%` : "\u2014"
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(RiskBadge, { value: displayCF, thresholds: { warning: 40, danger: 50 } })
          ] })
        ] })
      ] })
    ] })
  ] });
};
var finalresults_default = FinalResultsCompact;
function AssetTable({
  columns: columns3,
  rows,
  onRowsChange,
  idPrefix,
  addPlaceholder,
  formatCurrency = defaultFormatCurrency,
  colorScheme: colorSchemeProp,
  headerBg: headerBgProp,
  headerText: headerTextProp,
  title,
  ufValue,
  conversionRules = [],
  computeRules = []
}) {
  const { bg: headerBg, text: headerText, border: borderColor } = resolveColors(colorSchemeProp, headerBgProp, headerTextProp);
  const { getHoverProps, isHovered } = useRowHover();
  const [toggledCols, setToggledCols] = React3.useState(/* @__PURE__ */ new Set());
  const { activeRows, deletedRows, deleteTargetId, requestDelete, confirmDelete, cancelDelete, restoreRow } = useSoftDelete(rows, onRowsChange);
  const canToggleCurrency = ufValue != null;
  const toggleColumn = (key) => {
    setToggledCols((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };
  const resolvedColumns = React3.useMemo(() => {
    return columns3.map((col) => {
      if (col.ufPair && toggledCols.has(col.key)) {
        const pairLabel = col.ufPairLabel || col.label;
        const pairType = col.ufPairType || "currency";
        return { ...col, key: col.ufPair, type: pairType, label: pairLabel };
      }
      return col;
    });
  }, [columns3, toggledCols]);
  const editableCols = React3.useMemo(
    () => resolvedColumns.filter((c) => c.type !== "text"),
    [resolvedColumns]
  );
  const visibleRowIds = React3.useMemo(() => activeRows.map((r) => r.id), [activeRows]);
  const keyboard = useGridKeyboard({ visibleRowIds, colCount: editableCols.length });
  const textCols = resolvedColumns.filter((c) => c.type === "text");
  const labelCol = resolvedColumns.find((c) => c.isLabel) || resolvedColumns[0];
  const [newRowValues, setNewRowValues] = React3.useState({});
  const hasAutoConvert = conversionRules.length > 0 || computeRules.length > 0;
  const updateField = (id, field, value) => {
    onRowsChange(rows.map((r) => {
      if (r.id !== id) return r;
      if (hasAutoConvert) {
        let next = applyAutoConversions(r, field, value, conversionRules, {});
        next = applyAutoCompute(next, field, computeRules, {});
        return next;
      }
      return { ...r, [field]: value };
    }));
  };
  const addRow = (overrides) => {
    const base = { id: generateId(idPrefix) };
    for (const col of columns3) {
      if (col.type === "text") {
        base[col.key] = (newRowValues[col.key] || "").trim();
      } else {
        base[col.key] = null;
      }
      if (col.ufPair) base[col.ufPair] = null;
    }
    const row = { ...base, ...overrides };
    setNewRowValues({});
    onRowsChange([...rows, row]);
  };
  const totals = React3.useMemo(() => {
    const result = {};
    for (const col of resolvedColumns) {
      if (col.type === "currency" || col.type === "number") {
        result[col.key] = activeRows.reduce((s, r) => s + (r[col.key] || 0), 0);
      }
    }
    return result;
  }, [activeRows, resolvedColumns]);
  const editableColIndex = (col) => editableCols.indexOf(col);
  const renderEditableCell = (row, col, vline = "") => {
    const colIdx = editableColIndex(col);
    const value = row[col.key];
    const autoClass = col.autoComputedClass?.(row) || "";
    return /* @__PURE__ */ jsxRuntime.jsx(
      editablecell_default,
      {
        value,
        onChange: (v) => updateField(row.id, col.key, v),
        type: col.type,
        hasData: value !== null,
        align: col.align,
        className: `${autoClass} ${vline}`,
        focused: keyboard.isFocused(row.id, colIdx),
        onCellFocus: () => keyboard.focus(row.id, colIdx),
        onNavigate: keyboard.navigate,
        requestEdit: keyboard.isFocused(row.id, colIdx) ? keyboard.editTrigger : 0,
        requestClear: keyboard.isFocused(row.id, colIdx) ? keyboard.clearTrigger : 0,
        editInitialValue: keyboard.isFocused(row.id, colIdx) ? keyboard.editInitialValue : void 0
      },
      col.key
    );
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { onKeyDown: keyboard.handleContainerKeyDown, tabIndex: 0, className: "outline-none", children: /* @__PURE__ */ jsxRuntime.jsxs(
      tableshell_default,
      {
        colorScheme: colorSchemeProp,
        headerClassName: `border-t ${borderColor} ${headerText}`,
        renderHeader: () => /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
          resolvedColumns.map((col, i) => {
            const effectiveAlign = col.align ?? (col.type === "currency" || col.type === "number" ? "right" : "left");
            const vline = i < resolvedColumns.length - 1 ? T.vline : "";
            const label = col === labelCol && title ? title : col.label;
            const origCol = columns3[i];
            const isToggleable = canToggleCurrency && origCol?.ufPair;
            return /* @__PURE__ */ jsxRuntime.jsx(
              "th",
              {
                className: `${T.headerCell} ${effectiveAlign === "right" ? "text-right" : effectiveAlign === "center" ? "text-center" : "text-left"} ${T.th} ${headerText} ${vline}`,
                children: isToggleable ? /* @__PURE__ */ jsxRuntime.jsx(clickableheader_default, { onClick: () => toggleColumn(origCol.key), borderColor, children: label }) : label
              },
              col.key
            );
          }),
          /* @__PURE__ */ jsxRuntime.jsx("th", { className: T.actionCol })
        ] }),
        renderFooter: () => /* @__PURE__ */ jsxRuntime.jsxs("tr", { className: "font-semibold text-xs", children: [
          /* @__PURE__ */ jsxRuntime.jsx("td", { colSpan: textCols.length, className: `${T.totalCell} ${T.totalLabel} border-t border-gray-200`, children: "TOTAL" }),
          editableCols.map((col) => /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.totalCell} ${col.align === "center" ? "text-center" : "text-right"} ${T.totalValue} border-t border-gray-200`, children: totals[col.key] ? col.type === "number" ? totals[col.key].toLocaleString("es-CL", { maximumFractionDigits: 2 }) : formatCurrency(totals[col.key]) : "\u2014" }, col.key)),
          /* @__PURE__ */ jsxRuntime.jsx("td", { className: "border-t border-gray-200" })
        ] }),
        renderAfterContent: () => /* @__PURE__ */ jsxRuntime.jsx(
          recyclebin_default,
          {
            deletedRows,
            getLabel: (r) => r[labelCol.key] || "",
            onRestore: restoreRow,
            renderCells: (row) => /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
              editableCols.map((col, i) => {
                const v = row[col.key];
                return /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.totalCell} text-right tabular-nums ${i < editableCols.length - 1 ? T.vline : ""}`, children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${T.totalValue} ${v != null ? "text-gray-400" : "text-gray-200"}`, children: v != null ? col.type === "number" ? String(v) : formatCurrency(v) : "\u2014" }) }, col.key);
              }),
              /* @__PURE__ */ jsxRuntime.jsx("td", { className: T.actionCol })
            ] })
          }
        ),
        children: [
          activeRows.map((row) => {
            const hovered = isHovered(row.id);
            return /* @__PURE__ */ jsxRuntime.jsxs(
              "tr",
              {
                className: `${T.rowBorder} ${T.rowHover}`,
                ...getHoverProps(row.id),
                children: [
                  resolvedColumns.map((col, i) => {
                    const vline = i < resolvedColumns.length - 1 ? T.vline : "";
                    if (col.isLabel) {
                      return /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.cellEdit} ${T.cellLabel} ${vline}`, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-1 min-w-0", children: [
                        /* @__PURE__ */ jsxRuntime.jsx(deletebutton_default, { onClick: () => requestDelete(row.id), isVisible: hovered }),
                        /* @__PURE__ */ jsxRuntime.jsx(
                          "input",
                          {
                            type: "text",
                            value: row[col.key] || "",
                            onChange: (e) => updateField(row.id, col.key, e.target.value),
                            className: `flex-1 min-w-0 ${T.inputLabel} pl-1`,
                            placeholder: col.placeholder || col.label
                          }
                        )
                      ] }) }, col.key);
                    }
                    if (col.type === "text") {
                      const isRight = col.align === "right";
                      const textAlign = isRight ? "text-right" : col.align === "center" ? "text-center" : "text-left";
                      return /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.cellEdit} ${vline}`, children: /* @__PURE__ */ jsxRuntime.jsx(
                        "input",
                        {
                          type: "text",
                          value: row[col.key] || "",
                          onChange: (e) => updateField(row.id, col.key, e.target.value),
                          className: `w-full ${T.input} ${textAlign} pl-1`,
                          style: isRight ? { padding: 0 } : void 0,
                          placeholder: col.placeholder || col.label
                        }
                      ) }, col.key);
                    }
                    return renderEditableCell(row, col, vline);
                  }),
                  /* @__PURE__ */ jsxRuntime.jsx("td", { className: T.actionCol })
                ]
              },
              row.id
            );
          }),
          /* @__PURE__ */ jsxRuntime.jsxs("tr", { className: `border-b border-dashed ${borderColor.replace("200", "100")} ${headerBg}/20`, children: [
            resolvedColumns.map((col, i) => {
              const vline = i < resolvedColumns.length - 1 ? T.vline : "";
              if (col.isLabel) {
                return /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.cellEdit} ${vline}`, children: /* @__PURE__ */ jsxRuntime.jsx(
                  "input",
                  {
                    type: "text",
                    placeholder: addPlaceholder || `Agregar...`,
                    value: newRowValues[col.key] || "",
                    onChange: (e) => setNewRowValues((prev) => ({ ...prev, [col.key]: e.target.value })),
                    className: `w-full ${T.inputPlaceholder}`,
                    onKeyDown: (e) => {
                      if (e.key === "Enter" && (newRowValues[col.key] || "").trim()) addRow();
                    }
                  }
                ) }, col.key);
              }
              if (col.type === "text") {
                const isAddRight = col.align === "right";
                const addTextAlign = isAddRight ? "text-right" : col.align === "center" ? "text-center" : "text-left";
                return /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.cellEdit} ${vline}`, children: /* @__PURE__ */ jsxRuntime.jsx(
                  "input",
                  {
                    type: "text",
                    placeholder: col.placeholder || col.label,
                    value: newRowValues[col.key] || "",
                    onChange: (e) => setNewRowValues((prev) => ({ ...prev, [col.key]: e.target.value })),
                    className: `w-full ${T.inputPlaceholder} ${addTextAlign}`,
                    style: isAddRight ? { padding: 0 } : void 0
                  }
                ) }, col.key);
              }
              return /* @__PURE__ */ jsxRuntime.jsx(
                editablecell_default,
                {
                  value: null,
                  onChange: (v) => addRow({ [col.key]: v }),
                  type: col.type,
                  hasData: false,
                  align: col.align,
                  className: vline
                },
                col.key
              );
            }),
            /* @__PURE__ */ jsxRuntime.jsx("td", { className: T.actionCol })
          ] })
        ]
      }
    ) }),
    deleteTargetId && /* @__PURE__ */ jsxRuntime.jsx(deletedialog_default, { count: 1, onConfirm: confirmDelete, onCancel: cancelDelete })
  ] });
}
var assettable_default = AssetTable;
var columns = [
  { key: "marca", label: "Marca", type: "text", isLabel: true, placeholder: "Marca" },
  { key: "modelo", label: "Modelo", type: "text", placeholder: "Modelo" },
  { key: "anio", label: "A\xF1o", type: "number", align: "center" },
  { key: "monto", label: "Monto $", type: "currency" }
];
var VehiculosTable = ({
  rows,
  onRowsChange,
  formatCurrency,
  colorScheme,
  headerBg,
  headerText,
  title
}) => /* @__PURE__ */ jsxRuntime.jsx(
  assettable_default,
  {
    columns,
    rows,
    onRowsChange,
    idPrefix: "vh",
    addPlaceholder: "Agregar veh\xEDculo...",
    formatCurrency,
    colorScheme,
    headerBg,
    headerText,
    title
  }
);
var vehiculos_default = VehiculosTable;
var columns2 = [
  { key: "institucion", label: "Instituci\xF3n", type: "text", isLabel: true, placeholder: "Instituci\xF3n" },
  { key: "tipo", label: "Tipo Inversi\xF3n", type: "text", placeholder: "Tipo" },
  { key: "fecha", label: "Fecha", type: "text", align: "right", placeholder: "-" },
  { key: "monto", label: "Monto $", type: "currency" }
];
var InversionesTable = ({
  rows,
  onRowsChange,
  formatCurrency,
  colorScheme,
  headerBg,
  headerText,
  title
}) => /* @__PURE__ */ jsxRuntime.jsx(
  assettable_default,
  {
    columns: columns2,
    rows,
    onRowsChange,
    idPrefix: "inv",
    addPlaceholder: "Agregar inversi\xF3n...",
    formatCurrency,
    colorScheme,
    headerBg,
    headerText,
    title
  }
);
var inversiones_default = InversionesTable;
var PropiedadesTable = ({
  rows,
  onRowsChange,
  formatCurrency,
  ufValue,
  capRate = 0.05,
  factorDescuento = 0.1,
  colorScheme,
  headerBg,
  headerText,
  title
}) => {
  const columns3 = [
    { key: "direccion", label: "Direcci\xF3n", type: "text", isLabel: true, placeholder: "Direcci\xF3n" },
    { key: "comuna", label: "Comuna", type: "text", placeholder: "Comuna" },
    {
      key: "valor_uf",
      label: "Valor UF",
      type: "number",
      ufPair: "valor_pesos",
      ufPairLabel: "Valor $",
      ufPairType: "currency",
      autoComputedClass: (row) => ufValue && row.valor_uf != null && row.valor_pesos != null ? "italic text-amber-500" : ""
    },
    {
      key: "arriendo_real",
      label: "Arr. Real $",
      type: "currency",
      ufPair: "arriendo_real_uf",
      ufPairLabel: "Arr. Real UF",
      ufPairType: "number"
    },
    {
      key: "arriendo_futuro",
      label: "Arr. Fut $",
      type: "currency",
      ufPair: "arriendo_futuro_uf",
      ufPairLabel: "Arr. Fut UF",
      ufPairType: "number",
      autoComputedClass: (row) => ufValue && row.valor_uf != null ? "italic text-amber-500" : ""
    }
  ];
  const conversionRules = React3.useMemo(() => ufValue ? [
    { source: "valor_uf", target: "valor_pesos", formula: (v) => v * ufValue, precision: 0 },
    { source: "valor_pesos", target: "valor_uf", formula: (v) => v / ufValue, precision: 2 },
    { source: "arriendo_real", target: "arriendo_real_uf", formula: (v) => v / ufValue, precision: 2 },
    { source: "arriendo_real_uf", target: "arriendo_real", formula: (v) => v * ufValue, precision: 0 },
    { source: "arriendo_futuro", target: "arriendo_futuro_uf", formula: (v) => v / ufValue, precision: 2 },
    { source: "arriendo_futuro_uf", target: "arriendo_futuro", formula: (v) => v * ufValue, precision: 0 }
  ] : [], [ufValue]);
  const computeRules = React3.useMemo(() => ufValue ? [
    {
      target: "arriendo_futuro",
      depends: ["valor_uf", "valor_pesos"],
      condition: (row) => row.arriendo_futuro == null,
      formula: (row) => {
        const valorUf = row.valor_uf;
        if (!valorUf || !capRate) return null;
        return Math.round(valorUf * capRate / 12 * (1 - factorDescuento) * ufValue);
      }
    },
    {
      target: "arriendo_futuro_uf",
      depends: ["valor_uf", "valor_pesos"],
      condition: (row) => row.arriendo_futuro == null,
      formula: (row) => {
        const valorUf = row.valor_uf;
        if (!valorUf || !capRate) return null;
        return Math.round(valorUf * capRate / 12 * (1 - factorDescuento) * 100) / 100;
      }
    }
  ] : [], [ufValue, capRate, factorDescuento]);
  return /* @__PURE__ */ jsxRuntime.jsx(
    assettable_default,
    {
      columns: columns3,
      rows,
      onRowsChange,
      idPrefix: "br",
      addPlaceholder: "Agregar propiedad...",
      formatCurrency,
      colorScheme,
      headerBg,
      headerText,
      title,
      ufValue,
      conversionRules,
      computeRules
    }
  );
};
var propiedades_default = PropiedadesTable;
var defaultColorScheme = {
  totalBg: "bg-cyan-50",
  totalBorder: "border-cyan-200",
  totalText: "text-cyan-700",
  totalValueText: "text-cyan-800"
};
var ActivosSummary = ({
  items,
  totalLabel = "Total Activos",
  formatCurrency = defaultFormatCurrency,
  colorScheme = defaultColorScheme
}) => {
  const grandTotal = items.reduce((sum, item) => sum + (item.value || 0), 0);
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "grid grid-cols-3 gap-2", children: items.map((item, i) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "border border-gray-200 rounded-lg p-2.5", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: `${T.cardLabel} text-gray-500`, children: item.label }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: `${T.cardValue} text-gray-800 mt-0.5`, children: item.value ? formatCurrency(item.value) : "\u2014" }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "text-[10px] text-gray-400 mt-0.5", children: [
        item.count,
        " ",
        item.count === 1 ? "registro" : "registros"
      ] })
    ] }, i)) }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: `${colorScheme.totalBg} border ${colorScheme.totalBorder} rounded-lg p-2.5 flex items-center justify-between`, children: [
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${T.totalLabel} ${colorScheme.totalText}`, children: totalLabel }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${T.totalValue} ${colorScheme.totalValueText}`, children: grandTotal ? formatCurrency(grandTotal) : "\u2014" })
    ] })
  ] });
};
var activossummary_default = ActivosSummary;
function formatCell(v, format) {
  if (v == null) return { display: "\u2014", title: void 0 };
  switch (format) {
    case "percent": {
      const pct = v * 100;
      const display = pct.toFixed(2).replace(".", ",") + " %";
      const full = pct.toFixed(4).replace(".", ",") + " %";
      return { display, title: full !== display ? full : void 0 };
    }
    case "integer":
      return { display: String(Math.round(v)), title: void 0 };
    default:
      return { display: displayCurrencyCompact(v), title: displayCurrency(v) || void 0 };
  }
}
var SummaryTable = ({ columnHeaders, rows, extraColumn, renderLabelSuffix, colorScheme }) => {
  const colors = colorScheme ?? DEFAULT_SCHEME;
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "overflow-x-auto border-y border-gray-200 mb-3 sm:mb-4", children: /* @__PURE__ */ jsxRuntime.jsx("table", { className: `${T.table} border-collapse`, children: /* @__PURE__ */ jsxRuntime.jsx("tbody", { children: rows.map((row, idx) => {
    if (row.type === "subheader") {
      return /* @__PURE__ */ jsxRuntime.jsxs("tr", { className: `border-b-2 ${colors.border}`, children: [
        /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.cell} ${T.th} font-bold ${colors.text} tracking-wider ${T.vline}`, children: row.label }),
        extraColumn && /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.cell} ${T.th} text-right font-bold ${colors.text} ${T.vline}`, children: extraColumn.header }),
        columnHeaders.map((col, i) => /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.cell} ${T.th} text-right font-bold ${colors.text} ${i < columnHeaders.length - 1 ? T.vline : ""}`, children: col }, i))
      ] }, idx);
    }
    const isTotal = row.type === "total";
    const isFinal = row.type === "grandtotal";
    const bold = isTotal || isFinal;
    const fmt = row.format ?? "currency";
    const rowClass = isFinal ? `border-b-2 ${colors.bg} ${colors.border}` : isTotal ? T.rowTotal : T.row;
    return /* @__PURE__ */ jsxRuntime.jsxs("tr", { className: rowClass, children: [
      /* @__PURE__ */ jsxRuntime.jsxs("td", { className: `${T.cell} ${bold ? T.footerLabel + " text-gray-800" : T.muted + " " + T.cellIndent} ${T.vline}`, children: [
        row.label,
        renderLabelSuffix?.(row, idx)
      ] }),
      extraColumn && /* @__PURE__ */ jsxRuntime.jsx("td", { className: T.vline, children: extraColumn.render(row, idx) }),
      row.values.map((v, i) => {
        const { display, title } = formatCell(v, fmt);
        return /* @__PURE__ */ jsxRuntime.jsx(
          "td",
          {
            title,
            className: `${T.cellValue} ${bold ? T.footerValue + " text-gray-800" : "text-gray-700"}${title ? " cursor-default" : ""} ${i < row.values.length - 1 ? T.vline : ""}`,
            children: display
          },
          i
        );
      })
    ] }, idx);
  }) }) }) });
};
var summary_default = SummaryTable;
var DeclaracionTable = ({
  columns: columns3,
  rows,
  data,
  totalLabel = "Suma Total",
  formatCurrency,
  colorScheme: colorSchemeProp,
  sourceFileIds,
  onViewSource
}) => {
  const { bg: headerBg, text: headerText, border: borderColor } = resolveColors(colorSchemeProp);
  const showCodeColumn = rows.some((r) => r.code != null);
  return /* @__PURE__ */ jsxRuntime.jsx("div", { children: /* @__PURE__ */ jsxRuntime.jsx(
    tableshell_default,
    {
      headerBg,
      headerClassName: `border-b ${borderColor}`,
      renderHeader: () => /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        /* @__PURE__ */ jsxRuntime.jsx("th", { className: `text-left ${T.cell} font-medium ${headerText} ${T.vline}`, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-1.5", children: [
          "Concepto",
          /* @__PURE__ */ jsxRuntime.jsx(SourceIcon, { fileIds: sourceFileIds, onViewSource, className: headerText })
        ] }) }),
        showCodeColumn && /* @__PURE__ */ jsxRuntime.jsx("th", { className: `text-left ${T.cell} font-medium ${headerText} ${T.vline}`, children: "C\xF3digo" }),
        columns3.map((col, i) => /* @__PURE__ */ jsxRuntime.jsx("th", { className: `text-right ${T.cell} font-medium ${headerText} ${i < columns3.length - 1 ? T.vline : ""}`, children: col.label }, col.key))
      ] }),
      renderFooter: totalLabel ? () => /* @__PURE__ */ jsxRuntime.jsxs("tr", { className: "font-semibold", children: [
        /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.cell} text-gray-800 border-t border-gray-200`, children: totalLabel }),
        showCodeColumn && /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.cell} border-t border-gray-200` }),
        columns3.map((col) => {
          const summedRows = rows.filter((r) => r.summed);
          const hasAny = summedRows.some((r) => data[r.key]?.[col.key] != null);
          const sum = summedRows.reduce((acc, r) => acc + (data[r.key]?.[col.key] ?? 0), 0);
          return /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.cellValue} text-gray-900 border-t border-gray-200`, children: hasAny ? formatCurrency(sum) : "\u2014" }, col.key);
        })
      ] }) : void 0,
      children: rows.map((row) => /* @__PURE__ */ jsxRuntime.jsxs("tr", { className: T.row, children: [
        /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.cell} text-gray-700 ${T.vline}`, children: row.label }),
        showCodeColumn && /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.cell} text-gray-400 tabular-nums ${T.vline}`, children: row.code ?? "" }),
        columns3.map((col, ci) => {
          const value = data[row.key]?.[col.key];
          return /* @__PURE__ */ jsxRuntime.jsx("td", { className: `${T.cellValue} ${value != null ? "text-gray-900" : "text-gray-400"} ${ci < columns3.length - 1 ? T.vline : ""}`, children: value != null ? formatCurrency(value) : "\u2014" }, col.key);
        })
      ] }, row.key))
    }
  ) });
};
var declaracion_default = DeclaracionTable;
function EditableField({
  value,
  onChange,
  type = "percent",
  min = 0,
  max = 100,
  className = ""
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    editablecell_default,
    {
      value,
      onChange: (v) => {
        const n = typeof v === "number" ? v : 0;
        onChange(Math.max(min, Math.min(max, Math.round(n))));
      },
      type,
      asDiv: true,
      className: `bg-blue-50/50 rounded !py-0.5 !px-1.5 [&>div]:h-4 text-[11px] ${className}`
    }
  );
}

exports.ActivosSummary = activossummary_default;
exports.AssetTable = assettable_default;
exports.BoletasTable = boletas_default;
exports.ClickableHeader = clickableheader_default;
exports.DEFAULT_SCHEME = DEFAULT_SCHEME;
exports.DeclaracionTable = declaracion_default;
exports.DeleteDialog = deletedialog_default;
exports.DeudasTable = deudas_default;
exports.EditableCell = editablecell_default;
exports.EditableField = EditableField;
exports.FinalResultsCompact = finalresults_default;
exports.InversionesTable = inversiones_default;
exports.MONTH_LABELS = MONTH_LABELS;
exports.PropiedadesTable = propiedades_default;
exports.RecycleBin = recyclebin_default;
exports.SourceIcon = SourceIcon;
exports.SummaryTable = summary_default;
exports.TableShell = tableshell_default;
exports.VehiculosTable = vehiculos_default;
exports.applyAutoCompute = applyAutoCompute;
exports.applyAutoConversions = applyAutoConversions;
exports.default = renta_default;
exports.defaultFormatCurrency = defaultFormatCurrency;
exports.displayCurrency = displayCurrency;
exports.displayCurrencyCompact = displayCurrencyCompact;
exports.formatDeletedDate = formatDeletedDate;
exports.generateId = generateId;
exports.generateLastNMonths = generateLastNMonths;
exports.resolveColors = resolveColors;
exports.useSoftDelete = useSoftDelete;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map