import instance from "../Axios/Axios";

const getAll = () => {
  return instance.get("participations");
};

const getChartById = (id) => {
  return instance.get(`charts/${id}`);
};

const updateUser = (data) => {
  return instance.put(`charts/${data.id}`, data);
};

const createParticipation = (data) => {
  return instance.post("participations", data);
};

const updateParticipation = (id, data) => {
  return instance.put(`participations/${id}`, data);
};

const deleteParticipation = (id) => {
  return instance.delete(`participations/${id}`);
};

export {
  getAll,
  getChartById,
  updateUser,
  createParticipation,
  updateParticipation,
  deleteParticipation,
};
