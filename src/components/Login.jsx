import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { userLogin } from "../service/UserApi";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  let navi = useNavigate();
  const onFinish = async (values) => {
    const data = {
      bhxhNumber: values.email,
      password: values.password,
    };

    setLoading(true);

    try {
      const res = await userLogin(data);

      // ✅ kiểm tra login hợp lệ
      if (res?.user && res?.accessToken) {
        toast.success("Đăng nhập thành công!");
        localStorage.setItem("user", JSON.stringify(res.user));
        localStorage.setItem("accessToken", res.accessToken);
        setTimeout(() => {
          navi("/admin/users");
        }, 500);
      } else {
        toast.error("Sai thông tin đăng nhập!");
      }
    } catch (error) {
      toast.error("Sai thông tin đăng nhập! ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: 350,
        maxWidth: 460,
        margin: "auto",
        marginTop: 100,
        background: "#fff",
        padding: "32px 28px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <Title level={3} style={{ marginBottom: "8px" }}>
          Đăng nhập
        </Title>
        <Text type="secondary">Vui lòng nhập thông tin để tiếp tục</Text>
      </div>

      <Form
        name="login"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        size="large"
      >
        <Form.Item label="Email" name="email">
          <Input
            prefix={<UserOutlined style={{ color: "#aaa" }} />}
            placeholder="Email"
          />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu!" },
            { min: 6, message: "Ít nhất 6 ký tự" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "#aaa" }} />}
            placeholder="Mật khẩu"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{
              width: "100%",
              height: "40px",
              fontWeight: "500",
            }}
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>

      <div
        style={{
          textAlign: "center",
          marginTop: "8px",
          fontSize: "14px",
        }}
      >
        <Text>Chưa có tài khoản? </Text>
      </div>
    </div>
  );
};

export default Login;
