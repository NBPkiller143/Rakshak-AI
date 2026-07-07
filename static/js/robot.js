const RobotModule = {

    missionSeconds: 0,

    missionTimer: null,

    missionRunning: false,

    init() {

        console.log("🤖 Robot Module Initialized");

    },

    startMissionTimer() {

        if (this.missionRunning) return;

        this.missionRunning = true;

        this.missionSeconds = 0;

        this.missionTimer = setInterval(() => {

            this.missionSeconds++;

            const minutes = String(Math.floor(this.missionSeconds / 60)).padStart(2, "0");

            const seconds = String(this.missionSeconds % 60).padStart(2, "0");

            const timer = document.getElementById("robotMissionTime");

            if (timer) {

                timer.textContent = `${minutes}:${seconds}`;

            }

        }, 1000);

    },

    stopMissionTimer() {

        clearInterval(this.missionTimer);

        this.missionRunning = false;

    },

    updateMission(dispatch) {

    const mission = document.getElementById("robotMission");

    const missionBar = document.getElementById("missionBar");

    if (mission) {

        mission.textContent =
            dispatch ? "RESPONDING" : "PATROLLING";

    }

    if (missionBar) {

        missionBar.style.width =
            dispatch ? "100%" : "25%";

    }

    if (dispatch) {

        this.startMissionTimer();

    } else {

        this.stopMissionTimer();

    }

},

};

window.RobotModule = RobotModule;