/*========== Select DOM elements ===============*/
const allMatches = document.querySelector(".all-matches");
const addMatch = document.querySelector('.lws-addMatch');
const deleteMatch = document.querySelector('.lws-delete');
const resetScore = document.querySelector('.lws-reset');
const incrementInput = document.querySelector('.lws-increment');
const decrementInput = document.querySelector('.lws-decrement');


/*========== Action identifiers ===============*/
const NEW_MATCH_ADDED = 'new-match-added';
const INCREMENT_VALUE = 'increment-value';
const DECREMENT_VALUE = 'decrement-value';
const DELETE_MATCH = 'delete-match';
const RESET_ALL = 'reset-all';



/*========== Initial State Declaration ===============*/
const initialState = [{
    id: 1,
    total: 0,
}];




/*========== Create reducer function ==============*/
const MatchScoreReducer = (state = initialState, action) => {
    const cloneState = structuredClone(state);

    switch (action.type) {
        case NEW_MATCH_ADDED:
            cloneState.push(action.payload)
            return cloneState;

        case DELETE_MATCH:
            return cloneState.filter(match => match.id !== action.payload)

        case INCREMENT_VALUE:
            return cloneState.map(match => {
                if (match.id === action.payload.id) {
                    match.total += action.payload.value;
                }
                return match;
            })

        case DECREMENT_VALUE:
            return cloneState.map(match => {
                if (match.id === action.payload.id) {
                    match.total = match.total - action.payload.value < 0 ? 0 : match.total - action.payload.value;
                }
                return match;
            })

        case RESET_ALL:
            return cloneState.map(match => {
                // console.log(match);
                match.total = 0;
                return match;
            })

        default: return state;
    }
}



/*========== Create New Store ===============*/
const store = Redux.createStore(MatchScoreReducer)


/*========== Action creation ===============*/

// Add New Match Function
const addNewMatch = () => {
    const newState = store.getState()

    const id = newState[newState.length - 1] ? newState[newState.length - 1].id + 1 : 1;
    return {
        type: NEW_MATCH_ADDED,
        payload: { id, total: 0 }
    }
}


// Delete Match Function
const matchDeleteAction = (id) => {
    return {
        type: DELETE_MATCH,
        payload: id,
    }
}


// Increment Value Function
const incrementAction = (id, value) => {
    return {
        type: INCREMENT_VALUE,
        payload: { id, value }
    }
}


// Decrement Value Function
const decrementAction = (id, value) => {
    return {
        type: DECREMENT_VALUE,
        payload: { id, value },
    }
}


// Reset Action function
function resetAction() {
    return {
        type: RESET_ALL
    };
}




/*========== New Match added function ==============*/
const addNewMatchAdded = (match) => {
    const { id, total } = match;

    return `
    <div class="match">
        <div class="wrapper">
            <button class="lws-delete" onclick="matchDeleteHandler(${id})">
                <img src="./assets/delete.svg" alt="" />
            </button>
            <h3 class="lws-matchName">Match ${id}</h3>
        </div>
        <div class="inc-dec">
            <form class="incrementForm" onsubmit="incrementHandler(event, ${id})">
                <h4>Increment</h4>
                <input type="number" name="increment" class="lws-increment" />
            </form>
            <form class="decrementForm" onsubmit="decrementHandler(event, ${id})"  >
                <h4>Decrement</h4>
                <input type="number" name="decrement" class="lws-decrement" />
            </form>
        </div>
        <div class="numbers">
            <h2 class="lws-singleResult">${total}</h2>
        </div>
    </div>`
}


/*========== Update UI initially ==============*/
const render = () => {
    const matches = store.getState();
    const singleMatch = matches?.map(match => addNewMatchAdded(match));
    console.log(singleMatch)
    allMatches.innerHTML = singleMatch;
}


/*========== Store Subscribe ============*/
store.subscribe(render)
render();



/*========== Dispatch functions ===========*/

// Add Match Event Listener
addMatch.addEventListener("click", () => {
    store.dispatch(addNewMatch())
})


// Delete Match Event Listener
function matchDeleteHandler(id) {
    store.dispatch(matchDeleteAction(id))
}


// Increase Input Value
function incrementHandler(event, id) {
    event.preventDefault();
    const value = Math.abs(parseInt((event.target[0].value)));
    store.dispatch(incrementAction(id, value))
}


// Decrease Input Value
function decrementHandler(event, id) {
    event.preventDefault();
    const value = Math.abs(parseInt((event.target[0].value)));
    store.dispatch(decrementAction(id, value))
}


// Reset All Value
function resetHandler() {
    store.dispatch(resetAction())
    console.log('clicked')
}



