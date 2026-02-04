// Particles effect
const canvas = document.getElementById('particlesCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 100;
const purpleColors = ['#9d4edd', '#7b2cbf', '#5a189a', '#c77dff'];

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = purpleColors[Math.floor(Math.random() * purpleColors.length)];
        this.opacity = Math.random() * 0.5 + 0.2;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    // Connect nearby particles
    particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach(otherParticle => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                ctx.strokeStyle = particle.color;
                ctx.globalAlpha = (100 - distance) / 100 * 0.2;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(otherParticle.x, otherParticle.y);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        });
    });
    
    requestAnimationFrame(animateParticles);
}

animateParticles();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// GitHub API Integration
const GITHUB_USERNAME = 'descambiado';
const GITHUB_API = 'https://api.github.com';

async function fetchGitHubStats() {
    try {
        const userResponse = await fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}`);
        const userData = await userResponse.json();
        
        document.getElementById('repoCount').textContent = userData.public_repos || '--';
        document.getElementById('followerCount').textContent = userData.followers || '--';
        document.getElementById('followingCount').textContent = userData.following || '--';
        
        // Fetch repositories for stars count
        const reposResponse = await fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`);
        const reposData = await reposResponse.json();
        
        let totalStars = 0;
        reposData.forEach(repo => {
            totalStars += repo.stargazers_count;
        });
        
        document.getElementById('starCount').textContent = totalStars || '--';
        
        // Load projects
        loadProjects(reposData.slice(0, 6));
        
        // Draw activity chart
        drawActivityChart(reposData);
        
    } catch (error) {
        console.error('Error fetching GitHub stats:', error);
    }
}

function loadProjects(repos) {
    const projectsGrid = document.getElementById('projectsGrid');
    projectsGrid.innerHTML = '';
    
    const featuredProjects = [
        { name: 'SOTYHUB', description: 'Community-driven cybersecurity lab and knowledge ecosystem', url: 'https://sotyhub.com' },
        { name: 'SOTYBOT', description: 'Operator-oriented AI assistant / open agent engine', url: 'https://github.com/descambiado/Sotybot' },
        { name: 'BOFA', description: 'Best Of All Cybersecurity Suite', url: 'https://github.com/descambiado/BOFA' },
        { name: 'SOTYPOT', description: 'Modular multi-honeypot platform (TPOT CE remix)', url: 'https://github.com/descambiado/Sotypot' }
    ];
    
    featuredProjects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.innerHTML = `
            <h3>${project.name}</h3>
            <p>${project.description}</p>
            <a href="${project.url}" class="project-link" target="_blank">View Project →</a>
        `;
        projectsGrid.appendChild(projectCard);
    });
    
    repos.slice(0, 4).forEach(repo => {
        if (!featuredProjects.find(p => p.name === repo.name)) {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description || 'No description available'}</p>
                <a href="${repo.html_url}" class="project-link" target="_blank">View Repository →</a>
            `;
            projectsGrid.appendChild(projectCard);
        }
    });
}

function drawActivityChart(repos) {
    const canvas = document.getElementById('activityCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // Draw grid
    ctx.strokeStyle = 'rgba(157, 78, 221, 0.2)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // Draw bars
    const maxStars = Math.max(...repos.map(r => r.stargazers_count), 1);
    const barWidth = chartWidth / Math.min(repos.length, 10);
    
    repos.slice(0, 10).forEach((repo, index) => {
        const barHeight = (repo.stargazers_count / maxStars) * chartHeight;
        const x = padding + index * barWidth;
        const y = height - padding - barHeight;
        
        const gradient = ctx.createLinearGradient(x, y, x, height - padding);
        gradient.addColorStop(0, '#9d4edd');
        gradient.addColorStop(1, '#5a189a');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x + 5, y, barWidth - 10, barHeight);
    });
}

// Interactive Terminal
const terminalInput = document.getElementById('terminalInput');
const interactiveTerminal = document.getElementById('interactiveTerminal');

const terminalCommands = {
    'whoami': () => '@descambiado - Systems · Cybersecurity · Automation',
    'status': () => 'OPERATOR STATE: ACTIVE\nWORKSPACE: LIVE\nVISIBILITY: PUBLIC / PRIVATE',
    'projects': () => 'Loading projects...\nSOTYHUB, SOTYBOT, BOFA, SOTYPOT, and more.',
    'manifest': () => 'descambiado != broken\ndescambiado == out of pattern\nprofile_version = 2026.3',
    'clear': () => {
        interactiveTerminal.innerHTML = '';
        return '';
    },
    'help': () => 'Available commands: whoami, status, projects, manifest, clear, help'
};

function addTerminalLine(prompt, command, output) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    
    if (output !== undefined) {
        line.innerHTML = `
            <span class="prompt">${prompt}</span> <span class="command">${command}</span>
            <div class="output">${output}</div>
        `;
    } else {
        line.innerHTML = `<span class="prompt">${prompt}</span> <span class="command">${command}</span>`;
    }
    
    interactiveTerminal.insertBefore(line, interactiveTerminal.lastElementChild);
    interactiveTerminal.scrollTop = interactiveTerminal.scrollHeight;
}

terminalInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const command = terminalInput.value.trim().toLowerCase();
        terminalInput.value = '';
        
        addTerminalLine('descambiado@github:~$', command);
        
        setTimeout(() => {
            if (terminalCommands[command]) {
                const output = terminalCommands[command]();
                if (output) {
                    if (command === 'clear') {
                        addTerminalLine('descambiado@github:~$', '');
                    } else {
                        addTerminalLine('', '', output);
                    }
                }
            } else {
                addTerminalLine('', '', `Command not found: ${command}. Type 'help' for available commands.`);
            }
        }, 100);
    }
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize
fetchGitHubStats();
setInterval(fetchGitHubStats, 300000); // Update every 5 minutes
