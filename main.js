let graphql = JSON.stringify({
    query: `{
            user(where:{login:{_eq:"abmutungi"}}){
              login
                transactions{
                  object{
                    name
                  }
                  amount type
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
        sortTransaction(result.data);
        sortProgress(result.data);

    })
    .catch((error) => console.log("error", error));

const msToDays = (ms) =>{
 return Math.trunc(ms/(1000*60*60*24))
}

const sortTransaction = (data) => {
  // console.log("Data from fetch for abmutungi", data);
  for (let obj of data.user) {
    obj.transactions.sort(function(a,b){
      return new Date(b.object.createdAt) - new Date(a.object.createdAt);
    });
    
    let tranObj = {};

    obj.transactions.forEach(item => tranObj[item.object.name] = item);

    tranObj[1];

    console.log(Object.values(tranObj))
       
   }
};

const sortProgress = (data) => {
   // console.log("Data from fetch for abmutungi", data);
    for (let obj of data.user) {
      //console.log(obj.progresses);
      obj.progresses.sort(function(a,b){
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
    
        for (let i = 0; i < obj.progresses.length; i++) {

          console.log(msToDays((new Date(obj.progresses[i].updatedAt) - new Date(obj.progresses[i].createdAt))), obj.progresses[i].object.name);
         }
        
    }
};

