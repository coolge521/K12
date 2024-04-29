import axios from 'axios';
import ucConfig from "./ucConfig.js";

axios.defaults.timeout = 60*1000*10;
axios.defaults.headers.put['Content-Type'] = 'application/json';

axios.defaults.baseURL = ucConfig.API_HOST;


axios.interceptors.request.use(
  config => {
    config.headers={
      // 'appKey':'8465974068',
      'license':'d68beaf2798b995797362051ab25b246',
      // 'Access-Control-Allow-Origin':'*',
      // 'Access-Control-Allow-Methods':'GET,HEAD,POST,DELETE,PUT,OPTIONS',
      // 'Access-Control-Allow-Headers':'content-type,appKey,license'
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params,
    })
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, params = {}, data = {}, progress) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: url,
      params: params,
      data: data,
      onUploadProgress: function (progressEvent) {
        if (progress != undefined) {
          let complete = (progressEvent.loaded / progressEvent.total * 100 | 0);
          console.log(complete);
          progress(complete)
        }
      },
    }).then(response => {
      resolve(response.data)
    }, err => {
      reject(err)
    })
  })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function ucdelete(url, params, data = {}) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'delete',
      url: url,
      params: params,
      data: data
    }).then(response => {
      resolve(response.data)
    }, err => {
      reject(err)
    })
  })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function put(url, params = {}, data = {}) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'put',
      url: url,
      params: params,
      data: data,
    }).then(response => {
      resolve(response.data)
    }, err => {
      reject(err)
    })
  })
}


export function custom(method, url, params = {}, data = {}) {
  return new Promise((resolve, reject) => {
    axios({
      method: method,
      url: url,
      params: params,
      data: data
    }).then(response => {
      resolve(response.data)
    }, err => {
      reject(err)
    })
  })
}

export function fetchBlob(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: url,
      params: params,
      responseType: 'arraybuffer',
    }).then(response => {
      resolve(response)
    }, err => {
      reject(err)
    })
  })
}

export function fetchHtml(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: url,
      params: params,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    }).then(response => {
      // let num1 = response.data.indexOf('({')
      // let num2 = response.data.indexOf('})')
      // let resultData = JSON.parse(response.data.substring(num1 + 1, num2 + 1))
      resolve(response)
    }, err => {
      reject(err)
    })
  })
}
