import axios from "axios";

const instance = axios.create({
  baseURL: "https://backend-mobileapp-1.onrender.com/api/v1",
  withCredentials: true,
});

// 🧩 Interceptor để đính kèm token vào headers
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🧩 Interceptor xử lý lỗi 401 (hết hạn token)
instance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Gọi API refresh token (nếu có)
        await axios.get("http://localhost:8080/api/v1/auth/refresh", {
          withCredentials: true,
        });

        // Sau khi refresh, lấy lại access token mới
        const newAccessToken = localStorage.getItem("accessToken");
        if (newAccessToken) {
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        }

        return instance(originalRequest);
      } catch (err) {
        console.error("Refresh token failed, redirecting to login...");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user"); // Nếu bạn có lưu user
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
