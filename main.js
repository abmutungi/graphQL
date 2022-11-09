let myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

let graphql = JSON.stringify({
  query: "{\n  user(where:{login:{_eq:\"abmutungi\"}}){\n    login\n    transactions{\n      object{\n        name\n      }\n      amount\n    }\n       progresses(where:{\n            _and: [{object:{type:{_eq:\"project\"}}}, {isDone: {_eq: true}}]}){\n      createdAt\n      updatedAt\n      object {\n        name\n      }\n    }\n  }\n}",
  variables: {}
})
let requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: graphql,
  redirect: 'follow'
};

fetch("https://learn.01founders.co/api/graphql-engine/v1/graphql", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));