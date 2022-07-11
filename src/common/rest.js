const resolve = (response) => {
  return response.json().then((data) => {
    return { data: data, details: response };
  });
};

const get = (url) => {
  return fetch(window.CLOUDGOBRRR.API_URL + url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(resolve);
};

const post = (url, body) => {
  return fetch(window.CLOUDGOBRRR.API_URL + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then(resolve);
};

const getWithAuth = (url) => {
  return fetch(window.CLOUDGOBRRR.API_URL + url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
  }).then(resolve);
};

const postWithAuth = (url, body) => {
  return fetch(window.CLOUDGOBRRR.API_URL + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(body),
  }).then(resolve);
};

const rest = { get, post, getWithAuth, postWithAuth };

export default rest;
