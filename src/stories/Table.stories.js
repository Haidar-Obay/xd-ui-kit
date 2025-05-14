import React from "react";
import { Table } from "../components/Table";

export default {
  title: "Components/Table",
  component: Table,
};

const Template = (args) => <Table {...args} />;

// Sample Data
  const data = [
    { id: 1, name: "John Doe", age: 30, isActive: true, joinDate: "2022-01-15" },
    { id: 2, name: "Jane Smith", age: 25, isActive: false, joinDate: "2021-07-12" },
    { id: 3, name: "Sam Johnson", age: 35, isActive: true, joinDate: "2023-04-23" },
    { id: 4, name: "Emma Brown", age: 28, isActive: true, joinDate: "2022-06-30" },
    { id: 5, name: "Michael Scott", age: 45, isActive: false, joinDate: "2020-04-18" },
    { id: 6, name: "Dwight Schrute", age: 40, isActive: true, joinDate: "2019-12-21" },
    { id: 7, name: "Pam Beesly", age: 32, isActive: false, joinDate: "2018-05-10" },
    { id: 8, name: "Jim Halpert", age: 31, isActive: true, joinDate: "2017-03-19" },
    { id: 9, name: "Stanley Hudson", age: 55, isActive: false, joinDate: "2016-08-14" },
    { id: 10, name: "Angela Martin", age: 29, isActive: true, joinDate: "2021-11-05" },
    { id: 11, name: "Kevin Malone", age: 34, isActive: false, joinDate: "2021-09-22" },
    { id: 12, name: "Oscar Martinez", age: 37, isActive: true, joinDate: "2023-02-15" },
    { id: 13, name: "Andy Bernard", age: 33, isActive: true, joinDate: "2020-07-01" },
    { id: 14, name: "Erin Hannon", age: 26, isActive: true, joinDate: "2021-03-11" },
    { id: 15, name: "Toby Flenderson", age: 41, isActive: false, joinDate: "2019-10-30" },
    { id: 16, name: "Meredith Palmer", age: 50, isActive: false, joinDate: "2015-06-18" },
    { id: 17, name: "Ryan Howard", age: 27, isActive: true, joinDate: "2022-12-01" },
    { id: 18, name: "Kelly Kapoor", age: 29, isActive: false, joinDate: "2020-09-07" },
    { id: 19, name: "Phyllis Vance", age: 52, isActive: true, joinDate: "2018-04-13" },
    { id: 20, name: "Creed Bratton", age: 65, isActive: false, joinDate: "2016-10-08" }
  ];
  

const columns = [
  { key: "id", header: "ID", type: "number" },
  { key: "name", header: "Name", type: "text" },
  { key: "age", header: "Age", type: "number" },
  { key: "isActive", header: "Active", type: "boolean" },
  { key: "joinDate", header: "Join Date", type: "date" },
];

export const Default = Template.bind({});
Default.args = {
  data,
  columns,
  onEdit: (row) => alert(`Editing row: ${JSON.stringify(row)}`),
  onDelete: (row) => alert(`Deleting row: ${JSON.stringify(row)}`),
};
