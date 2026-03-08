const API_URL = "https://script.google.com/macros/s/AKfycbwUn_oPDKpiW2_D76syzrOBQFwI-3wCQzQTG7fIa0zmHzXNbt2iUMO-JcOXtsapshBPWQ/exec"

let chart = null



function loadData(){

fetch(API_URL)
.then(res => res.json())
.then(data => {

renderTotal(data)
renderChart(data)
renderTransactions(data)
renderGoalChart()

})

}



function renderTotal(list){

let total = 0

list.forEach(t => {

if(t.type === "income"){
total += Number(t.amount)
}else{
total -= Number(t.amount)
}

})

document.getElementById("totalMoney").innerText =
total.toLocaleString()

}



function renderChart(list){

let categories = {}

list.forEach(t => {

if(t.type === "expense"){

if(!categories[t.category]){
categories[t.category] = 0
}

categories[t.category] += Number(t.amount)

}

})

let labels = Object.keys(categories)
let values = Object.values(categories)

const ctx = document.getElementById("pieChart")

if(chart){
chart.destroy()
}

chart = new Chart(ctx,{

type:'doughnut',

data:{
labels:labels,
datasets:[{
data:values
}]
},

options:{
responsive:true
}

})

}



function renderTransactions(list){

let box = document.getElementById("transactionList")

box.innerHTML = ""

/* เอาแค่ 10 ล่าสุด */
let latest = list.slice(-10).reverse()

latest.forEach(t => {

let cls = t.type === "income" ? "income" : "expense"
let sign = t.type === "income" ? "+" : "-"

box.innerHTML += `

<div class="transaction">

<div>
<b>${t.category}</b>
</div>

<div class="${cls}">
${sign}${Number(t.amount).toLocaleString()}
</div>

</div>

`

})

}



function saveTransaction(){

let type = document.getElementById("type").value
let category = document.getElementById("category").value
let amount = document.getElementById("amount").value

if(!amount){
alert("กรอกจำนวนเงิน")
return
}

fetch(API_URL,{
method:"POST",
body:JSON.stringify({
type:type,
category:category,
amount:amount
})
})
.then(res => res.text())
.then(() => {

document.getElementById("amount").value=""

loadData()

showPopup()

})

}



function showPopup(){
document.getElementById("popup").style.display="flex"
}



function closePopup(){
document.getElementById("popup").style.display="none"
}

function renderGoalChart(){

fetch(API_URL + "?sheet=goal")
.then(res => res.json())
.then(goals => {

let labels = []
let savedData = []
let targetData = []

goals.forEach(g => {

labels.push(g.name)
savedData.push(Number(g.saved))
targetData.push(Number(g.target))

})

const ctx = document.getElementById("goalChart")

if(!ctx) return

if(goalChart){
goalChart.destroy()
}

goalChart = new Chart(ctx, {

type: 'bar',

data: {
labels: labels,
datasets: [
{
label: "เงินที่เก็บแล้ว",
data: savedData
},
{
label: "เป้าหมาย",
data: targetData
}
]
},

options: {
responsive: true,
plugins:{
legend:{
position:'bottom'
}
}
}

})

})

}
loadData()
