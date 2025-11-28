import React from "react";
import { Modal, Form, Input, Select, DatePicker } from "antd";
import { toast } from "react-toastify";
import { userRegister } from "../../../service/UserApi";

const { Option } = Select;

const AddUserModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const newUser = {
        userFullname: values.userFullname,
        userEmail: values.userEmail,
        userPhone: values.userPhone,
        userPassword: values.userPassword,
        userRole: values.userRole,
        bhxhNumber: values.bhxhNumber,
        citizenId: values.citizenId,
        dateOfBirth: values.dateOfBirth?.format("YYYY-MM-DD"),
        address: values.address,
        cardNumber: values.card,
        cardIssuedDate: values.cardIssuedDate?.format("YYYY-MM-DD"),
        cardExpiryDate: values.cardExpiryDate?.format("YYYY-MM-DD"),
        hospitalRegistered: values.hospitalRegistered,
        cardStatus: values.cardStatus,
      };

      let res = await userRegister(newUser);
      if (res) {
        toast.success("Thêm người dùng thành công!");
        onSuccess?.(newUser);
        form.resetFields();
        onCancel?.();
      } else {
        toast.error("Lỗi khi thêm người dùng, vui lòng thử lại!");
      }
    } catch (error) {
      if (error?.errorFields) {
        toast.error("Vui lòng điền đầy đủ thông tin!");
      } else {
        console.error("❌ Lỗi khác:", error);
        toast.error(
          "Đã xảy ra lỗi hoặc người dùng đã tồn tại vui lòng thêm lại"
        );
      }
    }
  };

  return (
    <Modal
      title="Thêm người dùng mới"
      open={visible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      okText="Thêm"
      cancelText="Hủy"
      width={1020}
      style={{ marginBottom: "100px" }}
    >
      <Form
        form={form}
        layout="vertical"
        className="compact-form"
        requiredMark={false}
      >
        {/* ==== THÔNG TIN TÀI KHOẢN ==== */}
        <h4 style={{ margin: "0 0 6px", fontWeight: 600, color: "#333" }}>
          🧑‍💻 Thông tin tài khoản
        </h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "4px 12px",
            marginBottom: 10,
          }}
        >
          <Form.Item
            name="userFullname"
            label="Họ và tên"
            rules={[{ required: true, message: "Nhập họ tên" }]}
            style={{ marginBottom: 4 }}
          >
            <Input placeholder="VD: Nguyễn Văn A" />
          </Form.Item>

          <Form.Item
            name="userEmail"
            label="Email"
            rules={[
              { required: true, message: "Nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
            style={{ marginBottom: 4 }}
          >
            <Input placeholder="example@gmail.com" />
          </Form.Item>

          <Form.Item
            name="userPassword"
            label="Mật khẩu"
            rules={[{ required: true, message: "Nhập mật khẩu" }]}
            style={{ marginBottom: 4 }}
          >
            <Input.Password placeholder="********" />
          </Form.Item>

          <Form.Item
            name="userPhone"
            label="Số điện thoại"
            rules={[{ required: true, message: "Nhập số điện thoại" }]}
            style={{ marginBottom: 4 }}
          >
            <Input placeholder="VD: 0905123456" />
          </Form.Item>

          <Form.Item
            name="userRole"
            label="Vai trò"
            rules={[{ required: true, message: "Chọn vai trò" }]}
            style={{ marginBottom: 4 }}
          >
            <Select placeholder="Chọn vai trò">
              <Option value="admin">Quản trị viên</Option>
              <Option value="user">Người dùng</Option>
            </Select>
          </Form.Item>
        </div>

        {/* ==== THÔNG TIN CÁ NHÂN ==== */}
        <h4 style={{ margin: "8px 0 6px", fontWeight: 600, color: "#333" }}>
          📋 Thông tin cá nhân
        </h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "4px 12px",
            marginBottom: 10,
          }}
        >
          <Form.Item name="citizenId" label="CCCD" style={{ marginBottom: 4 }}>
            <Input placeholder="VD: 012345678999" />
          </Form.Item>

          <Form.Item
            name="bhxhNumber"
            label="Mã số BHXH"
            style={{ marginBottom: 4 }}
          >
            <Input placeholder="VD: BHXH001" />
          </Form.Item>

          <Form.Item
            name="dateOfBirth"
            label="Ngày sinh"
            style={{ marginBottom: 4 }}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="address" label="Địa chỉ" style={{ marginBottom: 4 }}>
            <Input placeholder="VD: 123 Trần Hưng Đạo, Q1, TP.HCM" />
          </Form.Item>
        </div>

        {/* ==== THẺ BHYT ==== */}
        <h4 style={{ margin: "8px 0 6px", fontWeight: 600, color: "#333" }}>
          💳 Số Thẻ
        </h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "4px 12px",
          }}
        >
          <Form.Item
            name="hospitalRegistered"
            label="Nơi đăng ký KCB"
            style={{ marginBottom: 4 }}
          >
            <Input placeholder="VD: BV Chợ Rẫy" />
          </Form.Item>

          <Form.Item name="card" label="BHYT" style={{ marginBottom: 4 }}>
            <Input placeholder="" />
          </Form.Item>
          <Form.Item
            name="cardIssuedDate"
            label="Ngày cấp"
            style={{ marginBottom: 4 }}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="cardExpiryDate"
            label="Ngày hết hạn"
            style={{ marginBottom: 4 }}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="cardStatus"
            label="Trạng thái thẻ"
            style={{ marginBottom: 0 }}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="ACTIVE">Còn hiệu lực</Option>
              <Option value="EXPIRED">Hết hạn</Option>
            </Select>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default AddUserModal;
