/* ==========================================================
                RAKSHAK AI DASHBOARD V3
========================================================== */

const Dashboard = {

    refreshRate: 2000,

    init() {

        console.log("🚀 Rakshak AI Dashboard Started");

        this.startClock();

        this.animateCards();

        this.startServices();

        this.startRobotPatrol();

        this.initNotificationMenu();

        this.initProfileMenu();

        this.initVoiceAssistant();

        this.initEmergencyMode();

        this.initSnapshot();  
        
        this.initRecording();

        // this.initReport();
        
        SidebarModule.init();

    },

initRecording(){

    const initReport = () => {

    const reportBtn = document.getElementById("reportBtn");
    const modal = document.getElementById("reportModal");
    const closeBtn = document.getElementById("closeReportBtn");

    const reportDate = document.getElementById("reportDate");
    const reportTime = document.getElementById("reportTime");
    const reportCamera = document.getElementById("reportCamera");
    const reportThreat = document.getElementById("reportThreat");
    const reportRobot = document.getElementById("reportRobot");
    const reportStatus = document.getElementById("reportStatus");

    if(!reportBtn || !modal) return;

    reportBtn.addEventListener("click",()=>{

        const now = new Date();

        reportDate.textContent = now.toLocaleDateString("en-IN");

        reportTime.textContent = now.toLocaleTimeString("en-IN");

        if(reportCamera)
            reportCamera.textContent =
                document.getElementById("robotBattery")?.textContent || "Main Gate";

        if(reportThreat)
            reportThreat.textContent =
                document.getElementById("robotMode")?.textContent || "LOW";

        if(reportRobot)
            reportRobot.textContent =
                document.getElementById("robotStatus")?.textContent || "STANDBY";

        if(reportStatus)
            reportStatus.textContent = "ACTIVE";

        modal.classList.add("show");

    });

    if(closeBtn){

        closeBtn.addEventListener("click",()=>{

            modal.classList.remove("show");

        });

    }

}

    initReport();

    const buttons = [

        document.getElementById("recordBtn"),

        document.getElementById("cameraRecordBtn")

    ];

    let recording = false;

    buttons.forEach(btn=>{

        if(!btn) return;

        btn.addEventListener("click",()=>{

            if(!recording){

                fetch("/start_recording",{

                    method:"POST"

            });

            }else{

                fetch("/stop_recording",{

                    method:"POST"

                });

            }

            recording = !recording;

            buttons.forEach(button=>{

                if(!button) return;

                if(recording){

                    button.classList.add("recording");

                    button.innerHTML = "⏹ Stop";

                }else{

                    button.classList.remove("recording");

                    button.innerHTML = "🎥 Record";

                }

            });

            if(recording){

            this.addNotification(
                "🎥 Recording",
                "Recording Started",
                "warning"
            );

                this.addTimeline(
                    "🎥 Recording Started"
                );

            }else{

                this.addNotification(
                    "💾 Recording",
                    "Recording Saved"
                );

                this.addTimeline(
                    "💾 Recording Saved"
                );

            }

        });

    });

},

processVoiceCommand(command){

    const status=document.getElementById("voiceStatus");

    command=command.toLowerCase().trim();

    if(command.includes("status")){

        status.innerHTML=`
            <h3 style="color:#00d9ff;">✅ SYSTEM STATUS</h3>

            📷 Cameras : Online<br>

            🤖 Robot : Ready<br>

            🛡 Threat : LOW
        `;

    }

    else{

        status.innerHTML=`
            ❌ Unknown Command

            <br><br>

            You said:

            <b>${command}</b>
        `;

    }

},

    startVoiceRecognition(){

    console.log("🎤 Voice Started");

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if(!SpeechRecognition){

        alert("Speech Recognition is not supported in this browser.");

        return;

    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";

    recognition.continuous = true;

    recognition.interimResults = true;

    const status = document.getElementById("voiceStatus");

    status.innerHTML = "🎤 Listening...";

    recognition.start();

recognition.onresult = (event)=>{

    const command = event.results[0][0].transcript;

    console.log("🎤 Command :", command);

    status.innerHTML = `
        <strong>You said:</strong><br>
        ${command}
    `;

    this.processVoiceCommand(command);

};

recognition.onerror = (event)=>{

    console.log("Speech Error:", event.error);

    status.innerHTML = `
        ❌ Error : ${event.error}
    `;

};

recognition.onend = ()=>{

    console.log("Recognition Ended");

};

},

initVoiceAssistant(){

    const btn=document.getElementById("voiceBtn");

    const panel=document.getElementById("voicePanel");

    if(!btn || !panel) return;

btn.addEventListener("click",()=>{

    if(!panel.classList.contains("show")){

        panel.classList.add("show");

        this.startVoiceRecognition();

    }

});

},

initSnapshot(){

    const buttons = [

        document.getElementById("snapshotBtn"),

        document.getElementById("cameraSnapshotBtn")

    ];

    buttons.forEach(btn=>{

        if(!btn) return;

        btn.addEventListener("click", async ()=>{

            console.log("📸 Snapshot Click");

            try{

                const response = await fetch("/snapshot",{

                    method:"POST"

                });

                const data = await response.json();

                if(data.success){

                    ReportModule.setSnapshot(data.filename);

                    this.addNotification(

                        "📸 Snapshot",

                        `Saved : ${data.filename}`,

                        "success"

                    );

                    this.addTimeline(

                        `📸 Snapshot Captured (${data.filename})`

                    );

                }else{

                    alert("No frame available");

                }

            }catch(error){

                console.error(error);

                alert("Snapshot Failed");

            }

        });

    });

},

initEmergencyMode(){

    const btn = document.getElementById("emergencyBtn");
    const overlay = document.getElementById("emergencyOverlay");

    if(!btn || !overlay) return;

    const robotStatus = document.getElementById("robotStatus");
    const robotMode = document.getElementById("robotMode");
    const robotBattery = document.getElementById("robotBattery");
    const robotHealth = document.getElementById("robotHealth");
    const robotDispatch = document.getElementById("robotDispatch");

    btn.addEventListener("click", ()=>{

        overlay.classList.add("show");

        /* Robot Status */

        if(robotStatus)
            robotStatus.textContent = "DISPATCHED";

        if(robotMode)
            robotMode.textContent = "HIGH";

        if(robotBattery)
            robotBattery.textContent = "CAM-3";

        if(robotHealth)
            robotHealth.textContent = "12";

        if(robotDispatch)
            robotDispatch.textContent = "ON";

        document.body.classList.add("emergency-active");

        document.querySelectorAll(".card").forEach(card=>{

            card.classList.add("emergency");

        });

        this.addNotification(
            "🚨 Emergency",
            "Emergency Mode Activated"
        );

        this.addTimeline(
            "🚨 Emergency Mode Activated"
        );

        const feed = document.getElementById("feedList");

        if(feed){

            feed.innerHTML = `
                <div class="feed-item danger">

                    <i class="fa-solid fa-triangle-exclamation"></i>

                <div>

                    <strong>Emergency Detected</strong>

                    <p>Robot dispatched to alert location.</p>

                </div>

            </div>
        `;

    }

    

        setTimeout(()=>{

            overlay.classList.remove("show");

            document.body.classList.remove("emergency-active");

            document.querySelectorAll(".card").forEach(card=>{

                card.classList.remove("emergency");

                if(robotStatus)
                    robotStatus.textContent="STANDBY";

                if(robotMode)
                    robotMode.textContent="LOW";

                if(robotBattery)
                    robotBattery.textContent="Main Gate";

                if(robotHealth)
                    robotHealth.textContent="0";

                if(robotDispatch)
                    robotDispatch.textContent="OFF";

            });

        },5000);

    });

},


    initProfileMenu(){

    const btn=document.getElementById("profileBtn");

    const menu=document.getElementById("profileMenu");

    if(!btn || !menu) return;

    btn.addEventListener("click",()=>{

        const siren = document.getElementById("sirenSound");

        if(siren){

            siren.currentTime = 0;

            siren.play().catch(()=>{});

        }

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

    addNotification(title, message, type = "info") {

    const list=document.getElementById("notificationList");

    if(!list) return;

    const empty=list.querySelector(".notification-empty");

    if(empty) empty.remove();

        const time = new Date().toLocaleTimeString("en-IN", {

            hour: "2-digit",

            minute: "2-digit"

        });

    list.insertAdjacentHTML(

        "afterbegin",

        `

        <div class="notification ${type}">

            <i class="fa-solid fa-bell"></i>

            <div>

                <strong>${title}</strong>

                <br>

                <small>${message}</small>

                <br>

                <span class="notification-time">${time}</span>

            </div>

        </div>

        `

    );

    const notifications = list.querySelectorAll(".notification");

    if (notifications.length > 10) {

        notifications[notifications.length - 1].remove();

    }


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

const robotCamera = document.getElementById("robotCamera");
const robotStatus = document.getElementById("robotStatus");
const robotMode = document.getElementById("robotMode");
const robotBattery = document.getElementById("robotBattery");
const robotHealth = document.getElementById("robotHealth");
const robotMission = document.getElementById("robotMission");
const missionBar = document.getElementById("missionBar");

if (robotCamera)
    robotCamera.textContent = "CAM-1";

if (robotStatus)
    robotStatus.textContent =
        data.dispatch ? "DISPATCHED" : "STANDBY";

if (robotMode)
    robotMode.textContent = data.threat;

if (robotBattery)
    robotBattery.textContent =
        data.camera || "No Camera";

if (robotHealth)
    robotHealth.textContent = data.people;

RobotModule.updateMission(data.dispatch);

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

            if(!this.lastDetection){

                this.lastDetection = "";

            }

            const currentDetection = `${item.label}-${item.camera}`;

            if(this.lastDetection !== currentDetection){

                this.lastDetection = currentDetection;

                this.addNotification(

                    "AI Detection",

                    `${item.label} detected at ${item.camera}`

                );

            }

            this.addTimeline(

                `${item.label} detected at ${item.camera}`

            );

            ReportModule.addReport({

                label: item.label,

                confidence: item.confidence,

                camera: item.camera,

                time: item.time,
                    
                date: new Date().toLocaleDateString("en-IN")

            });

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
    ReportModule.init();
    RobotModule.init();

});

