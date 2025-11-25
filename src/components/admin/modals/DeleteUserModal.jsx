import React from "react";
import { Modal, Avatar, Typography, Space, message } from "antd";
import { UserOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

const DeleteUserModal = ({ visible, onCancel, onConfirm, userData }) => {
  const handleConfirm = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Delete user:", userData);
      message.success("Xóa người dùng thành công!");

      onConfirm && onConfirm(userData.id);
      onCancel();
    } catch (error) {
      message.error("Xóa người dùng thất bại!");
    }
  };

  const getRoleText = (role) => {
    const roles = {
      admin: "Quản trị viên",
      moderator: "Điều hành viên",
      user: "Người dùng",
    };
    return roles[role] || role;
  };

  const getStatusText = (status) => {
    return status === "active" ? "Hoạt động" : "Không hoạt động";
  };

  return (
    <Modal
      title={
        <Space>
          <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />
          <span>Xác nhận xóa người dùng</span>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      onOk={handleConfirm}
      okText="Xóa"
      cancelText="Hủy"
      okButtonProps={{ danger: true }}
      width={500}
      destroyOnClose
    >
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <Avatar
          size={80}
          icon={<UserOutlined />}
          style={{
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            marginBottom: 16,
          }}
        />

        <Title level={4} style={{ marginBottom: 8 }}>
          {userData?.name}
        </Title>

        <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
          {userData?.email}
        </Text>

        <div
          style={{
            background: "#f5f5f5",
            padding: 16,
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          <Space direction="vertical" size="small">
            <div>
              <Text strong>Số điện thoại: </Text>
              <Text>{userData?.phone}</Text>
            </div>
            <div>
              <Text strong>Vai trò: </Text>
              <Text>{getRoleText(userData?.role)}</Text>
            </div>
            <div>
              <Text strong>Trạng thái: </Text>
              <Text>{getStatusText(userData?.status)}</Text>
            </div>
          </Space>
        </div>

        <div
          style={{
            background: "#fff2f0",
            border: "1px solid #ffccc7",
            borderRadius: 6,
            padding: 12,
          }}
        >
          <Text type="danger">
            <ExclamationCircleOutlined style={{ marginRight: 8 }} />
            Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể
            hoàn tác.
          </Text>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteUserModal;
