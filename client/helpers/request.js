// import fetch from 'isomorphic-fetch';
const baseUrl = process.env.API_URL || 'http://localhost:3005/api';
const request = async (route, method = 'GET', data = {}) => {
  try {
    let res
    if (method === 'GET') {
      res = await fetch(baseUrl + route,
        {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            token: localStorage.getItem('token') || null
          },
        });
    } else if (data instanceof FormData) {
      res = await fetch(baseUrl + route,
        {
          method: method,
          enctype: "multipart/form-data",
          headers: {
            token: localStorage.getItem('token') || null
          },
          body: data,
        });
    } else {
      res = await fetch(baseUrl + route,
        {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            token: localStorage.getItem('token') || null
          },
          body: JSON.stringify(data),
        });
    };

    const response = await res.json();
    response.message ? console.log(response.message) : null
    if (response.message && response.message === 'invalid token' ) {
      localStorage.clear();
      location.pathname= '/signin';
    }
    return response;
  } catch(e) {
    if (e.message === 'Failed to fetch') {
      return { message: `Could not connect to server! Please make sure that server ${baseUrl} is live` };
    };
    return { message: e.message };
  };
};

export {
  baseUrl,
  request
};

export default request;
