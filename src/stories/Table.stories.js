// Table.stories.jsx
import React, { useState } from "react";
import { Table } from "../components/Table"; // adjust path if needed

export default {
  title: "Components/Table",
  component: Table,
};

const Template = (args) => {
  const [tableData, setTableData] = useState(args.data);
  const [log, setLog] = useState([]);

  const handleCellValueChange = (rowId, columnId, newValue) => {
    const updatedData = tableData.map((row) =>
      row.id === rowId ? { ...row, [columnId]: newValue } : row
    );
    setTableData(updatedData);
  };

  const handleDataReorder = (newData) => {
    setLog((prev) => [
      ...prev,
      `Reordered at ${new Date().toLocaleTimeString()}`,
    ]);
    setTableData(newData);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Table
        {...args}
        data={tableData}
        onCellValueChange={handleCellValueChange}
        onDataReorder={handleDataReorder}
      />
      <div
        style={{ marginTop: "20px", padding: "10px", background: "#f5f5f5" }}
      >
        <h4>Debug Info:</h4>
        <div>Drag events: {log.length}</div>
        <pre>{JSON.stringify(tableData, null, 2)}</pre>
      </div>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  data: [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Editor" },
  ],
  columns: [
    { id: "name", header: "Name" },
    { id: "email", header: "Email" },
    { id: "role", header: "Role" },
  ],
  styles: {
    headerBgColor: "#f0f0f0",
    rowHoverColor: "#f9f9f9",
    selectedRowColor: "#d1e7ff",
    borderColor: "#d1d5db",
    textColor: "#111827",
    headerTextColor: "#1f2937",
    showRowBorders: true,
    showColumnBorders: true,
    stickyHeader: true,
    stickyFirstColumn: false,
    rowHeight: "default",
  },
  features: {
    inlineEditing: true,
    rowExpansion: true,
    multiSelect: true,
    draggableRows: true,
    draggableColumns: true,
    saveState: true,
    liveSearch: true,
  },
  renderExpandedRow: (row) => (
    <div>
      <p>
        <strong>More about:</strong> {row.name}
      </p>
      <p>Email: {row.email}</p>
      <p>Role: {row.role}</p>
    </div>
  ),
  stateId: "storybook-table-state",
  searchDebounceTime: 300,
};
