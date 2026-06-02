import React, { useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Popconfirm, Table } from "antd";
import Highlighter from "react-highlight-words";
import { NavLink } from "react-router";

const BasicTable = ({
  page,
  filteredData,
  headers,
  onDelete,
  onEdit,
  noView = false,
}) => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button type="link" size="small" onClick={() => close()}>
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) setTimeout(() => searchInput.current?.select(), 100);
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  // build columns from headers prop
  const columns = [
    ...headers.map(([key, label]) => ({
      title: label,
      dataIndex: key,
      key,
      ...getColumnSearchProps(key),
    })),
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space>
          {onEdit ? (
            <Button
              size="small"
              type="default"
              style={{ color: "#60a5fa", borderColor: "#60a5fa" }}
              onClick={() => onEdit(record._id)}
            >
              Edit
            </Button>
          ) : (
            <NavLink to={`/${page}/edit/${record._id}`}>
              <Button
                size="small"
                type="default"
                style={{ color: "#60a5fa", borderColor: "#60a5fa" }}
              >
                Edit
              </Button>
            </NavLink>
          )}
          <Popconfirm
            title="Delete this category?"
            description="Children will also be removed."
            onConfirm={() => onDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" danger>
              Delete
            </Button>
          </Popconfirm>
          {!noView && (
            <NavLink to={`/${page}/view/${record._id}`}>
              <Button size="small" type="default">
                View
              </Button>
            </NavLink>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={filteredData}
      rowKey="_id"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: [5, 10, 25],
      }}
      bordered
    />
  );
};

export default BasicTable;
