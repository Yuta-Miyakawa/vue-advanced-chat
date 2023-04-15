import { api, stagingApi } from "src/boot/axios";
import { columnsForClients } from "src/composable/column-tables";
import { getTokenFromStorage } from "src/composable/utils";

export default {
  async createBook({ commit }, payload) {
    console.log(payload);
    const { id, ...dataToUpdate } = payload;
    console.log(id)
    console.log(dataToUpdate)
    const response = await stagingApi.post(`profiles/${id}/obituary`, dataToUpdate, {
      headers: {
        Authorization: getTokenFromStorage(),
      },
    });
    console.log(payload);

    if (response.status !== 201) {
      throw new Error("データの読み込み中にエラーが発生しました");
    }

    // const {
    //   data: { name },
    // } = await stagingApi.get(`/members2/${id}`);

    commit("createResource", { ...response.data });
    console.log("commited!!!",response.data)
  },

  async readMeta({ commit }) {
    const response = await stagingApi.get("/pastbook", {
      headers: {
        Authorization: getTokenFromStorage(),
      },
    });

    if (response.status !== 200) {
      throw new Error("データの読み込み中にエラーが発生しました");
    }

    commit("ReadResourceMeta", response.data);
  },

  async readBooks({ commit }, payload) {
    const pageID = payload.page
    console.log("pageID", pageID)
    const response = await stagingApi.get(`/pastbook?page=${pageID}`, {
      headers: {
        Authorization: getTokenFromStorage(),
      },
    });

    if (response.status !== 200) {
      throw new Error("データの読み込み中にエラーが発生しました");
    }

    commit("ReadResources", response.data);
    // console.log("response.data",response.data)
  },

  async searchBooks({ commit }, payload) {
    console.log("payload",payload)
    const response = await stagingApi.post("/pastbook/search", {
      "filters" : [
        { "field": "family_id", "operator": "=", "value": payload }
      ],
    }, {
      headers: {
        Authorization: getTokenFromStorage(),
      }
    });

    if (response.status !== 200) {
      throw new Error("データの読み込み中にエラーが発生しました");
    }

    commit("SearchResources", response.data);
    console.log("commited!!",response.data)
  },

  async updateBook({ commit }, payload) {
    console.log(payload)
    const { id, ...dataToUpdate } = payload;
    console.log(id)
    console.log(dataToUpdate)
    const response = await stagingApi.patch(`/pastbook/${id}`, dataToUpdate, {
      headers: {
        Authorization: getTokenFromStorage(),
      },
    });
    console.log(response.status)

    if (response.status !== 200) {
      throw new Error("データの更新中にエラーが発生しました");
    }

    const {
      data: { name },
    } = await stagingApi.get(`/pastbook/${id}`);

    commit("updateResource", { ...response.data, nombre_autor: name });
    console.log("commited!!!",response)
  },
  async deleteBook({ commit }, payload) {
    const { id } = payload;
    console.log(payload)
    const response = await stagingApi.delete(`/pastbook/${id}`, {
      headers: {
        Authorization: getTokenFromStorage(),
      },
    });

    if (response.status !== 200) {
      throw new Error("データの更新中にエラーが発生しました");
    }

    commit("deleteResource", { id });
  },

  async readBooksProfile({ commit }, payload) {
    const { id } = payload;
    console.log(payload)
    const response = await stagingApi.get(`/pastbook/${id}`, {
      headers: {
        Authorization: getTokenFromStorage(),
      },
    });

    if (response.status !== 200) {
      throw new Error("データの読み込み中にエラーが発生しました");
    }

    commit("ReadResourcesProfile", { id });
  },
};
