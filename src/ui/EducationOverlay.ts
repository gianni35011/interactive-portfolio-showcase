import {GameState, GameStateManager} from "../engine/GameStateManager.ts";

import bluelightImage00 from '/public/assets/portfolioAssets/bluelight/image00.gif';
import bluelightImage01 from '/public/assets/portfolioAssets/bluelight/image01.gif';
import bluelightImage02 from '/public/assets/portfolioAssets/bluelight/image02.gif';
import bluelightImage03 from '/public/assets/portfolioAssets/bluelight/image03.gif';
import bluelightImage04 from '/public/assets/portfolioAssets/bluelight/image04.gif';
import bluelightImage05 from '/public/assets/portfolioAssets/bluelight/image05.gif';
import bluelightImage06 from '/public/assets/portfolioAssets/bluelight/image06.jpg';
import bluelightImage07 from '/public/assets/portfolioAssets/bluelight/image07.gif';

import dataHuntImage00 from '/public/assets/portfolioAssets/datahunt/image00.jpg'
import dataHuntImage01 from '/public/assets/portfolioAssets/datahunt/image01.png'
import dataHuntImage02 from '/public/assets/portfolioAssets/datahunt/image02.png'

import resourceImage00 from '/public/assets/portfolioAssets/resource/image00.gif';
import resourceImage01 from '/public/assets/portfolioAssets/resource/image01.gif';
import resourceImage02 from '/public/assets/portfolioAssets/resource/image02.gif';
import resourceImage03 from '/public/assets/portfolioAssets/resource/image03.gif';
import resourceImage04 from '/public/assets/portfolioAssets/resource/image04.gif';
import resourceImage05 from '/public/assets/portfolioAssets/resource/image05.png';
import resourceImage06 from '/public/assets/portfolioAssets/resource/image06.png';
import resourceImage07 from '/public/assets/portfolioAssets/resource/image07.png';

interface EducationData{
    university: string;
    degree: string;
    field: string;
    duration: string;
    description: string;
    keyAchievements: string[];
    skills: string[];
}

interface AcademicProject{
    id: string;
    title: string;
    course: string;
    description: string;
    technologies: string[];
    keyFeatures: {title: string; body: string}[];
    images: string[];
    githubLink?: string;
}

export class EducationOverlay{
    private overlay!: HTMLDivElement;
    private container!: HTMLElement;
    private detailsContainer!: HTMLElement;
    private stateManager: GameStateManager;
    private _isVisible: boolean;

    get isVisible(): boolean{
        return this._isVisible;
    }

    set isVisible(isVisible: boolean){
        this._isVisible = isVisible;
    }

    private education: EducationData = {
        university: "Swinburne University of Technology",
        degree: "Bachelor of Art / Computer Science ",
        field: "Games and Interactivity",
        duration: "2015 - 2023",
        description: "Comprehensive computer science education focusing on software development, algorithms, and data structures with emphasis on practical applications.",
        keyAchievements: [
            "Developed multiple game prototypes and interactive experiences as part of coursework.",
            "Created a custom inventory system in Unreal Engine using C++ to demonstrate strong programming and game development skills.",
            "Worked on university projects like BlueLight, Expedition 14, and Data Hunt, showcasing teamwork, problem-solving, and technical ability.",
        ],
        skills: [
            "Game Development",
            "C++ (Unreal Engine)",
            "Blueprint Scripting",
            "Three.js & WebGL",
            "Interactive Media",
            "Software Engineering",
            "UI/UX Design",
            "Game Mechanics Programming",
            "Version Control (Git, Git LFS)",
            "Agile Development"]
    };

