/* ==========================================
   RAKSHAK AI DASHBOARD V3
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    startClock();

    animateCounters();

    notificationPulse();

    logoutHandler();

});

/* ==========================================
   LIVE CLOCK
========================================== */

function startClock() {

    const clock = document.getElementById("clock");

    if (!clock) return;

    function updateClock() {

        const now = new Date();

        clock.textContent = now.toLocaleTimeString();

    }

    updateClock();

    setInterval(updateClock, 1000);

}

/* ==========================================
   COUNTER ANIMATION
========================================== */

function animateCounters() {

    const counters = [

        {
            id: "cameraCount",
            target: 14
        },

        {
            id: "alertCount",
            target: 3
        }

    ];

    counters.forEach(counter => {

        const element = document.getElementById(counter.id);

        if (!element) return;

        let current = 0;

        const timer = setInterval(() => {

            current++;

            element.textContent = current;

            if (current >= counter.target) {

                clearInterval(timer);

            }

        }, 80);

    });

}

/* ==========================================
   NOTIFICATION PULSE
========================================== */

function notificationPulse() {

    const bell = document.querySelector(".bell");

    if (!bell) return;

    setInterval(() => {

        bell.animate([
            { transform: "scale(1)" },
            { transform: "scale(1.12)" },
            { transform: "scale(1)" }
        ], {
            duration: 600
        });

    }, 6000);

}

/* ==========================================
   LOGOUT
========================================== */

function logoutHandler() {

    const logoutBtn = document.querySelector(".logout");

    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", () => {

        const confirmLogout = confirm(
            "Are you sure you want to logout?"
        );

        if (confirmLogout) {

            window.location.href = "/";

        }

    });

}

/* ==========================================
   FAKE LIVE AI DETECTION FEED
========================================== */

const aiEvents = [

    {
        title: "Motion Detected",
        info: "Confidence : 94%",
        type: "warning"
    },

    {
        title: "Person Detected",
        info: "Confidence : 98%",
        type: "success"
    },

    {
        title: "Unknown Face",
        info: "Confidence : 91%",
        type: "danger"
    },

    {
        title: "Vehicle Detected",
        info: "Confidence : 96%",
        type: "success"
    },

    {
        title: "Suspicious Activity",
        info: "Confidence : 93%",
        type: "warning"
    }

];

function liveDetectionFeed(){

    const feedList = document.querySelector(".feed-list");

    if(!feedList) return;

    setInterval(()=>{

        const event =
        aiEvents[Math.floor(Math.random()*aiEvents.length)];

        const time =
        new Date().toLocaleTimeString();

        const card =
        document.createElement("div");

        card.className = `feed ${event.type}`;

        card.innerHTML = `

            <span>${time}</span>

            <div>

                <strong>${event.title}</strong>

                <p>${event.info}</p>

            </div>

        `;

        feedList.prepend(card);

        if(feedList.children.length>8){

            feedList.removeChild(feedList.lastElementChild);

        }

    },7000);

}

/* ==========================================
   ROBOT STATUS ANIMATION
========================================== */

function robotHeartbeat(){

    const robot =
    document.querySelector(".robot-avatar");

    if(!robot) return;

    setInterval(()=>{

        robot.animate([

            {
                transform:"scale(1)"
            },

            {
                transform:"scale(1.08)"
            },

            {
                transform:"scale(1)"
            }

        ],{

            duration:900

        });

    },2500);

}

/* ==========================================
   CARD FADE ANIMATION
========================================== */

function animateCards(){

    const cards =
    document.querySelectorAll(".card,.stat-card");

    cards.forEach((card,index)=>{

        card.style.opacity="0";

        card.style.transform="translateY(30px)";

        setTimeout(()=>{

            card.style.transition=".6s";

            card.style.opacity="1";

            card.style.transform="translateY(0)";

        },index*120);

    });

}

/* ==========================================
   SYSTEM STATUS RANDOMIZER
========================================== */

function randomStatus(){

    const values=[
        "LOW",
        "LOW",
        "LOW",
        "MEDIUM"
    ];

    const threat=
    document.querySelector(".status-grid div:last-child h2");

    if(!threat) return;

    setInterval(()=>{

        threat.textContent=
        values[Math.floor(Math.random()*values.length)];

    },10000);

}

/* ==========================================
   START ALL
========================================== */

liveDetectionFeed();

robotHeartbeat();

animateCards();

randomStatus();

/* ==========================================
   SEARCH FILTER
========================================== */

function enableSearch(){

    const searchInput = document.querySelector(".search input");

    const menuItems = document.querySelectorAll(".menu a");

    if(!searchInput) return;

    searchInput.addEventListener("keyup", ()=>{

        const value = searchInput.value.toLowerCase();

        menuItems.forEach(item=>{

            const text = item.textContent.toLowerCase();

            if(text.includes(value)){

                item.style.display="flex";

            }else{

                item.style.display="none";

            }

        });

    });

}

/* ==========================================
   LIVE CAMERA STATUS
========================================== */

function cameraStatus(){

    const badge=document.querySelector(".live-badge");

    if(!badge) return;

    let online=true;

    setInterval(()=>{

        online=!online;

        if(online){

            badge.innerHTML=`
                <span class="live-dot"></span>
                LIVE
            `;

        }else{

            badge.innerHTML=`
                <span class="live-dot"></span>
                RECONNECTING...
            `;

        }

    },15000);

}

/* ==========================================
   BUTTON HOVER EFFECT
========================================== */

function buttonEffects(){

    const buttons=document.querySelectorAll("button");

    buttons.forEach(button=>{

        button.addEventListener("mouseenter",()=>{

            button.style.transform="translateY(-3px)";

        });

        button.addEventListener("mouseleave",()=>{

            button.style.transform="translateY(0px)";

        });

    });

}

/* ==========================================
   ACTIVE MENU
========================================== */

function activeMenu(){

    const links=document.querySelectorAll(".menu a");

    links.forEach(link=>{

        link.addEventListener("click",()=>{

            links.forEach(item=>{

                item.classList.remove("active");

            });

            link.classList.add("active");

        });

    });

}

/* ==========================================
   PAGE LOAD ANIMATION
========================================== */

window.addEventListener("load",()=>{

    document.body.style.opacity="0";

    document.body.style.transition=".6s";

    requestAnimationFrame(()=>{

        document.body.style.opacity="1";

    });

});

/* ==========================================
   START FINAL MODULES
========================================== */

enableSearch();

cameraStatus();

buttonEffects();

activeMenu();

/* ==========================================
   FULLSCREEN CAMERA
========================================== */

function setupFullscreen() {

    const btn = document.querySelector(".fullscreen-btn");
    const camera = document.querySelector(".camera-box");

    if (!btn || !camera) return;

    btn.addEventListener("click", () => {

        if (!document.fullscreenElement) {

            camera.requestFullscreen();

        } else {

            document.exitFullscreen();

        }

    });

    document.addEventListener("fullscreenchange", () => {

        if (document.fullscreenElement) {

            btn.innerHTML =
                '<i class="fa-solid fa-compress"></i>';

            btn.title = "Exit Fullscreen";

        } else {

            btn.innerHTML =
                '<i class="fa-solid fa-expand"></i>';

            btn.title = "Fullscreen";

        }

    });

}

setupFullscreen();