'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React3 = require('react');
var lucideReact = require('lucide-react');
var jsxRuntime = require('react/jsx-runtime');
var reactDom = require('react-dom');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React3__default = /*#__PURE__*/_interopDefault(React3);

// src/monthly/index.tsx

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
  cardValue: "text-xs font-semibold"
};

// src/common/utils.ts
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

// src/monthly/helpers.ts
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
  const [isEditing, setIsEditing] = React3.useState(false);
  const [editValue, setEditValue] = React3.useState("");
  const [isHovered, setIsHovered] = React3.useState(false);
  const inputRef = React3.useRef(null);
  const startEdit = () => {
    setEditValue(value?.toString() || "");
    setIsEditing(true);
  };
  React3.useEffect(() => {
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
  React3.useEffect(() => {
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
  return /* @__PURE__ */ jsxRuntime.jsx(
    Wrapper,
    {
      className: `px-2 py-1.5 cursor-pointer ${focusRing} ${className}`,
      style: { width, minWidth: width, maxWidth: width },
      onClick: handleClick,
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
  const rowBg = selected ? "bg-emerald-50/60" : subtract ? "bg-red-50/50 hover:bg-red-100/50" : "hover:bg-gray-50";
  const showCheckbox = selectable && (anySelected || isHovered);
  const dropBorder = dropIndicator === "above" ? "border-t-2 border-t-blue-400" : dropIndicator === "below" ? "border-b-2 border-b-blue-400" : "";
  return /* @__PURE__ */ jsxRuntime.jsxs(
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
        /* @__PURE__ */ jsxRuntime.jsx("td", { className: `pl-1 pr-2 py-1.5 text-gray-700 ${T.cellLabel}`, style: { width: "180px" }, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: `flex items-center gap-0.5 min-w-0 ${indented ? "pl-4" : ""}`, children: [
          isHovered && onDragStart && !anySelected && /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              draggable: true,
              onDragStart,
              onDragEnd,
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
              onChange: onToggleSelect,
              className: "shrink-0 w-3.5 h-3.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
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
              className: `flex-1 min-w-0 ${T.rowLabel} ${isHovered || showCheckbox ? "" : "pl-1"}`,
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
        months.map((p, mi) => {
          const cellFocused = isCellFocused?.(mi) ?? false;
          return /* @__PURE__ */ jsxRuntime.jsx(
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
        /* @__PURE__ */ jsxRuntime.jsx("td", { style: { width: "40px" }, className: "text-center", children: isHovered && !anySelected && /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            onClick: onRemove,
            className: "p-0.5 rounded text-red-400 hover:text-red-600 hover:bg-red-100",
            title: "Eliminar fila",
            children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.X, { size: 14 })
          }
        ) })
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
  return /* @__PURE__ */ jsxRuntime.jsxs("tr", { className: `border-b border-dashed ${bgClass}`, children: [
    /* @__PURE__ */ jsxRuntime.jsx("td", { className: "px-4 py-1.5", style: { width: "180px" }, children: /* @__PURE__ */ jsxRuntime.jsx(
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
    months.map((p) => /* @__PURE__ */ jsxRuntime.jsx(
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
    /* @__PURE__ */ jsxRuntime.jsx("td", { style: { width: "40px" } })
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
  const groupValues = React3.useMemo(() => computeGroupValues(childRows, months), [childRows, months]);
  const subtract = isSubtractType(group.type);
  const isExpanded = forceExpanded || !group.collapsed;
  const dropBorder = dropIndicator === "above" ? "border-t-2 border-t-blue-400" : dropIndicator === "below" ? "border-b-2 border-b-blue-400" : "";
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "tr",
    {
      className: `border-b border-gray-200 ${subtract ? "bg-red-50/30" : "bg-gray-50/50"} ${isDragging ? "opacity-40" : ""} ${dropBorder} group`,
      onMouseEnter,
      onMouseLeave,
      onDragOver,
      onDragLeave,
      onDrop,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx("td", { className: "pl-1 pr-2 py-1.5 text-gray-700 overflow-hidden", style: { width: "180px" }, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-0.5 min-w-0", children: [
          isHovered && onDragStart && /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              draggable: true,
              onDragStart,
              onDragEnd,
              className: "shrink-0 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500",
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
        months.map((p) => {
          const value = groupValues[p.id] ?? 0;
          const hasValue = value !== 0;
          return /* @__PURE__ */ jsxRuntime.jsx(
            "td",
            {
              className: "px-2 py-1.5 text-right",
              style: { width: "110px", minWidth: "110px", maxWidth: "110px" },
              children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "h-5 flex items-center justify-end", children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: `text-xs tabular-nums font-medium ${subtract ? hasValue ? "text-rose-600" : "text-gray-300" : hasValue ? "text-gray-800" : "text-gray-300"}`, children: hasValue ? formatValue(value) : "\u2014" }) })
            },
            p.id
          );
        }),
        /* @__PURE__ */ jsxRuntime.jsx("td", { style: { width: "40px" }, className: "text-center", children: isHovered && /* @__PURE__ */ jsxRuntime.jsx(
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
var RecycleBin = ({ deletedRows, onRestore }) => {
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
    expanded && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "px-4 pb-3", children: deletedRows.map((row) => /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        className: "flex items-center gap-3 py-1.5 group",
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              onClick: () => onRestore(row.id),
              className: "shrink-0 p-1 rounded text-gray-300 hover:text-emerald-600 hover:bg-emerald-50 transition-colors",
              title: "Restaurar",
              children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Undo2, { size: 13 })
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-xs text-gray-500 truncate min-w-0 flex-1", children: row.label }),
          row.deletionReason && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-xs text-gray-400 italic truncate max-w-[160px]", title: row.deletionReason, children: row.deletionReason }),
          row.deletedAt && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-xs text-gray-300 shrink-0", children: formatDeletedDate(row.deletedAt) })
        ]
      },
      row.id
    )) })
  ] });
};
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
var HeaderSelectionBar = ({ selectedCount, canGroup, monthCount, naming, onNamingChange, onGroup, onDeleteSelected, onCancel }) => {
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
      colSpan: monthCount + 2,
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
var useKeyboard = ({ visibleRowIds, monthCount }) => {
  const [focusedCell, setFocusedCell] = React3.useState(null);
  const [editTrigger, setEditTrigger] = React3.useState(0);
  const isFocused = React3.useCallback((rowId, monthIndex) => {
    return focusedCell?.rowId === rowId && focusedCell?.monthIndex === monthIndex;
  }, [focusedCell]);
  const focus = React3.useCallback((rowId, monthIndex) => {
    setFocusedCell({ rowId, monthIndex });
  }, []);
  const clearFocus = React3.useCallback(() => setFocusedCell(null), []);
  const navigate = React3.useCallback((direction) => {
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
  const navigateAndEdit = React3.useCallback((direction) => {
    navigate(direction);
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
  const [hoveredRow, setHoveredRow] = React3.useState(null);
  const [isCollapsed, setIsCollapsed] = React3.useState(defaultCollapsed);
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
  const isExpanded = forceExpanded || !isCollapsed;
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
      isCellFocused: (mi) => keyboard.isFocused(r.id, mi),
      onCellFocus: (mi) => keyboard.focus(r.id, mi),
      onNavigate: keyboard.navigateAndEdit,
      editTrigger: keyboard.editTrigger,
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
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: `rounded-xl overflow-hidden ${!isExpanded ? "" : "border border-gray-200"}`, children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        role: anySelected ? void 0 : "button",
        onClick: () => !forceExpanded && !anySelected && setIsCollapsed(!isCollapsed),
        className: `w-full ${headerBg} hover:brightness-95 transition-all ${forceExpanded || anySelected ? "cursor-default" : "cursor-pointer"} ${!isExpanded ? "rounded-xl" : "rounded-t-xl"}`,
        children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntime.jsx("table", { className: T.table, style: { tableLayout: "fixed" }, children: /* @__PURE__ */ jsxRuntime.jsx("tbody", { children: /* @__PURE__ */ jsxRuntime.jsx("tr", { children: anySelected ? /* @__PURE__ */ jsxRuntime.jsx(
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
            }
          }
        ) : /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
          /* @__PURE__ */ jsxRuntime.jsx("td", { className: "px-4 py-2.5 text-left", style: { width: "180px" }, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${headerText} ${T.headerTitle}`, children: title }),
            sourceFileIds && sourceFileIds.length > 0 && onViewSource && /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  onViewSource(sourceFileIds);
                },
                className: "p-1 rounded hover:bg-white/50 transition-colors",
                title: "Ver documento fuente",
                children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Eye, { size: 14, className: headerText })
              }
            )
          ] }) }),
          monthsArray.map((p) => {
            const total = calculateTotal(p.id, rows);
            const hasValue = total !== 0;
            return /* @__PURE__ */ jsxRuntime.jsxs("td", { className: "px-2 py-2.5 text-right", style: { width: "110px" }, children: [
              /* @__PURE__ */ jsxRuntime.jsxs("span", { className: `${headerText} ${T.headerStatLabel}`, children: [
                p.label,
                ": "
              ] }),
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${T.headerStat} ${hasValue ? headerText : "text-gray-400"}`, children: hasValue ? formatValue(total) : "\u2014" })
            ] }, p.id);
          }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { className: "px-2 py-2.5 text-right", style: { width: "40px" }, children: !forceExpanded && (isExpanded ? /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronUp, { size: 20, className: headerText }) : /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronDown, { size: 20, className: headerText })) })
        ] }) }) }) }) })
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        className: `bg-white ${!isExpanded ? "hidden print:block" : ""} outline-none`,
        tabIndex: 0,
        onKeyDown: keyboard.handleContainerKeyDown,
        children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntime.jsx("table", { className: T.table, style: { tableLayout: "fixed" }, children: /* @__PURE__ */ jsxRuntime.jsx("tbody", { children: effectiveSections.map((section) => {
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
                onAddRowWithValue: (monthId, value) => addRowWithValue(section.type, monthId, value)
              }
            ),
            effectiveSections.length > 1 && (() => {
              const subtotals = computeSectionSubtotal(rows, section.type, monthsArray);
              const isSubtract = isSubtractType(section.type);
              const label = isSubtract ? "Total descuentos" : "Total haberes";
              return /* @__PURE__ */ jsxRuntime.jsxs("tr", { className: `border-t-2 ${isSubtract ? "border-t-rose-200 bg-red-50/30" : "border-t-emerald-200 bg-emerald-50/30"}`, children: [
                /* @__PURE__ */ jsxRuntime.jsx("td", { className: "pl-4 pr-2 py-2 text-gray-700", style: { width: "180px" }, children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${T.totalLabel} ${isSubtract ? "text-rose-700" : "text-emerald-700"}`, children: label }) }),
                monthsArray.map((p) => {
                  const value = subtotals[p.id] ?? 0;
                  const hasValue = value !== 0;
                  return /* @__PURE__ */ jsxRuntime.jsx("td", { className: "px-2 py-2 text-right", style: { width: "110px" }, children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${T.totalValue} tabular-nums ${isSubtract ? hasValue ? "text-rose-600" : "text-gray-300" : hasValue ? "text-emerald-700" : "text-gray-300"}`, children: hasValue ? formatValue(isSubtract ? -value : value) : "\u2014" }) }, p.id);
                }),
                /* @__PURE__ */ jsxRuntime.jsx("td", { style: { width: "40px" } })
              ] });
            })()
          ] }, section.type);
        }) }) }) })
      }
    ),
    isExpanded && /* @__PURE__ */ jsxRuntime.jsx(recyclebin_default, { deletedRows, onRestore: handleRestore }),
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
  ] });
};
var monthly_default = MonthlyTable;
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
  formatCurrency: formatCurrency4 = defaultFormatCurrency,
  sourceFileIds,
  onViewSource
}) => {
  const [hoveredRow, setHoveredRow] = React3.useState(null);
  const [isCollapsed, setIsCollapsed] = React3.useState(defaultCollapsed);
  const [newEntry, setNewEntry] = React3.useState({ entidad: "", tipo: "" });
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
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "tr",
      {
        className: `border-b border-gray-100 ${hasAtraso ? "bg-red-50/50 hover:bg-red-100/50" : "bg-rose-50/30 hover:bg-rose-100/50"} group`,
        onMouseEnter: () => setHoveredRow(entry.id),
        onMouseLeave: () => setHoveredRow(null),
        children: [
          /* @__PURE__ */ jsxRuntime.jsx("td", { className: `px-2 py-2.5 text-gray-700 ${T.cellLabel}`, style: { width: "180px" }, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                onClick: () => removeEntry(entry.id),
                className: `p-1 rounded transition-all shrink-0 ${isHovered ? "opacity-100 text-red-400 hover:text-red-600 hover:bg-red-100" : "opacity-0"}`,
                title: "Eliminar fila",
                children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.X, { size: 16 })
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
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
            entry.sourceFileId && onViewSource && /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                onClick: () => onViewSource([entry.sourceFileId]),
                className: `p-1 rounded transition-all shrink-0 ${isHovered ? "opacity-100 text-gray-400 hover:text-gray-600 hover:bg-gray-100" : "opacity-0"}`,
                title: "Ver documento fuente",
                children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Eye, { size: 14 })
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { className: "px-2 py-2.5 text-gray-600", style: { width: "100px" }, children: /* @__PURE__ */ jsxRuntime.jsx(
            "input",
            {
              type: "text",
              value: entry.tipo,
              onChange: (e) => updateEntry(entry.id, "tipo", e.target.value),
              className: `w-full ${T.input} pl-1`,
              placeholder: "Tipo"
            }
          ) }),
          /* @__PURE__ */ jsxRuntime.jsx(
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
          /* @__PURE__ */ jsxRuntime.jsx(
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
          hasLatePayments && /* @__PURE__ */ jsxRuntime.jsx("td", { className: "px-3 py-2.5 text-right text-red-600 font-medium", style: { width: "100px" }, children: hasAtraso ? formatCurrency4(
            (entry.atraso_30_59 || 0) + (entry.atraso_60_89 || 0) + (entry.atraso_90_mas || 0)
          ) : "\u2014" }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { style: { width: "40px" } })
        ]
      },
      entry.id
    );
  };
  const renderAddRow = () => {
    return /* @__PURE__ */ jsxRuntime.jsxs("tr", { className: "border-b border-dashed bg-rose-50/20 border-rose-100", children: [
      /* @__PURE__ */ jsxRuntime.jsx("td", { className: "px-4 py-2.5", style: { width: "180px" }, children: /* @__PURE__ */ jsxRuntime.jsx(
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
      /* @__PURE__ */ jsxRuntime.jsx("td", { className: "px-2 py-2.5", style: { width: "100px" }, children: /* @__PURE__ */ jsxRuntime.jsx(
        "input",
        {
          type: "text",
          placeholder: "Tipo",
          value: newEntry.tipo,
          onChange: (e) => setNewEntry((prev) => ({ ...prev, tipo: e.target.value })),
          className: `w-full ${T.inputPlaceholder}`
        }
      ) }),
      /* @__PURE__ */ jsxRuntime.jsx(
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
      /* @__PURE__ */ jsxRuntime.jsx(
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
      hasLatePayments && /* @__PURE__ */ jsxRuntime.jsx("td", { style: { width: "100px" } }),
      /* @__PURE__ */ jsxRuntime.jsx("td", { style: { width: "40px" } })
    ] });
  };
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: `rounded-xl overflow-hidden ${!isExpanded ? "" : "border border-gray-200"}`, children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      "button",
      {
        onClick: () => !forceExpanded && setIsCollapsed(!isCollapsed),
        className: `w-full ${headerBg} hover:brightness-95 transition-all ${forceExpanded ? "cursor-default" : "cursor-pointer"} ${!isExpanded ? "rounded-xl" : "rounded-t-xl"}`,
        children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntime.jsx("table", { className: T.table, style: { tableLayout: "fixed" }, children: /* @__PURE__ */ jsxRuntime.jsx("tbody", { children: /* @__PURE__ */ jsxRuntime.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntime.jsx("td", { className: "px-4 py-3 text-left", style: { width: "180px" }, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${headerText} ${T.headerTitle}`, children: title }),
            sourceFileIds && sourceFileIds.length > 0 && onViewSource && /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  onViewSource(sourceFileIds);
                },
                className: "p-1 rounded hover:bg-white/50 transition-colors",
                title: "Ver documento fuente",
                children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Eye, { size: 14, className: headerText })
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { className: "px-3 py-3 text-right", style: { width: "100px" }, children: /* @__PURE__ */ jsxRuntime.jsxs("span", { className: `${headerText} ${T.headerCount}`, children: [
            entries.length,
            " ",
            entries.length === 1 ? "deuda" : "deudas"
          ] }) }),
          /* @__PURE__ */ jsxRuntime.jsxs("td", { className: "px-3 py-3 text-right", style: { width: "120px" }, children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${headerText} ${T.headerStatLabel}`, children: "Total: " }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${T.headerStat} ${totalDeuda > 0 ? headerText : "text-gray-400"}`, children: totalDeuda > 0 ? formatCurrency4(totalDeuda) : "\u2014" })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("td", { className: "px-3 py-3 text-right", style: { width: "120px" }, children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${headerText} ${T.headerStatLabel}`, children: "Vigente: " }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${T.headerStat} ${totalVigente > 0 ? "text-emerald-600" : "text-gray-400"}`, children: totalVigente > 0 ? formatCurrency4(totalVigente) : "\u2014" })
          ] }),
          hasLatePayments && /* @__PURE__ */ jsxRuntime.jsxs("td", { className: "px-3 py-3 text-right", style: { width: "100px" }, children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: `text-red-600 ${T.headerStatLabel}`, children: "Atraso: " }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${T.headerStat} text-red-600`, children: formatCurrency4(totalAtraso) })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { className: "px-2 py-3 text-right", style: { width: "40px" }, children: !forceExpanded && (isExpanded ? /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronUp, { size: 20, className: headerText }) : /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronDown, { size: 20, className: headerText })) })
        ] }) }) }) })
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: `bg-white ${!isExpanded ? "hidden print:block" : ""}`, children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntime.jsxs("table", { className: T.table, style: { tableLayout: "fixed" }, children: [
      /* @__PURE__ */ jsxRuntime.jsx("thead", { children: /* @__PURE__ */ jsxRuntime.jsxs("tr", { className: "border-b border-gray-200 bg-gray-50/50", children: [
        /* @__PURE__ */ jsxRuntime.jsx("th", { className: `px-4 py-2 text-left ${T.th}`, style: { width: "180px" }, children: "Instituci\xF3n" }),
        /* @__PURE__ */ jsxRuntime.jsx("th", { className: `px-2 py-2 text-left ${T.th}`, style: { width: "100px" }, children: "Tipo" }),
        /* @__PURE__ */ jsxRuntime.jsx("th", { className: `px-3 py-2 text-right ${T.th}`, style: { width: "120px" }, children: "Total Cr\xE9dito" }),
        /* @__PURE__ */ jsxRuntime.jsx("th", { className: `px-3 py-2 text-right ${T.th}`, style: { width: "120px" }, children: "Vigente" }),
        hasLatePayments && /* @__PURE__ */ jsxRuntime.jsx("th", { className: `px-3 py-2 text-right text-red-500 font-medium text-xs uppercase`, style: { width: "100px" }, children: "Atraso" }),
        /* @__PURE__ */ jsxRuntime.jsx("th", { style: { width: "40px" } })
      ] }) }),
      /* @__PURE__ */ jsxRuntime.jsxs("tbody", { children: [
        entries.map((entry) => renderDataRow(entry)),
        renderAddRow()
      ] })
    ] }) }) })
  ] });
};
var debts_default = DebtsTable;
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
  const [isCollapsed, setIsCollapsed] = React3.useState(defaultCollapsed);
  const isExpanded = forceExpanded || !isCollapsed;
  const monthsWithData = months.filter((m) => m.hasData);
  const totalLiquido = totales?.total_liquido ?? monthsWithData.reduce((s, m) => s + (m.liquido || 0), 0);
  const totalBoletas = totales?.boletas_vigentes ?? monthsWithData.reduce((s, m) => s + (m.boletas || 0), 0);
  const promedioMensual = monthsWithData.length > 0 ? totalLiquido / monthsWithData.length : 0;
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: `rounded-xl overflow-hidden ${!isExpanded ? "" : "border border-gray-200"}`, children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      "button",
      {
        onClick: () => !forceExpanded && setIsCollapsed(!isCollapsed),
        className: `w-full ${headerBg} hover:brightness-95 transition-all ${forceExpanded ? "cursor-default" : "cursor-pointer"} ${!isExpanded ? "rounded-xl" : "rounded-t-xl"}`,
        children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${headerText} ${T.headerTitle}`, children: title }),
            sourceFileIds && sourceFileIds.length > 0 && onViewSource && /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  onViewSource(sourceFileIds);
                },
                className: "p-1 rounded hover:bg-white/50 transition-colors",
                title: "Ver documento fuente",
                children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Eye, { size: 14, className: headerText })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-3 text-xs", children: [
              /* @__PURE__ */ jsxRuntime.jsxs("span", { className: headerText, children: [
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${T.headerStatLabel}`, children: "Boletas: " }),
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: T.headerStat, children: totalBoletas })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs("span", { className: headerText, children: [
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${T.headerStatLabel}`, children: "L\xEDquido: " }),
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: T.headerStat, children: formatCurrency(totalLiquido) })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs("span", { className: headerText, children: [
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${T.headerStatLabel}`, children: "Promedio: " }),
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: T.headerStat, children: formatCurrency(Math.round(promedioMensual)) })
              ] })
            ] }),
            !forceExpanded && (isExpanded ? /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronUp, { size: 20, className: headerText }) : /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronDown, { size: 20, className: headerText }))
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: `bg-white ${!isExpanded ? "hidden print:block" : ""}`, children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntime.jsxs("table", { className: T.table, style: { tableLayout: "fixed" }, children: [
      /* @__PURE__ */ jsxRuntime.jsx("thead", { children: /* @__PURE__ */ jsxRuntime.jsxs("tr", { className: "border-b border-gray-200 bg-gray-50/50", children: [
        /* @__PURE__ */ jsxRuntime.jsx("th", { className: `px-4 py-2 text-left ${T.th}`, style: { width: "140px" }, children: "Mes" }),
        /* @__PURE__ */ jsxRuntime.jsx("th", { className: `px-3 py-2 text-center ${T.th}`, style: { width: "80px" }, children: "Boletas" }),
        /* @__PURE__ */ jsxRuntime.jsx("th", { className: `px-3 py-2 text-right ${T.th}`, style: { width: "130px" }, children: "Bruto" }),
        /* @__PURE__ */ jsxRuntime.jsx("th", { className: `px-3 py-2 text-right ${T.th}`, style: { width: "130px" }, children: "Retenci\xF3n" }),
        /* @__PURE__ */ jsxRuntime.jsx("th", { className: `px-4 py-2 text-right ${T.th}`, style: { width: "130px" }, children: "L\xEDquido" })
      ] }) }),
      /* @__PURE__ */ jsxRuntime.jsx("tbody", { children: months.map((m, i) => /* @__PURE__ */ jsxRuntime.jsxs("tr", { className: `border-b border-gray-100 ${m.hasData ? "hover:bg-emerald-50/30" : ""}`, children: [
        /* @__PURE__ */ jsxRuntime.jsx("td", { className: `px-4 py-2.5 font-medium ${T.cellLabel} ${m.hasData ? "text-gray-700" : "text-gray-300"}`, style: { width: "140px" }, children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate block", children: MONTH_LABELS[m.mes] || m.mes }) }),
        /* @__PURE__ */ jsxRuntime.jsx("td", { className: "px-3 py-2.5 text-center text-gray-800", style: { width: "80px" }, children: m.hasData ? m.boletas ?? "" : "" }),
        /* @__PURE__ */ jsxRuntime.jsx("td", { className: "px-3 py-2.5 text-right text-gray-800", style: { width: "130px" }, children: m.hasData ? formatCurrency(m.bruto) : "" }),
        /* @__PURE__ */ jsxRuntime.jsx("td", { className: "px-3 py-2.5 text-right text-red-700", style: { width: "130px" }, children: m.hasData ? formatCurrency(m.retencion) : "" }),
        /* @__PURE__ */ jsxRuntime.jsx("td", { className: "px-4 py-2.5 text-right font-medium text-emerald-700", style: { width: "130px" }, children: m.hasData ? formatCurrency(m.liquido) : "" })
      ] }, i)) }),
      /* @__PURE__ */ jsxRuntime.jsx("tfoot", { children: /* @__PURE__ */ jsxRuntime.jsxs("tr", { className: "border-t-2 border-emerald-200 bg-emerald-50/50", children: [
        /* @__PURE__ */ jsxRuntime.jsx("td", { className: `px-4 py-3 ${T.footerLabel} text-emerald-700`, style: { width: "140px" }, children: "TOTALES" }),
        /* @__PURE__ */ jsxRuntime.jsx("td", { className: `px-3 py-3 text-center ${T.footerValue} text-emerald-700`, style: { width: "80px" }, children: totalBoletas }),
        /* @__PURE__ */ jsxRuntime.jsx("td", { className: `px-3 py-3 text-right ${T.footerValue} text-emerald-700`, style: { width: "130px" }, children: formatCurrency(totales?.honorario_bruto ?? monthsWithData.reduce((s, m) => s + (m.bruto || 0), 0)) }),
        /* @__PURE__ */ jsxRuntime.jsx("td", { className: `px-3 py-3 text-right ${T.footerValue} text-red-700`, style: { width: "130px" }, children: formatCurrency(
          (totales?.retencion_terceros ?? 0) + (totales?.retencion_contribuyente ?? 0) || monthsWithData.reduce((s, m) => s + (m.retencion || 0), 0)
        ) }),
        /* @__PURE__ */ jsxRuntime.jsx("td", { className: `px-4 py-3 text-right ${T.footerValue} text-emerald-700`, style: { width: "130px" }, children: formatCurrency(totalLiquido) })
      ] }) })
    ] }) }) })
  ] });
};
var boletas_default = BoletasTable;
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
  const [isCollapsed, setIsCollapsed] = React3.useState(defaultCollapsed);
  const [hoveredRow, setHoveredRow] = React3.useState(null);
  const isExpanded = forceExpanded || !isCollapsed;
  const balanceEntries = entries.filter((e) => e.source === "balance-anual");
  const carpetaEntries = entries.filter((e) => e.source === "carpeta-tributaria");
  const totalIngresos = balanceEntries.reduce((sum, e) => sum + (e.ingresos || 0), 0);
  const totalEgresos = balanceEntries.reduce((sum, e) => sum + (e.egresos || 0), 0);
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: `rounded-xl overflow-hidden ${!isExpanded ? "" : "border border-gray-200"}`, children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      "button",
      {
        onClick: () => !forceExpanded && setIsCollapsed(!isCollapsed),
        className: `w-full ${headerBg} hover:brightness-95 transition-all ${forceExpanded ? "cursor-default" : "cursor-pointer"} ${!isExpanded ? "rounded-xl" : "rounded-t-xl"}`,
        children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntime.jsx("table", { className: T.table, style: { tableLayout: "fixed" }, children: /* @__PURE__ */ jsxRuntime.jsx("tbody", { children: /* @__PURE__ */ jsxRuntime.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntime.jsx("td", { className: "px-4 py-3 text-left", style: { width: "200px" }, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${headerText} ${T.headerTitle}`, children: title }),
            sourceFileIds && sourceFileIds.length > 0 && onViewSource && /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  onViewSource(sourceFileIds);
                },
                className: "p-1 rounded hover:bg-white/50 transition-colors",
                title: "Ver documento fuente",
                children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Eye, { size: 14, className: headerText })
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { className: "px-3 py-3 text-right", style: { width: "120px" }, children: /* @__PURE__ */ jsxRuntime.jsxs("span", { className: `${headerText} ${T.headerCount}`, children: [
            entries.length,
            " ",
            entries.length === 1 ? "documento" : "documentos"
          ] }) }),
          balanceEntries.length > 0 && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
            /* @__PURE__ */ jsxRuntime.jsxs("td", { className: "px-3 py-3 text-right", style: { width: "140px" }, children: [
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${headerText} ${T.headerStatLabel}`, children: "Ingresos: " }),
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${T.headerStat} ${totalIngresos > 0 ? "text-emerald-600" : "text-gray-400"}`, children: totalIngresos > 0 ? formatCurrency2(totalIngresos) : "\u2014" })
            ] }),
            /* @__PURE__ */ jsxRuntime.jsxs("td", { className: "px-3 py-3 text-right", style: { width: "140px" }, children: [
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${headerText} ${T.headerStatLabel}`, children: "Egresos: " }),
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${T.headerStat} ${totalEgresos > 0 ? headerText : "text-gray-400"}`, children: totalEgresos > 0 ? formatCurrency2(totalEgresos) : "\u2014" })
            ] })
          ] }),
          balanceEntries.length === 0 && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
            /* @__PURE__ */ jsxRuntime.jsx("td", { className: "px-3 py-3 text-right", style: { width: "140px" } }),
            /* @__PURE__ */ jsxRuntime.jsx("td", { className: "px-3 py-3 text-right", style: { width: "140px" } })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { className: "px-2 py-3 text-right", style: { width: "40px" }, children: !forceExpanded && (isExpanded ? /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronUp, { size: 20, className: headerText }) : /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronDown, { size: 20, className: headerText })) })
        ] }) }) }) })
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: `bg-white ${!isExpanded ? "hidden print:block" : ""}`, children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntime.jsxs("table", { className: T.table, style: { tableLayout: "fixed" }, children: [
      /* @__PURE__ */ jsxRuntime.jsx("thead", { children: /* @__PURE__ */ jsxRuntime.jsxs("tr", { className: "border-b border-gray-200 bg-gray-50/50", children: [
        /* @__PURE__ */ jsxRuntime.jsx("th", { className: `px-4 py-2 text-left ${T.th}`, style: { width: "200px" }, children: "Documento" }),
        /* @__PURE__ */ jsxRuntime.jsx("th", { className: `px-2 py-2 text-left ${T.th}`, style: { width: "120px" }, children: "Detalle" }),
        /* @__PURE__ */ jsxRuntime.jsx("th", { className: `px-3 py-2 text-right ${T.th}`, style: { width: "140px" }, children: "Ingresos" }),
        /* @__PURE__ */ jsxRuntime.jsx("th", { className: `px-3 py-2 text-right ${T.th}`, style: { width: "140px" }, children: "Egresos" }),
        /* @__PURE__ */ jsxRuntime.jsx("th", { style: { width: "40px" } })
      ] }) }),
      /* @__PURE__ */ jsxRuntime.jsxs("tbody", { children: [
        balanceEntries.map((entry) => /* @__PURE__ */ jsxRuntime.jsxs(
          "tr",
          {
            className: "border-b border-gray-100 bg-amber-50/30 hover:bg-amber-100/50 group",
            onMouseEnter: () => setHoveredRow(entry.id),
            onMouseLeave: () => setHoveredRow(null),
            children: [
              /* @__PURE__ */ jsxRuntime.jsx("td", { className: `px-4 py-2.5 text-gray-700 ${T.cellLabel}`, style: { width: "200px" }, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-medium text-xs truncate", title: entry.empresa || entry.label, children: entry.empresa || entry.label }),
                entry.sourceFileId && onViewSource && /* @__PURE__ */ jsxRuntime.jsx(
                  "button",
                  {
                    onClick: () => onViewSource([entry.sourceFileId]),
                    className: `p-1 rounded transition-all shrink-0 ${hoveredRow === entry.id ? "opacity-100 text-gray-400 hover:text-gray-600 hover:bg-gray-100" : "opacity-0"}`,
                    title: "Ver documento fuente",
                    children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Eye, { size: 14 })
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxRuntime.jsx("td", { className: `px-2 py-2.5 ${T.muted}`, style: { width: "120px" }, children: entry.year ? `A\xF1o ${entry.year}` : "\u2014" }),
              /* @__PURE__ */ jsxRuntime.jsx("td", { className: "px-3 py-2.5 text-right text-emerald-700 font-medium", style: { width: "140px" }, children: formatCurrency2(entry.ingresos) }),
              /* @__PURE__ */ jsxRuntime.jsx("td", { className: "px-3 py-2.5 text-right text-amber-700 font-medium", style: { width: "140px" }, children: formatCurrency2(entry.egresos) }),
              /* @__PURE__ */ jsxRuntime.jsx("td", { style: { width: "40px" } })
            ]
          },
          entry.id
        )),
        carpetaEntries.map((entry) => /* @__PURE__ */ jsxRuntime.jsxs(
          "tr",
          {
            className: "border-b border-gray-100 bg-amber-50/30 hover:bg-amber-100/50 group",
            onMouseEnter: () => setHoveredRow(entry.id),
            onMouseLeave: () => setHoveredRow(null),
            children: [
              /* @__PURE__ */ jsxRuntime.jsx("td", { className: `px-4 py-2.5 text-gray-700 ${T.cellLabel}`, style: { width: "200px" }, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-medium text-xs truncate", children: "Carpeta Tributaria" }),
                entry.sourceFileId && onViewSource && /* @__PURE__ */ jsxRuntime.jsx(
                  "button",
                  {
                    onClick: () => onViewSource([entry.sourceFileId]),
                    className: `p-1 rounded transition-all shrink-0 ${hoveredRow === entry.id ? "opacity-100 text-gray-400 hover:text-gray-600 hover:bg-gray-100" : "opacity-0"}`,
                    title: "Ver documento fuente",
                    children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Eye, { size: 14 })
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxRuntime.jsx("td", { className: `px-2 py-2.5 ${T.muted}`, colSpan: 3, style: { width: "400px" }, children: entry.actividades && entry.actividades.length > 0 ? entry.actividades.join(", ") : "\u2014" }),
              /* @__PURE__ */ jsxRuntime.jsx("td", { style: { width: "40px" } })
            ]
          },
          entry.id
        )),
        entries.length === 0 && /* @__PURE__ */ jsxRuntime.jsx("tr", { className: "border-b border-gray-100", children: /* @__PURE__ */ jsxRuntime.jsx("td", { className: `px-4 py-3 ${T.empty}`, colSpan: 5, children: "Sin informaci\xF3n tributaria" }) })
      ] })
    ] }) }) })
  ] });
};
var tributario_default = TributarioTable;
var AssetTable = ({
  rows,
  onRowsChange,
  formatCurrency: formatCurrency4,
  placeholder = "Agregar activo...",
  onViewSource
}) => {
  const [hoveredRow, setHoveredRow] = React3.useState(null);
  const [newAssetLabel, setNewAssetLabel] = React3.useState("");
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
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "tr",
      {
        className: "border-b border-gray-100 bg-blue-50/50 hover:bg-blue-100/50 group",
        onMouseEnter: () => setHoveredRow(row.id),
        onMouseLeave: () => setHoveredRow(null),
        children: [
          /* @__PURE__ */ jsxRuntime.jsx("td", { className: `px-2 py-2.5 text-gray-700 ${T.cellLabel}`, style: { width: "200px" }, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                onClick: () => removeRow(row.id),
                className: `p-1 rounded transition-all shrink-0 ${isHovered ? "opacity-100 text-red-400 hover:text-red-600 hover:bg-red-100" : "opacity-0"}`,
                title: "Eliminar fila",
                children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.X, { size: 16 })
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
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
          /* @__PURE__ */ jsxRuntime.jsx("td", { className: "px-2 py-2.5 text-gray-600", style: { width: "200px" }, children: /* @__PURE__ */ jsxRuntime.jsx(
            "input",
            {
              type: "text",
              value: row.description || "",
              onChange: (e) => updateRowDescription(row.id, e.target.value),
              placeholder: "Descripci\xF3n...",
              className: `w-full ${T.input} placeholder-gray-400`
            }
          ) }),
          /* @__PURE__ */ jsxRuntime.jsx(
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
    return /* @__PURE__ */ jsxRuntime.jsxs("tr", { className: "border-b border-dashed bg-blue-50/30 border-blue-100", children: [
      /* @__PURE__ */ jsxRuntime.jsx("td", { className: "px-4 py-2.5", style: { width: "200px" }, children: /* @__PURE__ */ jsxRuntime.jsx(
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
      /* @__PURE__ */ jsxRuntime.jsx("td", { className: "px-2 py-2.5", style: { width: "200px" }, children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: T.empty, children: "\u2014" }) }),
      /* @__PURE__ */ jsxRuntime.jsx(
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
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "rounded-xl overflow-hidden border border-gray-200 bg-white", children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntime.jsxs("table", { className: T.table, style: { tableLayout: "fixed" }, children: [
    /* @__PURE__ */ jsxRuntime.jsx("thead", { className: "sticky top-0 z-10", children: /* @__PURE__ */ jsxRuntime.jsxs("tr", { className: "bg-blue-50 border-b border-blue-100", children: [
      /* @__PURE__ */ jsxRuntime.jsx("th", { className: `px-4 py-2 text-left text-blue-700 font-medium text-xs`, style: { width: "200px" }, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntime.jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntime.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" }) }),
        "Activo"
      ] }) }),
      /* @__PURE__ */ jsxRuntime.jsx("th", { className: `px-3 py-2 text-left font-medium text-blue-600 text-xs`, style: { width: "200px" }, children: "Descripci\xF3n" }),
      /* @__PURE__ */ jsxRuntime.jsx("th", { className: `px-3 py-2 text-right font-medium text-blue-600 text-xs`, style: { width: "140px" }, children: "Valor Estimado" })
    ] }) }),
    /* @__PURE__ */ jsxRuntime.jsxs("tbody", { children: [
      rows.map((row) => renderRow(row)),
      renderAddRow(),
      /* @__PURE__ */ jsxRuntime.jsxs("tr", { className: "border-t-2 border-blue-200 bg-blue-100/50", children: [
        /* @__PURE__ */ jsxRuntime.jsx("td", { className: `px-4 py-3 text-blue-800 ${T.footerLabel}`, style: { width: "200px" }, children: "TOTAL ACTIVOS" }),
        /* @__PURE__ */ jsxRuntime.jsx("td", { className: "px-3 py-3", style: { width: "200px" } }),
        /* @__PURE__ */ jsxRuntime.jsx("td", { className: `px-3 py-3 text-right ${T.footerValue} text-blue-800`, style: { width: "140px" }, children: totalAssets > 0 ? formatCurrency4(totalAssets) : "\u2014" })
      ] })
    ] })
  ] }) }) });
};
var assets_default = AssetTable;
function ReportTable({ columns, items, renderRow, emptyMessage, totalLabel, totalValue, totalBg, totalText }) {
  return /* @__PURE__ */ jsxRuntime.jsxs("table", { className: "w-full text-sm", children: [
    /* @__PURE__ */ jsxRuntime.jsx("thead", { children: /* @__PURE__ */ jsxRuntime.jsx("tr", { className: "bg-gray-50 text-xs", children: columns.map((col, i) => /* @__PURE__ */ jsxRuntime.jsx(
      "th",
      {
        className: `py-2 px-3 font-semibold text-gray-600 ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"}`,
        children: col.label
      },
      i
    )) }) }),
    /* @__PURE__ */ jsxRuntime.jsxs("tbody", { children: [
      items.length > 0 ? items.map(renderRow) : /* @__PURE__ */ jsxRuntime.jsx("tr", { className: "border-b border-gray-100", children: /* @__PURE__ */ jsxRuntime.jsx("td", { colSpan: columns.length, className: "py-3 px-3 text-center text-gray-400 italic", children: emptyMessage }) }),
      /* @__PURE__ */ jsxRuntime.jsxs("tr", { className: totalBg, children: [
        /* @__PURE__ */ jsxRuntime.jsx("td", { colSpan: columns.length - 1, className: `py-2 px-3 font-semibold ${totalText}`, children: totalLabel }),
        /* @__PURE__ */ jsxRuntime.jsx("td", { className: `py-2 px-3 text-right font-bold ${totalText}`, children: totalValue })
      ] })
    ] })
  ] });
}
var reporttable_default = ReportTable;
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
              width: "120px",
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
              width: "120px",
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
              width: "120px",
              className: `text-emerald-700 ${T.cardValue}`,
              asDiv: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "border-t border-emerald-300 pt-2 mt-2 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${T.footerLabel} text-emerald-800 text-xs`, children: "TOTAL" }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: `text-emerald-800 ${T.footerValue}`, children: formatCurrency3(displayTotal > 0 ? displayTotal : null) })
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
              width: "120px",
              className: `text-sky-700 ${T.cardValue}`,
              asDiv: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: T.muted, children: "Deudas" }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: `text-orange-600 ${T.cardValue}`, children: formatCurrency3(totalDebts > 0 ? totalDebts : null) })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "border-t border-sky-300 pt-2 mt-2 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${T.footerLabel} text-sky-800 text-xs`, children: "TOTAL" }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: `text-sky-800 ${T.footerValue}`, children: formatCurrency3(dividendo + totalDebts > 0 ? dividendo + totalDebts : null) })
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

exports.AssetTable = assets_default;
exports.BoletasTable = boletas_default;
exports.DebtsTable = debts_default;
exports.FinalResultsCompact = finalresults_default;
exports.ReportTable = reporttable_default;
exports.TributarioTable = tributario_default;
exports.default = monthly_default;
exports.generateLastNMonths = generateLastNMonths;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map