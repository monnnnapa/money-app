const API_URL = "https://script.google.com/macros/s/AKfycbyvXkm3k0DWAmgtRJr0hyOTMTqa7Ajm0ERttHe2c8RrwIIlmp6dJfcN0ORYCjxjtpyNDg/exec"

const form = document.getElementById("form")

let expenseChart
let goalChart

form.addEventListener("submit",function(e){

e.preventDefault()

const category = document.getElementById("category").value
const amount = document.getElementById("amount").value
const type = document.getElementById("type").value

fetch(API_URL,{
method:"POST",
body:JSON.stringify({category,amount,type})
})
.then(res=>res.text())
.then(()=>{

showPopup()

loadData()

})

form.reset()

})

function loadData(){

fetch(API_URL)
.then(res=>res.json())
.then(data=>{

renderTotal(data)
renderChart(data)
renderTransactions(data)

})

renderGoalChart()

}

function renderTotal(list){

let total = 0

list.forEach(t=>{

if(t.type==="income"){
total+=Number(t.amount)
}

if(t.type==="expense"){
total-=Number(t.amount)
}

})

document.getElementById("totalMoney").innerText=
"฿"+total.toLocaleString()

}

function renderChart(list){

const expense={}

list.forEach(t=>{

if(t.type==="expense"){

if(!expense[t.category]){
expense[t.category]=0
}

expense[t.category]+=Number(t.amount)

}

})

const labels=Object.keys(expense)
const data=Object.values(expense)

if(expenseChart){
expenseChart.destroy()
}

expenseChart=new Chart(

document.getElementById("expenseChart"),

{
type:"pie",
data:{
labels:labels,
datasets:[{data:data}]
}
}

)

}

function renderGoalChart(){

fetch(API_URL+"?sheet=goal")
.then(res=>res.json())
.then(data=>{

const labels=data.map(r=>r.category)
const values=data.map(r=>Number(r.amount))

if(goalChart){
goalChart.destroy()
}

goalChart=new Chart(

document.getElementById("goalChart"),

{
type:"bar",
data:{
labels:labels,
datasets:[{
label:"Goal",
data:values
}]
}
}

)

})

}

function renderTransactions(list){

const ul=document.getElementById("transactionList")

ul.innerHTML=""

const latest=list.slice(-10).reverse()

latest.forEach(t=>{

const li=document.createElement("li")

li.innerText=
t.category+" - ฿"+Number(t.amount).toLocaleString()

ul.appendChild(li)

})

}

function showPopup(){

document.getElementById("popup").style.display="flex"

}

function closePopup(){

document.getElementById("popup").style.display="none"

}

loadData()
