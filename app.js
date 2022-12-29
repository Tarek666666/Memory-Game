/* general variables */
const startBtn = document.querySelector(".start_btn");
const startBtnContainer = document.querySelector(".btn_container");
let wrongTries = 0;
const allCardsContainer = document.querySelector(".cards_container");
const cards = Array.from(allCardsContainer.children);
let orderRange = [...cards.keys()];
let shuffeldRange = shuffleArray(orderRange);
let allCards = document.querySelectorAll(".single_card_container");
let wrongTriesScreen = document.querySelector(".tries");
let userNameInput = document.querySelector(".user_name");
let playerNameScreen = document.querySelector(".player_name");
let minutesScreen = document.querySelector(".minutes_display");
let secScreen = document.querySelector(".sec_display");
let timerSeconds = 0;
let timerMinutes = 0;
let counter;

// sounds for game

let rightSoundEffect = new Audio("Sounds/right.mp3");
let wrongSoundEffect = new Audio("Sounds/wrong.mp3");
let winSoundEffect = new Audio("Sounds/win.mp3");

//start button disabled by default until user writes his name

startBtn.classList.add("btn_blocked");

userNameInput.addEventListener("input", function (e) {
    playerNameScreen.innerHTML = e.target.value;
    startBtn.classList.remove("btn_blocked");
});

// looping throuw the card and using the array shuffle function
// stop the animation of the cards
cards.forEach((card, index) => {
    card.style.order = shuffeldRange[index];
    card.style.animationPlayState = "paused";
    card.classList.add("btn_blocked");
});

// start the game and hide the btn container after clicking start
//hiding the start btn
// start the animation of the card , and start the timer after 7 seconnds when the animation ends

startBtn.addEventListener("click", function () {
    startBtnContainer.style.opacity = "0.2";
    startBtnContainer.style.transform = "scale(0)";
    startBtn.classList.add("inActive");
    cards.forEach((card) => {
        card.style.animationPlayState = "running";
        setTimeout(function () {
            card.classList.remove("btn_blocked");
            updateTime(minutesScreen, secScreen, timerSeconds, timerMinutes);
        }, 7000);
    });
});

// create fucntion to shuffle the array to shuffle the cards each time the game starts
function shuffleArray(arr) {
    let current = arr.length - 1;
    let temp;
    let random;
    while (current > 0) {
        random = Math.floor(Math.random() * current);
        temp = arr[current];
        arr[current] = arr[random];
        arr[random] = temp;
        current--;
    }
    return arr;
}

// when the user clicks on a card it will flip and show it's content
// every time user clicks on card it will loop throuw the cards to count how many cards are flipped
allCards.forEach((card) => {
    card.addEventListener("click", function () {
        card.classList.add("is_flipped");
        let selectedCards = cards.filter((card) => card.classList.contains("is_flipped"));
        if (selectedCards.length == 2) {
            checkMatched(selectedCards);
            countFlippedCards(allCards);
        }
    });
});

// function to check if the 2 selected card are matched or not

function checkMatched(selectedCards) {
    
    let firstCard = selectedCards[0].getAttribute("photo-refrence");
    let secCard = selectedCards[1].getAttribute("photo-refrence");
    if (firstCard == secCard) {
        // do someanimation
        selectedCards[0].classList.add("found");
        selectedCards[1].classList.add("found");
        selectedCards[0].classList.remove("is_flipped");
        selectedCards[1].classList.remove("is_flipped");
        selectedCards[0].classList.add("btn_blocked");
        selectedCards[1].classList.add("btn_blocked");
        rightSoundEffect.play();
        // sound
    } else {
        wrongSoundEffect.play();
        // looping throuw the card and using the array shuffle function
        cards.forEach((card, index) => {
            card.classList.add("btn_blocked");
        });

        //update user tries total
        wrongTries++;
        wrongTriesScreen.innerHTML = wrongTries;

        //
        setTimeout(function () {
            selectedCards[0].classList.remove("is_flipped");
            selectedCards[1].classList.remove("is_flipped");
            cards.forEach((card, index) => {
                card.classList.remove("btn_blocked");
            });
        }, 1500);
    }
}

function updateTime(minutesScreen, secScreen, timerSeconds, timerMinutes) {
    let timeEnd = false;
    let counter = setInterval(function () {
        timerSeconds++;
        minutesScreen.innerHTML = `0${timerMinutes}`;

        if (timerSeconds < 10) {
            secScreen.innerHTML = `0${timerSeconds}`;
        } else if (timerSeconds >= 10 && timerSeconds <= 60) {
            secScreen.innerHTML = `${timerSeconds}`;
        } else {
            timerSeconds = 0;
            timerMinutes++;
            secScreen.innerHTML = `0${timerSeconds}`;
            minutesScreen.index = `0${timerMinutes}`;
        }

        // stop the game when a certain time reached.
    }, 1000);
}

function countFlippedCards(allCards) {
    allCardsArray = [...allCards];
    correctFilterdCards = allCardsArray.filter((card) => card.classList.contains("found"));
    let min = minutesScreen.innerText;
    let sec = secScreen.innerText;

    if (correctFilterdCards.length == allCards.length) {
        winSoundEffect.play();
        startBtnContainer.style.opacity = "80%";
        startBtnContainer.style.transform = "scale(1)";
        startBtnContainer.innerHTML = `
                                        
                                                            <div class="result_container"> You Have won the Game in</div>
                                                            <div class="result_container"> Time  ${min} : ${sec} </div>
                                                            <div class="tries"> You have tried : ( ${wrongTries} )     times. </div>
                                                            <div class="restart_btn" onclick="restartGame()"> Play Again  </div>
        
                                        `;

        document.querySelector(
            ".timer_container"
        ).innerHTML = ` <span class="minutes_display"> ${min} </span> : <span class="sec_display">${sec}</span>`;

        startBtnContainer.classList.add("result_box");
        startBtn.classList.remove("inActive");

        //add sound for winning
    }
}

// function to restart the game when use clicks on restart btn

function restartGame() {
    location.reload();
}