    private academicProjects: AcademicProject[] = [
        {
            id: "data-hunt",
            title: "Data Hunt",
            course: "University Project",
            description: "A pervasive game developed in Unity3D where players hunt down targets based on images assigned to them through the game.",
            technologies: ["Unity3D", "C#", "Google Firebase"],
            keyFeatures: [
                { title: "Online Multiplayer", body: "Integrated Firebase to manage player data, including usernames, images, and online status." },
                { title: "Target Hunting System", body: "Players are assigned a target based on a provided image and must track them down." },
                { title: "Survival & Reward System", body: "Players earn more in-game cash the longer they survive, while more hunters are assigned to them over time." }
            ],
            images: [
                dataHuntImage00,
                dataHuntImage01,
                dataHuntImage02
            ],
            githubLink: "" // No GitHub link provided
        },
        {
            id: "bluelight",
            title: "BlueLight",
            course: "University Project",
            description: "A fast-paced first-person melee combat game where both the player and enemies die in one hit. The goal is to deliver the box before time runs out.",
            technologies: ["Unreal Engine 4", "Blueprints", "C++"],
            keyFeatures: [
                { title: "Fast-Paced Combat", body: "One-hit kill system for both players and enemies, requiring quick reflexes and precision." },
                { title: "Dashing Mechanic", body: "Implemented quick movement and dashing to enhance combat fluidity." },
                { title: "Destructible Doors", body: "Players can kick down doors, overcoming technical challenges with navmesh and physics." },
                { title: "Leveling System", body: "Enemies drop 'Cores' that allow players to level up and unlock new abilities like throwing weapons, heavy attacks, and the 'ninja dash' technique." },
                { title: "HUD & UI Design", body: "Designed and implemented functional UI with animations and blurred backgrounds to improve clarity and polish." }
            ],
            images: [
                bluelightImage00,
                bluelightImage01,
                bluelightImage02,
                bluelightImage03,
                bluelightImage04,
                bluelightImage05,
                bluelightImage06,
                bluelightImage07
            ],
            githubLink: "" // No GitHub link provided
        },
        {
            id: "re-source",
            title: "RE-Source",
            course: "University Project",
            description: "A single-player 3D puzzle game where players control a hovering spaceship to solve puzzles using pressure plates, switches, and doors while dragging boxes with the mouse.",
            technologies: ["Unity3D", "C#"],
            keyFeatures: [
                { title: "Physics-Based Puzzles", body: "Solve puzzles using interactive elements like pressure plates, switches, and movable boxes." },
                { title: "Hovering Spaceship Controls", body: "Navigate and manipulate objects from a unique top-down perspective." },
                { title: "Drag-and-Drop Mechanics", body: "Use the mouse to grab and move boxes to solve environmental challenges." }
            ],
            images: [
                resourceImage00,
                resourceImage01,
                resourceImage02,
                resourceImage03,
                resourceImage04,
                resourceImage05,
                resourceImage06,
                resourceImage07
            ],
            githubLink: "" // No GitHub link provided
        }



        // Add more projects as needed
    ];

    constructor() {
        this.stateManager = GameStateManager.getInstance();
        this._isVisible = false;
        this.createOverlay();
        this.createDetailView();
        this.setupEventListeners();
    }

