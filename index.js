//stable elements on the dom selected

const form = document.querySelector('#state-form')

const statesDiv = document.querySelector('#state-list')

const passport = document.querySelector('#passport')

const addStateForm = document.querySelector('#form')

//global objects to check the values of states and hold the selected state when passport is loaded

const allStates = ["Florida", "Nevada", "Wyoming", "Idaho", "Montana", "Utah", "Maine", "New Hampshire", "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Hawaii", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Nebraska", "New Jersey", "New Mexico", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Vermont", "Virginia", "West Virginia", "Wisconsin", "New York", "Georgia", "Washington"]

const statesInDb = []

let selectedStates = {}

let statesInPassport = []



//Initial Fetch, populates left side state board from our database

fetch('http://localhost:3000/states')
.then(res => res.json())
.then(jsonArray =>
    jsonArray.forEach(function(jsonObj) {
        selectedStates[jsonObj.name] = []
        stateBarCreateElements(jsonObj)
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
                        comments: []
                    })
                })
                .then(res=>res.json())
                .then(jsonObj => {
                    selectedStates[jsonObj.name] = []
                    stateBarCreateElements(jsonObj)
                })
            }) 
        } else {
            alert("That's not a state, ya donut!")
        }    
})

function stateBarCreateElements(jsonObj) {
    statesInDb.push(jsonObj.name.toLowerCase())
    selectedStates[jsonObj.name] = [...selectedStates[jsonObj.name], ...jsonObj.comments]
    const stateSpan = document.createElement('span');
        stateSpan.className = 'state-item'
    
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
    // removes passport from the editing window
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

    stateDeleteButton.addEventListener("click", () => {
        fetch(`http://localhost:3000/states/${jsonObj.id}`, {
            method: "DELETE", 
            headers: {
                "Content-Type": "application/json"
            }  
        })
        .then(res => {
            stateSpan.remove()
            index = statesInDb.indexOf(jsonObj.name.toLowerCase())
            statesInDb.splice(index, 1)
        })
    })

    addToPassportButton.addEventListener("click", () =>{
       
        if(statesInPassport.includes(jsonObj.name.toLowerCase())){
        
            return alert("WHOA! Where d'ya think you're going, pal?! (Visit Added)")
        }

         statesInPassport.push(jsonObj.name.toLowerCase())

        const passportSpan = document.createElement('span');
            passportSpan.className = 'passport-card'
        
        const passportP = document.createElement('p');
            passportP.className = 'stateP'
            passportP.innerText = jsonObj.name
        
        const passportImg = document.createElement('img')
            passportImg.className = 'stateImg'
            passportImg.src = jsonObj.flag
        
        const stateDescriptP = document.createElement('p')
            stateDescriptP.className = 'description'
            stateDescriptP.innerText = jsonObj.description
        
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
            passportDeleteButton.innerText = "Remove From Passprt"

            const commentList = document.createElement("ul")
            commentList.classList.add("comment-content")

            //add comments
            for(let i = 0; i < selectedStates[jsonObj.name].length; i++){
                const commentLi = document.createElement("li")
                const titleP = document.createElement('p')
                    titleP.innerText = `Title: ${selectedStates[jsonObj.name][i].title}`
                const entryP = document.createElement('p')
                    entryP.innerText = `Entry: ${selectedStates[jsonObj.name][i].entry}`
                const dateP = document.createElement('p')
                    dateP.innerText = `${selectedStates[jsonObj.name][i].date}`
                const commentDelete =document.createElement('button')
                        commentDelete.innerText = "Delete Comment"
                        commentDelete.className = "comment_delete"
                    commentDelete.addEventListener('click', () => {
                        delete selectedStates[jsonObj.name][key]
                        fetch(`http://localhost:3000/states/${jsonObj.id}`, {
                            method: "PATCH", 
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                comments: selectedStates[jsonObj.name]
                            })
                            
                            
                        })
                        .then(res => res.json())
                        .then(newData => {
                            commentLi.remove()
                        })
                    })


                commentLi.append(dateP, titleP, entryP, commentDelete)

                commentList.append(commentLi)
            }

        commentForm.append(commentTitleInput, commentEntryInput, commentSubmit )

        passportSpan.append(passportP, passportImg, stateDescriptP, commentForm, passportDeleteButton, commentList)

        passport.append(passportSpan)

        passportDeleteButton.addEventListener("click", () => {
            const index = statesInPassport.indexOf(jsonObj.name.toLowerCase())
            passportSpan.remove()
            statesInPassport.splice(index, 1)
        
        })

        commentForm.addEventListener('submit', (evt) => {
            evt.preventDefault()
            let today = new Date();
            const todayDateFormat = `${today.getMonth()+1}/${today.getDate()}/${today.getFullYear()}`
            fetch(`http://localhost:3000/states/${jsonObj.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify({
                    comments: [...selectedStates[jsonObj.name], {title: evt.target.title.value, date: todayDateFormat, entry: evt.target.entry.value}]
                })
            })
            .then(res => res.json())
            .then(newObj => {
                commentList.innerHTML= ' '
                for(let i = 0; i < newObj.comments.length; i++){
                    const commentLi = document.createElement("li")
                    const titleP = document.createElement('p')
                        titleP.innerText = `Title: ${newObj.comments[i].title}`
                    const entryP = document.createElement('p')
                        entryP.innerText = `Entry: ${newObj.comments[i].entry}`
                    const dateP = document.createElement('p')
                        dateP.innerText = `${newObj.comments[i].date}`
                    const commentDelete =document.createElement('button')
                            commentDelete.innerText = "Delete Comment"
                            commentDelete.className = "comment_delete"


                    commentDelete.addEventListener('click', () => {
                        delete selectedStates[jsonObj.name][i]
                            fetch(`http://localhost:3000/states/${newObj.id}`, {
                                method: "PATCH", 
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    comments: newObj.comments
                                })
                            })
                            .then(res => res.json())
                            .then(newData => {
                                commentLi.remove()
                                
                            })
                        })

                    commentLi.append(dateP, titleP, entryP, commentDelete)
                    commentList.append(commentLi)
                    evt.target.title.value = ``
                    evt.target.entry.value = ``
                }})
        })
    })
}