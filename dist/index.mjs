import React4, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Eye, Info, ChevronUp, ChevronDown, Trash2, Undo2, GripVertical, ChevronRight, Ungroup, Check, X, FoldVertical } from 'lucide-react';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { createPortal } from 'react-dom';

// src/renta/index.tsx

// src/common/styles.ts
var T = {
  table: "w-full text-xs",
  headerTitle: "font-normal text-xs truncate",
  headerStat: "font-normal text-xs",
  headerStatLabel: "font-normal text-xs uppercase",
  headerCount: "font-medium text-xs",
  th: "text-gray-500 font-medium text-xs uppercase",
  cellLabel: "overflow-hidden",
  input: "bg-transparent border-none outline-none text-xs truncate",
  inputLabel: "bg-transparent border-none outline-none text-xs font-medium truncate",
  inputPlaceholder: "bg-transparent border-none outline-none text-xs text-gray-500 placeholder-gray-400 truncate",
  rowLabel: "bg-transparent border-none outline-none text-xs font-medium text-gray-600 truncate",
  totalLabel: "font-medium text-xs",
  totalValue: "font-medium text-xs",
  footerLabel: "font-bold",
  footerValue: "font-bold",
  muted: "text-xs text-gray-600",
  empty: "text-xs text-gray-400 italic",
  cardLabel: "text-xs font-medium",
  cardValue: "text-xs font-semibold",
  // Shared row primitives (used across summary, data-entry, and read-only tables)
  row: "border-b border-gray-100",
  rowTotal: "border-b bg-gray-50/80 border-gray-200",
  rowGrandtotal: "border-b-2 bg-gray-100 border-gray-300",
  cell: "py-1.5 px-3",
  cellValue: "py-1.5 px-3 text-right tabular-nums"
};
var SourceIcon = ({
  fileIds,
  onViewSource,
  className
}) => {
  if (!fileIds?.length || !onViewSource) return null;
  return /* @__PURE__ */ jsx(
    "button",
    {
      onClick: (e) => {
        e.stopPropagation();
        onViewSource(fileIds);
      },
      className: "p-1 rounded hover:bg-white/50 transition-colors",
      title: "Ver documento fuente",
      children: /* @__PURE__ */ jsx(Eye, { size: 14, className })
    }
  );
};
var TableShell = ({
  headerBg = "bg-gray-100",
  defaultCollapsed = false,
  forceExpanded = false,
  disableToggle = false,
  flush = false,
  renderHeader,
  children,
  renderAfterContent,
  contentClassName,
  contentProps
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const isExpanded = forceExpanded || !isCollapsed;
  const canToggle = !forceExpanded && !disableToggle;
  const outerBorder = flush ? "" : isExpanded ? "border border-gray-200" : "";
  const outerRadius = flush ? "" : `rounded-xl overflow-hidden`;
  const headerRadius = flush ? "" : isExpanded ? "rounded-t-xl" : "rounded-xl";
  return /* @__PURE__ */ jsx("div", { className: `${outerRadius} ${outerBorder}`, children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("div", { className: "inline-block min-w-full", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        role: canToggle ? "button" : void 0,
        tabIndex: canToggle ? 0 : void 0,
        onClick: () => canToggle && setIsCollapsed(!isCollapsed),
        onKeyDown: (e) => {
          if (canToggle && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            setIsCollapsed(!isCollapsed);
          }
        },
        className: `${headerBg} hover:brightness-95 transition-all ${canToggle ? "cursor-pointer" : "cursor-default"} ${headerRadius}`,
        children: renderHeader({ isExpanded })
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        ...contentProps,
        className: `bg-white ${!isExpanded ? "hidden print:block" : ""} ${contentClassName || ""}`,
        children
      }
    ),
    renderAfterContent?.({ isExpanded })
  ] }) }) });
};
var tableshell_default = TableShell;

