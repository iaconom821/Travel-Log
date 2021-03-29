let stateArray = ["Alabama", "New_York", "California", "New_Jersey", "Florida"]

document.addEventListener("DOMContentLoaded", () => {
    
    //for( let i; i < stateArray.length; i++ ){
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/California`)
    .then(res => res.json())
    .then(stateInfo => {console.log(stateInfo)})
    //}

})