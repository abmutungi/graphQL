let graphql = JSON.stringify({
    query: `{
      user(where:{login:{_eq:"abmutungi"}}){
        login
          transactions(where:{_or: [{_and: [{type: {_eq: "xp"}}, {object: {type: {_eq: "bonus"}}}]},{
            _and: [{type:{_eq:"xp"}}, {createdAt:{_gt:"2021-10-25"}}, {amount:{_gte:"5000"}}]}]} order_by:{createdAt: desc}){
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
              grade
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

const msToDays = (ms) => {
    return Math.trunc(ms / (1000 * 60 * 60 * 24));
};

const sortTransaction = (data) => {
    //console.log("Data from fetch for abmutungi", data);
    for (let obj of data.user) {
        // console.log(obj.transactions)

        const res = Object.values(
            obj.transactions.reduce((acc, obj) => {
                const curr = acc[obj.object.name];
                acc[obj.object.name] = curr
                    ? curr.amount < obj.amount
                        ? obj
                        : curr
                    : obj;
                return acc;
            }, {})
        );

        res.sort(function (a, b) {
            return new Date(b.object.createdAt) - new Date(a.object.createdAt);
        });

        //console.log(Object.values(res))

        let sum = 0;
        let xpPie = {};

        for (let subj of Object.values(res)) {
            // console.log(subj.object.name, subj.amount/1000);
            subj.amount = subj.amount / 1000;
            sum += subj.amount;
            xpPie[subj.object.name] = subj.amount;
        }

        createPie(sum, xpPie);

        Object.entries(xpPie).forEach(([key]) => {
            let a = document.createElement("a");
            let linkText = document.createTextNode(`${key}`);
            a.appendChild(linkText);
            a.title = key;
            a.href = "#";
            let node = document.createElement("li");
            node.appendChild(a);
            document.querySelector("ul").appendChild(node);
        });

        let totalXP = Math.round(sum) + "kB";
        console.log(totalXP);

        xp.innerHTML = totalXP;
    }
};

let yAxis = 9;
let startY = 1;
const yRow = 25;

const createBar = (days, subject) => {
    let barWidth = days * 5;
    let barSpace = 200;

    return ` <g class="bar">
    <rect width="${barWidth}" height="19" y="${startY}"></rect>
    <text x="${barSpace}" y="${yAxis}" dy=".35em">${subject}</text>
    <text x="10" y="${yAxis}" dy=".35em">${days} days</text>

  </g>`;
};

let strokeDOF = 0;

const createPie = (totalXP, subjData) => {
    Object.entries(subjData).forEach(([key, value]) => {
        console.log(value);
        let slice = (value / totalXP) * 31.4;
        let randomColor = Math.floor(Math.random() * 16777215).toString(16);

        pieChart.innerHTML += `
            // <circle r="5" cx="10" cy="10" fill="transparent"
            // stroke=#${randomColor}
            // stroke-width="10"
            // stroke-dasharray="${slice} 31.4"
            // stroke-dashoffset="-${strokeDOF}"
            // />	
            // `;

        strokeDOF += slice;
    });
};

const createTable = (subjData) => {
    console.log(subjData);

    Object.entries(subjData).forEach(([key, value]) => {
        let tr = "<tr>";

        tr +=
            "<td>" +
            key +
            "</td>" +
            "<td>" +
            value.toString() +
            "</td></tr>";

        /* We add the table row to the table body */
        tbody.innerHTML += tr;
    })
};

const sortProgress = (data) => {
    // console.log("Data from fetch for abmutungi", data);
    let projBar = {};
    let grade = {};

    for (let obj of data.user) {
        //console.log(obj.progresses);
        obj.progresses.sort(function (a, b) {
            return new Date(a.createdAt) - new Date(b.createdAt);
        });

        for (let i = 0; i < obj.progresses.length; i++) {
            projBar[
                msToDays(
                    new Date(obj.progresses[i].updatedAt) -
                        new Date(obj.progresses[i].createdAt)
                )
            ] = obj.progresses[i].object.name;
            grade[obj.progresses[i].object.name] =
                obj.progresses[i].grade.toFixed(2);
        }
    }
    // console.log(projBar);

    createTable(grade);

    Object.entries(projBar).forEach(([key, value]) => {
        let barDiv = createBar(key, value);

        barChart.innerHTML += barDiv;
        yAxis += yRow;
        startY += yRow;
    }),
        (yAxis = 9);
    startY = 0;
};
