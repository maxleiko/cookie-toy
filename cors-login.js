function auth(login, password) {
  var details = { login, password };

  var formBody = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");

  return fetch('http://localhost:8787/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: formBody,
    redirect: "follow",
  })
}

// this will set the cookie properly but won't redirect as it is a CORS request
// even though 'fetch' is called with `redirect: "follow"`
const res = await auth('admin', 'admin');
// res.statusCode === 200
// res.statusText === "OK"