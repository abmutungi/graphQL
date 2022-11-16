let graphql = JSON.stringify({
    query: `{user (where:{login:{_eq:"abmutungi"}}){ 
          login:
          transactions( where: {
          _and: [{ type: { _eq: "xp" } }]
          } order_by:{amount: desc}){
            userId
            object{
              name
              createdAt
              updatedAt
            }
            amount type
          }
          progresses(where:{
                  _and: [{object:{type:{_eq:"project"}}}, {isDone: {_eq: true}}]}order_by:{updatedAt:asc}){
            createdAt
            updatedAt
            object {
              name
            }
      
          }
      
        }
        group (where:{members:{userLogin:{_eq:"abmutungi"}}}){
            members{
              user{
                login
                roles{
                  description
                  user{
                    login
                  }
                }
              }
            }
          }
      }`,
});

let requestOptions = {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: graphql,
};

fetch(
    "https://learn.01founders.co/api/graphql-engine/v1/graphql",
    requestOptions
)
    .then((response) => response.json())
    .then(function (result) {
        console.log(result.data);

    })
    .catch((error) => console.log("error", error));