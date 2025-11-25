import instance from "../Axios/Axios";

// 🟢 Lấy danh sách tất cả file
const getAllFiles = () => {
  return instance.get("files");
};

// 🟣 Upload file (dùng form-data)
const uploadFile123 = (formData) => {
  console.log(formData);
  return instance.post("files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 🔵 Lấy chi tiết file theo ID
const getFileById = (id) => {
  return instance.get(`files/${id}`);
};

// 🟠 Xóa file theo ID
const deleteFile = (id) => {
  return instance.delete(`files/${id}`);
};

// 🟡 Cập nhật thông tin file (nếu cần)
const updateFile = (data) => {
  return instance.put(`files/${data.id}`, data);
};

const downloadFile = (id, filename) => {
  return instance
    .get(`files/download/${id}`, {
      responseType: "blob", // nhận file binary
    })
    .then((res) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
};

export {
  getAllFiles,
  getFileById,
  deleteFile,
  updateFile,
  uploadFile123,
  downloadFile,
};
