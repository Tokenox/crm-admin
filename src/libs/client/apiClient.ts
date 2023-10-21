import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Create an Axios instance with custom configuration
const apiInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:4000/rest', // Set your API base URL
  timeout: 10000, // Set the default timeout
  headers: {
    'Content-Type': 'application/json' // Set default content type
  },
  withCredentials: true // Set default withCredentials to true
});

// Define Request Config with generic types
interface RequestConfig<T> {
  data?: T;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  timeout?: number;
  withCredentials?: boolean;

  // Add more request-specific configuration options as needed
}

// Define Response Schema with generic types
interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: AxiosRequestConfig;
  request?: any;
}

// Request Interceptor
apiInstance.interceptors.request.use(
  (config) => {
    // Modify request config here (e.g., add headers, authentication tokens)
    return config;
  },
  (error) => {
    // Handle request error (e.g., network issues)
    return Promise.reject(error);
  }
);

// Response Interceptor
apiInstance.interceptors.response.use(
  (response) => {
    // Modify response data or headers here if needed
    return response;
  },
  (error) => {
    // Handle response errors (e.g., HTTP error codes, custom error handling)
    return Promise.reject(error);
  }
);

// Usage example: Making a GET request with cancellation using AbortController
function fetchData<T>(endpoint: string, config?: RequestConfig<T>) {
  const controller = new AbortController();
  const signal = controller.signal;

  const requestConfig: AxiosRequestConfig = {
    ...config,
    signal // Attach the AbortController's signal to the request
  };

  return apiInstance.get(endpoint, requestConfig).finally(() => {
    controller.abort(); // Cancel the request when it's no longer needed
  });
}

// Usage example: Making a POST request with cancellation using AbortController
function postData<T>(endpoint: string, config: RequestConfig<T>) {
  debugger;

  const controller = new AbortController();
  const signal = controller.signal;

  const requestConfig: AxiosRequestConfig = {
    ...config.data,
    signal // Attach the AbortController's signal to the request
  };
  //   const requestConfig: AxiosRequestConfig = {
  //     method: 'POST',
  //     url: 'https://your-api-endpoint.com/your-post-route',
  //     data: requestData,
  //     signal

  //     // Add headers, authorization, or other request configuration options as needed
  //   };

  return apiInstance
    .post('http://localhost:4000/rest/auth/login', requestConfig)
    .then((res) => {
      debugger;
      console.log(res);
    })
    .catch((e) => console.log(e))
    .finally(() => {
      controller.abort(); // Cancel the request when it's no longer needed
    });
}

export { fetchData, postData };

// async function performPostRequest() {
//   const requestData = {
//     key1: 'value1',
//     key2: 'value2'
//     // Add more data as needed
//   };

//   const requestConfig: AxiosRequestConfig = {
//     method: 'POST',
//     url: 'https://your-api-endpoint.com/your-post-route',
//     data: requestData
//     // Add headers, authorization, or other request configuration options as needed
//   };

//   try {
//     const response: AxiosResponse = await axios(requestConfig);
//     console.log('POST request successful', response.data);
//   } catch (error) {
//     console.error('POST request failed', error);
//   }
// }

// performPostRequest();
