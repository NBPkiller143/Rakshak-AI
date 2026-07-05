/* ==========================================================
                RAKSHAK AI DASHBOARD V3
========================================================== */

const Dashboard = {

    refreshRate: 2000,

    init() {

        console.log("🚀 Rakshak AI Dashboard Started");

        this.startClock();

        this.initSidebar();

        this.initNavigation();

        this.animateCards();

        this.startServices();

        this.startRobotPatrol();

        this.initNotificationMenu();

        this.initProfileMenu();

    },

    initProfileMenu(){

    const btn=document.getElementById("profileBtn");

    const menu=document.getElementById("profileMenu");

    if(!btn || !menu) return;

    btn.addEventListener("click",()=>{

        menu.classList.toggle("show");

    });

},

    initNotificationMenu() {

        const btn = document.getElementById("notificationBtn");

        const menu = document.getElementById("notificationDropdown");

        if (!btn || !menu) return;

        btn.addEventListener("click", () => {

            menu.classList.toggle("show");

        });

    },

    addNotification(title, message) {

    const list=document.getElementById("notificationList");

    if(!list) return;

    const empty=list.querySelector(".notification-empty");

    if(empty) empty.remove();

    list.insertAdjacentHTML(

        "afterbegin",

        `

        <div class="notification">

            <i class="fa-solid fa-bell"></i>

            <div>

                <strong>${title}</strong>

                <br>

                <small>${message}</small>

            </div>

        </div>

        `

    );

},

    /* =====================================
        ROBOT PATROL
===================================== */

robotPoints: [

    { x: 28, y: 48 }, // CAM 1

    { x: 57, y: 18 }, // CAM 2

    { x: 84, y: 58 }, // CAM 3

    { x: 63, y: 88 }, // CAM 5

    { x: 18, y: 82 }  // CAM 4

],

currentPoint: 0,

    /* =====================================================
                        LIVE CLOCK
    ===================================================== */

    startClock() {

        const clock = document.getElementById("clock");

        if (!clock) return;

        const update = () => {

            const now = new Date();

            clock.textContent = now.toLocaleTimeString("en-IN", {

                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"

            });

        };

        update();

        setInterval(update, 1000);

    },

    /* =====================================================
                    SIDEBAR
    ===================================================== */

    initSidebar() {

        const btn = document.querySelector(".top-actions .icon-btn");

        const sidebar = document.querySelector(".sidebar");

        const dashboard = document.querySelector(".dashboard");

        if (!btn || !sidebar || !dashboard) return;

        btn.addEventListener("click", () => {

            sidebar.classList.toggle("collapsed");

            dashboard.classList.toggle("sidebar-collapsed");

        });

    },

    /* =====================================================
                    ACTIVE MENU
    ===================================================== */

    initNavigation() {

        const links = document.querySelectorAll(".sidebar nav a");

        links.forEach(link => {

            link.addEventListener("click", () => {

                links.forEach(item => item.classList.remove("active"));

                link.classList.add("active");

            });

        });

    },

    /* =====================================================
        },
    ===================================================== */

    animateCards() {

        const cards = document.querySelectorAll(".card");

        cards.forEach((card, index) => {

            card.style.opacity = "0";

            card.style.transform = "translateY(25px)";

            setTimeout(() => {

                card.style.transition = "all .45s ease";

                card.style.opacity = "1";

                card.style.transform = "translateY(0)";

            }, index * 90);

        });

    },

    /* =====================================================
                START ALL SERVICES
    ===================================================== */

    startServices() {

        console.log("Dashboard Services Started");

        this.fetchPersonCount();

        this.fetchRobotStatus();

        this.fetchDetections();

        this.initFullscreen();

        this.initSnapshot();

        setInterval(() => {

            this.fetchPersonCount();

            this.fetchRobotStatus();

            this.fetchDetections();

        }, this.refreshRate);

    },

    /* =====================================================
                SNAPSHOT BUTTON
    ===================================================== */

    initSnapshot() {

        const btn = document.getElementById("snapshotBtn");

        const camera = document.getElementById("cameraFeed");

        if (!btn || !camera) return;

        btn.addEventListener("click", () => {

            window.open(camera.src, "_blank");

        });

    },


    /* =====================================================
                FETCH PERSON COUNT
===================================================== */

    async fetchPersonCount() {

    try {

        const response = await fetch("/person_count");

        if (!response.ok) return;

        const data = await response.json();

        const count = document.getElementById("personCount");

        if (count) {

            this.animateCounter("personCount", data.count);

            const trend = document.getElementById("peopleTrend");

            if (trend) {

                trend.innerHTML = `
                    <i class="fa-solid fa-arrow-trend-up"></i>
                    +${data.count}
                `;

            }

        }

    }

    catch (error) {

        console.error("Person Count Error :", error);

    }

},

/* =====================================
        ROBOT MOVEMENT
===================================== */

startRobotPatrol() {

    const robot = document.getElementById("robotMarker");

    if (!robot) return;

    const moveRobot = () => {

        const point = this.robotPoints[this.currentPoint];

        robot.style.left = point.x + "%";

        robot.style.top = point.y + "%";

        this.currentPoint++;

        if (this.currentPoint >= this.robotPoints.length) {

            this.currentPoint = 0;

        }

    };

    moveRobot();

    this.addNotification(

        "Robot",

        "Patrol Started"

    );

    setInterval(moveRobot, 3000);

},

/* =====================================================
                FETCH ROBOT STATUS
===================================================== */

async fetchRobotStatus() {

    try {

        const response = await fetch("/robot_status");

        if (!response.ok) return;

        const data = await response.json();

        const dispatchCard = document.getElementById("robotDispatch");

        if (dispatchCard) {

            dispatchCard.textContent = data.dispatch ? "ON" : "OFF";

        }

        document.getElementById("robotCamera").textContent="CAM-1";

        document.getElementById("robotStatus").textContent =
            data.dispatch ? "DISPATCHED" : "STANDBY";

        document.getElementById("robotMode").textContent =
            data.threat;

        document.getElementById("robotBattery").textContent =
            data.camera || "No Camera";

        document.getElementById("robotHealth").textContent =
            data.people;

        this.updateRobotPosition(data.dispatch);

        const alert = document.getElementById("alertMarker");

        if(alert){

            alert.classList.toggle(

                "active",

                data.threat === "HIGH"

            );

        }

        const robotCard = document.querySelector(".robot-card");

        if(robotCard){

            robotCard.classList.remove("low","medium","high");

            if(data.threat==="LOW")
                robotCard.classList.add("low");

            else if(data.threat==="MEDIUM")
                robotCard.classList.add("medium");

            else if(data.threat==="HIGH")
                robotCard.classList.add("high");

        }

    }

    catch(error){

        console.error(error);

    }

},

/* =====================================================
                FETCH DETECTIONS
===================================================== */

async fetchDetections(){

    try{

        const response=await fetch("/detections");

        if(!response.ok) return;

        const detections=await response.json();

        const feed=document.getElementById("feedList");

        if(!feed) return;

        if(detections.length===0){

            feed.innerHTML='<div class="feed-empty">No Detection</div>';

            return;

        }

        feed.innerHTML="";

        detections.forEach(item=>{

            this.addNotification(

                "AI Detection",

                `${item.label} detected at ${item.camera}`

            );

            this.addTimeline(

                `${item.label} detected at ${item.camera}`

            );

            feed.innerHTML+=`

            <div class="feed-item">

                <strong>${item.label}</strong><br>

                🎯 ${item.confidence}%<br>

                📷 ${item.camera}<br>

                🕒 ${item.time}

            </div>

            `;

        });

    }

    catch(err){

        console.error(err);

    }

},
    /* =====================================================
                UPDATE TIMELINE
===================================================== */

addTimeline(message){

    const list=document.getElementById("timelineList");

    if(!list) return;

    const empty=list.querySelector(".timeline-empty");

    if(empty) empty.remove();

    const time=new Date().toLocaleTimeString();

    list.insertAdjacentHTML(

        "afterbegin",

        `

        <div class="timeline-item">

            <div class="timeline-dot"></div>

            <div class="timeline-content">

                <strong>${message}</strong>

                <br>

                <small>${time}</small>

            </div>

        </div>

        `

    );

},

/* =====================================================
                UPDATE NOTIFICATIONS
===================================================== */



/* =====================================================
                FULLSCREEN
===================================================== */

initFullscreen(){

    const btn=document.getElementById("fullscreenBtn");

    const camera=document.getElementById("cameraFeed");

    if(!btn || !camera) return;

    btn.addEventListener("click",()=>{

        if(!document.fullscreenElement){

            camera.requestFullscreen();

        }else{

            document.exitFullscreen();

        }

    });

},

/* =====================================================
            ANIMATE COUNTERS
===================================================== */

animateCounter(id, value) {

    const element = document.getElementById(id);

    if (!element) return;

    const end = Number(value);

    if (isNaN(end)) {

        element.textContent = value;

        return;

    }

    let current = 0;

    const step = Math.max(1, Math.ceil(end / 20));

    const timer = setInterval(() => {

        current += step;

        if (current >= end) {

            current = end;

            clearInterval(timer);

        }

        element.textContent = current;

    }, 30);

},

/* =====================================================
            ROBOT MAP POSITION
===================================================== */

updateRobotPosition(dispatch) {

    const marker = document.getElementById("robotMarker");

    if (!marker) return;

    if (dispatch) {

        marker.style.left = "68%";

        marker.style.top = "38%";

    } else {

        marker.style.left = "48%";

        marker.style.top = "55%";

    }

}

};

/* ==========================================================
                    START DASHBOARD
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    Dashboard.init();

});

