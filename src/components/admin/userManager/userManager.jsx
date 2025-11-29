import React, { useState, useMemo, useEffect } from "react";
import { ProTable } from "@ant-design/pro-components";
import { Button, Tag, Space, message, Popconfirm, Input } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import { userlist, deleteUser } from "../../../service/UserApi";
import { toast } from "react-toastify";

const UserManager = () => {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dataUser, setDataUser] = useState();
  const [searchText, setSearchText] = useState("");

  const fechData = async () => {
    let res = await userlist();
    if (res && res.data) {
      setDataUser(res.data);
    }
  };
  useEffect(() => {
    fechData();
  }, []);
  // 🔍 Lọc dữ liệu theo ô tìm kiếm
  const filteredData = useMemo(() => {
    if (!searchText.trim()) return dataUser;
    const lower = searchText.toLowerCase();
    return dataUser.filter(
      (u) =>
        String(u.id).includes(lower) ||
        u.userFullname?.toLowerCase().includes(lower) ||
        u.userPassword?.toLowerCase().includes(lower) ||
        u.userPhone?.toLowerCase().includes(lower) ||
        u.bhxhNumber?.toLowerCase().includes(lower) ||
        u.cardNumber?.toLowerCase().includes(lower)
    );
  }, [dataUser, searchText]);

  const columns = [
    {
      title: "Tên người dùng",
      dataIndex: "userFullname",
      key: "userFullname",
      width: 200,
      render: (text) => (
        <span>
          <UserOutlined style={{ marginRight: 8 }} />
          {text}
        </span>
      ),
    },
    {
      title: "Mật khẩu",
      dataIndex: "userPassword",
      key: "userPassword",
      width: 200,
    },
    {
      title: "Số điện thoại",
      dataIndex: "userPhone",
      key: "userPhone",
      width: 130,
    },
    {
      title: "Số BHXH",
      dataIndex: "bhxhNumber",
      key: "bhxhNumber",
      width: 150,
    },
    {
      title: "Vai trò",
      dataIndex: "userRole",
      key: "userRole",
      width: 120,
      render: (role) => (
        <Tag color={role === "admin" ? "blue" : "default"}>
          {role === "admin" ? "Quản trị viên" : "Người dùng"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái thẻ BHYT",
      dataIndex: "cardStatus",
      key: "cardStatus",
      width: 140,
      render: (status) => (
        <Tag color={status === "ACTIVE" ? "green" : "red"}>
          {status === "ACTIVE" ? "Còn hiệu lực" : "Hết hạn"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa người dùng này?"
            onConfirm={() => handleDelete(record)}
            okText="Xóa"
            cancelText="Hủy"
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
  const handleEdit = (record) => {
    setSelectedUser(record);
    setEditModalVisible(true);
  };
  const handleDelete = async (record) => {
    try {
      let res = await deleteUser(record.id);
      if (res) {
        toast.success("Xóa người dùng thành công!");
        fechData();
      } else {
        toast.error("Lỗi khi xóa người dùng, vui lòng thử lại!");
      }
    } catch (error) {
      toast.error("Không thể xóa người dùng này! vì đã  tham gia bảo hiểm.");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>
          Quản lý người dùng
        </h2>
        <p style={{ margin: "8px 0 0 0", color: "#666" }}>
          Danh sách người dùng, thông tin cá nhân và thẻ BHYT
        </p>
      </div>

      {/* Ô tìm kiếm */}
      <Input
        placeholder="Tìm theo tên, email, CCCD hoặc mã thẻ..."
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: 400, marginBottom: 16 }}
        allowClear
      />

      <ProTable
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        headerTitle="Danh sách người dùng"
        search={false}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Thêm người dùng
          </Button>,
        ]}
        scroll={{ x: 1000 }}
        size="middle"
      />

      <AddUserModal
        visible={addModalVisible}
        onCancel={() => {
          setAddModalVisible(false);
          fechData();
        }}
      />

      <EditUserModal
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        userData={selectedUser}
        fectData={fechData}
      />
    </div>
  );
};

export default UserManager;
