const API_URL = "https://script.google.com/macros/s/AKfycbwqqhi9c47fwoqlZ6sABBMBzPntzPV1ANP6RfMClCdKIG3ixx04mXNBfo6ST7ufImCtTQ/exec"

let chart = null



function loadData(){

fetch(API_URL)
.then(res => res.json())
.then(data => {

renderTotal(data)
renderChart(data)
renderTransactions(data)
renderGoalChart(data)

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

function renderGoalChart(list){

let total = 0

list.forEach(t=>{
if(t.type==="income"){
total += Number(t.amount)
}else{
total -= Number(t.amount)
}
})

fetch(API_URL + "?sheet=goal")
.then(res=>res.json())
.then(goals=>{

let labels=[]
let goalValues=[]
let currentValues=[]

goals.forEach(g=>{

labels.push(g.name)
goalValues.push(Number(g.amount))
currentValues.push(total)

})

const ctx=document.getElementById("goalChart")

if(goalChart){
goalChart.destroy()
}

goalChart=new Chart(ctx,{

type:'bar',

data:{
labels:labels,
datasets:[
{
label:"เงินปัจจุบัน",
data:currentValues
},
{
label:"เป้าหมาย",
data:goalValues
}
]
},

options:{
responsive:true
}

})

})

}

loadData()
