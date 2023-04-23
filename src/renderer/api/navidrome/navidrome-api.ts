import { initClient, initContract } from '@ts-rest/core';
import axios, { Method, AxiosError, AxiosResponse, isAxiosError } from 'axios';
import { ndType } from './navidrome-types';
import { toast } from '/@/renderer/components';
import { useAuthStore } from '/@/renderer/store';

const c = initContract();

export const contract = c.router({
  addToPlaylist: {
    body: ndType._parameters.addToPlaylist,
    method: 'POST',
    path: 'playlist/:id/tracks',
    responses: {
      200: ndType._response.addToPlaylist,
    },
  },
  authenticate: {
    body: ndType._parameters.authenticate,
    method: 'POST',
    path: 'auth/login',
    responses: {
      200: ndType._response.authenticate,
    },
  },
  createPlaylist: {
    body: ndType._parameters.createPlaylist,
    method: 'POST',
    path: 'playlist',
    responses: {
      200: ndType._response.createPlaylist,
    },
  },
  deletePlaylist: {
    body: null,
    method: 'DELETE',
    path: 'playlist/:id',
    responses: {
      200: ndType._response.deletePlaylist,
    },
  },
  getAlbumArtistDetail: {
    method: 'GET',
    path: 'albumArtist/:id',
    responses: {
      200: ndType._response.albumArtist,
    },
  },
  getAlbumArtistList: {
    method: 'GET',
    path: 'albumArtist',
    pathParams: ndType._parameters.albumArtistList,
    responses: {
      200: ndType._response.albumArtistList,
    },
  },
  getAlbumDetail: {
    method: 'GET',
    path: 'album/:id',
    responses: {
      200: ndType._response.album,
    },
  },
  getAlbumList: {
    method: 'GET',
    path: 'album',
    responses: {
      200: ndType._response.albumList,
    },
  },
  getGenreList: {
    method: 'GET',
    path: 'genre',
    responses: {
      200: ndType._response.genreList,
    },
  },
  getPlaylistDetail: {
    method: 'GET',
    path: 'playlist/:id',
    responses: {
      200: ndType._response.playlist,
    },
  },
  getPlaylistList: {
    method: 'GET',
    path: 'playlist',
    responses: {
      200: ndType._response.playlistList,
    },
  },
  getSongDetail: {
    method: 'GET',
    path: 'song/:id',
    responses: {
      200: ndType._response.song,
    },
  },
  getSongList: {
    method: 'GET',
    path: 'song',
    pathParams: ndType._parameters.songList,
    responses: {
      200: ndType._response.songList,
    },
  },
  getUserList: {
    method: 'GET',
    path: 'user',
    responses: {
      200: ndType._response.userList,
    },
  },
  removeFromPlaylist: {
    body: null,
    method: 'DELETE',
    path: 'playlist/:id/tracks',
    query: ndType._parameters.removeFromPlaylist,
    responses: {
      200: ndType._response.removeFromPlaylist,
    },
  },
  updatePlaylist: {
    body: ndType._parameters.updatePlaylist,
    method: 'PUT',
    path: 'playlist/:id',
    responses: {
      200: ndType._response.updatePlaylist,
    },
  },
});

const axiosClient = axios.create({});

axiosClient.interceptors.response.use(
  (response) => {
    const serverId = useAuthStore.getState().currentServer?.id;

    if (serverId) {
      useAuthStore.getState().actions.updateServer(serverId, {
        ndCredential: response.headers['x-nd-authorization'] as string,
      });
    }

    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      toast.error({
        message: 'Your session has expired.',
      });

      const serverId = useAuthStore.getState().currentServer?.id;

      if (serverId) {
        useAuthStore.getState().actions.setCurrentServer(null);
        useAuthStore.getState().actions.updateServer(serverId, { ndCredential: undefined });
      }
    }

    return Promise.reject(error);
  },
);

export const ndApiClient = initClient(contract, {
  api: async ({ path, method, headers, body }) => {
    const server = useAuthStore.getState().currentServer;
    const baseUrl = `${server?.url}/api`;
    const token = server?.ndCredential;

    try {
      const result = await axiosClient.request({
        data: body,
        headers: { ...headers, 'x-nd-authorization': `Bearer ${token}` },
        method: method as Method,
        url: `${baseUrl}/${path}`,
      });
      return { body: result.data, status: result.status };
    } catch (e: Error | AxiosError | any) {
      if (isAxiosError(e)) {
        const error = e as AxiosError;
        const response = error.response as AxiosResponse;
        return { body: response.data, status: response.status };
      }
      throw e;
    }
  },
  baseHeaders: {
    'Content-Type': 'application/json',
  },
  baseUrl: '',
});
