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
import dayjs from "dayjs";
import { userlist } from "../../../service/UserApi";
import { updateParticipation } from "../../../service/ChartAPI";
// import { updateParticipation } from "../../../service/ChartAPI";

const { Option } = Select;

const EditParticipationModal = ({
  visible,
  onCancel,
  onSuccess,
  editingRecord, // 👈 dữ liệu hàng đang sửa { id, userId, ... }
}) => {
  const [form] = Form.useForm();
  const [dataUser, setDataUser] = useState();
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    let res = await userlist();
    if (res && res.data) {
      setDataUser(res.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log("editingRecord:", editingRecord);
  // Khi mở modal hoặc thay đổi record thì set lại form
  useEffect(() => {
    if (visible && editingRecord) {
      form.setFieldsValue({
        userId: editingRecord.user.id,
        insuranceType: editingRecord.insuranceType,
        startDate: editingRecord.startDate
          ? dayjs(editingRecord.startDate)
          : null,
        endDate: editingRecord.endDate ? dayjs(editingRecord.endDate) : null,
        companyName: editingRecord.companyName,
        workplaceAddress: editingRecord.workplaceAddress,
        position: editingRecord.position,
        currency: editingRecord.currency,
        salary: editingRecord.salary,
        insuranceSalary: editingRecord.insuranceSalary,
        totalTime: editingRecord.totalTime,
        delayedTime: editingRecord.delayedTime,
      });
    } else {
      form.resetFields();
    }
  }, [visible, editingRecord, form]);

  const handleOk = async () => {
    if (submitting) return;
    try {
      setSubmitting(true);
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
        totalTime: values.totalTime,
        delayedTime: values.delayedTime,
      };

      const res = await updateParticipation(editingRecord.id, payload);

      if (res) {
        message.success("Cập nhật thành công!");
        form.resetFields();
        onSuccess?.();
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật participation:", err);
      message.error("Không thể cập nhật!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="✏️ Chỉnh sửa quá trình tham gia bảo hiểm"
      open={visible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      confirmLoading={submitting}
      cancelButtonProps={{ disabled: submitting }}
      okText="Lưu thay đổi"
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
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Tổng thời gian tham gia (tháng)" name="totalTime">
              <InputNumber style={{ width: "100%" }} placeholder="VD: 24" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Thời gian chậm đóng (tháng)" name="delayedTime">
              <InputNumber style={{ width: "100%" }} placeholder="VD: 2" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EditParticipationModal;
