const SidebarModule = {

    init(){

        this.initSidebar();

        this.initNavigation();

        this.initSidebarNavigation();

    },

    initSidebar(){

        const toggleBtn =
        document.getElementById("sidebarToggle");
        const sidebar = document.querySelector(".sidebar");

        if(!toggleBtn || !sidebar) return;

        toggleBtn.addEventListener("click",()=>{

            sidebar.classList.toggle("collapsed");

        });

    },

    initNavigation(){

        const links=document.querySelectorAll(".sidebar nav a");

        links.forEach(link=>{

            link.addEventListener("click",()=>{

                links.forEach(item=>item.classList.remove("active"));

                link.classList.add("active");

            });

        });

    },

    initSidebarNavigation(){

        const sidebarMenu=[

            {btn:"navDashboard",target:".content"},
            {btn:"navCamera",target:"#live-surveillance"},
            {btn:"navRobot",target:"#robot-section"},
            {btn:"navMap",target:"#campus-map"},
            {btn:"navAnalytics",target:"#analytics-section"},
            {btn:"navAlerts",target:".notification-card"}

        ];

        sidebarMenu.forEach(item=>{

            const btn=document.getElementById(item.btn);

            const section=document.querySelector(item.target);

            if(!btn || !section) return;

            btn.addEventListener("click",(e)=>{

                e.preventDefault();

                section.scrollIntoView({

                    behavior:"smooth",
                    block:"start"

                });

            });

        });

    }

};