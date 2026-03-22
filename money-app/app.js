const API_URL = "https://script.google.com/macros/s/AKfycbyW_9hDAzWoxosma_bbaivyvl9mjRP_hd7gO7Qovgp2zsH1tVzKaoZZSCIlRHiKOsXrFA/exec"

async function loadData(){

const res = await fetch(API_URL)
const data = await res.json()

let html = ""

data.forEach(item => {

html += `
<div>
${item.note} - ${item.amount}
</div>
`

})

document.getElementById("list").innerHTML = html

}

loadData()