    private createOverlay(){
        this.overlay = document.createElement("div");
        this.overlay.className = 'education-overlay';

        this.container = document.createElement("div");
        this.container.className = 'education-overlay-container';

        const educationHeader = document.createElement("div");
        educationHeader.className = 'education-header';
        educationHeader.innerHTML = `
             <h1>My Education</h1>
            <div class="degree-info">
                <h2>${this.education.degree} in ${this.education.field}</h2>
                <h3>${this.education.university} | ${this.education.duration}</h3>
                <p>${this.education.description}</p>
                
                <div class="achievements">
                    <h4>Key Achievements</h4>
                    <ul>
                        ${this.education.keyAchievements.map(achievement => `<li>${achievement}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="skills-container">
                    <h4>Skills Developed</h4>
                    <div class="skills">
                        ${this.education.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;

        const projectsSection = document.createElement("div");
        projectsSection.className = 'academic-projects';
        projectsSection.innerHTML = `<h2>Academic Projects</h2>`;

        const projectsGrid = document.createElement("div");
        projectsGrid.className = 'projects-grid';

        this.academicProjects.forEach((academicProject) => {
            const card = this.createProjectCard(academicProject);
            projectsGrid.appendChild(card);
        });

        projectsSection.appendChild(projectsGrid);
        this.container.appendChild(educationHeader);
        this.container.appendChild(projectsSection);
        this.overlay.appendChild(this.container);
        document.body.appendChild(this.overlay);

        this.addStyles();

    }

    private createDetailView(){
        this.detailsContainer = document.createElement('div');
        this.detailsContainer.className = 'detail-container';
        this.overlay.appendChild(this.detailsContainer);
    }

    private createProjectCard(project: AcademicProject): HTMLElement{
        const card = document.createElement("div");
        card.className = 'project-card';
        card.innerHTML = `
            <h3>${project.title}</h3>
            <p class="course-name">${project.course}</p>
            <p>${project.description}</p>
            <div class="technologies">
                ${project.technologies.slice(0, 3).map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                ${project.technologies.length > 3 ? '<span class="tech-tag">+' + (project.technologies.length - 3) + '</span>' : ''}
            </div>
        `;
        card.addEventListener('click', () => {this.showProjectDetails(project)});
        return card;
    }

    private showProjectDetails(project: AcademicProject): void{
        if(!this.detailsContainer) return;

        this.detailsContainer.innerHTML = `
        <div class="detail-content">
            <button class="back-button">← Back</button>
            <div class="project-header">
                <h2>${project.title}</h2>
                <p class="course-name">${project.course}</p>
                ${project.githubLink ? `
                <div class="project-links">
                    <a href="${project.githubLink}" class="github-link" target="_blank">
                        <i class="fab fa-github"></i> View Source
                    </a>
                </div>
                ` : ''}
            </div>

            <div class="media-container">
                ${project.images.length > 0 ? `
                <div class="media-grid">
                    ${project.images.map(img => `
                        <div class="media-item">
                            <img src="${img}" alt="${project.title} Screenshot">
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            </div>

            <div class="project-body">
                <p>${project.description}</p>
                
                <div class="key-features">
                    <h3>Key Features</h3>
                    <div class="feature-grid">
                        ${project.keyFeatures.map(feature => `
                            <div class="feature-item">
                                <h4>${feature.title}</h4>
                                <p>${feature.body}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="tech-stack">
                    <h3>Technologies</h3>
                    <div class="tools-grid">
                        ${project.technologies.map(tech => `
                            <div class="tool-item">
                                <span>${tech}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
        `;

        this.container.style.opacity = '0';
        this.container.style.visibility = 'hidden';

        this.detailsContainer.style.opacity = '1';
        this.detailsContainer.style.visibility = 'visible';

        const backButton = this.detailsContainer.querySelector('.back-button');
        backButton?.addEventListener('click', () => this.ShowEducationView());
    }

    private ShowEducationView(): void{
        if (!this.detailsContainer) return;

        this.detailsContainer.style.opacity = '0';
        this.detailsContainer.style.visibility = 'hidden';

        this.container.style.opacity = '1';
        this.container.style.visibility = 'visible';
    }

    private addStyles() {
        const styles = `
            .education-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                opacity: 0;
                visibility: hidden;
                transition: opacity 1s ease-in-out;
                display: flex;
                justify-content: center;
                align-items: flex-start;
                z-index: 1000;
                overflow-y: auto;
            }

            .education-overlay.visible {
                opacity: 1;
                visibility: visible;
            }

            .education-container {
                max-width: 1200px;
                padding: 2rem;
                color: white;
                transform: translateY(50px);
                opacity: 0;
                transition: all 1s ease-out;
            }

            .education-overlay.visible .education-container {
                transform: translateY(0);
                opacity: 1;
            }

            .education-header {
                margin-bottom: 3rem;
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                padding-bottom: 2rem;
            }

            .degree-info {
                margin-top: 1.5rem;
            }

            .achievements ul {
                margin-top: 0.5rem;
                padding-left: 1.5rem;
            }

            .skills-container {
                margin-top: 1.5rem;
            }

            .skills {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                margin-top: 0.5rem;
            }

            .skill-tag {
                display: inline-block;
                background: rgba(255, 255, 255, 0.1);
                padding: 0.3rem 0.8rem;
                border-radius: 20px;
                font-size: 0.9rem;
            }

            .academic-projects h2 {
                margin-bottom: 1.5rem;
            }

            .projects-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 2rem;
            }

            .project-card {
                background: rgba(255, 255, 255, 0.1);
                padding: 1.5rem;
                border-radius: 8px;
                transition: transform 0.3s ease;
                cursor: pointer;
            }

            .project-card:hover {
                transform: translateY(-5px);
                background: rgba(255, 255, 255, 0.15);
            }

            .course-name {
                color: #aaa;
                font-style: italic;
                margin-bottom: 0.75rem;
            }

            .tech-tag {
                display: inline-block;
                background: rgba(255, 255, 255, 0.2);
                padding: 0.2rem 0.6rem;
                border-radius: 20px;
                margin-right: 0.5rem;
                margin-top: 0.5rem;
                font-size: 0.8rem;
            }

            .detail-container {
                position: relative;
                top: 0;
                left: 0;
                width: 100%;
                min-height: 100%;
                padding: 2rem;
                color: white;
                opacity: 0;
                visibility: hidden;
                transition: all 1s ease-out;
                overflow-y: auto;
            }

            .detail-content {
                max-width: 1000px;
                margin: 0 auto;
                background: rgba(255, 255, 255, 0.1);
                padding: 2rem;
                border-radius: 8px;
            }

            .back-button {
                background: transparent;
                border: 1px solid white;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                cursor: pointer;
                margin-bottom: 1.5rem;
                transition: all 0.3s ease;
            }

            .back-button:hover {
                background: white;
                color: black;
            }

            .project-header {
                margin-bottom: 2rem;
            }

            .media-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin-bottom: 2rem;
            }

            .media-item {
                border-radius: 8px;
                overflow: hidden;
            }

            .media-item img {
                width: 100%;
                height: 200px;
                object-fit: cover;
                transition: transform 0.3s ease;
            }

            .media-item:hover img {
                transform: scale(1.05);
            }

            .feature-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1.5rem;
                margin-top: 1rem;
                margin-bottom: 2rem;
            }

            .feature-item {
                background: rgba(255, 255, 255, 0.05);
                padding: 1.5rem;
                border-radius: 8px;
            }

            .tools-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 1rem;
                margin-top: 1rem;
            }

            .tool-item {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 1rem;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                text-align: center;
            }

            .github-link {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                background: #333;
                color: white;
                text-decoration: none;
                padding: 0.75rem 1.5rem;
                border-radius: 4px;
                transition: all 0.3s ease;
                margin-top: 1rem;
            }

            .github-link:hover {
                background: #444;
            }
        `;
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    private setupEventListeners(){

        this.stateManager.onStateEnter(GameState.EDUCATION_VIEW, () => {
            this.show();
        })

        this.overlay.addEventListener('click', (e) => {
            if(e.target === this.overlay){
                this.hide();
                this.stateManager.setState(GameState.CAMERA_TRANSITION_EXIT);
            }
        })
    }

    show(): void{
        this._isVisible = true;
        this.overlay.classList.add('visible');
        this.overlay.style.pointerEvents = 'auto';
    }

    hide(): void{
        this._isVisible = false;
        this.overlay.classList.remove('visible');
        this.overlay.style.pointerEvents = 'none';
    }
}