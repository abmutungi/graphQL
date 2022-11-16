const queryString = 
`{
    user (where:{login:{_eq:"tb38r"}}){
      login:
      transactions(order_by:{amount: desc}){
        object{
          name
          createdAt
          updatedAt
        }
        amount
      }
      progresses(where:{
              _and: [{object:{type:{_eq:"project"}}}, {isDone: {_eq: true}}]}){
        createdAt
        updatedAt
        object {
          name
        }
  
      }
    }
  }`
        



const userOptions = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: queryString,
      // query: getBooksQuery(keyword),
    }),
  };


const displayQueryResult=(data)=>{
    console.log(data);
}


  fetch('https://learn.01founders.co/api/graphql-engine/v1/graphql', userOptions)
  .then((res) => res.json())
  .then(function (userdata) {
    displayQueryResult(userdata);
  });