/* ==========================================================================
   Autonomous Navigation & AI Control Profile Website Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. Profile State & Storage Management
    // ----------------------------------------------------------------------
    const DEFAULT_PROFILE = {
        name: "홍길동",
        affiliation: "국립공주대학교 스마트운항공학과",
        intro: "인공지능 기반 자율운항 경로 최적화 및 고정밀 로봇 제어 시스템을 연구하고 있습니다.",
        interests: "자율운항, 제어공학, AI & 딥러닝, 경로 최적화, 로보틱스, 센서융합",
        courseName: "2026학년도 자율운항 및 AI제어 시스템",
        courseLink: "https://www.kongju.ac.kr",
        email: "student@kongju.ac.kr",
        github: "https://github.com"
    };

    let currentProfile = { ...DEFAULT_PROFILE };

    // Load from LocalStorage
    function loadProfile() {
        const saved = localStorage.getItem('knu_profile_data');
        if (saved) {
            try {
                currentProfile = { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
            } catch (e) {
                console.error("Failed to parse stored profile", e);
            }
        }
        renderProfile();
    }

    // Save to LocalStorage
    function saveProfile(data) {
        currentProfile = { ...data };
        localStorage.setItem('knu_profile_data', JSON.stringify(currentProfile));
        renderProfile();
        showToast("프로필 정보가 성공적으로 저장되었습니다!");
    }

    // Render profile to DOM
    function renderProfile() {
        document.getElementById('display-name').textContent = currentProfile.name;
        document.getElementById('display-affiliation').textContent = currentProfile.affiliation;
        document.getElementById('display-intro').textContent = `"${currentProfile.intro}"`;
        document.getElementById('display-course-name').textContent = currentProfile.courseName;
        
        const courseLinkEl = document.getElementById('display-course-link');
        courseLinkEl.href = currentProfile.courseLink || "#";
        
        document.getElementById('display-email').textContent = currentProfile.email;
        
        const githubEl = document.getElementById('display-github');
        githubEl.href = currentProfile.github || "https://github.com";

        // Render Interest Tags
        const tagsContainer = document.getElementById('display-interests');
        tagsContainer.innerHTML = '';
        const tagList = currentProfile.interests.split(',').map(s => s.trim()).filter(Boolean);
        
        const iconClasses = [
            'fa-ship', 'fa-sliders', 'fa-brain', 'fa-route', 
            'fa-robot', 'fa-satellite-dish', 'fa-microchip', 'fa-code'
        ];

        tagList.forEach((tagText, index) => {
            const span = document.createElement('span');
            span.className = `tag ${index === 0 ? 'tag-primary' : index === 1 ? 'tag-secondary' : index === 2 ? 'tag-accent' : ''}`;
            const iconClass = iconClasses[index % iconClasses.length];
            span.innerHTML = `<i class="fa-solid ${iconClass}"></i> ${tagText}`;
            tagsContainer.appendChild(span);
        });
    }

    // ----------------------------------------------------------------------
    // 2. Modal Handler Logic
    // ----------------------------------------------------------------------
    const modal = document.getElementById('modal-edit');
    const btnEdit = document.getElementById('btn-edit-profile');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const formEdit = document.getElementById('form-edit-profile');
    const btnResetDefault = document.getElementById('btn-reset-default');

    btnEdit.addEventListener('click', () => {
        // Pre-fill form inputs
        document.getElementById('input-name').value = currentProfile.name;
        document.getElementById('input-affiliation').value = currentProfile.affiliation;
        document.getElementById('input-intro').value = currentProfile.intro;
        document.getElementById('input-interests').value = currentProfile.interests;
        document.getElementById('input-course-name').value = currentProfile.courseName;
        document.getElementById('input-course-link').value = currentProfile.courseLink;
        document.getElementById('input-email').value = currentProfile.email;
        document.getElementById('input-github').value = currentProfile.github;
        
        modal.classList.remove('hidden');
    });

    btnCloseModal.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    formEdit.addEventListener('submit', (e) => {
        e.preventDefault();
        const updatedData = {
            name: document.getElementById('input-name').value,
            affiliation: document.getElementById('input-affiliation').value,
            intro: document.getElementById('input-intro').value,
            interests: document.getElementById('input-interests').value,
            courseName: document.getElementById('input-course-name').value,
            courseLink: document.getElementById('input-course-link').value,
            email: document.getElementById('input-email').value,
            github: document.getElementById('input-github').value
        };
        saveProfile(updatedData);
        modal.classList.add('hidden');
    });

    btnResetDefault.addEventListener('click', () => {
        if (confirm("기본 프로필 정보로 초기화하시겠습니까?")) {
            saveProfile(DEFAULT_PROFILE);
            modal.classList.add('hidden');
        }
    });

    // ----------------------------------------------------------------------
    // 3. Email Copy & Toast Notification
    // ----------------------------------------------------------------------
    const btnCopyEmail = document.getElementById('btn-copy-email');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    let toastTimeout;

    btnCopyEmail.addEventListener('click', () => {
        const emailText = currentProfile.email;
        navigator.clipboard.writeText(emailText).then(() => {
            showToast(`이메일(${emailText})이 클립보드에 복사되었습니다!`);
        }).catch(err => {
            showToast("복사 실패. 다시 시도해 주세요.");
        });
    });

    function showToast(msg) {
        toastMessage.textContent = msg;
        toast.classList.remove('hidden');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }

    // ----------------------------------------------------------------------
    // 4. Theme Switcher
    // ----------------------------------------------------------------------
    const btnThemeToggle = document.getElementById('btn-theme-toggle');
    const themeIcon = btnThemeToggle.querySelector('i');
    
    // Check saved theme preference
    const savedTheme = localStorage.getItem('knu_theme') || 'dark';
    setTheme(savedTheme);

    btnThemeToggle.addEventListener('click', () => {
        const activeTheme = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        setTheme(activeTheme);
    });

    function setTheme(theme) {
        if (theme === 'light') {
            document.body.setAttribute('data-theme', 'light');
            themeIcon.className = 'fa-solid fa-sun';
            themeIcon.style.color = '#f59e0b';
        } else {
            document.body.removeAttribute('data-theme');
            themeIcon.className = 'fa-solid fa-moon';
            themeIcon.style.color = '#38bdf8';
        }
        localStorage.setItem('knu_theme', theme);
    }

    // ----------------------------------------------------------------------
    // 5. Interactive Autonomous Navigation Pathfinding Canvas Background
    // ----------------------------------------------------------------------
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initNodes();
    });

    // Autonomous Navigation Nodes (Vessels / Autonomous Drone Waypoints)
    class Node {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.radius = Math.random() * 2 + 1.5;
            this.isWaypoint = Math.random() > 0.7;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off boundaries
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.isWaypoint ? '#818cf8' : '#38bdf8';
            ctx.fill();

            if (this.isWaypoint) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius + 4, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(129, 140, 248, 0.3)';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }

    let nodes = [];
    function initNodes() {
        nodes = [];
        const nodeCount = Math.floor((width * height) / 18000);
        for (let i = 0; i < nodeCount; i++) {
            nodes.push(new Node(Math.random() * width, Math.random() * height));
        }
    }

    // Mouse Interaction
    let mouse = { x: null, y: null, radius: 150 };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw mesh connection vectors
        const isLight = document.body.getAttribute('data-theme') === 'light';
        const lineBaseColor = isLight ? '14, 165, 233' : '56, 189, 248';

        for (let i = 0; i < nodes.length; i++) {
            nodes[i].update();
            nodes[i].draw();

            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 140) {
                    const alpha = (1 - dist / 140) * (isLight ? 0.2 : 0.15);
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = `rgba(${lineBaseColor}, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }

            // Mouse proximity repulsion/connection
            if (mouse.x && mouse.y) {
                const mdx = nodes[i].x - mouse.x;
                const mdy = nodes[i].y - mouse.y;
                const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                if (mdist < mouse.radius) {
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(${lineBaseColor}, ${0.3 * (1 - mdist / mouse.radius)})`;
                    ctx.lineWidth = 1.2;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    // Initialize
    loadProfile();
    initNodes();
    animate();
});
