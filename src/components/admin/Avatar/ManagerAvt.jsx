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
  Image,
} from "antd";
import {
  EditOutlined,
  UploadOutlined,
  PictureOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { updateUserAvatar, userlist } from "../../../service/UserApi";
import avtDefault from "../../../assets/avtVssID.png";
import Dragger from "antd/lib/upload/Dragger";
// TODO: import API update avatar thật của bạn
// import { updateUserAvatar } from "../../../service/UserApi";

const ManagerAvt = () => {
  const [dataUser, setDataUser] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await userlist();
      if (res && res.success === true) {
        setDataUser(res.data || []);
      } else {
        message.error("Lấy danh sách người dùng thất bại");
      }
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const clearPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  };

  const uploadProps = {
    accept: "image/*",
    multiple: false,
    beforeUpload: (f) => {
      clearPreview();
      setFile(f);
      const url = URL.createObjectURL(f);
      setPreviewUrl(url); // xem ảnh mới trước
      return false; // không upload auto
    },
    onRemove: () => {
      setFile(null);
      clearPreview();
    },
  };

  const handleOpenEdit = (user) => {
    setCurrentUser(user);
    setFile(null);
    clearPreview();
    setOpenModal(true);
  };

  const handleSaveAvatar = async () => {
    if (!currentUser) return;
    if (!file) {
      message.warning("Vui lòng chọn một ảnh");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await updateUserAvatar(currentUser.id, file);

      if (res && res.success === true) {
        message.success("Cập nhật ảnh đại diện thành công");
        setOpenModal(false);
        setCurrentUser(null);
        setFile(null);
        clearPreview();
        fetchData();
      } else {
        message.error("Cập nhật ảnh đại diện thất bại");
      }
    } catch (err) {
      console.error(err);
      message.error("Cập nhật ảnh đại diện thất bại");
    } finally {
      setUploading(false);
    }
  };

  // Lọc giống UserManager
  const filteredData = useMemo(() => {
    if (!searchText.trim()) return dataUser;
    const lower = searchText.toLowerCase();
    return dataUser.filter(
      (u) =>
        String(u.id).includes(lower) ||
        u.userFullname?.toLowerCase().includes(lower) ||
        u.userEmail?.toLowerCase().includes(lower) ||
        u.userPhone?.toLowerCase().includes(lower)
    );
  }, [dataUser, searchText]);

  const columns = [
    {
      title: "",
      dataIndex: "avatarUrl",
      key: "avatarUrl",
      width: 70,
      search: false,
      render: (_, record) => (
        <Image
          src={record.avatarUrl ? record.avatarUrl : avtDefault}
          alt="Avatar"
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            objectFit: "cover",
          }}
          preview={false}
        />
      ),
    },
    {
      title: "Tên người dùng",
      dataIndex: "userFullname",
      key: "userFullname",
      width: 220,
      render: (text, record) => (
        <span>
          <PictureOutlined style={{ marginRight: 8, color: "#1677ff" }} />
          <span style={{ fontWeight: 500 }}>{text}</span>
          <div style={{ fontSize: 12, color: "#888" }}>{record.userEmail}</div>
        </span>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "userPhone",
      key: "userPhone",
      width: 140,
    },
    {
      title: "Mã thẻ BHYT",
      dataIndex: "cardNumber",
      key: "cardNumber",
      width: 160,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 140,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleOpenEdit(record)}
          >
            Sửa ảnh
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Header giống UserManager */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>
          Quản lý ảnh đại diện
        </h2>
        <p style={{ margin: "8px 0 0 0", color: "#666" }}>
          Xem và cập nhật ảnh đại diện cho người dùng.
        </p>
      </div>

      {/* Ô tìm kiếm giống UserManager */}
      <Input
        placeholder="Tìm theo tên, email, số điện thoại..."
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
          pageSize: 5,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        headerTitle="Danh sách ảnh đại diện"
        search={false}
        toolBarRender={false} // không cần nút Thêm ở đây
        scroll={{ x: 800 }}
        size="middle"
      />

      <Modal
        title={
          currentUser
            ? `Cập nhật ảnh cho: ${currentUser.userFullname}`
            : "Cập nhật ảnh đại diện"
        }
        open={openModal}
        onCancel={() => {
          setOpenModal(false);
          setCurrentUser(null);
          setFile(null);
          clearPreview();
        }}
        onOk={handleSaveAvatar}
        okText="Lưu"
        confirmLoading={uploading}
        destroyOnClose
        width={640}
      >
        {currentUser && (
          <>
            <div
              style={{
                display: "flex",
                gap: 24,
                marginBottom: 24,
                justifyContent: "center",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 500, marginBottom: 8 }}>
                  Ảnh hiện tại
                </div>
                <Avatar size={96} src={currentUser.avatarUrl}>
                  {currentUser.userFullname?.[0]?.toUpperCase()}
                </Avatar>
              </div>

              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 500, marginBottom: 8 }}>
                  Ảnh mới (preview)
                </div>
                <Avatar
                  size={96}
                  src={
                    previewUrl
                      ? previewUrl
                      : currentUser.avatarUrl
                      ? currentUser.avatarUrl
                      : avtDefault
                  }
                >
                  {currentUser.userFullname?.[0]?.toUpperCase()}
                </Avatar>
              </div>
            </div>

            <div style={{ marginBottom: 8, fontWeight: 500 }}>Chọn ảnh mới</div>
            <Dragger {...uploadProps} style={{ padding: 12 }}>
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">
                Kéo thả ảnh vào đây hoặc bấm để chọn file
              </p>
              <p className="ant-upload-hint">
                Nên dùng ảnh vuông, dung lượng nhỏ để tải nhanh hơn.
              </p>
            </Dragger>
          </>
        )}
      </Modal>
    </div>
  );
};

export default ManagerAvt;
