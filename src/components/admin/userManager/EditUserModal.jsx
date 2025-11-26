import React, { useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker } from "antd";
import { toast } from "react-toastify";
import { updateuser } from "../../../service/UserApi";
import dayjs from "dayjs";

const { Option } = Select;

const EditUserModal = ({
  visible,
  onCancel,
  onConfirm,
  userData,
  fectData,
}) => {
  const [form] = Form.useForm();

  // ✅ Cập nhật form khi mở modal
  useEffect(() => {
    if (visible && userData) {
      form.resetFields();
      setTimeout(() => {
        form.setFieldsValue({
          userFullname: userData.userFullname || "",
          userEmail: userData.userEmail || "",
          userPhone: userData.userPhone || "",
          userRole: userData.userRole || "",
          bhxhNumber: userData.bhxhNumber || "",
          citizenId: userData.citizenId || "",
          dateOfBirth: userData.dateOfBirth
            ? dayjs(userData.dateOfBirth)
            : null,
          address: userData.address || "",
          cardNumber: userData.cardNumber || "",
          cardIssuedDate: userData.cardIssuedDate
            ? dayjs(userData.cardIssuedDate)
            : null,
          cardExpiryDate: userData.cardExpiryDate
            ? dayjs(userData.cardExpiryDate)
            : null,
          hospitalRegistered: userData.hospitalRegistered || "",
          cardStatus: userData.cardStatus || "",
        });
      }, 0);
    } else {
      form.resetFields();
    }
  }, [userData, visible, form]);

  const handleOk = async () => {
    try {
      // ✅ Validate form
      const values = await form.validateFields({
        scroll: { scrollToFirstError: true },
      });

      const updatedUser = {
        id: userData.id,
        userFullname: values.userFullname.trim(),
        userEmail: values.userEmail.trim(),
        userPhone: values.userPhone.trim(),
        bhxhNumber: values.bhxhNumber?.trim() || "",
        citizenId: values.citizenId?.trim() || "",
        dateOfBirth: values.dateOfBirth?.format("YYYY-MM-DD") || null,
        address: values.address?.trim() || "",
        cardNumber: values.cardNumber?.trim() || "",
        cardIssuedDate: values.cardIssuedDate?.format("YYYY-MM-DD") || null,
        cardExpiryDate: values.cardExpiryDate?.format("YYYY-MM-DD") || null,
        hospitalRegistered: values.hospitalRegistered?.trim() || "",
        cardStatus: values.cardStatus || "",
      };

      console.log("📦 Dữ liệu gửi lên:", updatedUser);

      const res = await updateuser(updatedUser);

      if (res && res.success === true) {
        toast.success("✅ Cập nhật người dùng thành công!");
        fectData();
        onConfirm?.();
        onCancel();
      } else {
        toast.error("❌ Lỗi khi cập nhật, vui lòng thử lại!");
      }
    } catch (error) {
      if (error?.errorFields) {
        toast.error("⚠️ Vui lòng điền đầy đủ thông tin bắt buộc!");
      } else {
        console.error("❌ Lỗi khi cập nhật:", error);
        toast.error("Đã xảy ra lỗi không mong muốn!");
      }
    }
  };

  return (
    <Modal
      title="Chỉnh sửa thông tin người dùng"
      open={visible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      okText="Lưu thay đổi"
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
            rules={[{ required: true, message: "Nhập họ và tên" }]}
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
            name="userPhone"
            label="Số điện thoại"
            rules={[{ required: true, message: "Nhập số điện thoại" }]}
            style={{ marginBottom: 4 }}
          >
            <Input placeholder="VD: 0905123456" />
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
          💳 Sổ thẻ BHYT
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

          <Form.Item
            name="cardNumber"
            label="Số thẻ BHYT"
            style={{ marginBottom: 4 }}
          >
            <Input placeholder="VD: BH123456789" />
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

export default EditUserModal;
