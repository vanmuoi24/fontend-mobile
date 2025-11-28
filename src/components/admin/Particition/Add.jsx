import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  message,
  Row,
  Col,
} from "antd";
import { userlist } from "../../../service/UserApi";
import { createParticipation } from "../../../service/ChartAPI";
// import { createParticipation } from "../../../../service/ParticipationAPI";
const { Option } = Select;

const AddParticipationModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [dataUser, setDataUser] = useState();

  const fechData = async () => {
    let res = await userlist();
    console.log(res);
    if (res && res.data) {
      setDataUser(res.data);
    }
  };
  useEffect(() => {
    fechData();
  }, []);
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        userId: values.userId,
        insuranceType: values.insuranceType,
        startDate: values.startDate?.format("YYYY-MM-DD"),
        endDate: values.endDate?.format("YYYY-MM-DD"),
        companyName: values.companyName,
        workplaceAddress: values.workplaceAddress,
        position: values.position,
        currency: values.currency,
        salary: values.salary,
        insuranceSalary: values.insuranceSalary,
      };

      const res = await createParticipation(payload);
      if (res) {
        message.success("Thêm mới thành công!");
        form.resetFields();
        onSuccess?.();
      }
    } catch (err) {
      console.error("Lỗi khi thêm participation:", err);
      message.error("Không thể thêm mới !");
    }
  };

  return (
    <Modal
      title="➕ Thêm quá trình tham gia bảo hiểm"
      open={visible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      okText="Thêm mới"
      cancelText="Hủy"
      width={800}
      style={{ top: 40 }}
    >
      <Form
        form={form}
        layout="vertical"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        style={{ marginTop: 10 }}
      >
        {/* 🧱 Thông tin chung */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Mã người dùng (user_id)"
              name="userId"
              rules={[
                { required: true, message: "Vui lòng chọn ID người dùng" },
              ]}
            >
              <Select
                placeholder="Chọn ID người dùng"
                showSearch
                optionFilterProp="children"
                // Nếu muốn lọc theo value thì dùng: optionFilterProp="value"
              >
                {dataUser?.map((user) => (
                  <Select.Option key={user.id} value={user.id}>
                    {user.id} - {user.userFullname}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Loại bảo hiểm"
              name="insuranceType"
              rules={[
                { required: true, message: "Vui lòng chọn loại bảo hiểm" },
              ]}
            >
              <Select placeholder="Chọn loại bảo hiểm">
                <Option value="BHXH">BHXH</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* 🗓 Thời gian tham gia */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Từ tháng" name="startDate">
              <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Đến tháng" name="endDate">
              <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        {/* 🏢 Đơn vị công tác */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Đơn vị công tác" name="companyName">
              <Input placeholder="Tên công ty / tổ chức" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Địa chỉ làm việc" name="workplaceAddress">
              <Input placeholder="Địa chỉ nơi làm việc" />
            </Form.Item>
          </Col>
        </Row>

        {/* 💼 Nghề nghiệp */}
        <Form.Item label="Chức vụ / Nghề nghiệp" name="position">
          <Input placeholder="VD: Nhân viên, Kỹ sư, Quản lý..." />
        </Form.Item>

        {/* 💰 Lương & Thông tin tài chính */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Loại tiền" name="currency">
              <Input placeholder="VD: VND" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Mức lương" name="salary">
              <InputNumber
                style={{ width: "100%" }}
                placeholder="VD: 15000000"
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Lương đóng BH" name="insuranceSalary">
              <InputNumber
                style={{ width: "100%" }}
                placeholder="VD: 12000000"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* 📅 Tổng thời gian tham gia */}
      </Form>
    </Modal>
  );
};

export default AddParticipationModal;
