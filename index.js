// let stateArray = ["Alabama", "New_York_(state)", "California", "New_Jersey", "Florida"]

// document.addEventListener("DOMContentLoaded", () => {
    

//     stateArray.forEach( function (state) { 
//         fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${state}`)
//         .then(res => res.json())
//         .then(stateInfo => {
//             fetch('http://localhost:3000/states', {
//                 method: "POST",
//                 headers: {
//                     "Content-type": "application/json",
//                     accept: "application/json"
//                 },
//                 body: JSON.stringify({
//                     name: `${stateInfo.title}`,
//                     flag: `${stateInfo.thumbnail.source}`,
//                     description: `${stateInfo.extract}`,
//                     visits: 0
//                 })
//             })
//         })
//         .catch(alert("That's Not A State, ya donut"))
//     })    
// })

const form = document.querySelector('#state-form')

const statesDiv = document.querySelector('#state-list')

const passport = document.querySelector('#passport')

const newStates = {}


fetch('http://localhost:3000/states')
.then(res => res.json())
.then(jsonArray =>
    jsonArray.forEach(function(jsonObj) {
    const stateSpan = document.createElement('span');
        stateSpan.id = jsonObj.name
    
    const stateP = document.createElement('p');
        stateP.className = 'stateP'
        stateP.innerText = jsonObj.name
    
    const stateImg = document.createElement('img')
        stateImg.className = 'stateImg'
        stateImg.src = jsonObj.flag

    const stateVisitP = document.createElement('p')
        stateVisitP.innerText = jsonObj.visits

    const stateDeleteButton = document.createElement("button")
          stateDeleteButton.className = 'delete-button'
          stateDeleteButton.innerText = "Delete"

    const addToPassportButton = document.createElement("button")
        addToPassportButton.className = 'passport-button'
        addToPassportButton.innerText = 'Add to Passport'
        
    
        stateSpan.append(stateP, stateImg, stateVisitsP, stateDeleteButton, addToPassportButton)
        statesDiv.append(stateSpan)

    stateDeleteButton.addEventListener("click", () => {
            fetch(`http://localhost:3000/states/${jsonObj.id}`, {
                method: "DELETE", 
                headers: {
                    "Content-Type": "application/json"
                }  
            })
            .then(res => stateSpan.remove())
        
            }
    

    )
    addToPassportButton.addEventListener("click", () =>{
        newStates = jsonObj

        let stateTitle = document.createElement("span")
            stateTitle.

    })

    })
)



form.addEventListener("submit", function (evt) {
    evt.preventDefault();
    //console.log(evt)
    const newState = evt.target.newState.value
    //console.log(newState)
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${newState}`)
        .then(res => res.json())
        .then(stateInfo => {
            console.log(stateInfo)
            fetch('http://localhost:3000/states', {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    accept: "application/json"
                },
                body: JSON.stringify({
                    name: `${stateInfo.title}`,
                    flag: `${stateInfo.thumbnail.source}`,
                    description: `${stateInfo.extract}`,
                    visits: 0
                })
            })
            .then(res=>res.json())
            .then(jsonObj => {
                Object.assign(newStates, jsonObj)
                //console.log(newState)
                const stateSpan = document.createElement('span');
                    stateSpan.id = jsonObj.name
                
                const stateP = document.createElement('p');
                    stateP.className = 'stateP'
                    stateP.innerText = jsonObj.name
                
                const stateImg = document.createElement('img')
                    stateImg.className = 'stateImg'
                    stateImg.src = jsonObj.flag

                const stateVisitP = document.createElement('p')
                    stateVisitP.innerText = jsonObj.visits

                const stateDeleteButton = document.createElement("button")
                    stateDeleteButton.className = 'delete-button'
                    stateDeleteButton.innerText = "Delete"
                
                const addToPassportButton = document.createElement("button")
                        addToPassportButton.className = 'passport-button'
                        addToPassportButton.innerText = 'Add to Passport'

                
                stateSpan.append(stateP, stateImg, stateDeleteButton, addToPassportButton)

                statesDiv.append(stateSpan)

                stateDeleteButton.addEventListener("click", () => {
                    fetch(`http://localhost:3000/states/${jsonObj.id}`, {
                        method: "DELETE", 
                        headers: {
                            "Content-Type": "application/json"
                        }  
                    })
                    .then(res => stateSpan.remove())
                
                }
            )
            .catch(alert("That's Not A State, ya donut"))
        })
    
        })
})