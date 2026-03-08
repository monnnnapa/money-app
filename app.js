const API = "https://script.google.com/macros/s/AKfycbxGX04yKUqOicvMUFIBS7pUvRSj2Cxs0CqBydCq002dPGlRN4Jz1bmHfvmcD4Fg6A64NQ/exec"

async function loadData(){

const res = await fetch(API)
const data = await res.json()

let html = ""

data.forEach(item => {

html += `
<div>
${item.note} - ${item.amount}
<button onclick="deleteItem('${item.id}')">ลบ</button>
</div>
`

})

document.getElementById("list").innerHTML = html

}

loadData()
async function addItem(){

let data = {
id: Date.now(),
type: document.getElementById("type").value,
category: document.getElementById("category").value,
amount: document.getElementById("amount").value,
note: document.getElementById("note").value,
user: "prem"
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
<button onclick="addItem()">เพิ่มรายการ</button>
