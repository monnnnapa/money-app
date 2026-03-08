const API = "https://script.google.com/macros/s/AKfycbxGX04yKUqOicvMUFIBS7pUvRSj2Cxs0CqBydCq002dPGlRN4Jz1bmHfvmcD4Fg6A64NQ/exec"

async function loadData(){

const res = await fetch(API)
const data = await res.json()

let html = ""

data.forEach(item => {

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

loadData()

}


async function deleteItem(id){

await fetch(API + "?id=" + id,{
method:"DELETE"
})

loadData()

}
let balance = 0

data.forEach(item=>{

if(item.type === "income"){
balance += Number(item.amount)
}else{
balance -= Number(item.amount)
}

})

document.getElementById("balance").innerText =
"฿" + balance.toLocaleString()

loadData()
