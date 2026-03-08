const API_URL = "https://script.google.com/macros/library/d/12pqurz0OyXkdBywdJjASVT3NqlFAm6XelnR4L8e0ctdWGFc5yjdCO-63/5"

let chart

function loadData(){

fetch(API_URL)
.then(res=>res.json())
.then(data=>{

renderTotal(data)
renderChart(data)
renderGoals(data.goals)
renderTransactions(data.transactions)

})

}

function renderTotal(data){

let total = data.transactions.reduce((sum,t)=>{

if(t.type=="income") return sum + Number(t.amount)
else return sum - Number(t.amount)

},0)

document.getElementById("totalMoney").innerText = total.toLocaleString()

}

function renderChart(data){

let categories={}

data.transactions.forEach(t=>{

if(t.type=="expense"){

if(!categories[t.category]) categories[t.category]=0

categories[t.category]+=Number(t.amount)

}

})

let labels=Object.keys(categories)
let values=Object.values(categories)

const ctx=document.getElementById("pieChart")

chart=new Chart(ctx,{

type:'doughnut',

data:{
labels:labels,
datasets:[{
data:values
}]
}

})

}

function renderGoals(goals){

let box=document.getElementById("goalList")

box.innerHTML=""

goals.forEach(g=>{

let percent=Math.floor(g.saved/g.target*100)

box.innerHTML+=`

<div class="goal">

<b>${g.name}</b>

<p>${g.saved}/${g.target}</p>

<div class="progress">

<div class="progress-bar" style="width:${percent}%"></div>

</div>

</div>

`

})

}

function renderTransactions(list){

let box=document.getElementById("transactionList")

box.innerHTML=""

list.slice().reverse().forEach(t=>{

let color = t.type=="income" ? "green":"red"
let sign = t.type=="income" ? "+" : "-"

box.innerHTML+=`

<div class="transaction">

<div>

<b>${t.category}</b><br>
${t.date}

</div>

<div style="color:${color}">

${sign}${t.amount}

</div>

</div>

`

})

}
function saveTransaction(){

let type = document.getElementById("type").value
let category = document.getElementById("category").value
let amount = document.getElementById("amount").value

fetch(API_URL,{

method:"POST",

body:JSON.stringify({

action:"addTransaction",
type:type,
category:category,
amount:amount

})

})
.then(res=>res.text())
.then(()=>{

document.getElementById("amount").value=""

loadData()

})

}

}

loadData()
