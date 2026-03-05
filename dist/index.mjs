import React6, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Eye, ChevronUp, ChevronDown, X, Check, GripVertical, ChevronRight, Ungroup, FoldVertical } from 'lucide-react';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { createPortal } from 'react-dom';

// src/index.tsx

// src/styles.ts
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
  empty: "text-xs text-gray-400 italic"};

// src/utils.ts
var displayCurrency = (value) => {
  if (value === void 0 || value === null) return "";
  return `$ ${value.toLocaleString("es-CL")}`;
};
var displayCurrencyCompact = (value, isDeduction = false) => {
  if (value === void 0 || value === null) return "\u2014";
  const abs = Math.abs(value);
  const sign = isDeduction && value > 0 ? "-" : "";
  const thousands = Math.round(abs / 1e3);
  return `${sign}$${thousands.toLocaleString("es-CL")}`;
};

// src/helpers.ts
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
    if (row.isGroup) continue;
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
  const sectionRows = rows.filter((r) => rowMatchesSection(r, sectionType));
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
  const sectionRows = rows.filter((r) => rowMatchesSection(r, sectionType) && !r.isGroup);
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
    return r;
  });
  const groupHeader = {
    id: groupId,
    label: groupName,
    type: groupType,
    values: {},
    isGroup: true,
    collapsed: false,
    order: firstIdx
  };
  newRows.splice(firstIdx, 0, groupHeader);
  return newRows;
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
  const groups = rows.filter((r) => r.isGroup);
  let result = rows;
  for (const group of groups) {
    const children = result.filter((r) => r.groupId === group.id);
    if (children.length < 2) {
      result = ungroupRows(result, group.id);
    }
  }
  return result;
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
  requestEdit = 0
}) => {
  const isMobile = useIsMobile();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef(null);
  const startEdit = () => {
    setEditValue(value?.toString() || "");
    setIsEditing(true);
  };
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
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
      startEdit();
    }
  }, [requestEdit]);
  const handleClick = () => {
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
var DataRow = ({
  row,
  months,
  isHovered,
  indented = false,
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
  isDragging = false,
  dropIndicator,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd
}) => {
  const subtract = isSubtractType(row.type);
  const rowBg = selected ? "bg-emerald-50/60" : subtract ? "bg-red-50/50 hover:bg-red-100/50" : "hover:bg-gray-50";
  const showCheckbox = selectable && (anySelected || isHovered);
  const dropBorder = dropIndicator === "above" ? "border-t-2 border-t-blue-400" : dropIndicator === "below" ? "border-b-2 border-b-blue-400" : "";
  return /* @__PURE__ */ jsxs(
    "tr",
    {
      className: `border-b border-gray-100 ${rowBg} ${isDragging ? "opacity-40" : ""} ${dropBorder} group`,
      onMouseEnter,
      onMouseLeave,
      onContextMenu,
      onDragOver,
      onDragLeave,
      onDrop,
      children: [
        /* @__PURE__ */ jsx("td", { className: `pl-1 pr-2 py-1.5 text-gray-700 ${T.cellLabel}`, style: { width: "180px" }, children: /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-0.5 min-w-0 ${indented ? "pl-4" : ""}`, children: [
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
          ) : isHovered ? /* @__PURE__ */ jsx(
            "button",
            {
              onClick: onRemove,
              className: "p-0.5 rounded shrink-0 text-red-400 hover:text-red-600 hover:bg-red-100",
              title: "Eliminar fila",
              children: /* @__PURE__ */ jsx(X, { size: 14 })
            }
          ) : null,
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: row.label,
              onChange: (e) => onLabelChange(e.target.value),
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
              requestEdit: cellFocused ? editTrigger : 0
            },
            p.id
          );
        }),
        /* @__PURE__ */ jsx("td", { style: { width: "40px" } })
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
  onAddRowWithValue
}) => {
  const subtract = isSubtractType(section.type);
  const bgClass = subtract ? "bg-red-50/30 border-red-100" : "bg-gray-50/30 border-gray-100";
  return /* @__PURE__ */ jsxs("tr", { className: `border-b border-dashed ${bgClass}`, children: [
    /* @__PURE__ */ jsx("td", { className: "px-4 py-1.5", style: { width: "180px" }, children: /* @__PURE__ */ jsx(
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
        /* @__PURE__ */ jsx("td", { className: "pl-1 pr-2 py-1.5 text-gray-700 overflow-hidden", style: { width: "180px" }, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-0.5 min-w-0", children: [
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
              className: "flex-1 min-w-0 bg-transparent border-none outline-none text-xs font-semibold text-gray-700 truncate",
              title: group.label
            }
          ),
          isHovered && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: onUngroup,
              className: "p-0.5 rounded shrink-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100",
              title: "Desagrupar",
              children: /* @__PURE__ */ jsx(Ungroup, { size: 14 })
            }
          )
        ] }) }),
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
        /* @__PURE__ */ jsx("td", { style: { width: "40px" } })
      ]
    }
  );
};
var grouprow_default = GroupRow;
var ContextMenu = ({ x, y, canGroup, selectedCount, onGroup, onCancel, onClose }) => {
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
var HeaderSelectionBar = ({ selectedCount, canGroup, monthCount, naming, onNamingChange, onGroup, onCancel }) => {
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
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
    "td",
    {
      colSpan: monthCount + 1,
      className: "px-4 py-2.5 text-right",
      onClick: (e) => e.stopPropagation(),
      children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-500 mr-1", children: [
          selectedCount,
          " fila",
          selectedCount !== 1 ? "s" : ""
        ] }),
        naming ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
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
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: onCancel,
              className: "text-xs px-2 py-1 rounded-full text-gray-500 hover:bg-gray-200 transition-colors",
              children: "Cancelar"
            }
          )
        ] })
      ] })
    }
  ) });
};
var useKeyboard = ({ visibleRowIds, monthCount }) => {
  const [focusedCell, setFocusedCell] = useState(null);
  const [editTrigger, setEditTrigger] = useState(0);
  const isFocused = useCallback((rowId, monthIndex) => {
    return focusedCell?.rowId === rowId && focusedCell?.monthIndex === monthIndex;
  }, [focusedCell]);
  const focus = useCallback((rowId, monthIndex) => {
    setFocusedCell({ rowId, monthIndex });
  }, []);
  const clearFocus = useCallback(() => setFocusedCell(null), []);
  const navigate = useCallback((direction) => {
    setFocusedCell((prev) => {
      if (!prev) return null;
      const rowIdx = visibleRowIds.indexOf(prev.rowId);
      if (rowIdx === -1) return null;
      let newRow = rowIdx;
      let newCol = prev.monthIndex;
      switch (direction) {
        case "right":
          if (newCol < monthCount - 1) {
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
            newCol = monthCount - 1;
          }
          break;
        case "down":
          if (newRow < visibleRowIds.length - 1) newRow++;
          break;
        case "up":
          if (newRow > 0) newRow--;
          break;
      }
      return { rowId: visibleRowIds[newRow], monthIndex: newCol };
    });
  }, [visibleRowIds, monthCount]);
  const navigateAndEdit = useCallback((direction) => {
    navigate(direction);
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
        e.preventDefault();
        setEditTrigger((prev) => prev + 1);
        break;
      case "Escape":
        e.preventDefault();
        clearFocus();
        break;
    }
  }, [focusedCell, navigate, clearFocus]);
  return {
    focusedCell,
    editTrigger,
    isFocused,
    focus,
    clearFocus,
    navigate,
    navigateAndEdit,
    handleContainerKeyDown
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
    const targetGroupId = targetRow.groupId ?? null;
    let workingRows = rows;
    if (targetGroupId !== null && sourceRow.groupId !== targetGroupId) {
      workingRows = workingRows.map((r) => r.id === sourceId ? { ...r, groupId: targetGroupId } : r);
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
var defaultFormatCurrency = (value) => {
  if (value === void 0 || value === null) return "\u2014";
  return `$ ${value.toLocaleString("es-CL")}`;
};
var DebtsTable = ({
  title,
  entries,
  onEntriesChange,
  summary,
  headerBg = "bg-rose-50",
  headerText = "text-rose-700",
  defaultCollapsed = true,
  forceExpanded = false,
  formatCurrency: formatCurrency3 = defaultFormatCurrency,
  sourceFileIds,
  onViewSource
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [newEntry, setNewEntry] = useState({ entidad: "", tipo: "" });
  const isExpanded = forceExpanded || !isCollapsed;
  const updateEntry = (id, field, value) => {
    onEntriesChange(entries.map((e) => e.id === id ? { ...e, [field]: value } : e));
  };
  const removeEntry = (id) => {
    onEntriesChange(entries.filter((e) => e.id !== id));
  };
  const addEntry = () => {
    if (!newEntry.entidad.trim()) return;
    const entry = {
      id: `debt_${Date.now()}`,
      entidad: newEntry.entidad.trim(),
      tipo: newEntry.tipo.trim() || "Consumo",
      deuda_total: null,
      vigente: null
    };
    setNewEntry({ entidad: "", tipo: "" });
    onEntriesChange([...entries, entry]);
  };
  const addEntryWithValue = (field, value) => {
    if (value === null) return;
    const entry = {
      id: `debt_${Date.now()}`,
      entidad: newEntry.entidad.trim() || "Nueva deuda",
      tipo: newEntry.tipo.trim() || "Consumo",
      deuda_total: field === "deuda_total" ? value : null,
      vigente: field === "vigente" ? value : null
    };
    setNewEntry({ entidad: "", tipo: "" });
    onEntriesChange([...entries, entry]);
  };
  const totalDeuda = entries.reduce((sum, e) => sum + (e.deuda_total || 0), 0);
  const totalVigente = entries.reduce((sum, e) => sum + (e.vigente || 0), 0);
  const totalAtraso = entries.reduce((sum, e) => {
    return sum + (e.atraso_30_59 || 0) + (e.atraso_60_89 || 0) + (e.atraso_90_mas || 0);
  }, 0);
  const hasLatePayments = entries.some(
    (e) => e.atraso_30_59 && e.atraso_30_59 > 0 || e.atraso_60_89 && e.atraso_60_89 > 0 || e.atraso_90_mas && e.atraso_90_mas > 0
  );
  const renderDataRow = (entry) => {
    const isHovered = hoveredRow === entry.id;
    const hasAtraso = entry.atraso_30_59 && entry.atraso_30_59 > 0 || entry.atraso_60_89 && entry.atraso_60_89 > 0 || entry.atraso_90_mas && entry.atraso_90_mas > 0;
    return /* @__PURE__ */ jsxs(
      "tr",
      {
        className: `border-b border-gray-100 ${hasAtraso ? "bg-red-50/50 hover:bg-red-100/50" : "bg-rose-50/30 hover:bg-rose-100/50"} group`,
        onMouseEnter: () => setHoveredRow(entry.id),
        onMouseLeave: () => setHoveredRow(null),
        children: [
          /* @__PURE__ */ jsx("td", { className: `px-2 py-2.5 text-gray-700 ${T.cellLabel}`, style: { width: "180px" }, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 min-w-0", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => removeEntry(entry.id),
                className: `p-1 rounded transition-all shrink-0 ${isHovered ? "opacity-100 text-red-400 hover:text-red-600 hover:bg-red-100" : "opacity-0"}`,
                title: "Eliminar fila",
                children: /* @__PURE__ */ jsx(X, { size: 16 })
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: entry.entidad,
                onChange: (e) => updateEntry(entry.id, "entidad", e.target.value),
                className: `flex-1 min-w-0 ${T.inputLabel} pl-1`,
                placeholder: "Entidad",
                title: entry.entidad
              }
            ),
            entry.sourceFileId && onViewSource && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => onViewSource([entry.sourceFileId]),
                className: `p-1 rounded transition-all shrink-0 ${isHovered ? "opacity-100 text-gray-400 hover:text-gray-600 hover:bg-gray-100" : "opacity-0"}`,
                title: "Ver documento fuente",
                children: /* @__PURE__ */ jsx(Eye, { size: 14 })
              }
            )
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-2 py-2.5 text-gray-600", style: { width: "100px" }, children: /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: entry.tipo,
              onChange: (e) => updateEntry(entry.id, "tipo", e.target.value),
              className: `w-full ${T.input} pl-1`,
              placeholder: "Tipo"
            }
          ) }),
          /* @__PURE__ */ jsx(
            editablecell_default,
            {
              value: entry.deuda_total,
              onChange: (v) => updateEntry(entry.id, "deuda_total", v),
              isDeduction: true,
              hasData: entry.deuda_total !== null,
              width: "120px",
              type: "currency"
            }
          ),
          /* @__PURE__ */ jsx(
            editablecell_default,
            {
              value: entry.vigente,
              onChange: (v) => updateEntry(entry.id, "vigente", v),
              isDeduction: false,
              hasData: entry.vigente !== null,
              width: "120px",
              type: "currency"
            }
          ),
          hasLatePayments && /* @__PURE__ */ jsx("td", { className: "px-3 py-2.5 text-right text-red-600 font-medium", style: { width: "100px" }, children: hasAtraso ? formatCurrency3(
            (entry.atraso_30_59 || 0) + (entry.atraso_60_89 || 0) + (entry.atraso_90_mas || 0)
          ) : "\u2014" }),
          /* @__PURE__ */ jsx("td", { style: { width: "40px" } })
        ]
      },
      entry.id
    );
  };
  const renderAddRow = () => {
    return /* @__PURE__ */ jsxs("tr", { className: "border-b border-dashed bg-rose-50/20 border-rose-100", children: [
      /* @__PURE__ */ jsx("td", { className: "px-4 py-2.5", style: { width: "180px" }, children: /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Agregar deuda...",
          value: newEntry.entidad,
          onChange: (e) => setNewEntry((prev) => ({ ...prev, entidad: e.target.value })),
          className: `w-full ${T.inputPlaceholder}`,
          onKeyDown: (e) => {
            if (e.key === "Enter" && newEntry.entidad.trim()) {
              addEntry();
            }
          }
        }
      ) }),
      /* @__PURE__ */ jsx("td", { className: "px-2 py-2.5", style: { width: "100px" }, children: /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Tipo",
          value: newEntry.tipo,
          onChange: (e) => setNewEntry((prev) => ({ ...prev, tipo: e.target.value })),
          className: `w-full ${T.inputPlaceholder}`
        }
      ) }),
      /* @__PURE__ */ jsx(
        editablecell_default,
        {
          value: null,
          onChange: (v) => addEntryWithValue("deuda_total", v),
          isDeduction: true,
          hasData: false,
          width: "120px",
          type: "currency"
        }
      ),
      /* @__PURE__ */ jsx(
        editablecell_default,
        {
          value: null,
          onChange: (v) => addEntryWithValue("vigente", v),
          isDeduction: false,
          hasData: false,
          width: "120px",
          type: "currency"
        }
      ),
      hasLatePayments && /* @__PURE__ */ jsx("td", { style: { width: "100px" } }),
      /* @__PURE__ */ jsx("td", { style: { width: "40px" } })
    ] });
  };
  return /* @__PURE__ */ jsxs("div", { className: `rounded-xl overflow-hidden ${!isExpanded ? "" : "border border-gray-200"}`, children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => !forceExpanded && setIsCollapsed(!isCollapsed),
        className: `w-full ${headerBg} hover:brightness-95 transition-all ${forceExpanded ? "cursor-default" : "cursor-pointer"} ${!isExpanded ? "rounded-xl" : "rounded-t-xl"}`,
        children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsx("table", { className: T.table, style: { tableLayout: "fixed" }, children: /* @__PURE__ */ jsx("tbody", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-left", style: { width: "180px" }, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: `${headerText} ${T.headerTitle}`, children: title }),
            sourceFileIds && sourceFileIds.length > 0 && onViewSource && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  onViewSource(sourceFileIds);
                },
                className: "p-1 rounded hover:bg-white/50 transition-colors",
                title: "Ver documento fuente",
                children: /* @__PURE__ */ jsx(Eye, { size: 14, className: headerText })
              }
            )
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-3 py-3 text-right", style: { width: "100px" }, children: /* @__PURE__ */ jsxs("span", { className: `${headerText} ${T.headerCount}`, children: [
            entries.length,
            " ",
            entries.length === 1 ? "deuda" : "deudas"
          ] }) }),
          /* @__PURE__ */ jsxs("td", { className: "px-3 py-3 text-right", style: { width: "120px" }, children: [
            /* @__PURE__ */ jsx("span", { className: `${headerText} ${T.headerStatLabel}`, children: "Total: " }),
            /* @__PURE__ */ jsx("span", { className: `${T.headerStat} ${totalDeuda > 0 ? headerText : "text-gray-400"}`, children: totalDeuda > 0 ? formatCurrency3(totalDeuda) : "\u2014" })
          ] }),
          /* @__PURE__ */ jsxs("td", { className: "px-3 py-3 text-right", style: { width: "120px" }, children: [
            /* @__PURE__ */ jsx("span", { className: `${headerText} ${T.headerStatLabel}`, children: "Vigente: " }),
            /* @__PURE__ */ jsx("span", { className: `${T.headerStat} ${totalVigente > 0 ? "text-emerald-600" : "text-gray-400"}`, children: totalVigente > 0 ? formatCurrency3(totalVigente) : "\u2014" })
          ] }),
          hasLatePayments && /* @__PURE__ */ jsxs("td", { className: "px-3 py-3 text-right", style: { width: "100px" }, children: [
            /* @__PURE__ */ jsx("span", { className: `text-red-600 ${T.headerStatLabel}`, children: "Atraso: " }),
            /* @__PURE__ */ jsx("span", { className: `${T.headerStat} text-red-600`, children: formatCurrency3(totalAtraso) })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-2 py-3 text-right", style: { width: "40px" }, children: !forceExpanded && (isExpanded ? /* @__PURE__ */ jsx(ChevronUp, { size: 20, className: headerText }) : /* @__PURE__ */ jsx(ChevronDown, { size: 20, className: headerText })) })
        ] }) }) }) })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: `bg-white ${!isExpanded ? "hidden print:block" : ""}`, children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: T.table, style: { tableLayout: "fixed" }, children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-gray-200 bg-gray-50/50", children: [
        /* @__PURE__ */ jsx("th", { className: `px-4 py-2 text-left ${T.th}`, style: { width: "180px" }, children: "Instituci\xF3n" }),
        /* @__PURE__ */ jsx("th", { className: `px-2 py-2 text-left ${T.th}`, style: { width: "100px" }, children: "Tipo" }),
        /* @__PURE__ */ jsx("th", { className: `px-3 py-2 text-right ${T.th}`, style: { width: "120px" }, children: "Total Cr\xE9dito" }),
        /* @__PURE__ */ jsx("th", { className: `px-3 py-2 text-right ${T.th}`, style: { width: "120px" }, children: "Vigente" }),
        hasLatePayments && /* @__PURE__ */ jsx("th", { className: `px-3 py-2 text-right text-red-500 font-medium text-xs uppercase`, style: { width: "100px" }, children: "Atraso" }),
        /* @__PURE__ */ jsx("th", { style: { width: "40px" } })
      ] }) }),
      /* @__PURE__ */ jsxs("tbody", { children: [
        entries.map((entry) => renderDataRow(entry)),
        renderAddRow()
      ] })
    ] }) }) })
  ] });
};
var debtstable_default = DebtsTable;
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
  defaultCollapsed = true,
  forceExpanded = false,
  sourceFileIds,
  onViewSource
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const isExpanded = forceExpanded || !isCollapsed;
  const monthsWithData = months.filter((m) => m.hasData);
  const totalLiquido = totales?.total_liquido ?? monthsWithData.reduce((s, m) => s + (m.liquido || 0), 0);
  const totalBoletas = totales?.boletas_vigentes ?? monthsWithData.reduce((s, m) => s + (m.boletas || 0), 0);
  const promedioMensual = monthsWithData.length > 0 ? totalLiquido / monthsWithData.length : 0;
  return /* @__PURE__ */ jsxs("div", { className: `rounded-xl overflow-hidden ${!isExpanded ? "" : "border border-gray-200"}`, children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => !forceExpanded && setIsCollapsed(!isCollapsed),
        className: `w-full ${headerBg} hover:brightness-95 transition-all ${forceExpanded ? "cursor-default" : "cursor-pointer"} ${!isExpanded ? "rounded-xl" : "rounded-t-xl"}`,
        children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 py-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: `${headerText} ${T.headerTitle}`, children: title }),
            sourceFileIds && sourceFileIds.length > 0 && onViewSource && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  onViewSource(sourceFileIds);
                },
                className: "p-1 rounded hover:bg-white/50 transition-colors",
                title: "Ver documento fuente",
                children: /* @__PURE__ */ jsx(Eye, { size: 14, className: headerText })
              }
            )
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
        ] })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: `bg-white ${!isExpanded ? "hidden print:block" : ""}`, children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: T.table, style: { tableLayout: "fixed" }, children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-gray-200 bg-gray-50/50", children: [
        /* @__PURE__ */ jsx("th", { className: `px-4 py-2 text-left ${T.th}`, style: { width: "140px" }, children: "Mes" }),
        /* @__PURE__ */ jsx("th", { className: `px-3 py-2 text-center ${T.th}`, style: { width: "80px" }, children: "Boletas" }),
        /* @__PURE__ */ jsx("th", { className: `px-3 py-2 text-right ${T.th}`, style: { width: "130px" }, children: "Bruto" }),
        /* @__PURE__ */ jsx("th", { className: `px-3 py-2 text-right ${T.th}`, style: { width: "130px" }, children: "Retenci\xF3n" }),
        /* @__PURE__ */ jsx("th", { className: `px-4 py-2 text-right ${T.th}`, style: { width: "130px" }, children: "L\xEDquido" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: months.map((m, i) => /* @__PURE__ */ jsxs("tr", { className: `border-b border-gray-100 ${m.hasData ? "hover:bg-emerald-50/30" : ""}`, children: [
        /* @__PURE__ */ jsx("td", { className: `px-4 py-2.5 font-medium ${T.cellLabel} ${m.hasData ? "text-gray-700" : "text-gray-300"}`, style: { width: "140px" }, children: /* @__PURE__ */ jsx("span", { className: "truncate block", children: MONTH_LABELS[m.mes] || m.mes }) }),
        /* @__PURE__ */ jsx("td", { className: "px-3 py-2.5 text-center text-gray-800", style: { width: "80px" }, children: m.hasData ? m.boletas ?? "" : "" }),
        /* @__PURE__ */ jsx("td", { className: "px-3 py-2.5 text-right text-gray-800", style: { width: "130px" }, children: m.hasData ? formatCurrency(m.bruto) : "" }),
        /* @__PURE__ */ jsx("td", { className: "px-3 py-2.5 text-right text-red-700", style: { width: "130px" }, children: m.hasData ? formatCurrency(m.retencion) : "" }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-2.5 text-right font-medium text-emerald-700", style: { width: "130px" }, children: m.hasData ? formatCurrency(m.liquido) : "" })
      ] }, i)) }),
      /* @__PURE__ */ jsx("tfoot", { children: /* @__PURE__ */ jsxs("tr", { className: "border-t-2 border-emerald-200 bg-emerald-50/50", children: [
        /* @__PURE__ */ jsx("td", { className: `px-4 py-3 ${T.footerLabel} text-emerald-700`, style: { width: "140px" }, children: "TOTALES" }),
        /* @__PURE__ */ jsx("td", { className: `px-3 py-3 text-center ${T.footerValue} text-emerald-700`, style: { width: "80px" }, children: totalBoletas }),
        /* @__PURE__ */ jsx("td", { className: `px-3 py-3 text-right ${T.footerValue} text-emerald-700`, style: { width: "130px" }, children: formatCurrency(totales?.honorario_bruto ?? monthsWithData.reduce((s, m) => s + (m.bruto || 0), 0)) }),
        /* @__PURE__ */ jsx("td", { className: `px-3 py-3 text-right ${T.footerValue} text-red-700`, style: { width: "130px" }, children: formatCurrency(
          (totales?.retencion_terceros ?? 0) + (totales?.retencion_contribuyente ?? 0) || monthsWithData.reduce((s, m) => s + (m.retencion || 0), 0)
        ) }),
        /* @__PURE__ */ jsx("td", { className: `px-4 py-3 text-right ${T.footerValue} text-emerald-700`, style: { width: "130px" }, children: formatCurrency(totalLiquido) })
      ] }) })
    ] }) }) })
  ] });
};
var boletastable_default = BoletasTable;
var formatCurrency2 = (value) => {
  return displayCurrencyCompact(value);
};
var TributarioTable = ({
  title,
  entries,
  headerBg = "bg-amber-50",
  headerText = "text-amber-700",
  defaultCollapsed = true,
  forceExpanded = false,
  sourceFileIds,
  onViewSource
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [hoveredRow, setHoveredRow] = useState(null);
  const isExpanded = forceExpanded || !isCollapsed;
  const balanceEntries = entries.filter((e) => e.source === "balance-anual");
  const carpetaEntries = entries.filter((e) => e.source === "carpeta-tributaria");
  const totalIngresos = balanceEntries.reduce((sum, e) => sum + (e.ingresos || 0), 0);
  const totalEgresos = balanceEntries.reduce((sum, e) => sum + (e.egresos || 0), 0);
  return /* @__PURE__ */ jsxs("div", { className: `rounded-xl overflow-hidden ${!isExpanded ? "" : "border border-gray-200"}`, children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => !forceExpanded && setIsCollapsed(!isCollapsed),
        className: `w-full ${headerBg} hover:brightness-95 transition-all ${forceExpanded ? "cursor-default" : "cursor-pointer"} ${!isExpanded ? "rounded-xl" : "rounded-t-xl"}`,
        children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsx("table", { className: T.table, style: { tableLayout: "fixed" }, children: /* @__PURE__ */ jsx("tbody", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-left", style: { width: "200px" }, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: `${headerText} ${T.headerTitle}`, children: title }),
            sourceFileIds && sourceFileIds.length > 0 && onViewSource && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  onViewSource(sourceFileIds);
                },
                className: "p-1 rounded hover:bg-white/50 transition-colors",
                title: "Ver documento fuente",
                children: /* @__PURE__ */ jsx(Eye, { size: 14, className: headerText })
              }
            )
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
        ] }) }) }) })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: `bg-white ${!isExpanded ? "hidden print:block" : ""}`, children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: T.table, style: { tableLayout: "fixed" }, children: [
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
            onMouseEnter: () => setHoveredRow(entry.id),
            onMouseLeave: () => setHoveredRow(null),
            children: [
              /* @__PURE__ */ jsx("td", { className: `px-4 py-2.5 text-gray-700 ${T.cellLabel}`, style: { width: "200px" }, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 min-w-0", children: [
                /* @__PURE__ */ jsx("span", { className: "font-medium text-xs truncate", title: entry.empresa || entry.label, children: entry.empresa || entry.label }),
                entry.sourceFileId && onViewSource && /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => onViewSource([entry.sourceFileId]),
                    className: `p-1 rounded transition-all shrink-0 ${hoveredRow === entry.id ? "opacity-100 text-gray-400 hover:text-gray-600 hover:bg-gray-100" : "opacity-0"}`,
                    title: "Ver documento fuente",
                    children: /* @__PURE__ */ jsx(Eye, { size: 14 })
                  }
                )
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
            onMouseEnter: () => setHoveredRow(entry.id),
            onMouseLeave: () => setHoveredRow(null),
            children: [
              /* @__PURE__ */ jsx("td", { className: `px-4 py-2.5 text-gray-700 ${T.cellLabel}`, style: { width: "200px" }, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 min-w-0", children: [
                /* @__PURE__ */ jsx("span", { className: "font-medium text-xs truncate", children: "Carpeta Tributaria" }),
                entry.sourceFileId && onViewSource && /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => onViewSource([entry.sourceFileId]),
                    className: `p-1 rounded transition-all shrink-0 ${hoveredRow === entry.id ? "opacity-100 text-gray-400 hover:text-gray-600 hover:bg-gray-100" : "opacity-0"}`,
                    title: "Ver documento fuente",
                    children: /* @__PURE__ */ jsx(Eye, { size: 14 })
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: `px-2 py-2.5 ${T.muted}`, colSpan: 3, style: { width: "400px" }, children: entry.actividades && entry.actividades.length > 0 ? entry.actividades.join(", ") : "\u2014" }),
              /* @__PURE__ */ jsx("td", { style: { width: "40px" } })
            ]
          },
          entry.id
        )),
        entries.length === 0 && /* @__PURE__ */ jsx("tr", { className: "border-b border-gray-100", children: /* @__PURE__ */ jsx("td", { className: `px-4 py-3 ${T.empty}`, colSpan: 5, children: "Sin informaci\xF3n tributaria" }) })
      ] })
    ] }) }) })
  ] });
};
var tributariotable_default = TributarioTable;
var AssetTable = ({
  rows,
  onRowsChange,
  formatCurrency: formatCurrency3,
  placeholder = "Agregar activo...",
  onViewSource
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [newAssetLabel, setNewAssetLabel] = useState("");
  const updateRowLabel = (rowId, label) => {
    onRowsChange(rows.map((r) => r.id === rowId ? { ...r, label } : r));
  };
  const updateRowValue = (rowId, value) => {
    onRowsChange(rows.map((r) => r.id === rowId ? { ...r, value } : r));
  };
  const updateRowDescription = (rowId, description) => {
    onRowsChange(rows.map((r) => r.id === rowId ? { ...r, description } : r));
  };
  const removeRow = (rowId) => {
    onRowsChange(rows.filter((r) => r.id !== rowId));
  };
  const addRow = (label) => {
    if (!label.trim()) return;
    const newRow = {
      id: `row_asset_${Date.now()}`,
      label: label.trim(),
      type: "asset",
      value: null
    };
    setNewAssetLabel("");
    onRowsChange([...rows, newRow]);
  };
  const addRowWithValue = (value) => {
    if (value === null) return;
    const pendingLabel = newAssetLabel.trim();
    const defaultLabel = "Nuevo activo";
    const newRow = {
      id: `row_asset_${Date.now()}`,
      label: pendingLabel || defaultLabel,
      type: "asset",
      value
    };
    setNewAssetLabel("");
    onRowsChange([...rows, newRow]);
  };
  const calculateTotalAssets = () => {
    return rows.reduce((sum, row) => sum + (row.value || 0), 0);
  };
  const totalAssets = calculateTotalAssets();
  const renderRow = (row) => {
    const isHovered = hoveredRow === row.id;
    return /* @__PURE__ */ jsxs(
      "tr",
      {
        className: "border-b border-gray-100 bg-blue-50/50 hover:bg-blue-100/50 group",
        onMouseEnter: () => setHoveredRow(row.id),
        onMouseLeave: () => setHoveredRow(null),
        children: [
          /* @__PURE__ */ jsx("td", { className: `px-2 py-2.5 text-gray-700 ${T.cellLabel}`, style: { width: "200px" }, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 min-w-0", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => removeRow(row.id),
                className: `p-1 rounded transition-all shrink-0 ${isHovered ? "opacity-100 text-red-400 hover:text-red-600 hover:bg-red-100" : "opacity-0"}`,
                title: "Eliminar fila",
                children: /* @__PURE__ */ jsx(X, { size: 16 })
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: row.label,
                onChange: (e) => updateRowLabel(row.id, e.target.value),
                className: `flex-1 min-w-0 ${T.inputLabel} pl-1`,
                title: row.label
              }
            )
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-2 py-2.5 text-gray-600", style: { width: "200px" }, children: /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: row.description || "",
              onChange: (e) => updateRowDescription(row.id, e.target.value),
              placeholder: "Descripci\xF3n...",
              className: `w-full ${T.input} placeholder-gray-400`
            }
          ) }),
          /* @__PURE__ */ jsx(
            editablecell_default,
            {
              value: row.value,
              onChange: (v) => updateRowValue(row.id, v),
              isDeduction: false,
              hasData: row.value !== null,
              width: "140px",
              type: "currency",
              className: "text-blue-700 font-medium"
            }
          )
        ]
      },
      row.id
    );
  };
  const renderAddRow = () => {
    return /* @__PURE__ */ jsxs("tr", { className: "border-b border-dashed bg-blue-50/30 border-blue-100", children: [
      /* @__PURE__ */ jsx("td", { className: "px-4 py-2.5", style: { width: "200px" }, children: /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder,
          value: newAssetLabel,
          onChange: (e) => setNewAssetLabel(e.target.value),
          className: `w-full ${T.inputPlaceholder}`,
          onKeyDown: (e) => {
            if (e.key === "Enter" && newAssetLabel.trim()) {
              addRow(newAssetLabel);
            }
          }
        }
      ) }),
      /* @__PURE__ */ jsx("td", { className: "px-2 py-2.5", style: { width: "200px" }, children: /* @__PURE__ */ jsx("span", { className: T.empty, children: "\u2014" }) }),
      /* @__PURE__ */ jsx(
        editablecell_default,
        {
          value: null,
          onChange: (v) => addRowWithValue(v),
          isDeduction: false,
          hasData: false,
          width: "140px",
          type: "currency"
        }
      )
    ] });
  };
  return /* @__PURE__ */ jsx("div", { className: "rounded-xl overflow-hidden border border-gray-200 bg-white", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: T.table, style: { tableLayout: "fixed" }, children: [
    /* @__PURE__ */ jsx("thead", { className: "sticky top-0 z-10", children: /* @__PURE__ */ jsxs("tr", { className: "bg-blue-50 border-b border-blue-100", children: [
      /* @__PURE__ */ jsx("th", { className: `px-4 py-2 text-left text-blue-700 font-medium text-xs`, style: { width: "200px" }, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" }) }),
        "Activo"
      ] }) }),
      /* @__PURE__ */ jsx("th", { className: `px-3 py-2 text-left font-medium text-blue-600 text-xs`, style: { width: "200px" }, children: "Descripci\xF3n" }),
      /* @__PURE__ */ jsx("th", { className: `px-3 py-2 text-right font-medium text-blue-600 text-xs`, style: { width: "140px" }, children: "Valor Estimado" })
    ] }) }),
    /* @__PURE__ */ jsxs("tbody", { children: [
      rows.map((row) => renderRow(row)),
      renderAddRow(),
      /* @__PURE__ */ jsxs("tr", { className: "border-t-2 border-blue-200 bg-blue-100/50", children: [
        /* @__PURE__ */ jsx("td", { className: `px-4 py-3 text-blue-800 ${T.footerLabel}`, style: { width: "200px" }, children: "TOTAL ACTIVOS" }),
        /* @__PURE__ */ jsx("td", { className: "px-3 py-3", style: { width: "200px" } }),
        /* @__PURE__ */ jsx("td", { className: `px-3 py-3 text-right ${T.footerValue} text-blue-800`, style: { width: "140px" }, children: totalAssets > 0 ? formatCurrency3(totalAssets) : "\u2014" })
      ] })
    ] })
  ] }) }) });
};
var assettable_default = AssetTable;
var MonthlyTable = ({
  title,
  months = 3,
  rows,
  onRowsChange,
  sections,
  headerBg = "bg-gray-100",
  headerText = "text-gray-700",
  defaultCollapsed = true,
  forceExpanded = false,
  formatValue = defaultFormatValue,
  calculateTotal = defaultCalculateTotal,
  sourceFileIds,
  onViewSource
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [newRowLabels, setNewRowLabels] = useState({});
  const [selectedRows, setSelectedRows] = useState(/* @__PURE__ */ new Set());
  const [contextMenu, setContextMenu] = useState(null);
  const [naming, setNaming] = useState(false);
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
  const isExpanded = forceExpanded || !isCollapsed;
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
    if (selected.some((r) => r.isGroup || r.groupId)) return false;
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
  const removeRow = useCallback((rowId) => {
    const row = rows.find((r) => r.id === rowId);
    if (!row) return;
    let newRows;
    if (row.isGroup) {
      newRows = ungroupRows(rows, rowId);
    } else {
      newRows = rows.filter((r) => r.id !== rowId);
      newRows = autoUngroup(newRows);
    }
    setSelectedRows((prev) => {
      if (!prev.has(rowId)) return prev;
      const next = new Set(prev);
      next.delete(rowId);
      return next;
    });
    onRowsChange(newRows);
  }, [rows, onRowsChange]);
  const toggleGroupCollapse = useCallback((groupId) => {
    onRowsChange(rows.map((r) => r.id === groupId ? { ...r, collapsed: !r.collapsed } : r));
  }, [rows, onRowsChange]);
  const handleUngroup = useCallback((groupId) => {
    onRowsChange(ungroupRows(rows, groupId));
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
  return /* @__PURE__ */ jsxs("div", { className: `rounded-xl overflow-hidden ${!isExpanded ? "" : "border border-gray-200"}`, children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        role: anySelected ? void 0 : "button",
        onClick: () => !forceExpanded && !anySelected && setIsCollapsed(!isCollapsed),
        className: `w-full ${headerBg} hover:brightness-95 transition-all ${forceExpanded || anySelected ? "cursor-default" : "cursor-pointer"} ${!isExpanded ? "rounded-xl" : "rounded-t-xl"}`,
        children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsx("table", { className: T.table, style: { tableLayout: "fixed" }, children: /* @__PURE__ */ jsx("tbody", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { className: "px-4 py-2.5 text-left", style: { width: "180px" }, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: `${headerText} ${T.headerTitle}`, children: title }),
            !anySelected && sourceFileIds && sourceFileIds.length > 0 && onViewSource && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  onViewSource(sourceFileIds);
                },
                className: "p-1 rounded hover:bg-white/50 transition-colors",
                title: "Ver documento fuente",
                children: /* @__PURE__ */ jsx(Eye, { size: 14, className: headerText })
              }
            )
          ] }) }),
          anySelected ? /* @__PURE__ */ jsx(
            HeaderSelectionBar,
            {
              selectedCount: selectedRows.size,
              canGroup,
              monthCount: monthsArray.length,
              naming,
              onNamingChange: setNaming,
              onGroup: handleGroup,
              onCancel: () => {
                clearSelection();
                setNaming(false);
              }
            }
          ) : /* @__PURE__ */ jsxs(Fragment, { children: [
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
            /* @__PURE__ */ jsx("td", { className: "px-2 py-2.5 text-right", style: { width: "40px" }, children: !forceExpanded && (isExpanded ? /* @__PURE__ */ jsx(ChevronUp, { size: 20, className: headerText }) : /* @__PURE__ */ jsx(ChevronDown, { size: 20, className: headerText })) })
          ] })
        ] }) }) }) })
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `bg-white ${!isExpanded ? "hidden print:block" : ""} outline-none`,
        tabIndex: 0,
        onKeyDown: keyboard.handleContainerKeyDown,
        children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsx("table", { className: T.table, style: { tableLayout: "fixed" }, children: /* @__PURE__ */ jsx("tbody", { children: effectiveSections.map((section) => {
          const items = getOrderedItems(rows, section.type);
          return /* @__PURE__ */ jsxs(React6.Fragment, { children: [
            items.map((item) => {
              if (item.kind === "group") {
                const { group, children: groupChildren } = item;
                const showChildren = forceExpanded || !group.collapsed;
                return /* @__PURE__ */ jsxs(React6.Fragment, { children: [
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
                      isDragging: drag.dragRowId === group.id,
                      dropIndicator: drag.dropTargetId === group.id ? drag.dropPosition : null,
                      onDragStart: drag.handleDragStart(group.id),
                      onDragOver: drag.handleDragOver(group.id),
                      onDragLeave: drag.handleDragLeave,
                      onDrop: drag.handleDrop(rows, onRowsChange),
                      onDragEnd: drag.handleDragEnd
                    }
                  ),
                  showChildren && groupChildren.map((child) => /* @__PURE__ */ jsx(
                    datarow_default,
                    {
                      row: child,
                      months: monthsArray,
                      isHovered: hoveredRow === child.id,
                      indented: true,
                      onMouseEnter: () => setHoveredRow(child.id),
                      onMouseLeave: () => setHoveredRow(null),
                      onRemove: () => removeRow(child.id),
                      onLabelChange: (label) => updateRowLabel(child.id, label),
                      onValueChange: (monthId, value) => updateRowValue(child.id, monthId, value),
                      onViewSource,
                      isCellFocused: (mi) => keyboard.isFocused(child.id, mi),
                      onCellFocus: (mi) => keyboard.focus(child.id, mi),
                      onNavigate: keyboard.navigateAndEdit,
                      editTrigger: keyboard.editTrigger,
                      dropIndicator: drag.dropTargetId === child.id ? drag.dropPosition : null,
                      onDragOver: drag.handleDragOver(child.id),
                      onDragLeave: drag.handleDragLeave,
                      onDrop: drag.handleDrop(rows, onRowsChange)
                    },
                    child.id
                  ))
                ] }, group.id);
              }
              const { row } = item;
              const selectable = !row.isGroup && !row.groupId;
              return /* @__PURE__ */ jsx(
                datarow_default,
                {
                  row,
                  months: monthsArray,
                  isHovered: hoveredRow === row.id,
                  selected: selectedRows.has(row.id),
                  anySelected,
                  selectable,
                  onMouseEnter: () => setHoveredRow(row.id),
                  onMouseLeave: () => setHoveredRow(null),
                  onRemove: () => removeRow(row.id),
                  onToggleSelect: () => toggleSelect(row.id),
                  onContextMenu: (e) => handleContextMenu(e, row.id),
                  onLabelChange: (label) => updateRowLabel(row.id, label),
                  onValueChange: (monthId, value) => updateRowValue(row.id, monthId, value),
                  onViewSource,
                  isCellFocused: (mi) => keyboard.isFocused(row.id, mi),
                  onCellFocus: (mi) => keyboard.focus(row.id, mi),
                  onNavigate: keyboard.navigateAndEdit,
                  editTrigger: keyboard.editTrigger,
                  isDragging: drag.dragRowId === row.id,
                  dropIndicator: drag.dropTargetId === row.id ? drag.dropPosition : null,
                  onDragStart: drag.handleDragStart(row.id),
                  onDragOver: drag.handleDragOver(row.id),
                  onDragLeave: drag.handleDragLeave,
                  onDrop: drag.handleDrop(rows, onRowsChange),
                  onDragEnd: drag.handleDragEnd
                },
                row.id
              );
            }),
            /* @__PURE__ */ jsx(
              addrow_default,
              {
                section,
                months: monthsArray,
                labelValue: newRowLabels[section.type] || "",
                onLabelChange: (v) => setNewRowLabels((prev) => ({ ...prev, [section.type]: v })),
                onAddRow: (label) => addRow(section.type, label),
                onAddRowWithValue: (monthId, value) => addRowWithValue(section.type, monthId, value)
              }
            ),
            effectiveSections.length > 1 && (() => {
              const subtotals = computeSectionSubtotal(rows, section.type, monthsArray);
              const isSubtract = isSubtractType(section.type);
              const label = isSubtract ? "Total descuentos" : "Total haberes";
              return /* @__PURE__ */ jsxs("tr", { className: `border-t-2 ${isSubtract ? "border-t-rose-200 bg-red-50/30" : "border-t-emerald-200 bg-emerald-50/30"}`, children: [
                /* @__PURE__ */ jsx("td", { className: "pl-4 pr-2 py-2 text-gray-700", style: { width: "180px" }, children: /* @__PURE__ */ jsx("span", { className: `${T.totalLabel} ${isSubtract ? "text-rose-700" : "text-emerald-700"}`, children: label }) }),
                monthsArray.map((p) => {
                  const value = subtotals[p.id] ?? 0;
                  const hasValue = value !== 0;
                  return /* @__PURE__ */ jsx("td", { className: "px-2 py-2 text-right", style: { width: "110px" }, children: /* @__PURE__ */ jsx("span", { className: `${T.totalValue} tabular-nums ${isSubtract ? hasValue ? "text-rose-600" : "text-gray-300" : hasValue ? "text-emerald-700" : "text-gray-300"}`, children: hasValue ? formatValue(isSubtract ? -value : value) : "\u2014" }) }, p.id);
                }),
                /* @__PURE__ */ jsx("td", { style: { width: "40px" } })
              ] });
            })()
          ] }, section.type);
        }) }) }) })
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
        onCancel: clearSelection,
        onClose: () => setContextMenu(null)
      }
    )
  ] });
};
var index_default = MonthlyTable;

export { assettable_default as AssetTable, boletastable_default as BoletasTable, debtstable_default as DebtsTable, tributariotable_default as TributarioTable, index_default as default, generateLastNMonths };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map