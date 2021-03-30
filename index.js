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

const addStateForm = document.querySelector('#form')

const allStates = ["Florida", "Nevada", "Wyoming", "Idaho", "Montana", "Utah", "Maine", "New Hampshire", "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Hawaii", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Nebraska", "New Jersey", "New Mexico", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Vermont", "Virginia", "West Virginia", "Wisconsin", "New York", "Georgia", "Washington"]

const statesInDb = []

let selectedState = {}



//Initial Fetch, populates left side state board when searched
fetch('http://localhost:3000/states')
.then(res => res.json())
.then(jsonArray =>
    jsonArray.forEach(function(jsonObj) {
        statesInDb.push(jsonObj.name)
        
        const stateSpan = document.createElement('span');
            stateSpan.className = 'state-sidebar'
        
        const stateP = document.createElement('p');
            stateP.className = 'stateP'
            stateP.innerText = jsonObj.name
            stateP.className = 'state-name'
        
        const stateImg = document.createElement('img')
            stateImg.className = 'stateImg'
            stateImg.src = jsonObj.flag

        const stateVisitP = document.createElement('p')
            stateVisitP.innerText = `Visits: ${jsonObj.visits}`
        
        const stateVisitAddButton = document.createElement('button')
            stateVisitAddButton.innerText = 'Add Visit'
        
        const stateVisitDeleteButton = document.createElement('button')
            stateVisitDeleteButton.innerText = 'Delete Visit'

        const stateDeleteButton = document.createElement("button")
            stateDeleteButton.className = 'delete-button'
            stateDeleteButton.innerText = "Delete"

        const addToPassportButton = document.createElement("button")
            addToPassportButton.className = 'passport-button'
            addToPassportButton.innerText = 'Add to Passport'
            
        stateSpan.append(stateP, stateImg, stateVisitP, stateVisitAddButton, stateVisitDeleteButton, stateDeleteButton, addToPassportButton)

        statesDiv.append(stateSpan)

        stateVisitAddButton.addEventListener('click', () => {
            fetch(`http://localhost:3000/states/${jsonObj.id}`, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify({
                    visits: jsonObj.visits + 1
                })
            })
            .then(res => res.json())
            .then(newObj => {
                jsonObj.visits = newObj.visits
                stateVisitP.innerText = `Visits: ${jsonObj.visits}`
            })
        })
        
        stateVisitDeleteButton.addEventListener('click', () => {
            if(jsonObj.visits > 0) {
                fetch(`http://localhost:3000/states/${jsonObj.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-type": "application/json",
                        accept: "application/json"
                    },
                    body: JSON.stringify({
                        visits: jsonObj.visits - 1
                    })
                })
                .then(res => res.json())
                .then(newObj => {
                    jsonObj.visits = newObj.visits
                    stateVisitP.innerText = `Visits: ${jsonObj.visits}`
                })
            }
        })
        //  Delete from "database" 

        stateDeleteButton.addEventListener("click", () => {
            fetch(`http://localhost:3000/states/${jsonObj.id}`, {
                method: "DELETE", 
                headers: {
                    "Content-Type": "application/json"
                }  
            })
            .then(res => stateSpan.remove())   
        })

        //addds selected state to Passport, along with existing comments and info
        addToPassportButton.addEventListener("click", () =>{
            selectedState = Object.assign(jsonObj)

            const passportSpan = document.createElement('span');
                passportSpan.id = selectedState.name
            
            const passportP = document.createElement('p');
                passportP.className = 'stateP'
                passportP.innerText = selectedState.name
            
            const passportImg = document.createElement('img')
                passportImg.className = 'stateImg'
                passportImg.src = selectedState.flag
            
            const stateDescriptP = document.createElement('p')
                stateDescriptP.className = 'description'
                stateDescriptP.innerText = selectedState.description
            
            const commentForm = document.createElement('form')
                commentForm.id = 'comment-form'
            
            const commentTitleInput = document.createElement('input')
                commentTitleInput.type = 'text'
                commentTitleInput.name = 'title'
                commentTitleInput.placeholder = 'Add Title'
            
            const commentEntryInput = document.createElement('textarea')
                commentEntryInput.id = 'entry'
                commentEntryInput.placeholder = 'New Entry'
            
            const commentSubmit = document.createElement('input')
                commentSubmit.type = 'submit'
                commentSubmit.id = 'comment-submit'
                commentSubmit.value = 'Add Entry'

            const passportDeleteButton = document.createElement("button")
                passportDeleteButton.className = 'delete-button'
                passportDeleteButton.innerText = "Delete"

            const commentList = document.createElement("ul")
            commentList.classList.add("comment-content")

            //add comments
            for(key in jsonObj.comments){
                const commentLi = document.createElement("li")
                    commentLi.innerText = `${key}: ${jsonObj.comments[key]}`
                    commentList.append(commentLi)
            }

            commentForm.append(commentTitleInput, commentEntryInput, commentSubmit )

            passportSpan.append(passportP, passportImg, stateDescriptP, commentForm, passportDeleteButton, commentList)

            passport.append(passportSpan)


            passportDeleteButton.addEventListener("click", () => {
                passportSpan.remove()
            
            })

            commentForm.addEventListener('submit', (evt) => {
                evt.preventDefault()
                selectedState.comments = Object.assign(selectedState.comments, {[evt.target.title.value]: evt.target.entry.value})
                fetch(`http://localhost:3000/states/${jsonObj.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json"
                    },
                    body: JSON.stringify({
                        comments: Object.assign(selectedState.comments, {[evt.target.title.value]: evt.target.entry.value})
                    })
                })
                .then(res => res.json())
                .then(newObj => {
                    commentList.innerHTML= ' '
                    for(key in newObj.comments){
                        const commentLi = document.createElement("li")
                            commentLi.innerText = `${key}: ${newObj.comments[key]}`
                            commentList.append(commentLi)
                    }
                })
            })
        })
    })
)

//form for adding new comments to the passport div

form.addEventListener("submit", function (evt) {
    evt.preventDefault();
    //console.log(evt)
    if(statesInDb.find(state => evt.target.newState.value.toLowerCase() === state.toLowerCase())) {
        return alert("You've already been there jabroni, add a visit!")
    }
    statesInDb.push(evt.target.newState.value)
    if(allStates.find(state => evt.target.newState.value.toLowerCase() === state.toLowerCase())){
        let newState = ""
        if(evt.target.newState.value.toLowerCase() === "georgia") {
            newState = "Georgia_(U.S._state)"
        } else if (evt.target.newState.value.toLowerCase() === "new york"){
            newState = "New_York_(state)"
        } else if (evt.target.newState.value.toLowerCase() === "washington"){
            newState = "Washington_(state)"
        } else {
            newState = evt.target.newState.value
        }
        //console.log(newState)
        fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${newState}`)
            .then(res => res.json())
            .then(stateInfo => {
                //console.log(stateInfo)
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
                        visits: 0,
                        comments: {}
                    })
                })
                .then(res=>res.json())
                .then(jsonObj => {
                    statesInDb.push(jsonObj.name)
                    Object.assign (selectedState, jsonObj)
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
                        stateVisitP.innerText = `Visits: ${jsonObj.visits}`
                    
                    const stateVisitAddButton = document.createElement('button')
                        stateVisitAddButton.innerText = 'Add Visit'
                    
                    const stateVisitDeleteButton = document.createElement('button')
                        stateVisitDeleteButton.innerText = 'Delete Visit'

                    const stateDeleteButton = document.createElement("button")
                        stateDeleteButton.className = 'delete-button'
                        stateDeleteButton.innerText = "Delete"
                    
                    const addToPassportButton = document.createElement("button")
                        addToPassportButton.className = 'passport-button'
                        addToPassportButton.innerText = 'Add to Passport'
                    
                    
                    stateSpan.append(stateP, stateImg, stateVisitP, stateVisitAddButton, stateVisitDeleteButton, stateDeleteButton, addToPassportButton)

                    statesDiv.append(stateSpan)

                    stateVisitAddButton.addEventListener('click', () => {
                        fetch(`http://localhost:3000/states/${jsonObj.id}`, {
                            method: "PATCH",
                            headers: {
                                "Content-type": "application/json",
                                Accept: "application/json"
                            },
                            body: JSON.stringify({
                                visits: jsonObj.visits + 1
                            })
                        })
                        .then(res => res.json())
                        .then(newObj => {
                            jsonObj.visits = newObj.visits
                            stateVisitP.innerText = `Visits: ${jsonObj.visits}`
                        })
                    })
                    
                    stateVisitDeleteButton.addEventListener('click', () => {
                        if(jsonObj.visits > 0) {
                            fetch(`http://localhost:3000/states/${jsonObj.id}`, {
                                method: "PATCH",
                                headers: {
                                    "Content-type": "application/json",
                                    accept: "application/json"
                                },
                                body: JSON.stringify({
                                    visits: jsonObj.visits - 1
                                })
                            })
                            .then(res => res.json())
                            .then(newObj => {
                                jsonObj.visits = newObj.visits
                                stateVisitP.innerText = `Visits: ${jsonObj.visits}`
                            })
                        }
                    })
                    //

                    stateDeleteButton.addEventListener("click", () => {
                        fetch(`http://localhost:3000/states/${jsonObj.id}`, {
                            method: "DELETE", 
                            headers: {
                                "Content-Type": "application/json"
                            }  
                        })
                        .then(res => stateSpan.remove())
                    
                    })

                    addToPassportButton.addEventListener("click", () =>{
                        selectedState = Object.assign(jsonObj)
                
                        const passportSpan = document.createElement('span');
                            passportSpan.id = selectedState.name
                        
                        const passportP = document.createElement('p');
                            passportP.className = 'stateP'
                            passportP.innerText = selectedState.name
                        
                        const passportImg = document.createElement('img')
                            passportImg.className = 'stateImg'
                            passportImg.src = selectedState.flag
                        
                        const stateDescriptP = document.createElement('p')
                            stateDescriptP.className = 'description'
                            stateDescriptP.innerText = selectedState.description
                        
                        const commentForm = document.createElement('form')
                            commentForm.id = 'comment-form'
                        
                        const commentTitleInput = document.createElement('input')
                            commentTitleInput.type = 'text'
                            commentTitleInput.name = 'title'
                            commentTitleInput.placeholder = 'Add Title'
                        
                        const commentEntryInput = document.createElement('textarea')
                            commentEntryInput.id = 'entry'
                            commentEntryInput.placeholder = 'New Entry'
                        
                        const commentSubmit = document.createElement('input')
                            commentSubmit.type = 'submit'
                            commentSubmit.id = 'comment-submit'
                            commentSubmit.value = 'Add Entry'
                
                        const passportDeleteButton = document.createElement("button")
                            passportDeleteButton.className = 'delete-button'
                            passportDeleteButton.innerText = "Delete"
                
                            const commentList = document.createElement("ul")
                            commentList.classList.add("comment-content")
                
                            //add comments
                            for(key in jsonObj.comments){
                                const commentLi = document.createElement("li")
                                    commentLi.innerText = `${key}: ${jsonObj.comments[key]}`
                                    commentList.append(commentLi)
                            }
                
                        commentForm.append(commentTitleInput, commentEntryInput, commentSubmit )
                
                        passportSpan.append(passportP, passportImg, stateDescriptP, commentForm, passportDeleteButton, commentList)
                
                        passport.append(passportSpan)
                
                        
                
                        passportDeleteButton.addEventListener("click", () => {
                            passportSpan.remove()
                        
                        }
                    )
                
                        commentForm.addEventListener('submit', (evt) => {
                            evt.preventDefault()
                            selectedState.comments = Object.assign(selectedState.comments, {[evt.target.title.value]: evt.target.entry.value})
                            fetch(`http://localhost:3000/states/${jsonObj.id}`, {
                                method: "PATCH",
                                headers: {
                                    "Content-Type": "application/json",
                                    Accept: "application/json"
                                },
                                body: JSON.stringify({
                                    comments: Object.assign(selectedState.comments, {[evt.target.title.value]: evt.target.entry.value})
                                })
                            })
                            .then(res => res.json())
                            .then(newObj => {
                                commentList.innerHTML= ' '
                                for(key in newObj.comments){
                                    const commentLi = document.createElement("li")
                                        commentLi.innerText = `${key}: ${newObj.comments[key]}`
                                        commentList.append(commentLi)
                                }
                            })
                        })
                    })
                
            })
        })
    } else {
        alert("That's not a state, ya donut!")
    }    
})