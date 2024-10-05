import axios, { AxiosRequestConfig } from 'axios';
// Importing Constants
import {
  BASE_URL,
  RESPONSE_STATUS_200,
  RESPONSE_STATUS_201,
} from '@/lib/constants';

interface FetcherOptions extends AxiosRequestConfig {
  token?: string;
}

async function baseFetcher(url: string, options: FetcherOptions = {}) {
  const { token, method = 'GET', data, ...restOptions } = options;

  const config: AxiosRequestConfig = {
    url: `${BASE_URL}${url}`,
    method,
    ...restOptions,
    headers: {
      ...restOptions.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  if (data) {
    config.data = data;
    if (typeof data === 'string') {
      config.headers = {
        ...config.headers,
        'Content-Type': 'application/json',
      };
    } else if (data instanceof FormData) {
      config.headers = {
        ...config.headers,
        'Content-Type': 'multipart/form-data',
      };
    }
  }

  try {
    const response = await axios(config);
    if (
      response.status !== RESPONSE_STATUS_200 &&
      response.status !== RESPONSE_STATUS_201
    ) {
      throw new Error('Failed to fetch data');
    }
    return response.data || true;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Failed to fetch data');
  }
}

export const fetcher = {
  get: (url: string, options?: FetcherOptions) =>
    baseFetcher(url, { ...options, method: 'GET' }),
  post: (url: string, data: any, options?: FetcherOptions) =>
    baseFetcher(url, { ...options, method: 'POST', data }),
  thirdParty: (url: string, options?: AxiosRequestConfig) =>
    axios.get(url, options).then((response) => response.data),
};

// Specific fetcher for Safe API
export const safeFetcher = {
  getSafes: (ownerAddress: string) =>
    fetcher.get(`/owners/${ownerAddress}/safes`),
};
