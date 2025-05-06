import React, { useState } from "react";
import { Table } from "../components/Table"; // Adjust path if needed

export default {
  title: "Components/Table",
  component: Table,
};

const Template = (args) => {
  const [data, setData] = useState(args.data);

  const handleCellValueChange = (rowId, columnId, newValue) => {
    setData((prevData) =>
      prevData.map((row) =>
        row.id === rowId ? { ...row, [columnId]: newValue } : row
      )
    );
  };

  const handleRowClick = (row, action) => {
    if (action === "edit") {
      console.log("Edit clicked:", row);
    } else if (action === "delete") {
      const confirmed = window.confirm(
        `Are you sure you want to delete ${row.name}?`
      );
      if (confirmed) {
        console.log("Confirmed delete:", row);
        setData((prev) => prev.filter((r) => r.id !== row.id));
      }
    } else {
      console.log("Row clicked:", row);
    }
  };

  const renderExpandedRow = (row) => (
    <div>
      <p>
        <strong>More Details:</strong> {row.details}
      </p>
    </div>
  );

  return (
    <Table
      {...args}
      data={data}
      onCellValueChange={handleCellValueChange}
      onRowClick={handleRowClick}
      renderExpandedRow={renderExpandedRow}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  data: [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      details: "Manages everything.",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "User",
      details: "Regular user access.",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "Editor",
      details: "Content editor.",
    },
  ],
  columns: [
    { id: "name", header: "Name" },
    { id: "email", header: "Email" },
    { id: "role", header: "Role" },
  ],
  styles: {
    headerBgColor: "#f9fafb",
    rowHoverColor: "#f3f4f6",
    selectedRowColor: "#eff6ff",
    borderColor: "#e5e7eb",
    textColor: "#374151",
    headerTextColor: "#111827",
    showRowBorders: true,
    showColumnBorders: true,
    stickyHeader: true,
    stickyFirstColumn: true,
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
  stateId: "storybook-table-example",
  searchDebounceTime: 300,
};
