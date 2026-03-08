const API_URL = "https://script.google.com/macros/s/AKfycbwqqhi9c47fwoqlZ6sABBMBzPntzPV1ANP6RfMClCdKIG3ixx04mXNBfo6ST7ufImCtTQ/exec"

let chart = null

// โหลดข้อมูลจาก API
function loadData(){

fetch(API_URL)
.then(res => res.json())
.then(data => {

renderTotal(data)
renderChart(data)
renderTransactions(data)

})
.catch(err => {

console.log("โหลดข้อมูลไม่สำเร็จ", err)

})

}



// คำนวณเงินรวม
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



// สร้างกราฟวงกลม
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



// แสดงรายการธุรกรรม
function renderTransactions(list){

let box = document.getElementById("transactionList")

box.innerHTML = ""

list.slice().reverse().forEach(t => {

let color = t.type === "income" ? "green" : "red"
let sign = t.type === "income" ? "+" : "-"

box.innerHTML += `

<div class="transaction">

<div>

<b>${t.category}</b><br>
${new Date(t.date).toLocaleDateString()}

</div>

<div style="color:${color}">

${sign}${Number(t.amount).toLocaleString()}

</div>

</div>

`

})

}



// เพิ่มรายการใหม่
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

document.getElementById("amount").value = ""

loadData()

})

}



// โหลดข้อมูลเมื่อเปิดเว็บ
loadData()
