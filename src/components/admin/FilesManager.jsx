import React, { useRef, useState, useEffect } from "react";
import { ProTable } from "@ant-design/pro-components";
import { Button, Tag, Space, message, Popconfirm, Input } from "antd";
import {
  PlusOutlined,
  DownloadOutlined,
  DeleteOutlined,
  FileOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import AddUserModal from "./modals/AddUserModal";
import EditUserModal from "./modals/EditUserModal";
import { deleteFile, downloadFile, getAllFiles } from "../../service/fileAPI";
import { toast } from "react-toastify";

const FilesManager = () => {
  const actionRef = useRef();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]); // 🔍 Danh sách sau khi lọc
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // 🔹 Gọi API lấy danh sách file
  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await getAllFiles();
      if (res) {
        setFiles(res || []);
        setFilteredFiles(res || []);
      }
    } catch (err) {
      message.error("Không thể tải danh sách file!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // 🔎 Hàm xử lý tìm kiếm
  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = files.filter(
      (file) =>
        file.name.toLowerCase().includes(value.toLowerCase()) ||
        file.type.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredFiles(filtered);
  };

  const handleDownload = async (record) => {
    try {
      let res = await downloadFile(record.id, record.name);
      if (res) {
        toast.success(`Đã tải xuống: ${record.name}`);
      }
    } catch {
      message.error("Không thể tải file xuống!");
    }
  };

  const getStatusColor = (status) =>
    status === "available" ? "green" : "orange";

  const getStatusText = (status) =>
    status === "available" ? "Sẵn sàng" : "Lưu trữ";

  const columns = [
    {
      title: "Tên file",
      dataIndex: "name",
      key: "name",
      width: 250,
      render: (text) => (
        <span>
          <FileOutlined style={{ marginRight: 8 }} />
          {text}
        </span>
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 100,
    },
    {
      title: "Dung lượng",
      dataIndex: "size",
      key: "size",
      width: 120,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: "Ngày tải lên",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<DownloadOutlined />}
            size="small"
            onClick={() => handleDownload(record)}
          >
            Tải xuống
          </Button>

          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa mục này không?"
            okText="Có"
            cancelText="Không"
            onConfirm={() => handleDelete(record)}
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = () => setAddModalVisible(true);

  const handleDelete = async (record) => {
    try {
      let res = await deleteFile(record.id);
      if (res) {
        toast.success("Xóa file thành công");
        fetchFiles();
      }
    } catch {
      message.error("Xóa thất bại!");
    }
  };

  const handleModalClose = () => {
    setAddModalVisible(false);
    setDeleteModalVisible(false);
    setSelectedFile(null);
  };

  const handleSuccess = () => {
    handleModalClose();
    fetchFiles();
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>
          Quản lý file
        </h2>
        <p style={{ margin: "8px 0 0 0", color: "#666" }}>
          Quản lý file tải lên và trạng thái file trong hệ thống
        </p>
      </div>

      <ProTable
        actionRef={actionRef}
        columns={columns}
        dataSource={filteredFiles} // 🔍 hiển thị danh sách đã lọc
        loading={loading}
        rowKey="id"
        search={false} // Tắt search mặc định
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        headerTitle="Danh sách file"
        toolBarRender={() => [
          <Input
            key="search"
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm file theo tên hoặc loại..."
            allowClear
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 300 }}
          />,
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Thêm file
          </Button>,
        ]}
        scroll={{ x: 1000 }}
        size="middle"
      />

      <AddUserModal
        visible={addModalVisible}
        onCancel={handleModalClose}
        onSuccess={handleSuccess}
      />
      <EditUserModal
        visible={deleteModalVisible}
        onCancel={handleModalClose}
        onConfirm={handleSuccess}
        fileData={selectedFile}
      />
    </div>
  );
};

export default FilesManager;
