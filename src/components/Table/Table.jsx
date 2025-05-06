import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  Filter,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";
import _ from "lodash";

// Enhanced Data Table Component with advanced features
export const Table = ({
  data: initialData = [],
  columns: initialColumns = [],
  onRowClick = null,
  onCellValueChange = null,
  // Dynamic styling options
  styles = {
    headerBgColor: "#f9fafb",
    rowHoverColor: "#f3f4f6",
    selectedRowColor: "#eff6ff",
    borderColor: "#e5e7eb",
    textColor: "#374151",
    headerTextColor: "#111827",
    showRowBorders: true,
    showColumnBorders: true,
    stickyHeader: true,
    stickyFirstColumn: false,
    rowHeight: "default", // 'compact', 'default', 'relaxed'
  },
  // Feature flags
  features = {
    inlineEditing: true,
    rowExpansion: true,
    multiSelect: true,
    draggableRows: true,
    draggableColumns: true,
    saveState: true,
    liveSearch: true,
  },
  // Table state identifier for localStorage
  stateId = "data-table-state",
  // Row expansion render function
  renderExpandedRow = null,
  // Custom cell renderer functions
  cellRenderers = {},
  searchDebounceTime = 300,
}) => {
  // State management
  const [data, setData] = useState(initialData);
  const [columns, setColumns] = useState(initialColumns);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [columnOrder, setColumnOrder] = useState([]);
  const [filters, setFilters] = useState({});
  const [globalSearch, setGlobalSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [selectedRows, setSelectedRows] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [editingCell, setEditingCell] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [activeColumnSearch, setActiveColumnSearch] = useState(null);

  const filterRef = useRef(null);
  const tableRef = useRef(null);
  const headerRef = useRef(null);
  const firstColRef = useRef(null);
  const editCellInputRef = useRef(null);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const dragColumnItem = useRef(null);
  const dragOverColumnItem = useRef(null);
  const columnSearchRef = useRef(null);

  // Setup column order and visibility on init and when columns change
  useEffect(() => {
    if (columns.length > 0) {
      // Set initial column order if not already set
      if (columnOrder.length === 0) {
        setColumnOrder(columns.map((col) => col.id));
      }

      // Set initial visible columns if not already set
      if (visibleColumns.length === 0) {
        setVisibleColumns(columns.map((col) => col.id));
      }
    }
  }, [columns]);

  // Load saved state from localStorage
  useEffect(() => {
    if (features.saveState) {
      const savedState = localStorage.getItem(stateId);
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          if (parsedState.visibleColumns)
            setVisibleColumns(parsedState.visibleColumns);
          if (parsedState.columnOrder) setColumnOrder(parsedState.columnOrder);
          if (parsedState.sortConfig) setSortConfig(parsedState.sortConfig);
          if (parsedState.recentSearches)
            setRecentSearches(parsedState.recentSearches);
        } catch (e) {
          console.error("Error parsing saved table state", e);
        }
      }
    }
  }, [features.saveState, stateId]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (features.saveState) {
      const stateToSave = {
        visibleColumns,
        columnOrder,
        sortConfig,
        recentSearches,
      };
      localStorage.setItem(stateId, JSON.stringify(stateToSave));
    }
  }, [
    visibleColumns,
    columnOrder,
    sortConfig,
    recentSearches,
    features.saveState,
    stateId,
  ]);

  // Set up sticky header and first column behavior
  useEffect(() => {
    const applySticky = () => {
      if (!tableRef.current) return;

      if (styles.stickyHeader && headerRef.current) {
        const header = headerRef.current;
        header.style.position = "sticky";
        header.style.top = "0";
        header.style.zIndex = "10";
        header.style.backgroundColor = styles.headerBgColor;
      }

      if (styles.stickyFirstColumn && firstColRef.current) {
        const firstCol = firstColRef.current;
        const firstColCells = tableRef.current.querySelectorAll(".first-col");
        firstColCells.forEach((cell) => {
          cell.style.position = "sticky";
          cell.style.left = "0";
          cell.style.zIndex = "5";
          cell.style.backgroundColor = "inherit";
        });
      }
    };

    applySticky();
  }, [styles.stickyHeader, styles.stickyFirstColumn]);

  // Handle outside clicks to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }

      if (
        columnSearchRef.current &&
        !columnSearchRef.current.contains(event.target)
      ) {
        setActiveColumnSearch(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus the input when editing a cell
  useEffect(() => {
    if (editingCell && editCellInputRef.current) {
      editCellInputRef.current.focus();
    }
  }, [editingCell]);

  // Debounce search input
  useEffect(() => {
    if (!features.liveSearch) {
      setDebouncedSearch(globalSearch);
      return;
    }

    const handler = setTimeout(() => {
      setDebouncedSearch(globalSearch);

      // Save to recent searches if not empty and not already in list
      if (globalSearch && globalSearch.trim() !== "") {
        setRecentSearches((prev) => {
          const newSearches = [
            globalSearch,
            ...prev.filter((s) => s !== globalSearch),
          ].slice(0, 5);
          return newSearches;
        });
      }
    }, searchDebounceTime);

    return () => {
      clearTimeout(handler);
    };
  }, [globalSearch, searchDebounceTime, features.liveSearch]);

  // Sort function
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Filter function
  const handleFilterChange = (columnId, value) => {
    setFilters((prev) => ({
      ...prev,
      [columnId]: value,
    }));
  };

  // Toggle column search functionality
  const toggleColumnSearch = (columnId, e) => {
    e.stopPropagation(); // Prevent sorting when clicking on search

    if (activeColumnSearch === columnId) {
      setActiveColumnSearch(null);
    } else {
      setActiveColumnSearch(columnId);
    }
  };

  // Column visibility toggle
  const toggleColumnVisibility = (columnId) => {
    setVisibleColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    );
  };

  // Select all rows
  const toggleSelectAll = () => {
    if (selectedRows.length === filteredData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredData.map((row) => row.id));
    }
  };

  // Select individual row
  const toggleRowSelection = (e, rowId) => {
    e.stopPropagation();
    setSelectedRows((prev) =>
      prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId]
    );
  };

  // Toggle row expansion
  const toggleRowExpansion = (rowId) => {
    setExpandedRows((prev) =>
      prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId]
    );
  };

  // Handle double click to edit cell
  const handleCellDoubleClick = (rowId, columnId, currentValue) => {
    if (!features.inlineEditing) return;
    if (!onCellValueChange) return;

    const column = columns.find((col) => col.id === columnId);
    if (column && column.editable === false) return;

    setEditingCell({ rowId, columnId, value: currentValue });
  };

  // Handle cell edit complete
  const handleCellEditComplete = (e) => {
    if (!editingCell) return;

    const { rowId, columnId, value } = editingCell;
    const newValue = e.target.value;

    if (newValue !== value) {
      // Call parent handler
      if (onCellValueChange) {
        onCellValueChange(rowId, columnId, newValue);
      }

      // Update local data
      setData((prevData) =>
        prevData.map((row) =>
          row.id === rowId ? { ...row, [columnId]: newValue } : row
        )
      );
    }

    setEditingCell(null);
  };

  // Handle dragging rows - FIXED VERSION
  const handleRowDragStart = (e, rowId) => {
    if (!features.draggableRows) return;
    dragItem.current = rowId;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleRowDragOver = (e, rowId) => {
    if (!features.draggableRows) return;
    e.preventDefault();
    dragOverItem.current = rowId;
  };

  const handleRowDragEnd = () => {
    if (
      !features.draggableRows ||
      dragItem.current === null ||
      dragOverItem.current === null
    )
      return;

    // Get the actual row objects from the data array
    const sourceRow = data.find((row) => row.id === dragItem.current);
    const targetRow = data.find((row) => row.id === dragOverItem.current);

    if (!sourceRow || !targetRow) return;

    // Get source and target indices from the data array
    const sourceIndex = data.findIndex((row) => row.id === dragItem.current);
    const targetIndex = data.findIndex(
      (row) => row.id === dragOverItem.current
    );

    // Create a new data array with the moved item
    const newData = [...data];
    newData.splice(sourceIndex, 1);
    newData.splice(targetIndex, 0, sourceRow);

    setData(newData);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  // Handle dragging columns
  const handleColumnDragStart = (e, index) => {
    if (!features.draggableColumns) return;
    dragColumnItem.current = index;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleColumnDragOver = (e, index) => {
    if (!features.draggableColumns) return;
    e.preventDefault();
    dragOverColumnItem.current = index;
  };

  const handleColumnDragEnd = () => {
    if (
      !features.draggableColumns ||
      dragColumnItem.current === null ||
      dragOverColumnItem.current === null
    )
      return;

    const newOrder = [...columnOrder];
    const itemToMove = newOrder[dragColumnItem.current];
    newOrder.splice(dragColumnItem.current, 1);
    newOrder.splice(dragOverColumnItem.current, 0, itemToMove);

    setColumnOrder(newOrder);
    dragColumnItem.current = null;
    dragOverColumnItem.current = null;
  };

  // Apply filters, sorting, and global search
  const filteredData = useMemo(() => {
    let result = [...data]; // Changed from initialData to data to reflect local state

    // Apply column filters
    Object.entries(filters).forEach(([columnId, filterValue]) => {
      if (filterValue && filterValue.length > 0) {
        result = result.filter((row) => {
          const cellValue = String(row[columnId] || "").toLowerCase();
          return cellValue.includes(filterValue.toLowerCase());
        });
      }
    });

    // Apply global search
    if (debouncedSearch) {
      const searchTerm = debouncedSearch.toLowerCase();
      result = result.filter((row) => {
        return visibleColumns.some((columnId) => {
          const column = columns.find((col) => col.id === columnId);
          if (!column) return false;
          const cellValue = String(row[columnId] || "").toLowerCase();
          return cellValue.includes(searchTerm);
        });
      });
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [data, filters, debouncedSearch, sortConfig, visibleColumns, columns]);

  // Row height class
  const getRowHeightClass = () => {
    switch (styles.rowHeight) {
      case "compact":
        return "py-1";
      case "relaxed":
        return "py-4";
      default:
        return "py-2";
    }
  };

  // Dynamic border styles
  const getBorderStyle = () => {
    return {
      borderColor: styles.borderColor,
      borderStyle: "solid",
      borderWidth: "0",
      ...(styles.showColumnBorders ? { borderRightWidth: "1px" } : {}),
      ...(styles.showRowBorders ? { borderBottomWidth: "1px" } : {}),
    };
  };

  // Render cell value with custom renderer if provided
  const renderCellValue = (row, columnId) => {
    const value = row[columnId];
    const customRenderer = cellRenderers[columnId];

    if (customRenderer) {
      return customRenderer(value, row);
    }

    return value;
  };

  // Empty state
  // if (filteredData.length === 0) {
  //   return (
  //     <div
  //       className="w-full border rounded p-8"
  //       style={{ borderColor: styles.borderColor }}
  //     >
  //       <div className="flex flex-col items-center justify-center">
  //         <div className="bg-gray-100 p-6 rounded-full mb-4">
  //           <Filter size={32} className="text-gray-400" />
  //         </div>
  //         <h3
  //           className="text-lg font-medium mb-2"
  //           style={{ color: styles.headerTextColor }}
  //         >
  //           No data found
  //         </h3>
  //         <p className="text-gray-500 text-center mb-4">
  //           {debouncedSearch || Object.values(filters).some(Boolean)
  //             ? "Your search or filter criteria didn't match any records. Try adjusting your filters."
  //             : "There are no records to display yet."}
  //         </p>
  //         {(debouncedSearch || Object.values(filters).some(Boolean)) && (
  //           <button
  //             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
  //             onClick={() => {
  //               setGlobalSearch("");
  //               setDebouncedSearch("");
  //               setFilters({});
  //             }}
  //           >
  //             Clear all filters
  //           </button>
  //         )}
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div
      className="w-full border rounded"
      style={{ borderColor: styles.borderColor, color: styles.textColor }}
      ref={tableRef}
    >
      {/* Toolbar */}
      <div
        className="flex flex-wrap items-center justify-between p-4 border-b"
        style={{ borderColor: styles.borderColor }}
      >
        <div className="flex items-center space-x-2 mb-2 sm:mb-0">
          {/* Global search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search all columns..."
              className="pl-10 pr-4 py-2 border rounded w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ borderColor: styles.borderColor }}
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              list="recent-searches"
            />
            {recentSearches.length > 0 && (
              <datalist id="recent-searches">
                {recentSearches.map((search, index) => (
                  <option key={index} value={search} />
                ))}
              </datalist>
            )}
          </div>

          {/* Filter button */}
          <div className="relative" ref={filterRef}>
            <button
              className="flex items-center px-3 py-2 border rounded hover:bg-gray-50"
              style={{ borderColor: styles.borderColor }}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter size={16} className="mr-2" />
              Filters
              {Object.values(filters).some(Boolean) && (
                <span className="ml-2 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {Object.values(filters).filter(Boolean).length}
                </span>
              )}
            </button>

            {isFilterOpen && (
              <div
                className="absolute left-0 mt-2 w-64 bg-white border rounded shadow-lg z-10"
                style={{ borderColor: styles.borderColor }}
              >
                <div
                  className="p-3 border-b font-medium"
                  style={{ borderColor: styles.borderColor }}
                >
                  Column Filters
                </div>
                <div className="max-h-96 overflow-y-auto p-2">
                  {columns.map((column) => (
                    <div key={column.id} className="mb-3">
                      <label className="block text-sm font-medium mb-1">
                        {column.header}
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        style={{ borderColor: styles.borderColor }}
                        placeholder={`Filter ${column.header.toLowerCase()}...`}
                        value={filters[column.id] || ""}
                        onChange={(e) =>
                          handleFilterChange(column.id, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
                <div
                  className="p-2 border-t"
                  style={{ borderColor: styles.borderColor }}
                >
                  <button
                    className="w-full py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                    onClick={() => setFilters({})}
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr
              style={{
                backgroundColor: styles.headerBgColor,
                color: styles.headerTextColor,
              }}
              ref={headerRef}
            >
              {/* Select all checkbox */}
              {features.multiSelect && (
                <th
                  className="p-3 text-left first-col"
                  style={getBorderStyle()}
                >
                  <div className="flex items-center">
                    <button onClick={toggleSelectAll} className="mr-2">
                      {selectedRows.length === filteredData.length &&
                      filteredData.length > 0 ? (
                        <CheckSquare size={18} className="text-blue-500" />
                      ) : (
                        <Square size={18} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </th>
              )}

              {/* Expansion column */}
              {features.rowExpansion && renderExpandedRow && (
                <th
                  className="w-10 p-3 text-left"
                  style={getBorderStyle()}
                ></th>
              )}

              {/* Column headers based on column order */}
              {columnOrder
                .filter((columnId) => visibleColumns.includes(columnId))
                .map((columnId, index) => {
                  const column = columns.find((col) => col.id === columnId);
                  if (!column) return null;

                  return (
                    <th
                      key={column.id}
                      className={`p-3 text-left ${
                        index === 0 &&
                        !features.multiSelect &&
                        !features.rowExpansion
                          ? "first-col"
                          : ""
                      }`}
                      style={getBorderStyle()}
                      draggable={features.draggableColumns}
                      onDragStart={(e) => handleColumnDragStart(e, index)}
                      onDragOver={(e) => handleColumnDragOver(e, index)}
                      onDragEnd={handleColumnDragEnd}
                    >
                      <div className="relative">
                        <div
                          className="flex items-center cursor-pointer group"
                          onClick={() => requestSort(column.id)}
                        >
                          {column.header}
                          {sortConfig.key === column.id ? (
                            <ChevronDown
                              size={16}
                              className={`ml-1 ${
                                sortConfig.direction === "desc"
                                  ? "transform rotate-180"
                                  : ""
                              }`}
                            />
                          ) : (
                            <ChevronDown
                              size={16}
                              className="ml-1 opacity-0 group-hover:opacity-50"
                            />
                          )}

                          {/* Column search icon */}
                          <button
                            className="ml-2 text-gray-400 hover:text-gray-700"
                            onClick={(e) => toggleColumnSearch(column.id, e)}
                          >
                            <Search size={14} />
                          </button>
                        </div>

                        {/* Column search input */}
                        {activeColumnSearch === column.id && (
                          <div
                            className="absolute left-0 right-0 mt-1 p-2 bg-white border rounded shadow-lg z-20"
                            style={{
                              borderColor: styles.borderColor,
                              minWidth: "150px",
                            }}
                            ref={columnSearchRef}
                          >
                            <div className="flex items-center mb-1">
                              <span className="text-xs font-medium">
                                Search {column.header}
                              </span>
                              <button
                                className="ml-auto text-gray-400 hover:text-gray-700"
                                onClick={() => setActiveColumnSearch(null)}
                              >
                                <X size={14} />
                              </button>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="text"
                                className="w-full p-1 text-sm border rounded"
                                style={{ borderColor: styles.borderColor }}
                                placeholder={`Search...`}
                                value={filters[column.id] || ""}
                                onChange={(e) =>
                                  handleFilterChange(column.id, e.target.value)
                                }
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                              />
                              {filters[column.id] && (
                                <button
                                  className="ml-1 text-gray-400 hover:text-gray-700"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleFilterChange(column.id, "");
                                  }}
                                >
                                  <X size={14} />
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </th>
                  );
                })}
              <th className="p-3 text-left" style={getBorderStyle()}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    visibleColumns.length +
                    (features.multiSelect ? 1 : 0) +
                    (features.rowExpansion && renderExpandedRow ? 1 : 0) +
                    1 // for actions column
                  }
                  className="text-center py-4 text-gray-500"
                >
                  No matching records found.
                </td>
              </tr>
            ) : (
              filteredData.map((row) => {
                const isExpanded = expandedRows.includes(row.id);
                const isSelected = selectedRows.includes(row.id);

                return (
                  <React.Fragment key={row.id}>
                    <tr
                      className={`hover:bg-gray-50`}
                      style={{
                        backgroundColor: isSelected
                          ? styles.selectedRowColor
                          : "inherit",
                        ":hover": { backgroundColor: styles.rowHoverColor },
                      }}
                      draggable={features.draggableRows}
                      onDragStart={(e) => handleRowDragStart(e, row.id)}
                      onDragOver={(e) => handleRowDragOver(e, row.id)}
                      onDragEnd={handleRowDragEnd}
                    >
                      {/* Row selection checkbox */}
                      {features.multiSelect && (
                        <td
                          className={`${getRowHeightClass()} p-3 first-col`}
                          style={getBorderStyle()}
                        >
                          <button
                            onClick={(e) => toggleRowSelection(e, row.id)}
                          >
                            {isSelected ? (
                              <CheckSquare
                                size={18}
                                className="text-blue-500"
                              />
                            ) : (
                              <Square size={18} className="text-gray-400" />
                            )}
                          </button>
                        </td>
                      )}

                      {/* Expansion control */}
                      {features.rowExpansion && renderExpandedRow && (
                        <td
                          className={`${getRowHeightClass()} w-10 p-3`}
                          style={getBorderStyle()}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRowExpansion(row.id);
                          }}
                        >
                          {isExpanded ? (
                            <ChevronDown size={18} className="text-gray-500" />
                          ) : (
                            <ChevronRight size={18} className="text-gray-500" />
                          )}
                        </td>
                      )}

                      {/* Data cells */}
                      {columnOrder
                        .filter((columnId) => visibleColumns.includes(columnId))
                        .map((columnId, index) => {
                          const isEditing =
                            editingCell &&
                            editingCell.rowId === row.id &&
                            editingCell.columnId === columnId;

                          return (
                            <td
                              key={`${row.id}-${columnId}`}
                              className={`${getRowHeightClass()} p-3 ${
                                index === 0 &&
                                !features.multiSelect &&
                                !features.rowExpansion
                                  ? "first-col"
                                  : ""
                              }`}
                              style={getBorderStyle()}
                              onDoubleClick={() =>
                                handleCellDoubleClick(
                                  row.id,
                                  columnId,
                                  row[columnId]
                                )
                              }
                            >
                              {isEditing ? (
                                <input
                                  type="text"
                                  className="w-full p-1 border rounded"
                                  style={{ borderColor: styles.borderColor }}
                                  defaultValue={editingCell.value}
                                  ref={editCellInputRef}
                                  onBlur={handleCellEditComplete}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      handleCellEditComplete(e);
                                    } else if (e.key === "Escape") {
                                      setEditingCell(null);
                                    }
                                  }}
                                />
                              ) : (
                                renderCellValue(row, columnId)
                              )}
                            </td>
                          );
                        })}

                      <td
                        className={`${getRowHeightClass()} p-3`}
                        style={getBorderStyle()}
                      >
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-600 hover:underline"
                            onClick={() => onRowClick?.(row, "edit")}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 hover:underline"
                            onClick={() => onRowClick?.(row, "delete")}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded row content */}
                    {isExpanded &&
                      features.rowExpansion &&
                      renderExpandedRow && (
                        <tr>
                          <td
                            colSpan={
                              visibleColumns.length +
                              (features.multiSelect ? 1 : 0) +
                              1 +
                              1
                            }
                            className="p-0"
                            style={getBorderStyle()}
                          >
                            <div
                              className="p-4 bg-gray-50"
                              style={{ borderColor: styles.borderColor }}
                            >
                              {renderExpandedRow(row)}
                            </div>
                          </td>
                        </tr>
                      )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table footer with indicators */}
      {Object.values(filters).some(Boolean) && (
        <div
          className="p-3 bg-gray-50 border-t text-sm"
          style={{ borderColor: styles.borderColor }}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium">Active filters:</span>
            {Object.entries(filters)
              .filter(([_, value]) => value && value.length > 0)
              .map(([columnId, value]) => {
                const column = columns.find((col) => col.id === columnId);
                return (
                  <div
                    key={columnId}
                    className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded"
                  >
                    <span>
                      {column?.header || columnId}: {value}
                    </span>
                    <button
                      className="ml-1 text-blue-600 hover:text-blue-800"
                      onClick={() => handleFilterChange(columnId, "")}
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
            <button
              className="text-red-600 hover:text-red-800 ml-auto"
              onClick={() => setFilters({})}
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
