import * as request from "~/utils/request";

export const register = async (userData) => {
  try {
    const res = await request.post("user/create", userData);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const login = async (userData) => {
  try {
    const res = await request.post("user/login", userData);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const addBookmark = async (data = {}) => {
  try {
    const res = await request.post(`user/bookmark`, data);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getBookmark = async (user) => {
  try {
    const res = await request.get(`user/bookmark`, {
      params: {
        user,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getAllBookmark = async (data) => {
  try {
    const res = await request.post(`questions/bookmarks`, data);
    return res;
  } catch (error) {
    console.log(error);
  }
};
