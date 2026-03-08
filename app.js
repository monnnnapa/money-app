const API_URL = "https://script.google.com/macros/s/AKfycbwUI-sPYGV_7QQEkzv70klIzJbj6IFnETw0E134xrqCM8BILroVNDh6_wP-EjaLVCjVkw/exec";

let chart;

function loadData(){

fetch(API_URL)
.then(res=>res.json())
.then(data=>{

const transactions = data.transactions
const goals = data.goals

renderBalance(transactions)
renderPie(transactions)
renderGoals(goals)
renderTransactions(transactions)

})

}

function renderBalance(data){

let balance=0

data.forEach(t=>{

if(t.type=="income") balance+=Number(t.amount)
if(t.type=="expense") balance-=Number(t.amount)

})

document.getElementById("balance").innerText = balance.toLocaleString()

}

function renderPie(data){

const categoryTotals={}

data.forEach(t=>{

if(t.type=="expense"){

if(!categoryTotals[t.category]){
categoryTotals[t.category]=0
}

categoryTotals[t.category]+=Number(t.amount)

}

})

const labels = Object.keys(categoryTotals)
const values = Object.values(categoryTotals)

if(chart) chart.destroy()

chart = new Chart(document.getElementById("pieChart"),{

type:"doughnut",

data:{
labels:labels,
datasets:[{
data:values
}]
}

})

}

function renderGoals(goals){

const box = document.getElementById("goals")

box.innerHTML=""

goals.forEach(g=>{

const percent = (g.saved/g.target)*100

box.innerHTML+=`

<div class="goal">

<strong>${g.name}</strong>

<div>${g.saved} / ${g.target}</div>

<div class="progress">
<div class="bar" style="width:${percent}%"></div>
</div>

</div>

`

})

}

function renderTransactions(data){

const box = document.getElementById("transactions")

box.innerHTML=""

data.slice().reverse().forEach(t=>{

box.innerHTML+=`

<div class="transaction">

<div>${t.date} ${t.category}</div>

<div class="${t.type}">
฿${t.amount}
</div>

</div>

`

})

}

loadData()
