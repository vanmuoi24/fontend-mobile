import instance from "../Axios/Axios";

const userLogin = (data) => {
  return instance.post("auth/login", data);
};
const userRegister = (data) => {
  return instance.post("auth/register", data);
};
const userlist = () => {
  return instance.get("users");
};

const updateuser = (data) => {
  return instance.put(`users/${data.id}`, data);
};

const deleteUser = (id) => {
  return instance.delete(`users/${id}`);
};

const updateUserAvatar = (userId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("userId", userId);
  return instance.post(`users/media/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export {
  userLogin,
  userRegister,
  userlist,
  updateuser,
  deleteUser,
  updateUserAvatar,
};
