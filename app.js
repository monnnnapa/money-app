const API = "https://script.google.com/macros/s/AKfycbwMkQZZRGh6ffE8yTgasdlIIGeIt9EeM4X5imtSuxKYOQQmZ-ceGxfxJsVExy14lHpjsg/exec"
async function loadData(){

const res = await fetch(API)
const data = await res.json()

let html = ""
let balance = 0

let food = 0
let gas = 0
let travel = 0

data.forEach(item => {

if(item.type === "income"){
balance += Number(item.amount)
}else{
balance -= Number(item.amount)
}

if(item.category === "food") food += Number(item.amount)
if(item.category === "gas") gas += Number(item.amount)
if(item.category === "travel") travel += Number(item.amount)

html += `

<div class="item">

<b>${item.note}</b><br>

${item.category} - ${item.amount}

<br><br>

<button onclick="deleteItem('${item.id}')">
ลบ
</button>

</div>

`

})

document.getElementById("list").innerHTML = html

document.getElementById("balance").innerText =
"฿" + balance.toLocaleString()

drawChart(food,gas,travel)

}

function drawChart(food,gas,travel){

new Chart(document.getElementById("chart"),{

type:"doughnut",

data:{
labels:["อาหาร","น้ำมัน","เที่ยว"],

datasets:[{

data:[food,gas,travel]

}]

}

})

}

async function addItem(){

let data = {

id: Date.now(),

type: document.getElementById("type").value,

category: document.getElementById("category").value,

amount: document.getElementById("amount").value,

note: document.getElementById("note").value,

user: "user1"

}

await fetch(API,{
method:"POST",
body:JSON.stringify(data)
})

document.getElementById("category").value=""
document.getElementById("amount").value=""
document.getElementById("note").value=""

loadData()

}

async function deleteItem(id){

await fetch(API + "?id=" + id,{
method:"DELETE"
})

loadData()

}

loadData()
