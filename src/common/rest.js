const resolve = (response) => {
  return response.json().then((data) => {
    return { data: data, details: response };
  });
};

const header = {
  "Content-Type": "application/json",
};

const headerWithToken = () => {
  const headers = header;
  headers["Authorization"] = localStorage.getItem("token");
  return headers;
};

const get = (url, auth, params = undefined) => {
  var tmp = window.CLOUDGOBRRR.API_URL + url;
  if (params !== undefined) {
    tmp += "?" + new URLSearchParams(params).toString();
  }
  return fetch(tmp, {
    method: "GET",
    headers: auth ? headerWithToken() : header,
  }).then(resolve);
};

const post = (url, auth, body) => {
  return fetch(window.CLOUDGOBRRR.API_URL + url, {
    method: "POST",
    headers: auth ? headerWithToken() : header,
    body: JSON.stringify(body),
  }).then(resolve);
};

const rest = { get, post };

export default rest;
