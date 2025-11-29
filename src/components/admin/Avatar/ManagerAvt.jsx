import React, { useState, useMemo, useEffect } from "react";
import { ProTable } from "@ant-design/pro-components";
import {
  Avatar,
  Button,
  Modal,
  Upload,
  message,
  Space,
  Input,
  Tag,
} from "antd";
import {
  EditOutlined,
  UploadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { updateUserAvatar, userlist } from "../../../service/UserApi";
import avtDefault from "../../../assets/avtVssID.png";
import { toast } from "react-toastify";

const { Dragger } = Upload;

const ManagerAvt = () => {
  const [dataUser, setDataUser] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      let res = await userlist();
      if (res && res.data) setDataUser(res.data);
    } catch {
      message.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const clearPreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const uploadProps = {
    accept: "image/*",
    multiple: false,
    beforeUpload: (file) => {
      clearPreview();
      setFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      return false;
    },
    onRemove: () => {
      clearPreview();
      setFile(null);
    },
  };

  const handleOpenEdit = (user) => {
    setCurrentUser(user);
    clearPreview();
    setFile(null);
    setOpenModal(true);
  };

  const handleSaveAvatar = async () => {
    if (!file) return message.warning("Vui lòng chọn ảnh");

    try {
      setUploading(true);
      const res = await updateUserAvatar(currentUser.id, file);
      if (res && res.success) {
        toast.success("Cập nhật ảnh thành công");
        setOpenModal(false);
        fetchData();
      } else {
        toast.error("Cập nhật thất bại vui long thử lại");
      }
    } catch {
      toast.error("Lỗi khi tải ảnh lên");
    } finally {
      setUploading(false);
    }
  };

  const filteredData = useMemo(() => {
    if (!searchText.trim()) return dataUser;
    const lower = searchText.toLowerCase();
    return dataUser.filter(
      (u) =>
        u.userFullname?.toLowerCase().includes(lower) ||
        u.bhxhNumber?.toLowerCase().includes(lower) ||
        u.userPhone?.toLowerCase().includes(lower) ||
        String(u.id).includes(lower)
    );
  }, [dataUser, searchText]);

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatarUrl",
      width: 80,
      render: (_, record) => (
        <Avatar size={48} src={record.avatarUrl || avtDefault} />
      ),
    },
    {
      title: "Tên người dùng",
      dataIndex: "userFullname",
      width: 220,
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Mã BHXH",
      dataIndex: "bhxhNumber",
      width: 220,
    },
    {
      title: "Số điện thoại",
      dataIndex: "userPhone",
      width: 140,
    },
    {
      title: "Ảnh đại diện",
      dataIndex: "avatarUrl",
      width: 140,
      render: (url) =>
        url ? (
          <Tag color="blue">Đã cập nhật</Tag>
        ) : (
          <Tag color="default">Chưa có</Tag>
        ),
    },
    {
      title: "Thao tác",
      width: 120,
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={<EditOutlined />}
          onClick={() => handleOpenEdit(record)}
        >
          Sửa ảnh
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>
          Quản lý ảnh đại diện
        </h2>
        <p style={{ margin: "8px 0 0 0", color: "#666" }}>
          Danh sách người dùng và trạng thái ảnh đại diện
        </p>
      </div>

      {/* Ô tìm kiếm */}
      <Input
        placeholder="Tìm theo tên, email hoặc số điện thoại..."
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
        loading={loading}
        pagination={{
          pageSize: 6,
          showSizeChanger: true,
        }}
        search={false}
        headerTitle="Danh sách người dùng"
        size="middle"
        scroll={{ x: 900 }}
        toolBarRender={false}
      />

      {/* Modal sửa ảnh */}
      <Modal
        title={
          <div style={{ fontSize: 20, fontWeight: 600, paddingBottom: 8 }}>
            {currentUser
              ? `Cập nhật ảnh cho: ${currentUser.userFullname}`
              : "Cập nhật ảnh"}
          </div>
        }
        open={openModal}
        onCancel={() => setOpenModal(false)}
        onOk={handleSaveAvatar}
        confirmLoading={uploading}
        okText="Lưu ảnh"
        width={600}
        centered
        style={{ top: 20 }}
      >
        {currentUser && (
          <div style={{ padding: "10px 5px" }}>
            {/* --- Avatar Section --- */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 24,
                padding: 20,
                background: "#fafafa",
                borderRadius: 12,
                boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ textAlign: "center", flex: 1 }}>
                <div style={{ marginBottom: 10, fontWeight: 500 }}>
                  Ảnh hiện tại
                </div>
                <Avatar
                  size={120}
                  src={currentUser.avatarUrl || avtDefault}
                  style={{ border: "2px solid #d9d9d9" }}
                />
              </div>

              <div style={{ textAlign: "center", flex: 1 }}>
                <div style={{ marginBottom: 10, fontWeight: 500 }}>Ảnh mới</div>
                <Avatar
                  size={120}
                  src={previewUrl || currentUser.avatarUrl || avtDefault}
                  style={{
                    border: "2px solid #1677ff",
                    boxShadow: previewUrl
                      ? "0 0 10px rgba(22,119,255,0.4)"
                      : "none",
                  }}
                />
              </div>
            </div>

            {/* --- Upload Box --- */}
            <Dragger
              {...uploadProps}
              style={{
                borderRadius: 12,
                padding: 25,
                background: "#fff",
                border: "1.5px dashed #bfbfbf",
              }}
            >
              <p className="ant-upload-drag-icon" style={{ marginBottom: 8 }}>
                <UploadOutlined style={{ fontSize: 30, color: "#1677ff" }} />
              </p>
              <p style={{ fontSize: 16, fontWeight: 500 }}>
                Kéo ảnh vào hoặc nhấn để chọn file
              </p>
              <p style={{ color: "#888" }}>
                Hỗ trợ các định dạng ảnh (PNG, JPG…)
              </p>
            </Dragger>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManagerAvt;
