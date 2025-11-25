import React, { useState } from "react";
import { Modal, Upload, message, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { uploadFile123 } from "../../../service/fileAPI";
import { toast } from "react-toastify";

const AddFileModal = ({ visible, onCancel, onSuccess }) => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning("Vui lòng chọn file!");
      return;
    }
    const formData = new FormData();
    formData.append("file", fileList[0].originFileObj); // 👈 chính xác tên phải là "file"
    try {
      setUploading(true);
      const res = await uploadFile123(formData);
      if (res) {
        toast.success("Tải file thành công!");
        onCancel();
        setFileList([]);
        onSuccess && onSuccess(res);
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi khi tải file!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      title="Tải file lên"
      open={visible}
      onCancel={onCancel}
      onOk={handleUpload}
      okText="Tải lên"
      cancelText="Hủy"
      confirmLoading={uploading}
      width={500}
    >
      <Upload
        beforeUpload={() => false} // không tự upload
        onChange={({ fileList: newList }) => setFileList(newList.slice(-1))}
        onRemove={() => setFileList([])}
        fileList={fileList}
        maxCount={1}
      >
        <Button icon={<UploadOutlined />}>Chọn file</Button>
      </Upload>
      <p style={{ marginTop: 12, color: "#666" }}>
        Chọn một file để tải lên hệ thống.
      </p>
    </Modal>
  );
};

export default AddFileModal;