// src/common/utils.ts
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
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
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
  width = "100px",
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
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef(null);
  const startEdit = (initialValue) => {
    setEditValue(initialValue ?? value?.toString() ?? "");
    setIsEditing(true);
  };
  useEffect(() => {
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
  useEffect(() => {
    if (requestEdit > 0 && !isEditing) {
      startEdit(editInitialValue ?? void 0);
    }
  }, [requestEdit]);
  useEffect(() => {
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
  return /* @__PURE__ */ jsx(
    Wrapper,
    {
      className: `px-2 py-1.5 cursor-pointer ${focusRing} ${className}`,
      style: { width, minWidth: width, maxWidth: width },
      onClick: handleClick,
      onDoubleClick: handleDoubleClick,
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      children: /* @__PURE__ */ jsxs("div", { className: `h-5 flex items-center ${alignClass} gap-1`, children: [
        onViewSource && (isMobile || isHovered) && !isEditing && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: (e) => {
              e.stopPropagation();
              onViewSource();
            },
            className: `p-0.5 rounded hover:bg-gray-200 transition-all shrink-0 ${isMobile ? "opacity-100" : ""}`,
            title: "Ver documento fuente",
            children: /* @__PURE__ */ jsx(Eye, { size: 14, className: "text-gray-400" })
          }
        ),
        isEditing ? /* @__PURE__ */ jsx(
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
        ) : /* @__PURE__ */ jsx(
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
  return /* @__PURE__ */ jsx(
    "button",
    {
      onClick,
      className: `${padding} rounded transition-all shrink-0 ${isVisible ? "opacity-100 text-red-400 hover:text-red-600 hover:bg-red-100" : "opacity-0"}`,
      title,
      children: /* @__PURE__ */ jsx(X, { size: iconSize })
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
  onMouseEnter,
  onMouseLeave,
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
  return /* @__PURE__ */ jsxs(
    "tr",
    {
      className: `border-b border-gray-100 ${rowBg} ${isDragging ? "opacity-40" : ""} ${dropBorder} group`,
      onClick: handleRowClick,
      onMouseEnter,
      onMouseLeave,
      onContextMenu,
      onDragOver,
      onDragLeave,
      onDrop,
      children: [
        /* @__PURE__ */ jsx("td", { className: `pl-1 pr-2 py-1.5 text-gray-700 ${T.cellLabel}`, style: { width: showClassificationColumns || showVariableColumn ? "140px" : "180px" }, children: /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-0.5 min-w-0 ${indented ? "pl-4" : ""}`, children: [
          isHovered && onDragStart && !anySelected && /* @__PURE__ */ jsx(
            "span",
            {
              draggable: true,
              onDragStart,
              onDragEnd,
              className: "shrink-0 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500",
              title: "Arrastrar para reordenar",
              children: /* @__PURE__ */ jsx(GripVertical, { size: 14 })
            }
          ),
          showCheckbox ? /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: selected,
              onChange: onToggleSelect,
              className: "shrink-0 w-3.5 h-3.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            }
          ) : null,
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: row.label,
              onChange: (e) => onLabelChange(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter") e.target.blur();
              },
              className: `flex-1 min-w-0 ${T.rowLabel} ${isHovered || showCheckbox ? "" : "pl-1"}`,
              title: row.label
            }
          ),
          row.sourceFileId && onViewSource && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => onViewSource([row.sourceFileId]),
              className: `p-1 rounded transition-all shrink-0 ${isHovered ? "opacity-100 text-gray-400 hover:text-gray-600 hover:bg-gray-100" : "opacity-0"}`,
              title: "Ver documento fuente",
              children: /* @__PURE__ */ jsx(Eye, { size: 14 })
            }
          )
        ] }) }),
        showClassificationColumns && (() => {
          const tipo = naturalezaPill(row.naturaleza);
          const renta = rentaPill(row.isVariable, row.naturaleza);
          return /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              "td",
              {
                className: "px-0.5 py-1 text-center",
                style: { width: "44px" },
                onClick: (e) => {
                  e.stopPropagation();
                  onToggleNaturaleza?.();
                },
                title: `${row.naturaleza || "Sin tipo"} \u2014 click para cambiar`,
                children: /* @__PURE__ */ jsx("span", { className: `${PILL} ${tipo.style}`, children: tipo.label })
              }
            ),
            /* @__PURE__ */ jsx(
              "td",
              {
                className: "px-0.5 py-1 text-center",
                style: { width: "36px" },
                onClick: (e) => {
                  e.stopPropagation();
                  if (row.naturaleza !== "Legal") onToggleVariable?.();
                },
                title: row.naturaleza === "Legal" ? "Descuento legal" : row.isVariable ? "Variable \u2014 click para cambiar a Fija" : "Fija \u2014 click para cambiar a Variable",
                children: /* @__PURE__ */ jsx("span", { className: `${PILL} ${renta.style}`, children: renta.label })
              }
            )
          ] });
        })(),
        showVariableColumn && !showClassificationColumns && (() => {
          const renta = rentaPill(row.isVariable, void 0);
          return /* @__PURE__ */ jsx(
            "td",
            {
              className: "px-0.5 py-1 text-center",
              style: { width: "28px" },
              onClick: (e) => {
                e.stopPropagation();
                onToggleVariable?.();
              },
              title: row.isVariable ? "Variable \u2014 click para cambiar a Fija" : "Fija \u2014 click para cambiar a Variable",
              children: /* @__PURE__ */ jsx("span", { className: `${PILL} ${renta.style}`, children: renta.label })
            }
          );
        })(),
        months.map((p, mi) => {
          const cellFocused = isCellFocused?.(mi) ?? false;
          return /* @__PURE__ */ jsx(
            editablecell_default,
            {
              value: row.values[p.id] ?? null,
              onChange: (v) => onValueChange(p.id, v),
              isDeduction: subtract,
              hasData: row.values[p.id] !== void 0 && row.values[p.id] !== null,
              width: "110px",
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
        /* @__PURE__ */ jsx("td", { style: { width: "40px" }, className: "text-center", children: /* @__PURE__ */ jsx(deletebutton_default, { onClick: onRemove, isVisible: isHovered && !anySelected, title: "Eliminar fila" }) })
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
  return /* @__PURE__ */ jsxs("tr", { className: `border-b border-dashed ${bgClass}`, children: [
    /* @__PURE__ */ jsx("td", { className: "px-4 py-1.5", style: { width: showClassificationColumns || showVariableColumn ? "140px" : "180px" }, children: /* @__PURE__ */ jsx(
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
    showClassificationColumns && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("td", { style: { width: "44px" } }),
      /* @__PURE__ */ jsx("td", { style: { width: "36px" } })
    ] }),
    showVariableColumn && !showClassificationColumns && /* @__PURE__ */ jsx("td", { style: { width: "28px" } }),
    months.map((p) => /* @__PURE__ */ jsx(
      editablecell_default,
      {
        value: null,
        onChange: (v) => onAddRowWithValue(p.id, v),
        isDeduction: subtract,
        hasData: false,
        width: "110px",
        type: "currency"
      },
      p.id
    )),
    /* @__PURE__ */ jsx("td", { style: { width: "40px" } })
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
  onMouseEnter,
  onMouseLeave,
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
  const groupValues = useMemo(() => computeGroupValues(childRows, months), [childRows, months]);
  const subtract = isSubtractType(group.type);
  const isExpanded = forceExpanded || !group.collapsed;
  const dropBorder = dropIndicator === "above" ? "border-t-2 border-t-blue-400" : dropIndicator === "below" ? "border-b-2 border-b-blue-400" : "";
  return /* @__PURE__ */ jsxs(
    "tr",
    {
      className: `border-b border-gray-200 ${subtract ? "bg-red-50/30" : "bg-gray-50/50"} ${isDragging ? "opacity-40" : ""} ${dropBorder} group`,
      onMouseEnter,
      onMouseLeave,
      onDragOver,
      onDragLeave,
      onDrop,
      children: [
        /* @__PURE__ */ jsx("td", { className: "pl-1 pr-2 py-1.5 text-gray-700 overflow-hidden", style: { width: showClassificationColumns || showVariableColumn ? "140px" : "180px" }, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-0.5 min-w-0", children: [
          isHovered && onDragStart && /* @__PURE__ */ jsx(
            "span",
            {
              draggable: true,
              onDragStart,
              onDragEnd,
              className: "shrink-0 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500",
              title: "Arrastrar para reordenar",
              children: /* @__PURE__ */ jsx(GripVertical, { size: 14 })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: onToggleCollapse,
              className: "p-0.5 rounded shrink-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100",
              title: isExpanded ? "Colapsar grupo" : "Expandir grupo",
              children: isExpanded ? /* @__PURE__ */ jsx(ChevronDown, { size: 14 }) : /* @__PURE__ */ jsx(ChevronRight, { size: 14 })
            }
          ),
          /* @__PURE__ */ jsx(
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
        showClassificationColumns && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("td", { style: { width: "44px" } }),
          /* @__PURE__ */ jsx("td", { style: { width: "36px" } })
        ] }),
        showVariableColumn && !showClassificationColumns && /* @__PURE__ */ jsx("td", { style: { width: "28px" } }),
        months.map((p) => {
          const value = groupValues[p.id] ?? 0;
          const hasValue = value !== 0;
          return /* @__PURE__ */ jsx(
            "td",
            {
              className: "px-2 py-1.5 text-right",
              style: { width: "110px", minWidth: "110px", maxWidth: "110px" },
              children: /* @__PURE__ */ jsx("div", { className: "h-5 flex items-center justify-end", children: /* @__PURE__ */ jsx("span", { className: `text-xs tabular-nums font-medium ${subtract ? hasValue ? "text-rose-600" : "text-gray-300" : hasValue ? "text-gray-800" : "text-gray-300"}`, children: hasValue ? formatValue(value) : "\u2014" }) })
            },
            p.id
          );
        }),
        /* @__PURE__ */ jsx("td", { style: { width: "40px" }, className: "text-center", children: isHovered && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onUngroup,
            className: "p-0.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100",
            title: "Desagrupar",
            children: /* @__PURE__ */ jsx(Ungroup, { size: 14 })
          }
        ) })
      ]
    }
  );
};
var grouprow_default = GroupRow;
var DeleteDialog = ({ count, onConfirm, onCancel }) => {
  const [reason, setReason] = useState("");
  const inputRef = useRef(null);
  const cardRef = useRef(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
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
  const dialog = /* @__PURE__ */ jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm",
      onClick: handleBackdropClick,
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          ref: cardRef,
          className: "bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm mx-4 text-center",
          children: [
            /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-4", children: /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-full bg-red-50 flex items-center justify-center", children: /* @__PURE__ */ jsx(Trash2, { size: 24, className: "text-red-500" }) }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "\xBFCu\xE1l es la raz\xF3n para borrar?" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-5", children: count === 1 ? "Esta fila se mover\xE1 a la papelera." : `${count} filas se mover\xE1n a la papelera.` }),
            /* @__PURE__ */ jsx(
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
            /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: handleSubmit,
                  className: "flex-1 py-2.5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors",
                  children: "Confirmar"
                }
              ),
              /* @__PURE__ */ jsx(
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
    return createPortal(dialog, document.body);
  }
  return dialog;
};
var deletedialog_default = DeleteDialog;
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
var RecycleBin = ({ deletedRows, months, onRestore, formatValue, showVariableColumn = false }) => {
  const [expanded, setExpanded] = useState(false);
  if (deletedRows.length === 0) return null;
  return /* @__PURE__ */ jsxs("div", { className: "border-t border-gray-200 bg-gray-50/50", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setExpanded(!expanded),
        className: "w-full px-4 py-2 flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 transition-colors",
        children: [
          /* @__PURE__ */ jsx(Trash2, { size: 12 }),
          /* @__PURE__ */ jsxs("span", { children: [
            deletedRows.length,
            " eliminado",
            deletedRows.length !== 1 ? "s" : ""
          ] }),
          expanded ? /* @__PURE__ */ jsx(ChevronUp, { size: 12 }) : /* @__PURE__ */ jsx(ChevronDown, { size: 12 })
        ]
      }
    ),
    expanded && /* @__PURE__ */ jsx("table", { className: T.table, style: { tableLayout: "fixed" }, children: /* @__PURE__ */ jsx("tbody", { children: deletedRows.map((row) => {
      const subtract = isSubtractType(row.type);
      return /* @__PURE__ */ jsxs("tr", { className: "border-b border-gray-100 opacity-75 group", children: [
        showVariableColumn && /* @__PURE__ */ jsx("td", { style: { width: "20px" } }),
        /* @__PURE__ */ jsx("td", { className: `pl-1 pr-2 py-1.5 text-gray-500 ${T.cellLabel}`, style: { width: showVariableColumn ? "160px" : "180px" }, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 min-w-0", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => onRestore(row.id),
              className: "shrink-0 p-1 rounded text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors",
              title: "Restaurar",
              children: /* @__PURE__ */ jsx(Undo2, { size: 13 })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                className: `${T.rowLabel} line-through text-gray-400 truncate block`,
                title: row.label,
                children: row.label
              }
            ),
            row.deletedAt && /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-gray-400 truncate block", title: row.deletionReason, children: [
              formatDeletedDate(row.deletedAt),
              row.deletionReason && ` \xB7 ${row.deletionReason}`
            ] })
          ] })
        ] }) }),
        months.map((m) => {
          const v = row.values[m.id];
          const hasValue = v != null;
          return /* @__PURE__ */ jsx(
            "td",
            {
              className: "px-2 py-1.5 text-right tabular-nums",
              style: { width: "110px" },
              children: /* @__PURE__ */ jsx("span", { className: `${T.totalValue} ${hasValue ? subtract ? "text-rose-300" : "text-gray-400" : "text-gray-200"}`, children: hasValue ? formatValue(v) : "\u2014" })
            },
            m.id
          );
        }),
        /* @__PURE__ */ jsx("td", { style: { width: "40px" } })
      ] }, row.id);
    }) }) })
  ] });
};
var recyclebin_default = RecycleBin;
var ContextMenu = ({ x, y, canGroup, selectedCount, onGroup, onDeleteSelected, onCancel, onClose }) => {
  const ref = useRef(null);
  useEffect(() => {
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
  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      ref.current.style.left = `${window.innerWidth - rect.width - 8}px`;
    }
    if (rect.bottom > window.innerHeight) {
      ref.current.style.top = `${window.innerHeight - rect.height - 8}px`;
    }
  }, []);
  const menu = /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      className: "fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[180px] print:hidden",
      style: { left: x, top: y },
      children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => {
              onGroup();
              onClose();
            },
            disabled: !canGroup,
            className: "w-full px-3 py-1.5 text-left text-xs flex items-center gap-2 hover:bg-gray-50 disabled:text-gray-300 disabled:hover:bg-transparent",
            children: [
              /* @__PURE__ */ jsx(FoldVertical, { size: 14 }),
              "Agrupar ",
              selectedCount,
              " filas"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => {
              onDeleteSelected();
              onClose();
            },
            className: "w-full px-3 py-1.5 text-left text-xs flex items-center gap-2 hover:bg-gray-50 text-red-600",
            children: [
              /* @__PURE__ */ jsx(Trash2, { size: 14 }),
              "Eliminar ",
              selectedCount,
              " fila",
              selectedCount !== 1 ? "s" : ""
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => {
              onCancel();
              onClose();
            },
            className: "w-full px-3 py-1.5 text-left text-xs flex items-center gap-2 hover:bg-gray-50 text-gray-600",
            children: [
              /* @__PURE__ */ jsx(X, { size: 14 }),
              "Cancelar selecci\xF3n"
            ]
          }
        )
      ]
    }
  );
  if (typeof document !== "undefined") {
    return createPortal(menu, document.body);
  }
  return menu;
};
var HeaderSelectionBar = ({ selectedCount, canGroup, monthCount, naming, onNamingChange, onGroup, onDeleteSelected, onCancel, showVariableColumn = false, showClassificationColumns = false }) => {
  const [groupName, setGroupName] = useState("");
  const inputRef = useRef(null);
  useEffect(() => {
    if (naming && inputRef.current) {
      inputRef.current.focus();
    }
  }, [naming]);
  useEffect(() => {
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
  return /* @__PURE__ */ jsx(
    "td",
    {
      colSpan: monthCount + 2 + (showClassificationColumns ? 2 : showVariableColumn ? 1 : 0),
      className: "px-4 py-2.5",
      onClick: (e) => e.stopPropagation(),
      children: /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: naming ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx(
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
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleSubmit,
            disabled: !groupName.trim(),
            className: "p-1 rounded text-emerald-700 hover:bg-emerald-100 disabled:text-gray-300 disabled:hover:bg-transparent",
            title: "Confirmar",
            children: /* @__PURE__ */ jsx(Check, { size: 14 })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              onNamingChange(false);
              setGroupName("");
            },
            className: "p-1 rounded text-gray-400 hover:bg-gray-200",
            title: "Cancelar",
            children: /* @__PURE__ */ jsx(X, { size: 14 })
          }
        )
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-500", children: [
          selectedCount,
          " fila",
          selectedCount !== 1 ? "s" : ""
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => onNamingChange(true),
            disabled: !canGroup,
            className: "text-xs px-3 py-1 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors",
            title: !canGroup && selectedCount < 2 ? "Selecciona al menos 2 filas" : !canGroup ? "Solo puedes agrupar filas del mismo tipo" : "Agrupar filas seleccionadas",
            children: "Agrupar"
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: onDeleteSelected,
            className: "text-xs px-3 py-1 rounded-full text-red-600 hover:bg-red-100 transition-colors flex items-center gap-1",
            title: "Eliminar filas seleccionadas",
            children: [
              /* @__PURE__ */ jsx(Trash2, { size: 12 }),
              "Eliminar"
            ]
          }
        ),
        /* @__PURE__ */ jsx(
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
  const [focusedCell, setFocusedCell] = useState(null);
  const [editTrigger, setEditTrigger] = useState(0);
  const [clearTrigger, setClearTrigger] = useState(0);
  const [editInitialValue, setEditInitialValue] = useState(null);
  const isFocused = useCallback((rowId, colIndex) => {
    return focusedCell?.rowId === rowId && focusedCell?.colIndex === colIndex;
  }, [focusedCell]);
  const focus = useCallback((rowId, colIndex) => {
    setFocusedCell({ rowId, colIndex });
  }, []);
  const clearFocus = useCallback(() => setFocusedCell(null), []);
  const navigate = useCallback((direction) => {
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
  const navigateAndEdit = useCallback((direction) => {
    navigate(direction);
    setEditInitialValue(null);
    setTimeout(() => setEditTrigger((prev) => prev + 1), 0);
  }, [navigate]);
  const handleContainerKeyDown = useCallback((e) => {
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
  const [dragRowId, setDragRowId] = useState(null);
  const [dropTargetId, setDropTargetId] = useState(null);
  const [dropPosition, setDropPosition] = useState(null);
  const handleDragStart = useCallback((rowId) => (e) => {
    setDragRowId(rowId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", rowId);
  }, []);
  const handleDragOver = useCallback((rowId) => (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (rowId === dragRowId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const pos = e.clientY < midY ? "above" : "below";
    setDropTargetId(rowId);
    setDropPosition(pos);
  }, [dragRowId]);
  const handleDragLeave = useCallback(() => {
    setDropTargetId(null);
    setDropPosition(null);
  }, []);
  const handleDrop = useCallback((rows, onRowsChange) => (e) => {
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
  const handleDragEnd = useCallback(() => {
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
  return /* @__PURE__ */ jsx("div", { className: "hidden group-hover/reliq:block absolute bottom-full left-0 mb-2 z-50", children: /* @__PURE__ */ jsx("div", { className: "bg-white text-gray-700 text-[11px] rounded-lg shadow-lg border border-gray-200 px-3 py-2.5 whitespace-nowrap", children: /* @__PURE__ */ jsx("table", { className: "border-spacing-0 w-full", children: /* @__PURE__ */ jsxs("tbody", { children: [
    /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 2, className: `pb-1.5 font-semibold text-[11px] text-left ${isFija ? "text-sky-600" : "text-amber-600"}`, children: isFija ? "C\xE1lculo Renta Fija" : "C\xE1lculo Renta Variable" }) }),
    lines.filter((l) => l.value !== 0).map((l, i) => /* @__PURE__ */ jsxs("tr", { children: [
      /* @__PURE__ */ jsx("td", { className: "pr-4 py-0.5 text-gray-500 text-left", children: l.label }),
      /* @__PURE__ */ jsxs("td", { className: "text-right py-0.5 tabular-nums text-gray-600", children: [
        l.sign === "-" ? "\u2212" : "+",
        fmtK(l.value)
      ] })
    ] }, i)),
    /* @__PURE__ */ jsxs("tr", { className: `border-t ${isFija ? "border-sky-200" : "border-amber-200"}`, children: [
      /* @__PURE__ */ jsx("td", { className: `pr-4 pt-1.5 font-semibold text-left ${isFija ? "text-sky-700" : "text-amber-700"}`, children: isFija ? "Renta Fija" : "Renta Variable" }),
      /* @__PURE__ */ jsx("td", { className: `text-right pt-1.5 font-semibold tabular-nums ${isFija ? "text-sky-700" : "text-amber-700"}`, children: fmtK(result) })
    ] })
  ] }) }) }) });
};
var RentaTable = ({
  title,
  months = 3,
  rows,
  onRowsChange,
  sections,
  headerBg = "bg-gray-100",
  headerText = "text-gray-700",
  defaultCollapsed = false,
  forceExpanded = false,
  flush = false,
  formatValue = defaultFormatValue,
  calculateTotal = defaultCalculateTotal,
  showVariableColumn = false,
  showClassificationColumns = false,
  sourceFileIds,
  onViewSource,
  reliquidacion
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [newRowLabels, setNewRowLabels] = useState({});
  const [selectedRows, setSelectedRows] = useState(/* @__PURE__ */ new Set());
  const [contextMenu, setContextMenu] = useState(null);
  const [naming, setNaming] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const monthsArray = useMemo(() => {
    if (typeof months === "number") return generateLastNMonths(months);
    return months;
  }, [months]);
  const effectiveSections = useMemo(() => {
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
  const visibleRowIds = useMemo(() => {
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
  const expandTimerRef = useRef(null);
  useEffect(() => {
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
  const toggleSelect = useCallback((rowId) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  }, []);
  const clearSelection = useCallback(() => setSelectedRows(/* @__PURE__ */ new Set()), []);
  const canGroup = useMemo(() => {
    if (selectedRows.size < 2) return false;
    const selected = rows.filter((r) => selectedRows.has(r.id));
    if (selected.some((r) => r.isGroup)) return false;
    const types = new Set(selected.map((r) => isAddType(r.type) ? "add" : "subtract"));
    return types.size === 1;
  }, [selectedRows, rows]);
  const handleGroup = useCallback((name) => {
    const newRows = createGroup(rows, selectedRows, name);
    onRowsChange(newRows);
    clearSelection();
    setNaming(false);
  }, [rows, selectedRows, onRowsChange, clearSelection]);
  const handleContextMenu = useCallback((e, rowId) => {
    if (!selectedRows.has(rowId) || selectedRows.size < 2) return;
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, [selectedRows]);
  const startGroupNaming = useCallback(() => {
    setContextMenu(null);
    setNaming(true);
  }, []);
  const updateRowLabel = useCallback((rowId, label) => {
    onRowsChange(rows.map((r) => r.id === rowId ? { ...r, label } : r));
  }, [rows, onRowsChange]);
  const updateRowValue = useCallback((rowId, monthId, value) => {
    onRowsChange(rows.map((r) => {
      if (r.id !== rowId) return r;
      return { ...r, values: { ...r.values, [monthId]: value } };
    }));
  }, [rows, onRowsChange]);
  const requestDelete = useCallback((rowId) => {
    const row = rows.find((r) => r.id === rowId);
    if (!row) return;
    if (row.isGroup) {
      onRowsChange(ungroupRows(rows, rowId));
      return;
    }
    setDeleteTarget(/* @__PURE__ */ new Set([rowId]));
  }, [rows, onRowsChange]);
  const requestDeleteSelected = useCallback(() => {
    setDeleteTarget(new Set(selectedRows));
  }, [selectedRows]);
  const confirmDelete = useCallback((reason) => {
    if (!deleteTarget) return;
    const newRows = softDeleteRows(rows, deleteTarget, reason);
    onRowsChange(newRows);
    clearSelection();
    setDeleteTarget(null);
  }, [rows, deleteTarget, onRowsChange, clearSelection]);
  const handleRestore = useCallback((rowId) => {
    onRowsChange(restoreRows(rows, /* @__PURE__ */ new Set([rowId])));
  }, [rows, onRowsChange]);
  const deletedRows = useMemo(
    () => rows.filter((r) => r.deletedAt && !r.isGroup),
    [rows]
  );
  const toggleGroupCollapse = useCallback((groupId) => {
    onRowsChange(rows.map((r) => r.id === groupId ? { ...r, collapsed: !r.collapsed } : r));
  }, [rows, onRowsChange]);
  const handleUngroup = useCallback((groupId) => {
    onRowsChange(ungroupRows(rows, groupId));
  }, [rows, onRowsChange]);
  const toggleVariable = useCallback((rowId) => {
    onRowsChange(rows.map((r) => r.id === rowId ? { ...r, isVariable: !r.isVariable } : r));
  }, [rows, onRowsChange]);
  const toggleNaturaleza = useCallback((rowId) => {
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
  const addRow = useCallback((type, label) => {
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
  const addRowWithValue = useCallback((type, monthId, value) => {
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
  const renderDataRow = (r) => /* @__PURE__ */ jsx(
    datarow_default,
    {
      row: r,
      months: monthsArray,
      isHovered: hoveredRow === r.id,
      selected: selectedRows.has(r.id),
      anySelected,
      selectable: !r.isGroup,
      onMouseEnter: () => setHoveredRow(r.id),
      onMouseLeave: () => setHoveredRow(null),
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
  return /* @__PURE__ */ jsx(
    tableshell_default,
    {
      headerBg,
      defaultCollapsed,
      forceExpanded,
      flush,
      disableToggle: anySelected,
      contentClassName: "outline-none",
      contentProps: {
        tabIndex: 0,
        onKeyDown: keyboard.handleContainerKeyDown
      },
      renderHeader: ({ isExpanded }) => /* @__PURE__ */ jsx("table", { className: T.table, style: { tableLayout: "fixed" }, children: /* @__PURE__ */ jsx("tbody", { children: /* @__PURE__ */ jsx("tr", { children: anySelected ? /* @__PURE__ */ jsx(
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
      ) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("td", { className: "px-4 py-2.5 text-left", style: { width: showClassificationColumns || showVariableColumn ? "140px" : "180px" }, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          !forceExpanded && (isExpanded ? /* @__PURE__ */ jsx(ChevronUp, { size: 16, className: headerText }) : /* @__PURE__ */ jsx(ChevronDown, { size: 16, className: headerText })),
          /* @__PURE__ */ jsx("span", { className: `${headerText} ${T.headerTitle}`, children: title }),
          /* @__PURE__ */ jsx(SourceIcon, { fileIds: sourceFileIds, onViewSource, className: headerText })
        ] }) }),
        showClassificationColumns && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("td", { style: { width: "44px" }, className: "text-center", children: /* @__PURE__ */ jsx("span", { className: `${headerText} text-[9px] font-semibold opacity-60`, children: "Tipo" }) }),
          /* @__PURE__ */ jsx("td", { style: { width: "36px" }, className: "text-center", children: /* @__PURE__ */ jsx("span", { className: `${headerText} text-[9px] font-semibold opacity-60`, children: "Renta" }) })
        ] }),
        showVariableColumn && !showClassificationColumns && /* @__PURE__ */ jsx("td", { style: { width: "28px" } }),
        monthsArray.map((p) => {
          const total = calculateTotal(p.id, rows);
          const hasValue = total !== 0;
          return /* @__PURE__ */ jsxs("td", { className: "px-2 py-2.5 text-right", style: { width: "110px" }, children: [
            /* @__PURE__ */ jsxs("span", { className: `${headerText} ${T.headerStatLabel}`, children: [
              p.label,
              ": "
            ] }),
            /* @__PURE__ */ jsx("span", { className: `${T.headerStat} ${hasValue ? headerText : "text-gray-400"}`, children: hasValue ? formatValue(total) : "\u2014" })
          ] }, p.id);
        }),
        /* @__PURE__ */ jsx("td", { style: { width: "40px" } })
      ] }) }) }) }),
      renderAfterContent: ({ isExpanded }) => /* @__PURE__ */ jsxs(Fragment, { children: [
        isExpanded && /* @__PURE__ */ jsx(recyclebin_default, { deletedRows, months: monthsArray, onRestore: handleRestore, formatValue, showVariableColumn }),
        deleteTarget && /* @__PURE__ */ jsx(
          deletedialog_default,
          {
            count: deleteTarget.size,
            onConfirm: confirmDelete,
            onCancel: () => setDeleteTarget(null)
          }
        ),
        contextMenu && anySelected && /* @__PURE__ */ jsx(
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
      children: /* @__PURE__ */ jsx("table", { className: T.table, style: { tableLayout: "fixed" }, children: /* @__PURE__ */ jsxs("tbody", { children: [
        effectiveSections.map((section) => {
          const items = getOrderedItems(rows, section.type);
          return /* @__PURE__ */ jsxs(React4.Fragment, { children: [
            effectiveSections.length > 1 && (() => {
              const subtotals = computeSectionSubtotal(rows, section.type, monthsArray);
              const isSubtract = isSubtractType(section.type);
              const label = isSubtract ? "Total descuentos" : "Total haberes";
              return /* @__PURE__ */ jsxs("tr", { className: `border-b-2 ${isSubtract ? "border-b-rose-200 bg-red-50/30" : "border-b-emerald-200 bg-emerald-50/30"}`, children: [
                /* @__PURE__ */ jsx("td", { className: "pl-4 pr-2 py-2 text-gray-700", style: { width: showClassificationColumns || showVariableColumn ? "140px" : "180px" }, children: /* @__PURE__ */ jsx("span", { className: `${T.totalLabel} ${isSubtract ? "text-rose-700" : "text-emerald-700"}`, children: label }) }),
                showClassificationColumns && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx("td", { style: { width: "44px" } }),
                  /* @__PURE__ */ jsx("td", { style: { width: "36px" } })
                ] }),
                showVariableColumn && !showClassificationColumns && /* @__PURE__ */ jsx("td", { style: { width: "28px" } }),
                monthsArray.map((p) => {
                  const value = subtotals[p.id] ?? 0;
                  const hasValue = value !== 0;
                  const display = isSubtract ? `-${formatValue(value)}` : formatValue(value);
                  return /* @__PURE__ */ jsx("td", { className: "px-2 py-2 text-right", style: { width: "110px" }, children: /* @__PURE__ */ jsx("span", { className: `${T.totalValue} tabular-nums ${isSubtract ? hasValue ? "text-rose-600" : "text-gray-300" : hasValue ? "text-emerald-700" : "text-gray-300"}`, children: hasValue ? display : "\u2014" }) }, p.id);
                }),
                /* @__PURE__ */ jsx("td", { style: { width: "40px" } })
              ] });
            })(),
            items.map((item) => {
              if (item.kind === "group") {
                const { group, children: groupChildren } = item;
                const showChildren = forceExpanded || !group.collapsed;
                return /* @__PURE__ */ jsxs(React4.Fragment, { children: [
                  /* @__PURE__ */ jsx(
                    grouprow_default,
                    {
                      group,
                      childRows: groupChildren,
                      months: monthsArray,
                      isHovered: hoveredRow === group.id,
                      forceExpanded,
                      formatValue,
                      onMouseEnter: () => setHoveredRow(group.id),
                      onMouseLeave: () => setHoveredRow(null),
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
            /* @__PURE__ */ jsx(
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
            )
          ] }, section.type);
        }),
        (showVariableColumn || showClassificationColumns) && effectiveSections.length > 1 && (() => {
          const rentaVariable = computeRentaVariable(rows, monthsArray);
          const fmtSigned = (v) => v < 0 ? `-${formatValue(-v)}` : formatValue(v);
          return /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("tr", { className: "border-t-2 border-t-gray-200 border-b border-gray-100 bg-amber-50/30", children: [
              /* @__PURE__ */ jsx("td", { className: "pl-4 pr-2 py-2", style: { width: showClassificationColumns || showVariableColumn ? "140px" : "180px" }, children: /* @__PURE__ */ jsx("span", { className: `${T.totalLabel} text-amber-700`, children: "Renta Variable" }) }),
              showClassificationColumns && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("td", { style: { width: "44px" } }),
                /* @__PURE__ */ jsx("td", { style: { width: "36px" } })
              ] }),
              showVariableColumn && !showClassificationColumns && /* @__PURE__ */ jsx("td", { style: { width: "28px" } }),
              monthsArray.map((p) => {
                const value = rentaVariable[p.id] ?? 0;
                const hasValue = value !== 0;
                const rliq = reliquidacion?.[p.id];
                return /* @__PURE__ */ jsxs("td", { className: "py-2 pr-2 text-right relative", style: { width: "110px" }, children: [
                  rliq && hasValue && /* @__PURE__ */ jsxs("span", { className: "group/reliq absolute cursor-help", style: { top: "9px", left: "30px" }, children: [
                    /* @__PURE__ */ jsx(Info, { size: 12, className: "text-amber-400 hover:text-amber-500" }),
                    /* @__PURE__ */ jsx(ReliqInfoTooltip, { data: rliq, type: "variable" })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: `${T.totalValue} tabular-nums ${hasValue ? "text-amber-700" : "text-gray-300"}`, children: hasValue ? fmtSigned(value) : "\u2014" })
                ] }, p.id);
              }),
              /* @__PURE__ */ jsx("td", { style: { width: "40px" } })
            ] }),
            /* @__PURE__ */ jsxs("tr", { className: "border-b border-gray-200 bg-sky-50/30", children: [
              /* @__PURE__ */ jsx("td", { className: "pl-4 pr-2 py-2", style: { width: showClassificationColumns || showVariableColumn ? "140px" : "180px" }, children: /* @__PURE__ */ jsx("span", { className: `${T.totalLabel} text-sky-700`, children: "Renta Fija" }) }),
              showClassificationColumns && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("td", { style: { width: "44px" } }),
                /* @__PURE__ */ jsx("td", { style: { width: "36px" } })
              ] }),
              showVariableColumn && !showClassificationColumns && /* @__PURE__ */ jsx("td", { style: { width: "28px" } }),
              monthsArray.map((p) => {
                const liquida = calculateTotal(p.id, rows);
                const variable = rentaVariable[p.id] ?? 0;
                const fija = liquida - variable;
                const hasValue = fija !== 0;
                const rliq = reliquidacion?.[p.id];
                return /* @__PURE__ */ jsxs("td", { className: "py-2 pr-2 text-right relative", style: { width: "110px" }, children: [
                  rliq && hasValue && /* @__PURE__ */ jsxs("span", { className: "group/reliq absolute cursor-help", style: { top: "9px", left: "30px" }, children: [
                    /* @__PURE__ */ jsx(Info, { size: 12, className: "text-sky-400 hover:text-sky-500" }),
                    /* @__PURE__ */ jsx(ReliqInfoTooltip, { data: rliq, type: "fija" })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: `${T.totalValue} tabular-nums ${hasValue ? "text-blue-700" : "text-gray-300"}`, children: hasValue ? fmtSigned(fija) : "\u2014" })
                ] }, p.id);
              }),
              /* @__PURE__ */ jsx("td", { style: { width: "40px" } })
            ] })
          ] });
        })()
      ] }) })
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
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const activeRows = useMemo(() => rows.filter((r) => !r.deletedAt), [rows]);
  const deletedRows = useMemo(() => rows.filter((r) => !!r.deletedAt), [rows]);
  const requestDelete = useCallback((id) => {
    setDeleteTargetId(id);
  }, []);
  const confirmDelete = useCallback((reason) => {
    if (!deleteTargetId) return;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    onRowsChange(rows.map(
      (r) => r.id === deleteTargetId ? { ...r, deletedAt: now, deletionReason: reason || void 0 } : r
    ));
    setDeleteTargetId(null);
  }, [deleteTargetId, rows, onRowsChange]);
  const cancelDelete = useCallback(() => {
    setDeleteTargetId(null);
  }, []);
  const restoreRow = useCallback((id) => {
    onRowsChange(rows.map((r) => {
      if (r.id !== id) return r;
      const { deletedAt: _, deletionReason: __, ...rest } = r;
      return rest;
    }));
  }, [rows, onRowsChange]);
  return { activeRows, deletedRows, deleteTargetId, requestDelete, confirmDelete, cancelDelete, restoreRow };
}
var useDragReorder2 = () => {
  const [dragRowId, setDragRowId] = useState(null);
  const [dropTargetId, setDropTargetId] = useState(null);
  const [dropPosition, setDropPosition] = useState(null);
  const handleDragStart = useCallback((rowId) => (e) => {
    setDragRowId(rowId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", rowId);
  }, []);
  const handleDragOver = useCallback((rowId) => (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (rowId === dragRowId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    setDropTargetId(rowId);
    setDropPosition(e.clientY < midY ? "above" : "below");
  }, [dragRowId]);
  const handleDrop = useCallback((rows, onRowsChange) => (e) => {
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
  const handleDragEnd = useCallback(() => {
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
    handleDragLeave: useCallback(() => {
      setDropTargetId(null);
      setDropPosition(null);
    }, []),
    handleDrop,
    handleDragEnd
  };
};
var formatDeletedDate2 = (iso) => {
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
function RecycleBin2({ deletedRows, getLabel, onRestore }) {
  const [expanded, setExpanded] = useState(false);
  if (deletedRows.length === 0) return null;
  return /* @__PURE__ */ jsxs("div", { className: "border-t border-gray-200 bg-gray-50/50", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setExpanded(!expanded),
        className: "w-full px-4 py-2 flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 transition-colors",
        children: [
          /* @__PURE__ */ jsx(Trash2, { size: 12 }),
          /* @__PURE__ */ jsxs("span", { children: [
            deletedRows.length,
            " eliminado",
            deletedRows.length !== 1 ? "s" : ""
          ] }),
          expanded ? /* @__PURE__ */ jsx(ChevronUp, { size: 12 }) : /* @__PURE__ */ jsx(ChevronDown, { size: 12 })
        ]
      }
    ),
    expanded && /* @__PURE__ */ jsx("div", { className: "px-4 pb-2 space-y-1", children: deletedRows.map((row) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 py-1 opacity-75", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => onRestore(row.id),
          className: "shrink-0 p-1 rounded text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors",
          title: "Restaurar",
          children: /* @__PURE__ */ jsx(Undo2, { size: 13 })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            className: "text-xs font-medium line-through text-gray-400 truncate block",
            title: getLabel(row),
            children: getLabel(row)
          }
        ),
        row.deletedAt && /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-gray-400 truncate block", title: row.deletionReason, children: [
          formatDeletedDate2(row.deletedAt),
          row.deletionReason && ` \xB7 ${row.deletionReason}`
        ] })
      ] })
    ] }, row.id)) })
  ] });
}
var recyclebin_default2 = RecycleBin2;
var LINEAS_TC_PATTERN = /l[ií]nea|tarjeta|tc/i;
var DeudasTable = ({
  rows,
  onRowsChange,
  formatCurrency: formatCurrency4 = defaultFormatCurrency,
  ufValue,
  castigo = 0.05,
  headerBg = "bg-rose-50",
  headerText = "text-rose-700",
  onViewSource
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState(/* @__PURE__ */ new Set());
  const [newRow, setNewRow] = useState({ institucion: "", tipo_deuda: "" });
  const { activeRows, deletedRows, deleteTargetId, requestDelete, confirmDelete, cancelDelete, restoreRow } = useSoftDelete(rows, onRowsChange);
  const visibleRowIds = useMemo(() => activeRows.map((r) => r.id), [activeRows]);
  const keyboard = useGridKeyboard({ visibleRowIds, colCount: 6 });
  const drag = useDragReorder2();
  const anySelected = selectedRows.size > 0;
  const toggleSelect = useCallback((rowId) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  }, []);
  const clearSelection = useCallback(() => setSelectedRows(/* @__PURE__ */ new Set()), []);
  const requestDeleteSelected = useCallback(() => {
    for (const id of selectedRows) requestDelete(id);
    clearSelection();
  }, [selectedRows, requestDelete, clearSelection]);
  const handleRowClick = useCallback((e, rowId) => {
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
      id: `dc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
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
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "overflow-x-auto", onKeyDown: keyboard.handleContainerKeyDown, tabIndex: 0, children: [
      /* @__PURE__ */ jsxs("table", { className: T.table, style: { tableLayout: "fixed" }, children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { className: `${headerBg} border-t border-rose-200 ${headerText}`, children: anySelected ? /* @__PURE__ */ jsx("th", { colSpan: 8, className: "px-4 py-1.5 text-left", onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-xs text-rose-600", children: [
            selectedRows.size,
            " fila",
            selectedRows.size !== 1 ? "s" : ""
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: requestDeleteSelected,
              className: "text-xs px-3 py-1 rounded-full text-red-600 hover:bg-red-100 transition-colors flex items-center gap-1",
              title: "Eliminar filas seleccionadas",
              children: [
                /* @__PURE__ */ jsx(Trash2, { size: 12 }),
                "Eliminar"
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: clearSelection,
              className: "text-xs px-2 py-1 rounded-full text-gray-500 hover:bg-gray-200 transition-colors",
              children: "Cancelar"
            }
          )
        ] }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("th", { className: `px-2 py-1.5 text-left ${T.th} ${headerText}`, style: { width: "160px" }, children: "Instituci\xF3n" }),
          /* @__PURE__ */ jsx("th", { className: `px-2 py-1.5 text-left ${T.th} ${headerText}`, style: { width: "120px" }, children: "Tipo Deuda" }),
          /* @__PURE__ */ jsx("th", { className: `px-2 py-1.5 text-right ${T.th} ${headerText}`, style: { width: "100px" }, children: "Saldo UF" }),
          /* @__PURE__ */ jsx("th", { className: `px-2 py-1.5 text-right ${T.th} ${headerText}`, style: { width: "120px" }, children: "Saldo $" }),
          /* @__PURE__ */ jsx("th", { className: `px-2 py-1.5 text-right ${T.th} ${headerText}`, style: { width: "110px" }, children: "Cuota $" }),
          /* @__PURE__ */ jsx("th", { className: `px-2 py-1.5 text-center ${T.th} ${headerText}`, style: { width: "50px" }, children: "%" }),
          /* @__PURE__ */ jsx("th", { className: `px-2 py-1.5 text-center ${T.th} ${headerText}`, style: { width: "90px" }, children: "Cuotas" }),
          /* @__PURE__ */ jsx("th", { style: { width: "40px" } })
        ] }) }) }),
        /* @__PURE__ */ jsxs("tbody", { children: [
          activeRows.map((row) => {
            const isHovered = hoveredRow === row.id;
            const selected = selectedRows.has(row.id);
            const showCheckbox = anySelected || isHovered;
            const isDragging = drag.dragRowId === row.id;
            const dropBorder = drag.dropTargetId === row.id ? drag.dropPosition === "above" ? "border-t-2 border-t-blue-400" : "border-b-2 border-b-blue-400" : "";
            return /* @__PURE__ */ jsxs(
              "tr",
              {
                className: `border-b border-gray-100 ${selected ? "bg-rose-50/60" : "hover:bg-gray-50"} ${isDragging ? "opacity-40" : ""} ${dropBorder}`,
                onMouseEnter: () => setHoveredRow(row.id),
                onMouseLeave: () => setHoveredRow(null),
                onClick: (e) => handleRowClick(e, row.id),
                onDragOver: drag.handleDragOver(row.id),
                onDragLeave: drag.handleDragLeave,
                onDrop: drag.handleDrop(rows, onRowsChange),
                children: [
                  /* @__PURE__ */ jsxs("td", { className: `pl-1 pr-2 py-2.5 ${T.cellLabel} relative`, style: { width: "160px" }, children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-0.5 min-w-0", children: [
                      isHovered && !anySelected && /* @__PURE__ */ jsx(
                        "span",
                        {
                          draggable: true,
                          onDragStart: drag.handleDragStart(row.id),
                          onDragEnd: drag.handleDragEnd,
                          className: "shrink-0 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500",
                          title: "Arrastrar para reordenar",
                          children: /* @__PURE__ */ jsx(GripVertical, { size: 14 })
                        }
                      ),
                      showCheckbox ? /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: selected,
                          onChange: () => toggleSelect(row.id),
                          className: "shrink-0 w-3.5 h-3.5 rounded border-gray-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                        }
                      ) : null,
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "text",
                          value: row.institucion,
                          onChange: (e) => updateField(row.id, "institucion", e.target.value),
                          className: `flex-1 min-w-0 ${T.inputLabel} ${isHovered || showCheckbox ? "" : "pl-1"}`,
                          placeholder: "Instituci\xF3n"
                        }
                      )
                    ] }),
                    isHovered && row.sourceFileId && onViewSource && /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => onViewSource([row.sourceFileId]),
                        className: "absolute right-0 top-1/2 -translate-y-1/2 translate-x-[2px] p-0.5 rounded text-rose-400 hover:text-rose-600 hover:bg-rose-100",
                        title: "Ver documento fuente",
                        children: /* @__PURE__ */ jsx(Eye, { size: 14 })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx("td", { className: "px-2 py-2.5", style: { width: "120px" }, children: /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: row.tipo_deuda,
                      onChange: (e) => updateField(row.id, "tipo_deuda", e.target.value),
                      className: `w-full ${T.input} pl-1`,
                      placeholder: "Tipo"
                    }
                  ) }),
                  /* @__PURE__ */ jsx(
                    editablecell_default,
                    {
                      value: row.saldo_deuda_uf,
                      onChange: (v) => updateField(row.id, "saldo_deuda_uf", v),
                      type: "number",
                      hasData: row.saldo_deuda_uf !== null,
                      width: "100px",
                      focused: keyboard.isFocused(row.id, 0),
                      onCellFocus: () => keyboard.focus(row.id, 0),
                      onNavigate: keyboard.navigate,
                      requestEdit: keyboard.isFocused(row.id, 0) ? keyboard.editTrigger : 0,
                      requestClear: keyboard.isFocused(row.id, 0) ? keyboard.clearTrigger : 0,
                      editInitialValue: keyboard.isFocused(row.id, 0) ? keyboard.editInitialValue : void 0
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    editablecell_default,
                    {
                      value: row.saldo_deuda_pesos,
                      onChange: (v) => updateField(row.id, "saldo_deuda_pesos", v),
                      type: "currency",
                      hasData: row.saldo_deuda_pesos !== null,
                      width: "120px",
                      className: isAutoComputed(row, "saldo_deuda_pesos") ? "italic text-rose-400" : "",
                      focused: keyboard.isFocused(row.id, 1),
                      onCellFocus: () => keyboard.focus(row.id, 1),
                      onNavigate: keyboard.navigate,
                      requestEdit: keyboard.isFocused(row.id, 1) ? keyboard.editTrigger : 0,
                      requestClear: keyboard.isFocused(row.id, 1) ? keyboard.clearTrigger : 0,
                      editInitialValue: keyboard.isFocused(row.id, 1) ? keyboard.editInitialValue : void 0
                    }
                  ),
                  /* @__PURE__ */ jsxs("td", { className: "relative", style: { width: "110px" }, children: [
                    /* @__PURE__ */ jsx(
                      editablecell_default,
                      {
                        value: row.monto_cuota,
                        onChange: (v) => updateField(row.id, "monto_cuota", v),
                        type: "currency",
                        hasData: row.monto_cuota !== null,
                        width: "110px",
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
                    isHovered && row.cuota_estimated && row.saldo_deuda_pesos != null && !row.castigo_pct && /* @__PURE__ */ jsxs("div", { className: "absolute right-0 top-1/2 -translate-y-1/2 translate-x-[2px] group/info", children: [
                      /* @__PURE__ */ jsx("button", { className: "p-0.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100", children: /* @__PURE__ */ jsx(Info, { size: 13 }) }),
                      /* @__PURE__ */ jsxs("div", { className: "hidden group-hover/info:block absolute bottom-full right-0 mb-1 px-2 py-1 rounded bg-gray-800 text-white text-[10px] whitespace-nowrap z-50 shadow-lg", children: [
                        "Estimado: ",
                        Math.round((row.castigo_pct ?? castigo) * 100),
                        "% de ",
                        formatCurrency4(row.saldo_deuda_pesos)
                      ] })
                    ] }),
                    isHovered && row.cuota_source_file_id && onViewSource && /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => onViewSource([row.cuota_source_file_id]),
                        className: "absolute right-0 top-1/2 -translate-y-1/2 translate-x-[2px] p-0.5 rounded text-rose-400 hover:text-rose-600 hover:bg-rose-100",
                        title: "Ver documento fuente",
                        children: /* @__PURE__ */ jsx(Eye, { size: 13 })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx("td", { className: "text-center", style: { width: "50px" }, children: row.cuota_estimated ? /* @__PURE__ */ jsx(
                    editablecell_default,
                    {
                      value: row.castigo_pct != null ? Math.round(row.castigo_pct * 100) : Math.round(castigo * 100),
                      onChange: (v) => updateField(row.id, "castigo_pct", v != null ? v / 100 : castigo),
                      type: "number",
                      hasData: true,
                      width: "50px",
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
                  ) : /* @__PURE__ */ jsx("span", { className: "text-[11px] text-gray-300", children: "\u2014" }) }),
                  /* @__PURE__ */ jsx("td", { className: "text-center text-xs text-gray-500", style: { width: "90px" }, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-0.5", children: [
                    /* @__PURE__ */ jsx(
                      editablecell_default,
                      {
                        value: row.cuotas_pagadas,
                        onChange: (v) => updateField(row.id, "cuotas_pagadas", v),
                        type: "number",
                        hasData: row.cuotas_pagadas !== null,
                        width: "35px",
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
                    /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "/" }),
                    /* @__PURE__ */ jsx(
                      editablecell_default,
                      {
                        value: row.cuotas_total,
                        onChange: (v) => updateField(row.id, "cuotas_total", v),
                        type: "number",
                        hasData: row.cuotas_total !== null,
                        width: "35px",
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
                  /* @__PURE__ */ jsx("td", { style: { width: "40px" }, className: "text-center", children: /* @__PURE__ */ jsx(deletebutton_default, { onClick: () => requestDelete(row.id), isVisible: isHovered && !anySelected }) })
                ]
              },
              row.id
            );
          }),
          /* @__PURE__ */ jsxs("tr", { className: "border-b border-dashed border-rose-100 bg-rose-50/20", children: [
            /* @__PURE__ */ jsx("td", { className: "px-2 py-2.5", style: { width: "160px" }, children: /* @__PURE__ */ jsx(
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
            /* @__PURE__ */ jsx("td", { className: "px-2 py-2.5", style: { width: "120px" }, children: /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: "Tipo",
                value: newRow.tipo_deuda,
                onChange: (e) => setNewRow((prev) => ({ ...prev, tipo_deuda: e.target.value })),
                className: `w-full ${T.inputPlaceholder}`
              }
            ) }),
            /* @__PURE__ */ jsx("td", { style: { width: "100px" } }),
            /* @__PURE__ */ jsx("td", { style: { width: "120px" } }),
            /* @__PURE__ */ jsx("td", { style: { width: "110px" } }),
            /* @__PURE__ */ jsx("td", { style: { width: "50px" } }),
            /* @__PURE__ */ jsx("td", { style: { width: "90px" } }),
            /* @__PURE__ */ jsx("td", { style: { width: "40px" } })
          ] })
        ] }),
        /* @__PURE__ */ jsx("tfoot", { children: /* @__PURE__ */ jsxs("tr", { className: `${headerBg} font-semibold text-xs border-b border-rose-200`, children: [
          /* @__PURE__ */ jsx("td", { colSpan: 3, className: `px-2 py-1.5 ${headerText} ${T.totalLabel}`, children: "TOTAL" }),
          /* @__PURE__ */ jsx("td", { className: `px-2 py-1.5 text-right ${headerText} ${T.totalValue}`, children: totalSaldoPesos ? formatCurrency4(totalSaldoPesos) : "\u2014" }),
          /* @__PURE__ */ jsx("td", { className: `px-2 py-1.5 text-right ${headerText} ${T.totalValue}`, children: totalMontoCuota ? formatCurrency4(totalMontoCuota) : "\u2014" }),
          /* @__PURE__ */ jsx("td", { colSpan: 3 })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx(recyclebin_default2, { deletedRows, getLabel: (r) => r.institucion, onRestore: restoreRow })
    ] }),
    deleteTargetId && /* @__PURE__ */ jsx(deletedialog_default, { count: 1, onConfirm: confirmDelete, onCancel: cancelDelete })
  ] });
};
var deudas_default = DeudasTable;
var formatCurrency = (value) => {
  return displayCurrencyCompact(value);
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
var BoletasTable = ({
  title,
  months,
  totales,
  headerBg = "bg-emerald-50",
  headerText = "text-emerald-700",
  defaultCollapsed = false,
  forceExpanded = false,
  flush = false,
  sourceFileIds,
  onViewSource,
  onRemoveMonth
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);
  const monthsWithData = months.filter((m) => m.hasData);
  const totalLiquido = totales?.total_liquido ?? monthsWithData.reduce((s, m) => s + (m.liquido || 0), 0);
  const totalBoletas = totales?.boletas_vigentes ?? monthsWithData.reduce((s, m) => s + (m.boletas || 0), 0);
  const promedioMensual = monthsWithData.length > 0 ? totalLiquido / monthsWithData.length : 0;
  return /* @__PURE__ */ jsx(
    tableshell_default,
    {
      headerBg,
      defaultCollapsed,
      forceExpanded,
      flush,
      renderHeader: ({ isExpanded }) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 py-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: `${headerText} ${T.headerTitle}`, children: title }),
          /* @__PURE__ */ jsx(SourceIcon, { fileIds: sourceFileIds, onViewSource, className: headerText })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-xs", children: [
            /* @__PURE__ */ jsxs("span", { className: headerText, children: [
              /* @__PURE__ */ jsx("span", { className: `${T.headerStatLabel}`, children: "Boletas: " }),
              /* @__PURE__ */ jsx("span", { className: T.headerStat, children: totalBoletas })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: headerText, children: [
              /* @__PURE__ */ jsx("span", { className: `${T.headerStatLabel}`, children: "L\xEDquido: " }),
              /* @__PURE__ */ jsx("span", { className: T.headerStat, children: formatCurrency(totalLiquido) })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: headerText, children: [
              /* @__PURE__ */ jsx("span", { className: `${T.headerStatLabel}`, children: "Promedio: " }),
              /* @__PURE__ */ jsx("span", { className: T.headerStat, children: formatCurrency(Math.round(promedioMensual)) })
            ] })
          ] }),
          !forceExpanded && (isExpanded ? /* @__PURE__ */ jsx(ChevronUp, { size: 20, className: headerText }) : /* @__PURE__ */ jsx(ChevronDown, { size: 20, className: headerText }))
        ] })
      ] }),
      children: /* @__PURE__ */ jsxs("table", { className: T.table, style: { tableLayout: "fixed" }, children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-gray-200 bg-gray-50/50", children: [
          /* @__PURE__ */ jsx("th", { className: `px-4 py-2 text-left ${T.th}`, style: { width: "140px" }, children: "Mes" }),
          /* @__PURE__ */ jsx("th", { className: `px-3 py-2 text-center ${T.th}`, style: { width: "80px" }, children: "Boletas" }),
          /* @__PURE__ */ jsx("th", { className: `px-3 py-2 text-right ${T.th}`, style: { width: "130px" }, children: "Bruto" }),
          /* @__PURE__ */ jsx("th", { className: `px-3 py-2 text-right ${T.th}`, style: { width: "130px" }, children: "Retenci\xF3n" }),
          /* @__PURE__ */ jsx("th", { className: `px-4 py-2 text-right ${T.th}`, style: { width: "130px" }, children: "L\xEDquido" }),
          onRemoveMonth && /* @__PURE__ */ jsx("th", { style: { width: "36px" } })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: months.map((m, i) => /* @__PURE__ */ jsxs(
          "tr",
          {
            className: `border-b border-gray-100 ${m.hasData ? "hover:bg-emerald-50/30" : ""}`,
            onMouseEnter: () => setHoveredRow(i),
            onMouseLeave: () => setHoveredRow(null),
            children: [
              /* @__PURE__ */ jsx("td", { className: `px-4 py-2.5 font-medium ${T.cellLabel} ${m.hasData ? "text-gray-700" : "text-gray-300"}`, style: { width: "140px" }, children: /* @__PURE__ */ jsx("span", { className: "truncate block", children: MONTH_LABELS[m.mes] || m.mes }) }),
              /* @__PURE__ */ jsx("td", { className: "px-3 py-2.5 text-center text-gray-800", style: { width: "80px" }, children: m.hasData ? m.boletas ?? "" : "" }),
              /* @__PURE__ */ jsx("td", { className: "px-3 py-2.5 text-right text-gray-800", style: { width: "130px" }, children: m.hasData ? formatCurrency(m.bruto) : "" }),
              /* @__PURE__ */ jsx("td", { className: "px-3 py-2.5 text-right text-red-700", style: { width: "130px" }, children: m.hasData ? formatCurrency(m.retencion) : "" }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-2.5 text-right font-medium text-emerald-700", style: { width: "130px" }, children: m.hasData ? formatCurrency(m.liquido) : "" }),
              onRemoveMonth && /* @__PURE__ */ jsx("td", { style: { width: "36px" }, className: "text-center", children: m.hasData && /* @__PURE__ */ jsx(
                deletebutton_default,
                {
                  onClick: () => onRemoveMonth(m.periodo),
                  isVisible: hoveredRow === i
                }
              ) })
            ]
          },
          i
        )) }),
        /* @__PURE__ */ jsx("tfoot", { children: /* @__PURE__ */ jsxs("tr", { className: "border-t-2 border-emerald-200 bg-emerald-50/50", children: [
          /* @__PURE__ */ jsx("td", { className: `px-4 py-3 ${T.footerLabel} text-emerald-700`, style: { width: "140px" }, children: "TOTALES" }),
          /* @__PURE__ */ jsx("td", { className: `px-3 py-3 text-center ${T.footerValue} text-emerald-700`, style: { width: "80px" }, children: totalBoletas }),
          /* @__PURE__ */ jsx("td", { className: `px-3 py-3 text-right ${T.footerValue} text-emerald-700`, style: { width: "130px" }, children: formatCurrency(totales?.honorario_bruto ?? monthsWithData.reduce((s, m) => s + (m.bruto || 0), 0)) }),
          /* @__PURE__ */ jsx("td", { className: `px-3 py-3 text-right ${T.footerValue} text-red-700`, style: { width: "130px" }, children: formatCurrency(
            (totales?.retencion_terceros ?? 0) + (totales?.retencion_contribuyente ?? 0) || monthsWithData.reduce((s, m) => s + (m.retencion || 0), 0)
          ) }),
          /* @__PURE__ */ jsx("td", { className: `px-4 py-3 text-right ${T.footerValue} text-emerald-700`, style: { width: "130px" }, children: formatCurrency(totalLiquido) }),
          onRemoveMonth && /* @__PURE__ */ jsx("td", { style: { width: "36px" } })
        ] }) })
      ] })
    }
  );
};
var boletas_default = BoletasTable;
var ViewSourceButton = ({
  sourceFileId,
  onViewSource,
  isVisible,
  size = "sm"
}) => {
  if (!sourceFileId || !onViewSource) return null;
  const padding = size === "sm" ? "p-0.5" : "p-1";
  return /* @__PURE__ */ jsx(
    "button",
    {
      onClick: () => onViewSource([sourceFileId]),
      className: `${padding} rounded transition-all shrink-0 ${isVisible ? "opacity-100 text-gray-400 hover:text-gray-600 hover:bg-gray-100" : "opacity-0"}`,
      title: "Ver documento fuente",
      children: /* @__PURE__ */ jsx(Eye, { size: 14 })
    }
  );
};
var viewsourcebutton_default = ViewSourceButton;
function useRowHover() {
  const [hoveredRow, setHoveredRow] = useState(null);
  const getHoverProps = useCallback((id) => ({
    onMouseEnter: () => setHoveredRow(id),
    onMouseLeave: () => setHoveredRow(null)
  }), []);
  const isHovered = useCallback((id) => hoveredRow === id, [hoveredRow]);
  return { hoveredRow, getHoverProps, isHovered };
}
var formatCurrency2 = (value) => {
  return displayCurrencyCompact(value);
};
var TributarioTable = ({
  title,
  entries,
  headerBg = "bg-amber-50",
  headerText = "text-amber-700",
  defaultCollapsed = false,
  forceExpanded = false,
  flush = false,
  sourceFileIds,
  onViewSource
}) => {
  const { getHoverProps, isHovered: isRowHovered } = useRowHover();
  const balanceEntries = entries.filter((e) => e.source === "balance-anual");
  const carpetaEntries = entries.filter((e) => e.source === "carpeta-tributaria");
  const totalIngresos = balanceEntries.reduce((sum, e) => sum + (e.ingresos || 0), 0);
  const totalEgresos = balanceEntries.reduce((sum, e) => sum + (e.egresos || 0), 0);
  return /* @__PURE__ */ jsx(
    tableshell_default,
    {
      headerBg,
      defaultCollapsed,
      forceExpanded,
      flush,
      renderHeader: ({ isExpanded }) => /* @__PURE__ */ jsx("table", { className: T.table, style: { tableLayout: "fixed" }, children: /* @__PURE__ */ jsx("tbody", { children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-left", style: { width: "200px" }, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: `${headerText} ${T.headerTitle}`, children: title }),
          /* @__PURE__ */ jsx(SourceIcon, { fileIds: sourceFileIds, onViewSource, className: headerText })
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "px-3 py-3 text-right", style: { width: "120px" }, children: /* @__PURE__ */ jsxs("span", { className: `${headerText} ${T.headerCount}`, children: [
          entries.length,
          " ",
          entries.length === 1 ? "documento" : "documentos"
        ] }) }),
        balanceEntries.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("td", { className: "px-3 py-3 text-right", style: { width: "140px" }, children: [
            /* @__PURE__ */ jsx("span", { className: `${headerText} ${T.headerStatLabel}`, children: "Ingresos: " }),
            /* @__PURE__ */ jsx("span", { className: `${T.headerStat} ${totalIngresos > 0 ? "text-emerald-600" : "text-gray-400"}`, children: totalIngresos > 0 ? formatCurrency2(totalIngresos) : "\u2014" })
          ] }),
          /* @__PURE__ */ jsxs("td", { className: "px-3 py-3 text-right", style: { width: "140px" }, children: [
            /* @__PURE__ */ jsx("span", { className: `${headerText} ${T.headerStatLabel}`, children: "Egresos: " }),
            /* @__PURE__ */ jsx("span", { className: `${T.headerStat} ${totalEgresos > 0 ? headerText : "text-gray-400"}`, children: totalEgresos > 0 ? formatCurrency2(totalEgresos) : "\u2014" })
          ] })
        ] }),
        balanceEntries.length === 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("td", { className: "px-3 py-3 text-right", style: { width: "140px" } }),
          /* @__PURE__ */ jsx("td", { className: "px-3 py-3 text-right", style: { width: "140px" } })
        ] }),
        /* @__PURE__ */ jsx("td", { className: "px-2 py-3 text-right", style: { width: "40px" }, children: !forceExpanded && (isExpanded ? /* @__PURE__ */ jsx(ChevronUp, { size: 20, className: headerText }) : /* @__PURE__ */ jsx(ChevronDown, { size: 20, className: headerText })) })
      ] }) }) }),
      children: /* @__PURE__ */ jsxs("table", { className: T.table, style: { tableLayout: "fixed" }, children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-gray-200 bg-gray-50/50", children: [
          /* @__PURE__ */ jsx("th", { className: `px-4 py-2 text-left ${T.th}`, style: { width: "200px" }, children: "Documento" }),
          /* @__PURE__ */ jsx("th", { className: `px-2 py-2 text-left ${T.th}`, style: { width: "120px" }, children: "Detalle" }),
          /* @__PURE__ */ jsx("th", { className: `px-3 py-2 text-right ${T.th}`, style: { width: "140px" }, children: "Ingresos" }),
          /* @__PURE__ */ jsx("th", { className: `px-3 py-2 text-right ${T.th}`, style: { width: "140px" }, children: "Egresos" }),
          /* @__PURE__ */ jsx("th", { style: { width: "40px" } })
        ] }) }),
        /* @__PURE__ */ jsxs("tbody", { children: [
          balanceEntries.map((entry) => /* @__PURE__ */ jsxs(
            "tr",
            {
              className: "border-b border-gray-100 bg-amber-50/30 hover:bg-amber-100/50 group",
              ...getHoverProps(entry.id),
              children: [
                /* @__PURE__ */ jsx("td", { className: `px-4 py-2.5 text-gray-700 ${T.cellLabel}`, style: { width: "200px" }, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 min-w-0", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-xs truncate", title: entry.empresa || entry.label, children: entry.empresa || entry.label }),
                  /* @__PURE__ */ jsx(viewsourcebutton_default, { sourceFileId: entry.sourceFileId, onViewSource, isVisible: isRowHovered(entry.id), size: "default" })
                ] }) }),
                /* @__PURE__ */ jsx("td", { className: `px-2 py-2.5 ${T.muted}`, style: { width: "120px" }, children: entry.year ? `A\xF1o ${entry.year}` : "\u2014" }),
                /* @__PURE__ */ jsx("td", { className: "px-3 py-2.5 text-right text-emerald-700 font-medium", style: { width: "140px" }, children: formatCurrency2(entry.ingresos) }),
                /* @__PURE__ */ jsx("td", { className: "px-3 py-2.5 text-right text-amber-700 font-medium", style: { width: "140px" }, children: formatCurrency2(entry.egresos) }),
                /* @__PURE__ */ jsx("td", { style: { width: "40px" } })
              ]
            },
            entry.id
          )),
          carpetaEntries.map((entry) => /* @__PURE__ */ jsxs(
            "tr",
            {
              className: "border-b border-gray-100 bg-amber-50/30 hover:bg-amber-100/50 group",
              ...getHoverProps(entry.id),
              children: [
                /* @__PURE__ */ jsx("td", { className: `px-4 py-2.5 text-gray-700 ${T.cellLabel}`, style: { width: "200px" }, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 min-w-0", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-xs truncate", children: "Carpeta Tributaria" }),
                  /* @__PURE__ */ jsx(viewsourcebutton_default, { sourceFileId: entry.sourceFileId, onViewSource, isVisible: isRowHovered(entry.id), size: "default" })
                ] }) }),
                /* @__PURE__ */ jsx("td", { className: `px-2 py-2.5 ${T.muted}`, colSpan: 3, style: { width: "400px" }, children: entry.actividades && entry.actividades.length > 0 ? entry.actividades.join(", ") : "\u2014" }),
                /* @__PURE__ */ jsx("td", { style: { width: "40px" } })
              ]
            },
            entry.id
          ))
        ] })
      ] })
    }
  );
};
var tributario_default = TributarioTable;
var formatCurrency3 = (value) => {
  return displayCurrencyCompact(value);
};
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
  return /* @__PURE__ */ jsx("span", { className: `text-xs font-medium px-1.5 py-0.5 rounded ${badgeClass}`, children: badgeText });
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
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-emerald-50 rounded-xl p-4 border border-emerald-200", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-3 flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
        "Rentas L\xEDquidas"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: T.muted, children: "Comprador" }),
          /* @__PURE__ */ jsx(
            editablecell_default,
            {
              value: debtorIncome,
              onChange: (v) => {
                onChange("renta_liquida_ajustada_comprador", v);
                const newTotal = (v ?? 0) + totalCodeudorIncome;
                onChange("total_rentas", newTotal > 0 ? newTotal : null);
              },
              type: "currency",
              width: "120px",
              className: `text-emerald-700 ${T.cardValue}`,
              asDiv: true
            }
          )
        ] }),
        hasMultipleCodes ? codeudorIncomes.map((codeudor, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: `${T.muted} truncate max-w-[120px]`, title: codeudor.name, children: codeudorIncomes.length > 1 ? `Codeudor ${idx + 1}` : "Codeudor" }),
          /* @__PURE__ */ jsx(
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
              width: "120px",
              className: `text-emerald-700 ${T.cardValue}`,
              asDiv: true
            }
          )
        ] }, idx)) : /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: T.muted, children: "Codeudor" }),
          /* @__PURE__ */ jsx(
            editablecell_default,
            {
              value: codeudorIncomesAdjusted[0],
              onChange: (v) => {
                onChange("renta_liquida_ajustada_codeudor", v);
                const newTotal = (debtorIncome ?? 0) + (v ?? 0);
                onChange("total_rentas", newTotal > 0 ? newTotal : null);
              },
              type: "currency",
              width: "120px",
              className: `text-emerald-700 ${T.cardValue}`,
              asDiv: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-t border-emerald-300 pt-2 mt-2 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: `${T.footerLabel} text-emerald-800 text-xs`, children: "TOTAL" }),
          /* @__PURE__ */ jsx("span", { className: `text-emerald-800 ${T.footerValue}`, children: formatCurrency3(displayTotal > 0 ? displayTotal : null) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-sky-50 rounded-xl p-4 border border-sky-200", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-xs font-semibold text-sky-700 uppercase tracking-wider mb-3 flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" }) }),
        "Obligaciones"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: T.muted, children: "Dividendo" }),
          /* @__PURE__ */ jsx(
            editablecell_default,
            {
              value: values.dividendo_hipotecario,
              onChange: (v) => onChange("dividendo_hipotecario", v),
              type: "currency",
              width: "120px",
              className: `text-sky-700 ${T.cardValue}`,
              asDiv: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: T.muted, children: "Deudas" }),
          /* @__PURE__ */ jsx("span", { className: `text-orange-600 ${T.cardValue}`, children: formatCurrency3(totalDebts > 0 ? totalDebts : null) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-t border-sky-300 pt-2 mt-2 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: `${T.footerLabel} text-sky-800 text-xs`, children: "TOTAL" }),
          /* @__PURE__ */ jsx("span", { className: `text-sky-800 ${T.footerValue}`, children: formatCurrency3(dividendo + totalDebts > 0 ? dividendo + totalDebts : null) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-violet-50 rounded-xl p-4 border border-violet-200", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-xs font-semibold text-violet-700 uppercase tracking-wider mb-3 flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }) }),
        "\xCDndices de Carga"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: T.muted, children: "Hipotecaria" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                className: `text-violet-700 ${T.cardValue} ${clickableClass}`,
                onClick: handleEditCH,
                children: displayCH !== null && displayCH !== void 0 ? `${displayCH}%` : "\u2014"
              }
            ),
            /* @__PURE__ */ jsx(RiskBadge, { value: displayCH, thresholds: { warning: 25, danger: 35 } })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: T.muted, children: "Financiera" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                className: `text-violet-700 ${T.cardValue} ${clickableClass}`,
                onClick: handleEditCF,
                children: displayCF !== null && displayCF !== void 0 ? `${displayCF}%` : "\u2014"
              }
            ),
            /* @__PURE__ */ jsx(RiskBadge, { value: displayCF, thresholds: { warning: 40, danger: 50 } })
          ] })
        ] })
      ] })
    ] })
  ] });
};
var finalresults_default = FinalResultsCompact;
function useFieldUpdate(rows, onRowsChange) {
  const updateField = useCallback(
    (id, field, value) => {
      onRowsChange(rows.map((r) => r.id === id ? { ...r, [field]: value } : r));
    },
    [rows, onRowsChange]
  );
  const removeRow = useCallback(
    (id) => {
      onRowsChange(rows.filter((r) => r.id !== id));
    },
    [rows, onRowsChange]
  );
  return { updateField, removeRow };
}
var VehiculosTable = ({
  rows,
  onRowsChange,
  formatCurrency: formatCurrency4 = defaultFormatCurrency,
  headerBg = "bg-slate-50",
  headerText = "text-slate-700",
  title
}) => {
  const { getHoverProps, isHovered } = useRowHover();
  const { updateField } = useFieldUpdate(rows, onRowsChange);
  const [newRow, setNewRow] = useState({ marca: "", modelo: "" });
  const { activeRows, deletedRows, deleteTargetId, requestDelete, confirmDelete, cancelDelete, restoreRow } = useSoftDelete(rows, onRowsChange);
  const visibleRowIds = useMemo(() => activeRows.map((r) => r.id), [activeRows]);
  const keyboard = useGridKeyboard({ visibleRowIds, colCount: 2 });
  const addRow = (overrides) => {
    const row = {
      id: `vh_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      marca: newRow.marca.trim(),
      modelo: newRow.modelo.trim(),
      monto: null,
      anio: null,
      ...overrides
    };
    setNewRow({ marca: "", modelo: "" });
    onRowsChange([...rows, row]);
  };
  const totalMonto = activeRows.reduce((s, r) => s + (r.monto || 0), 0);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "overflow-x-auto", onKeyDown: keyboard.handleContainerKeyDown, tabIndex: 0, children: [
      /* @__PURE__ */ jsxs("table", { className: T.table, style: { tableLayout: "fixed" }, children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: `${headerBg} border-t border-slate-200 ${headerText}`, children: [
          /* @__PURE__ */ jsx("th", { className: `px-2 py-1.5 text-left ${T.th} ${headerText}`, style: { width: "160px" }, children: title || "Marca" }),
          /* @__PURE__ */ jsx("th", { className: `px-2 py-1.5 text-left ${T.th} ${headerText}`, style: { width: "140px" }, children: "Modelo" }),
          /* @__PURE__ */ jsx("th", { className: `px-2 py-1.5 text-right ${T.th} ${headerText}`, style: { width: "120px" }, children: "Monto $" }),
          /* @__PURE__ */ jsx("th", { className: `px-2 py-1.5 text-center ${T.th} ${headerText}`, style: { width: "80px" }, children: "A\xF1o" }),
          /* @__PURE__ */ jsx("th", { style: { width: "40px" } })
        ] }) }),
        /* @__PURE__ */ jsxs("tbody", { children: [
          activeRows.map((row) => {
            const hovered = isHovered(row.id);
            return /* @__PURE__ */ jsxs(
              "tr",
              {
                className: "border-b border-gray-100 hover:bg-gray-50",
                ...getHoverProps(row.id),
                children: [
                  /* @__PURE__ */ jsx("td", { className: `px-2 py-2.5 ${T.cellLabel}`, style: { width: "160px" }, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 min-w-0", children: [
                    /* @__PURE__ */ jsx(deletebutton_default, { onClick: () => requestDelete(row.id), isVisible: hovered }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: row.marca,
                        onChange: (e) => updateField(row.id, "marca", e.target.value),
                        className: `flex-1 min-w-0 ${T.inputLabel} pl-1`,
                        placeholder: "Marca"
                      }
                    )
                  ] }) }),
                  /* @__PURE__ */ jsx("td", { className: "px-2 py-2.5", style: { width: "140px" }, children: /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: row.modelo,
                      onChange: (e) => updateField(row.id, "modelo", e.target.value),
                      className: `w-full ${T.input} pl-1`,
                      placeholder: "Modelo"
                    }
                  ) }),
                  /* @__PURE__ */ jsx(
                    editablecell_default,
                    {
                      value: row.monto,
                      onChange: (v) => updateField(row.id, "monto", v),
                      type: "currency",
                      hasData: row.monto !== null,
                      width: "120px",
                      focused: keyboard.isFocused(row.id, 0),
                      onCellFocus: () => keyboard.focus(row.id, 0),
                      onNavigate: keyboard.navigate,
                      requestEdit: keyboard.isFocused(row.id, 0) ? keyboard.editTrigger : 0,
                      requestClear: keyboard.isFocused(row.id, 0) ? keyboard.clearTrigger : 0,
                      editInitialValue: keyboard.isFocused(row.id, 0) ? keyboard.editInitialValue : void 0
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    editablecell_default,
                    {
                      value: row.anio,
                      onChange: (v) => updateField(row.id, "anio", v),
                      type: "number",
                      hasData: row.anio !== null,
                      width: "80px",
                      align: "center",
                      focused: keyboard.isFocused(row.id, 1),
                      onCellFocus: () => keyboard.focus(row.id, 1),
                      onNavigate: keyboard.navigate,
                      requestEdit: keyboard.isFocused(row.id, 1) ? keyboard.editTrigger : 0,
                      requestClear: keyboard.isFocused(row.id, 1) ? keyboard.clearTrigger : 0,
                      editInitialValue: keyboard.isFocused(row.id, 1) ? keyboard.editInitialValue : void 0
                    }
                  ),
                  /* @__PURE__ */ jsx("td", { style: { width: "40px" } })
                ]
              },
              row.id
            );
          }),
          /* @__PURE__ */ jsxs("tr", { className: "border-b border-dashed border-slate-100 bg-slate-50/20", children: [
            /* @__PURE__ */ jsx("td", { className: "px-2 py-2.5", style: { width: "160px" }, children: /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: "Agregar veh\xEDculo...",
                value: newRow.marca,
                onChange: (e) => setNewRow((prev) => ({ ...prev, marca: e.target.value })),
                className: `w-full ${T.inputPlaceholder}`,
                onKeyDown: (e) => {
                  if (e.key === "Enter" && newRow.marca.trim()) addRow();
                }
              }
            ) }),
            /* @__PURE__ */ jsx("td", { className: "px-2 py-2.5", style: { width: "140px" }, children: /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: "Modelo",
                value: newRow.modelo,
                onChange: (e) => setNewRow((prev) => ({ ...prev, modelo: e.target.value })),
                className: `w-full ${T.inputPlaceholder}`
              }
            ) }),
            /* @__PURE__ */ jsx(
              editablecell_default,
              {
                value: null,
                onChange: (v) => addRow({ monto: v }),
                type: "currency",
                hasData: false,
                width: "120px"
              }
            ),
            /* @__PURE__ */ jsx(
              editablecell_default,
              {
                value: null,
                onChange: (v) => addRow({ anio: v }),
                type: "number",
                hasData: false,
                width: "80px",
                align: "center"
              }
            ),
            /* @__PURE__ */ jsx("td", { style: { width: "40px" } })
          ] })
        ] }),
        /* @__PURE__ */ jsx("tfoot", { children: /* @__PURE__ */ jsxs("tr", { className: `${headerBg} font-semibold text-xs border-b border-slate-200`, children: [
          /* @__PURE__ */ jsx("td", { colSpan: 2, className: `px-2 py-1.5 ${headerText} ${T.totalLabel}`, children: "TOTAL" }),
          /* @__PURE__ */ jsx("td", { className: `px-2 py-1.5 text-right ${headerText} ${T.totalValue}`, children: totalMonto ? formatCurrency4(totalMonto) : "\u2014" }),
          /* @__PURE__ */ jsx("td", { colSpan: 2 })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx(recyclebin_default2, { deletedRows, getLabel: (r) => r.marca, onRestore: restoreRow })
    ] }),
    deleteTargetId && /* @__PURE__ */ jsx(deletedialog_default, { count: 1, onConfirm: confirmDelete, onCancel: cancelDelete })
  ] });
};
var vehiculos_default = VehiculosTable;
var InversionesTable = ({
  rows,
  onRowsChange,
  formatCurrency: formatCurrency4 = defaultFormatCurrency,
  headerBg = "bg-emerald-50",
  headerText = "text-emerald-700",
  title
}) => {
  const { getHoverProps, isHovered } = useRowHover();
  const { updateField } = useFieldUpdate(rows, onRowsChange);
  const [newRow, setNewRow] = useState({ institucion: "", tipo: "" });
  const { activeRows, deletedRows, deleteTargetId, requestDelete, confirmDelete, cancelDelete, restoreRow } = useSoftDelete(rows, onRowsChange);
  const visibleRowIds = useMemo(() => activeRows.map((r) => r.id), [activeRows]);
  const keyboard = useGridKeyboard({ visibleRowIds, colCount: 1 });
  const addRow = (overrides) => {
    const row = {
      id: `inv_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      institucion: newRow.institucion.trim(),
      tipo: newRow.tipo.trim(),
      monto: null,
      fecha: "",
      ...overrides
    };
    setNewRow({ institucion: "", tipo: "" });
    onRowsChange([...rows, row]);
  };
  const totalMonto = activeRows.reduce((s, r) => s + (r.monto || 0), 0);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "overflow-x-auto", onKeyDown: keyboard.handleContainerKeyDown, tabIndex: 0, children: [
      /* @__PURE__ */ jsxs("table", { className: T.table, style: { tableLayout: "fixed" }, children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: `${headerBg} border-t border-emerald-200 ${headerText}`, children: [
          /* @__PURE__ */ jsx("th", { className: `px-2 py-1.5 text-left ${T.th} ${headerText}`, style: { width: "160px" }, children: title || "Instituci\xF3n" }),
          /* @__PURE__ */ jsx("th", { className: `px-2 py-1.5 text-left ${T.th} ${headerText}`, style: { width: "140px" }, children: "Tipo Inversi\xF3n" }),
          /* @__PURE__ */ jsx("th", { className: `px-2 py-1.5 text-right ${T.th} ${headerText}`, style: { width: "120px" }, children: "Monto $" }),
          /* @__PURE__ */ jsx("th", { className: `px-2 py-1.5 text-left ${T.th} ${headerText}`, style: { width: "100px" }, children: "Fecha" }),
          /* @__PURE__ */ jsx("th", { style: { width: "40px" } })
        ] }) }),
        /* @__PURE__ */ jsxs("tbody", { children: [
          activeRows.map((row) => {
            const hovered = isHovered(row.id);
            return /* @__PURE__ */ jsxs(
              "tr",
              {
                className: "border-b border-gray-100 hover:bg-gray-50",
                ...getHoverProps(row.id),
                children: [
                  /* @__PURE__ */ jsx("td", { className: `px-2 py-2.5 ${T.cellLabel}`, style: { width: "160px" }, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 min-w-0", children: [
                    /* @__PURE__ */ jsx(deletebutton_default, { onClick: () => requestDelete(row.id), isVisible: hovered }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: row.institucion,
                        onChange: (e) => updateField(row.id, "institucion", e.target.value),
                        className: `flex-1 min-w-0 ${T.inputLabel} pl-1`,
                        placeholder: "Instituci\xF3n"
                      }
                    )
                  ] }) }),
                  /* @__PURE__ */ jsx("td", { className: "px-2 py-2.5", style: { width: "140px" }, children: /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: row.tipo,
                      onChange: (e) => updateField(row.id, "tipo", e.target.value),
                      className: `w-full ${T.input} pl-1`,
                      placeholder: "Tipo"
                    }
                  ) }),
                  /* @__PURE__ */ jsx(
                    editablecell_default,
                    {
                      value: row.monto,
                      onChange: (v) => updateField(row.id, "monto", v),
                      type: "currency",
                      hasData: row.monto !== null,
                      width: "120px",
                      focused: keyboard.isFocused(row.id, 0),
                      onCellFocus: () => keyboard.focus(row.id, 0),
                      onNavigate: keyboard.navigate,
                      requestEdit: keyboard.isFocused(row.id, 0) ? keyboard.editTrigger : 0,
                      requestClear: keyboard.isFocused(row.id, 0) ? keyboard.clearTrigger : 0,
                      editInitialValue: keyboard.isFocused(row.id, 0) ? keyboard.editInitialValue : void 0
                    }
                  ),
                  /* @__PURE__ */ jsx("td", { className: "px-2 py-2.5", style: { width: "100px" }, children: /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: row.fecha,
                      onChange: (e) => updateField(row.id, "fecha", e.target.value),
                      className: `w-full ${T.input} pl-1`,
                      placeholder: "Fecha"
                    }
                  ) }),
                  /* @__PURE__ */ jsx("td", { style: { width: "40px" } })
                ]
              },
              row.id
            );
          }),
          /* @__PURE__ */ jsxs("tr", { className: "border-b border-dashed border-emerald-100 bg-emerald-50/20", children: [
            /* @__PURE__ */ jsx("td", { className: "px-2 py-2.5", style: { width: "160px" }, children: /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: "Agregar inversi\xF3n...",
                value: newRow.institucion,
                onChange: (e) => setNewRow((prev) => ({ ...prev, institucion: e.target.value })),
                className: `w-full ${T.inputPlaceholder}`,
                onKeyDown: (e) => {
                  if (e.key === "Enter" && newRow.institucion.trim()) addRow();
                }
              }
            ) }),
            /* @__PURE__ */ jsx("td", { className: "px-2 py-2.5", style: { width: "140px" }, children: /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: "Tipo",
                value: newRow.tipo,
                onChange: (e) => setNewRow((prev) => ({ ...prev, tipo: e.target.value })),
                className: `w-full ${T.inputPlaceholder}`
              }
            ) }),
            /* @__PURE__ */ jsx(
              editablecell_default,
              {
                value: null,
                onChange: (v) => addRow({ monto: v }),
                type: "currency",
                hasData: false,
                width: "120px"
              }
            ),
            /* @__PURE__ */ jsx("td", { className: "px-2 py-2.5", style: { width: "100px" }, children: /* @__PURE__ */ jsx("span", { className: T.empty, children: "\u2014" }) }),
            /* @__PURE__ */ jsx("td", { style: { width: "40px" } })
          ] })
        ] }),
        /* @__PURE__ */ jsx("tfoot", { children: /* @__PURE__ */ jsxs("tr", { className: `${headerBg} font-semibold text-xs border-b border-emerald-200`, children: [
          /* @__PURE__ */ jsx("td", { colSpan: 2, className: `px-2 py-1.5 ${headerText} ${T.totalLabel}`, children: "TOTAL" }),
          /* @__PURE__ */ jsx("td", { className: `px-2 py-1.5 text-right ${headerText} ${T.totalValue}`, children: totalMonto ? formatCurrency4(totalMonto) : "\u2014" }),
          /* @__PURE__ */ jsx("td", { colSpan: 2 })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx(recyclebin_default2, { deletedRows, getLabel: (r) => r.institucion, onRestore: restoreRow })
    ] }),
    deleteTargetId && /* @__PURE__ */ jsx(deletedialog_default, { count: 1, onConfirm: confirmDelete, onCancel: cancelDelete })
  ] });
};
var inversiones_default = InversionesTable;
var CurrencyToggle = ({ value, onChange, headerText }) => /* @__PURE__ */ jsxs("span", { className: "inline-flex rounded-md overflow-hidden border border-amber-200 ml-2 text-[10px] leading-none align-middle", children: [
  /* @__PURE__ */ jsx(
    "button",
    {
      className: `px-1.5 py-0.5 font-medium transition-colors ${value === "uf" ? "bg-amber-200 text-amber-800" : `text-amber-500 hover:text-amber-700`}`,
      onClick: () => onChange("uf"),
      children: "UF"
    }
  ),
  /* @__PURE__ */ jsx(
    "button",
    {
      className: `px-1.5 py-0.5 font-medium transition-colors ${value === "clp" ? "bg-amber-200 text-amber-800" : `text-amber-500 hover:text-amber-700`}`,
      onClick: () => onChange("clp"),
      children: "$"
    }
  )
] });
var PropiedadesTable = ({
  rows,
  onRowsChange,
  formatCurrency: formatCurrency4 = defaultFormatCurrency,
  ufValue,
  capRate = 0.05,
  factorDescuento = 0.1,
  headerBg = "bg-amber-50",
  headerText = "text-amber-700",
  onViewSource,
  title,
  hipotecarioOptions
}) => {
  const { getHoverProps, isHovered: isRowHovered } = useRowHover();
  const [newRow, setNewRow] = useState({ direccion: "", comuna: "" });
  const [currency, setCurrency] = useState("uf");
  const { activeRows, deletedRows, deleteTargetId, requestDelete, confirmDelete, cancelDelete, restoreRow } = useSoftDelete(rows, onRowsChange);
  const visibleRowIds = useMemo(() => activeRows.map((r) => r.id), [activeRows]);
  const keyboard = useGridKeyboard({ visibleRowIds, colCount: 7 });
  const isUf = currency === "uf";
  const conversionRules = ufValue ? [
    { source: "valor_uf", target: "valor_pesos", formula: (v) => v * ufValue, precision: 0 },
    { source: "valor_pesos", target: "valor_uf", formula: (v) => v / ufValue, precision: 2 },
    { source: "saldo_deuda_uf", target: "saldo_deuda_pesos", formula: (v) => v * ufValue, precision: 0 },
    { source: "saldo_deuda_pesos", target: "saldo_deuda_uf", formula: (v) => v / ufValue, precision: 2 }
  ] : [];
  const computeRules = ufValue ? [
    {
      target: "arriendo_futuro",
      depends: ["valor_uf", "valor_pesos"],
      condition: (row) => row.arriendo_futuro == null,
      formula: (row) => {
        const valorUf = row.valor_uf;
        if (!valorUf || !capRate) return null;
        return Math.round(valorUf * capRate / 12 * (1 - factorDescuento) * ufValue);
      }
    }
  ] : [];
  const updateField = (id, field, value) => {
    onRowsChange(rows.map((r) => {
      if (r.id !== id) return r;
      let next = applyAutoConversions(r, field, value, conversionRules, {});
      next = applyAutoCompute(next, field, computeRules, {});
      return next;
    }));
  };
  const addRow = (overrides) => {
    const row = {
      id: `br_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      direccion: newRow.direccion.trim(),
      comuna: newRow.comuna.trim(),
      valor_uf: null,
      valor_pesos: null,
      arriendo_real: null,
      arriendo_futuro: null,
      institucion: "",
      tipo_deuda: "",
      saldo_deuda_uf: null,
      saldo_deuda_pesos: null,
      monto_cuota: null,
      cuotas_pagadas: null,
      cuotas_total: null,
      ...overrides
    };
    setNewRow({ direccion: "", comuna: "" });
    onRowsChange([...rows, row]);
  };
  const totalValorUf = activeRows.reduce((s, r) => s + (r.valor_uf || 0), 0);
  const totalValorPesos = activeRows.reduce((s, r) => s + (r.valor_pesos || 0), 0);
  const totalArriendoReal = activeRows.reduce((s, r) => s + (r.arriendo_real || 0), 0);
  const totalArriendoFuturo = activeRows.reduce((s, r) => s + (r.arriendo_futuro || 0), 0);
  const totalSaldoDeudaUf = activeRows.reduce((s, r) => s + (r.saldo_deuda_uf || 0), 0);
  const totalSaldoDeudaPesos = activeRows.reduce((s, r) => s + (r.saldo_deuda_pesos || 0), 0);
  const totalMontoCuota = activeRows.reduce((s, r) => s + (r.monto_cuota || 0), 0);
  const usedEntidades = useMemo(() => {
    if (!hipotecarioOptions?.length) return /* @__PURE__ */ new Set();
    return new Set(activeRows.map((r) => r.institucion).filter(Boolean));
  }, [activeRows, hipotecarioOptions]);
  const selectHipotecario = (rowId, entidad) => {
    const option = hipotecarioOptions?.find((o) => o.entidad === entidad);
    onRowsChange(rows.map((r) => {
      if (r.id !== rowId) return r;
      if (!entidad) {
        return { ...r, institucion: "", tipo_deuda: "", saldo_deuda_uf: null, saldo_deuda_pesos: null, monto_cuota: null };
      }
      if (!option) return r;
      return {
        ...r,
        institucion: option.entidad,
        tipo_deuda: "Hipotecaria",
        saldo_deuda_uf: option.saldo_uf,
        saldo_deuda_pesos: option.saldo_pesos,
        monto_cuota: option.monto_cuota ?? r.monto_cuota
      };
    }));
  };
  const isAutoComputed = (row, field) => {
    if (!ufValue) return false;
    if (field === "valor_pesos" && row.valor_uf != null) return true;
    if (field === "saldo_deuda_pesos" && row.saldo_deuda_uf != null) return true;
    if (field === "arriendo_futuro" && row.valor_uf != null) return true;
    return false;
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "overflow-x-auto relative", onKeyDown: keyboard.handleContainerKeyDown, tabIndex: 0, children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-1 right-1 z-10", children: /* @__PURE__ */ jsx(CurrencyToggle, { value: currency, onChange: setCurrency, headerText }) }),
      /* @__PURE__ */ jsxs("table", { className: T.table, style: { tableLayout: "fixed" }, children: [
        /* @__PURE__ */ jsxs("thead", { children: [
          /* @__PURE__ */ jsxs("tr", { className: `${headerBg} border-t border-amber-200`, children: [
            /* @__PURE__ */ jsx("th", { colSpan: 5, className: `px-2 py-1.5 text-left ${T.th} ${headerText} border-r border-amber-200`, children: title || "Propiedad" }),
            /* @__PURE__ */ jsx("th", { colSpan: 5, className: `px-2 py-1.5 text-left ${T.th} ${headerText}`, children: "Deuda Hipotecaria Asociada" }),
            /* @__PURE__ */ jsx("th", { style: { width: "40px" } })
          ] }),
          /* @__PURE__ */ jsxs("tr", { className: `${headerBg}/50 border-b border-amber-100 text-amber-600`, children: [
            /* @__PURE__ */ jsx("th", { className: `px-2 py-1 text-left ${T.th} text-amber-600`, style: { width: "140px" }, children: "Direcci\xF3n" }),
            /* @__PURE__ */ jsx("th", { className: `px-2 py-1 text-left ${T.th} text-amber-600`, style: { width: "100px" }, children: "Comuna" }),
            /* @__PURE__ */ jsx("th", { className: `px-2 py-1 text-right ${T.th} text-amber-600`, style: { width: "100px" }, children: isUf ? "Valor UF" : "Valor $" }),
            /* @__PURE__ */ jsx("th", { className: `px-2 py-1 text-right ${T.th} text-amber-600`, style: { width: "100px" }, children: "Arr. Real $" }),
            /* @__PURE__ */ jsx("th", { className: `px-2 py-1 text-right ${T.th} text-amber-600 border-r border-amber-200`, style: { width: "100px" }, children: "Arr. Fut $" }),
            /* @__PURE__ */ jsx("th", { className: `px-2 py-1 text-left ${T.th} text-amber-600`, style: { width: "120px" }, children: "Instituci\xF3n" }),
            /* @__PURE__ */ jsx("th", { className: `px-2 py-1 text-left ${T.th} text-amber-600`, style: { width: "90px" }, children: "Tipo" }),
            /* @__PURE__ */ jsx("th", { className: `px-2 py-1 text-right ${T.th} text-amber-600`, style: { width: "100px" }, children: isUf ? "Saldo UF" : "Saldo $" }),
            /* @__PURE__ */ jsx("th", { className: `px-2 py-1 text-right ${T.th} text-amber-600`, style: { width: "100px" }, children: "Cuota $" }),
            /* @__PURE__ */ jsx("th", { className: `px-2 py-1 text-center ${T.th} text-amber-600`, style: { width: "80px" }, children: "Cuotas" }),
            /* @__PURE__ */ jsx("th", { style: { width: "40px" } })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("tbody", { children: [
          activeRows.map((row) => {
            const isHovered = isRowHovered(row.id);
            return /* @__PURE__ */ jsxs(
              "tr",
              {
                className: "border-b border-gray-100 hover:bg-gray-50",
                ...getHoverProps(row.id),
                children: [
                  /* @__PURE__ */ jsx("td", { className: `px-2 py-2.5 ${T.cellLabel}`, style: { width: "140px" }, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 min-w-0", children: [
                    /* @__PURE__ */ jsx(deletebutton_default, { onClick: () => requestDelete(row.id), isVisible: isHovered }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: row.direccion,
                        onChange: (e) => updateField(row.id, "direccion", e.target.value),
                        className: `flex-1 min-w-0 ${T.inputLabel} pl-1`,
                        placeholder: "Direcci\xF3n"
                      }
                    )
                  ] }) }),
                  /* @__PURE__ */ jsx("td", { className: "px-2 py-2.5", style: { width: "100px" }, children: /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: row.comuna,
                      onChange: (e) => updateField(row.id, "comuna", e.target.value),
                      className: `w-full ${T.input} pl-1`,
                      placeholder: "Comuna"
                    }
                  ) }),
                  isUf ? /* @__PURE__ */ jsx(
                    editablecell_default,
                    {
                      value: row.valor_uf,
                      onChange: (v) => updateField(row.id, "valor_uf", v),
                      type: "number",
                      hasData: row.valor_uf !== null,
                      width: "100px",
                      focused: keyboard.isFocused(row.id, 0),
                      onCellFocus: () => keyboard.focus(row.id, 0),
                      onNavigate: keyboard.navigate,
                      requestEdit: keyboard.isFocused(row.id, 0) ? keyboard.editTrigger : 0,
                      requestClear: keyboard.isFocused(row.id, 0) ? keyboard.clearTrigger : 0,
                      editInitialValue: keyboard.isFocused(row.id, 0) ? keyboard.editInitialValue : void 0
                    }
                  ) : /* @__PURE__ */ jsx(
                    editablecell_default,
                    {
                      value: row.valor_pesos,
                      onChange: (v) => updateField(row.id, "valor_pesos", v),
                      type: "currency",
                      hasData: row.valor_pesos !== null,
                      width: "100px",
                      className: isAutoComputed(row, "valor_pesos") ? "italic text-amber-500" : "",
                      focused: keyboard.isFocused(row.id, 0),
                      onCellFocus: () => keyboard.focus(row.id, 0),
                      onNavigate: keyboard.navigate,
                      requestEdit: keyboard.isFocused(row.id, 0) ? keyboard.editTrigger : 0,
                      requestClear: keyboard.isFocused(row.id, 0) ? keyboard.clearTrigger : 0,
                      editInitialValue: keyboard.isFocused(row.id, 0) ? keyboard.editInitialValue : void 0
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    editablecell_default,
                    {
                      value: row.arriendo_real,
                      onChange: (v) => updateField(row.id, "arriendo_real", v),
                      type: "currency",
                      hasData: row.arriendo_real !== null,
                      width: "100px",
                      focused: keyboard.isFocused(row.id, 1),
                      onCellFocus: () => keyboard.focus(row.id, 1),
                      onNavigate: keyboard.navigate,
                      requestEdit: keyboard.isFocused(row.id, 1) ? keyboard.editTrigger : 0,
                      requestClear: keyboard.isFocused(row.id, 1) ? keyboard.clearTrigger : 0,
                      editInitialValue: keyboard.isFocused(row.id, 1) ? keyboard.editInitialValue : void 0
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    editablecell_default,
                    {
                      value: row.arriendo_futuro,
                      onChange: (v) => updateField(row.id, "arriendo_futuro", v),
                      type: "currency",
                      hasData: row.arriendo_futuro !== null,
                      width: "100px",
                      className: `border-r border-amber-200 ${isAutoComputed(row, "arriendo_futuro") ? "italic text-amber-500" : ""}`,
                      focused: keyboard.isFocused(row.id, 2),
                      onCellFocus: () => keyboard.focus(row.id, 2),
                      onNavigate: keyboard.navigate,
                      requestEdit: keyboard.isFocused(row.id, 2) ? keyboard.editTrigger : 0,
                      requestClear: keyboard.isFocused(row.id, 2) ? keyboard.clearTrigger : 0,
                      editInitialValue: keyboard.isFocused(row.id, 2) ? keyboard.editInitialValue : void 0
                    }
                  ),
                  /* @__PURE__ */ jsx("td", { className: "px-2 py-2.5", style: { width: "120px" }, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 min-w-0", children: [
                    row.sourceFileId && onViewSource && /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => onViewSource([row.sourceFileId]),
                        className: `p-0.5 rounded transition-all shrink-0 ${isHovered ? "opacity-100 text-teal-400 hover:text-amber-600 hover:bg-teal-100" : "opacity-0"}`,
                        title: "Ver documento fuente",
                        children: /* @__PURE__ */ jsx(Eye, { size: 14 })
                      }
                    ),
                    hipotecarioOptions?.length ? /* @__PURE__ */ jsxs(
                      "select",
                      {
                        value: row.institucion,
                        onChange: (e) => selectHipotecario(row.id, e.target.value),
                        className: `flex-1 min-w-0 ${T.input} pl-0.5 bg-transparent cursor-pointer`,
                        children: [
                          /* @__PURE__ */ jsx("option", { value: "", children: "\u2014" }),
                          hipotecarioOptions.map((opt) => /* @__PURE__ */ jsx(
                            "option",
                            {
                              value: opt.entidad,
                              disabled: usedEntidades.has(opt.entidad) && row.institucion !== opt.entidad,
                              children: opt.entidad
                            },
                            opt.entidad
                          ))
                        ]
                      }
                    ) : /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: row.institucion,
                        onChange: (e) => updateField(row.id, "institucion", e.target.value),
                        className: `flex-1 min-w-0 ${T.input} pl-1`,
                        placeholder: "Instituci\xF3n"
                      }
                    )
                  ] }) }),
                  /* @__PURE__ */ jsx("td", { className: "px-2 py-2.5", style: { width: "90px" }, children: hipotecarioOptions?.length && row.institucion ? /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 pl-1", children: "Hipotecaria" }) : /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: row.tipo_deuda,
                      onChange: (e) => updateField(row.id, "tipo_deuda", e.target.value),
                      className: `w-full ${T.input} pl-1`,
                      placeholder: "Tipo"
                    }
                  ) }),
                  isUf ? /* @__PURE__ */ jsx(
                    editablecell_default,
                    {
                      value: row.saldo_deuda_uf,
                      onChange: (v) => updateField(row.id, "saldo_deuda_uf", v),
                      type: "number",
                      hasData: row.saldo_deuda_uf !== null,
                      width: "100px",
                      focused: keyboard.isFocused(row.id, 3),
                      onCellFocus: () => keyboard.focus(row.id, 3),
                      onNavigate: keyboard.navigate,
                      requestEdit: keyboard.isFocused(row.id, 3) ? keyboard.editTrigger : 0,
                      requestClear: keyboard.isFocused(row.id, 3) ? keyboard.clearTrigger : 0,
                      editInitialValue: keyboard.isFocused(row.id, 3) ? keyboard.editInitialValue : void 0
                    }
                  ) : /* @__PURE__ */ jsx(
                    editablecell_default,
                    {
                      value: row.saldo_deuda_pesos,
                      onChange: (v) => updateField(row.id, "saldo_deuda_pesos", v),
                      type: "currency",
                      hasData: row.saldo_deuda_pesos !== null,
                      width: "100px",
                      className: isAutoComputed(row, "saldo_deuda_pesos") ? "italic text-amber-500" : "",
                      focused: keyboard.isFocused(row.id, 3),
                      onCellFocus: () => keyboard.focus(row.id, 3),
                      onNavigate: keyboard.navigate,
                      requestEdit: keyboard.isFocused(row.id, 3) ? keyboard.editTrigger : 0,
                      requestClear: keyboard.isFocused(row.id, 3) ? keyboard.clearTrigger : 0,
                      editInitialValue: keyboard.isFocused(row.id, 3) ? keyboard.editInitialValue : void 0
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    editablecell_default,
                    {
                      value: row.monto_cuota,
                      onChange: (v) => updateField(row.id, "monto_cuota", v),
                      type: "currency",
                      hasData: row.monto_cuota !== null,
                      width: "100px",
                      focused: keyboard.isFocused(row.id, 4),
                      onCellFocus: () => keyboard.focus(row.id, 4),
                      onNavigate: keyboard.navigate,
                      requestEdit: keyboard.isFocused(row.id, 4) ? keyboard.editTrigger : 0,
                      requestClear: keyboard.isFocused(row.id, 4) ? keyboard.clearTrigger : 0,
                      editInitialValue: keyboard.isFocused(row.id, 4) ? keyboard.editInitialValue : void 0
                    }
                  ),
                  /* @__PURE__ */ jsx("td", { className: "text-center text-xs text-gray-500", style: { width: "80px" }, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-0.5", children: [
                    /* @__PURE__ */ jsx(
                      editablecell_default,
                      {
                        value: row.cuotas_pagadas,
                        onChange: (v) => updateField(row.id, "cuotas_pagadas", v),
                        type: "number",
                        hasData: row.cuotas_pagadas !== null,
                        width: "30px",
                        align: "center",
                        asDiv: true,
                        focused: keyboard.isFocused(row.id, 5),
                        onCellFocus: () => keyboard.focus(row.id, 5),
                        onNavigate: keyboard.navigate,
                        requestEdit: keyboard.isFocused(row.id, 5) ? keyboard.editTrigger : 0,
                        requestClear: keyboard.isFocused(row.id, 5) ? keyboard.clearTrigger : 0,
                        editInitialValue: keyboard.isFocused(row.id, 5) ? keyboard.editInitialValue : void 0
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "/" }),
                    /* @__PURE__ */ jsx(
                      editablecell_default,
                      {
                        value: row.cuotas_total,
                        onChange: (v) => updateField(row.id, "cuotas_total", v),
                        type: "number",
                        hasData: row.cuotas_total !== null,
                        width: "30px",
                        align: "center",
                        asDiv: true,
                        focused: keyboard.isFocused(row.id, 6),
                        onCellFocus: () => keyboard.focus(row.id, 6),
                        onNavigate: keyboard.navigate,
                        requestEdit: keyboard.isFocused(row.id, 6) ? keyboard.editTrigger : 0,
                        requestClear: keyboard.isFocused(row.id, 6) ? keyboard.clearTrigger : 0,
                        editInitialValue: keyboard.isFocused(row.id, 6) ? keyboard.editInitialValue : void 0
                      }
                    )
                  ] }) }),
                  /* @__PURE__ */ jsx("td", { style: { width: "40px" } })
                ]
              },
              row.id
            );
          }),
          /* @__PURE__ */ jsxs("tr", { className: "border-b border-dashed border-amber-100 bg-amber-50/20", children: [
            /* @__PURE__ */ jsx("td", { className: `px-2 py-2.5 ${T.cellLabel}`, style: { width: "140px" }, children: /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: "Agregar propiedad...",
                value: newRow.direccion,
                onChange: (e) => setNewRow((prev) => ({ ...prev, direccion: e.target.value })),
                className: `w-full ${T.inputPlaceholder}`,
                onKeyDown: (e) => {
                  if (e.key === "Enter" && newRow.direccion.trim()) addRow();
                }
              }
            ) }),
            /* @__PURE__ */ jsx("td", { className: "px-2 py-2.5", style: { width: "100px" }, children: /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: "Comuna",
                value: newRow.comuna,
                onChange: (e) => setNewRow((prev) => ({ ...prev, comuna: e.target.value })),
                className: `w-full ${T.inputPlaceholder}`
              }
            ) }),
            /* @__PURE__ */ jsx("td", { style: { width: "100px" } }),
            /* @__PURE__ */ jsx("td", { style: { width: "100px" } }),
            /* @__PURE__ */ jsx("td", { style: { width: "100px" } }),
            /* @__PURE__ */ jsx("td", { style: { width: "120px" } }),
            /* @__PURE__ */ jsx("td", { style: { width: "90px" } }),
            /* @__PURE__ */ jsx("td", { style: { width: "100px" } }),
            /* @__PURE__ */ jsx("td", { style: { width: "100px" } }),
            /* @__PURE__ */ jsx("td", { style: { width: "80px" } }),
            /* @__PURE__ */ jsx("td", { style: { width: "40px" } })
          ] })
        ] }),
        /* @__PURE__ */ jsx("tfoot", { children: /* @__PURE__ */ jsxs("tr", { className: `${headerBg} font-semibold text-xs border-b border-amber-200`, children: [
          /* @__PURE__ */ jsx("td", { colSpan: 2, className: `px-2 py-1.5 ${headerText} ${T.totalLabel}`, children: "TOTAL" }),
          /* @__PURE__ */ jsx("td", { className: `px-2 py-1.5 text-right ${headerText} ${T.totalValue}`, children: isUf ? totalValorUf ? totalValorUf.toLocaleString("es-CL", { maximumFractionDigits: 2 }) : "\u2014" : totalValorPesos ? formatCurrency4(totalValorPesos) : "\u2014" }),
          /* @__PURE__ */ jsx("td", { className: `px-2 py-1.5 text-right ${headerText} ${T.totalValue}`, children: totalArriendoReal ? formatCurrency4(totalArriendoReal) : "\u2014" }),
          /* @__PURE__ */ jsx("td", { className: `px-2 py-1.5 text-right ${headerText} ${T.totalValue} border-r border-amber-200`, children: totalArriendoFuturo ? formatCurrency4(totalArriendoFuturo) : "\u2014" }),
          /* @__PURE__ */ jsx("td", { colSpan: 2 }),
          /* @__PURE__ */ jsx("td", { className: `px-2 py-1.5 text-right ${headerText} ${T.totalValue}`, children: isUf ? totalSaldoDeudaUf ? totalSaldoDeudaUf.toLocaleString("es-CL", { maximumFractionDigits: 2 }) : "\u2014" : totalSaldoDeudaPesos ? formatCurrency4(totalSaldoDeudaPesos) : "\u2014" }),
          /* @__PURE__ */ jsx("td", { className: `px-2 py-1.5 text-right ${headerText} ${T.totalValue}`, children: totalMontoCuota ? formatCurrency4(totalMontoCuota) : "\u2014" }),
          /* @__PURE__ */ jsx("td", { colSpan: 2 })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx(recyclebin_default2, { deletedRows, getLabel: (r) => r.direccion, onRestore: restoreRow })
    ] }),
    deleteTargetId && /* @__PURE__ */ jsx(deletedialog_default, { count: 1, onConfirm: confirmDelete, onCancel: cancelDelete })
  ] });
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
  formatCurrency: formatCurrency4 = defaultFormatCurrency,
  colorScheme = defaultColorScheme
}) => {
  const grandTotal = items.reduce((sum, item) => sum + (item.value || 0), 0);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2", children: items.map((item, i) => /* @__PURE__ */ jsxs("div", { className: "border border-gray-200 rounded-lg p-2.5", children: [
      /* @__PURE__ */ jsx("div", { className: `${T.cardLabel} text-gray-500`, children: item.label }),
      /* @__PURE__ */ jsx("div", { className: `${T.cardValue} text-gray-800 mt-0.5`, children: item.value ? formatCurrency4(item.value) : "\u2014" }),
      /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-gray-400 mt-0.5", children: [
        item.count,
        " ",
        item.count === 1 ? "registro" : "registros"
      ] })
    ] }, i)) }),
    /* @__PURE__ */ jsxs("div", { className: `${colorScheme.totalBg} border ${colorScheme.totalBorder} rounded-lg p-2.5 flex items-center justify-between`, children: [
      /* @__PURE__ */ jsx("span", { className: `${T.totalLabel} ${colorScheme.totalText}`, children: totalLabel }),
      /* @__PURE__ */ jsx("span", { className: `${T.totalValue} ${colorScheme.totalValueText}`, children: grandTotal ? formatCurrency4(grandTotal) : "\u2014" })
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
var SummaryTable = ({ columnHeaders, rows, extraColumn, renderLabelSuffix, columnWidth = "w-[120px]" }) => {
  const extraW = extraColumn?.width ?? "w-[80px]";
  return /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsx("table", { className: `${T.table} text-sm border-collapse`, children: /* @__PURE__ */ jsx("tbody", { children: rows.map((row, idx) => {
    if (row.type === "subheader") {
      return /* @__PURE__ */ jsxs("tr", { className: "border-b-2 border-gray-300", children: [
        /* @__PURE__ */ jsx("td", { className: `${T.cell} ${T.th} font-bold text-gray-800 tracking-wider`, children: row.label }),
        extraColumn && /* @__PURE__ */ jsx("td", { className: `${T.cell} ${T.th} text-right font-bold text-gray-600 ${extraW}`, children: extraColumn.header }),
        columnHeaders.map((col, i) => /* @__PURE__ */ jsx("td", { className: `${T.cell} ${T.th} text-right font-bold text-gray-600 ${columnWidth}`, children: col }, i))
      ] }, idx);
    }
    const isTotal = row.type === "total";
    const isFinal = row.type === "grandtotal";
    const bold = isTotal || isFinal;
    const fmt = row.format ?? "currency";
    const rowClass = isFinal ? T.rowGrandtotal : isTotal ? T.rowTotal : T.row;
    return /* @__PURE__ */ jsxs("tr", { className: rowClass, children: [
      /* @__PURE__ */ jsxs("td", { className: `${T.cell} ${bold ? T.footerLabel + " text-gray-800" : T.muted + " pl-5"}`, children: [
        row.label,
        renderLabelSuffix?.(row, idx)
      ] }),
      extraColumn && /* @__PURE__ */ jsx("td", { className: `${T.cell} ${extraW}`, children: extraColumn.render(row, idx) }),
      row.values.map((v, i) => {
        const { display, title } = formatCell(v, fmt);
        return /* @__PURE__ */ jsx(
          "td",
          {
            title,
            className: `${T.cellValue} ${columnWidth} ${bold ? T.footerValue + " text-gray-800" : "text-gray-700"}${title ? " cursor-default" : ""}`,
            children: display
          },
          i
        );
      })
    ] }, idx);
  }) }) }) });
};
var summary_default = SummaryTable;

export { activossummary_default as ActivosSummary, boletas_default as BoletasTable, deletedialog_default as DeleteDialog, deudas_default as DeudasTable, finalresults_default as FinalResultsCompact, inversiones_default as InversionesTable, propiedades_default as PropiedadesTable, recyclebin_default2 as RecycleBin, SourceIcon, summary_default as SummaryTable, tableshell_default as TableShell, tributario_default as TributarioTable, vehiculos_default as VehiculosTable, applyAutoCompute, applyAutoConversions, renta_default as default, defaultFormatCurrency, displayCurrency, displayCurrencyCompact, generateLastNMonths, useSoftDelete };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map