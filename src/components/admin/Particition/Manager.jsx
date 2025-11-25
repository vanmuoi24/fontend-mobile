import React, { useRef, useState } from "react";
import { ProTable } from "@ant-design/pro-components";
import { Button, Tag, message, Space, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getAll } from "../../../service/ChartAPI";
import EditParticipationModal from "./Edit";
import AddParticipationModal from "./Add";

const ParticipationManager = () => {
  const actionRef = useRef();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 70, align: "center" },
    {
      title: "Người tham gia",
      dataIndex: ["user", "userFullname"],
      key: "userFullname",
      render: (_, record) => record.user?.userFullname || "—",
    },
    {
      title: "Loại bảo hiểm",
      dataIndex: "insuranceType",
      key: "insuranceType",
      render: (type) => {
        let color = "blue";
        if (type === "BHXH") color = "green";
        else if (type === "BHTN") color = "volcano";
        else if (type === "BHYT") color = "geekblue";
        else if (type === "BHTNLD_BNN") color = "purple";
        return <Tag color={color}>{type}</Tag>;
      },
    },
    {
      title: "Từ tháng",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "—"),
    },
    {
      title: "Đến tháng",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "—"),
    },
    { title: "Đơn vị công tác", dataIndex: "companyName", key: "companyName" },
    {
      title: "Địa chỉ làm việc",
      dataIndex: "workplaceAddress",
      key: "workplaceAddress",
    },
    { title: "Chức vụ / Nghề nghiệp", dataIndex: "position", key: "position" },
    {
      title: "Mức lương (VNĐ)",
      dataIndex: "salary",
      key: "salary",
      render: (value) => (value ? value.toLocaleString("vi-VN") : "—"),
      align: "right",
    },
    {
      title: "Lương đóng BH (VNĐ)",
      dataIndex: "insuranceSalary",
      key: "insuranceSalary",
      render: (value) => (value ? value.toLocaleString("vi-VN") : "—"),
      align: "right",
    },
    {
      title: "Tổng TG tham gia (tháng)",
      dataIndex: "totalTime",
      key: "totalTime",
      align: "center",
    },
    {
      title: "TG chậm đóng (tháng)",
      dataIndex: "delayedTime",
      key: "delayedTime",
      align: "center",
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
            onClick={() => setIsEditOpen(true) || setCurrentRecord(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa quá trình tham gia bảo hiểm này?"
            // onConfirm={}
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

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>
            Quản lý quá trình tham gia bảo hiểm
          </h2>
          <p style={{ margin: "8px 0 0 0", color: "#666" }}>
            Danh sách quá trình tham gia BHXH, BHTN, BHYT, BHTNLD-BNN
          </p>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Thêm mới
        </Button>
      </div>

      <ProTable
        actionRef={actionRef}
        columns={columns}
        rowKey="id"
        search={false}
        pagination={{ pageSize: 6 }}
        request={async (params) => {
          // params.current: trang hiện tại
          // params.pageSize: số item/trang
          try {
            const res = await getAll(); // API có thể nhận params.page, params.pageSize nếu backend hỗ trợ
            if (res?.data) {
              return {
                data: res.data,
                success: true,
                total: res.data.length,
              };
            }
          } catch (err) {
            message.error("Không thể tải dữ liệu!");
            return { data: [], success: false, total: 0 };
          }
        }}
        headerTitle="Danh sách tham gia bảo hiểm"
        options={{
          reload: true,
          density: true,
          fullScreen: true,
          setting: true,
        }}
      />

      <AddParticipationModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSuccess={() => {
          setIsModalVisible(false);
          actionRef.current?.reload(); // reload table
        }}
      />

      <EditParticipationModal
        visible={isEditOpen}
        editingRecord={currentRecord}
        onCancel={() => setIsEditOpen(false)}
        onSuccess={() => {
          setIsEditOpen(false);
          actionRef.current?.reload();
        }}
      />
    </div>
  );
};

export default ParticipationManager;
