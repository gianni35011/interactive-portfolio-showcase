import {GameState, GameStateManager} from "../engine/GameStateManager.ts";

import GeoAdventure0 from '/public/assets/portfolioAssets/geoadventure/0_GeoAdventure.png';
import GeoAdventure1 from '/public/assets/portfolioAssets/geoadventure/1_GeoAdventure.png';
import GeoAdventure2 from '/public/assets/portfolioAssets/geoadventure/2_GeoAdventure.png';
import GeoAdventure3 from '/public/assets/portfolioAssets/geoadventure/3_GeoAdventure.png';
import GeoAdventure4 from '/public/assets/portfolioAssets/geoadventure/4_GeoAdventure.png';
import GeoAdventure5 from '/public/assets/portfolioAssets/geoadventure/5_GeoAdventure.png';

import MindQuest0 from '/public/assets/portfolioAssets/MindQuest/MindQuest_02.png';
import MindQuest1 from '/public/assets/portfolioAssets/MindQuest/MindQuest_03.png';
import MindQuest2 from '/public/assets/portfolioAssets/MindQuest/MindQuest_04.png';
import MindQuest3 from '/public/assets/portfolioAssets/MindQuest/MindQuest_05.png';
import MindQuest4 from '/public/assets/portfolioAssets/MindQuest/MindQuest_06.png';
import MindQuest5 from '/public/assets/portfolioAssets/MindQuest/MindQuest_07.png';


import PortfolioImage1 from '/public/assets/portfolioAssets/portfolio/campfire.gif'
import PortfolioImage2 from '/public/assets/portfolioAssets/portfolio/fire.png'
import PortfolioImage3 from '/public/assets/portfolioAssets/portfolio/transition.gif'
import PortfolioImage4 from '/public/assets/portfolioAssets/portfolio/world.png'

import Blender from '/public/assets/icons/blender-icon.svg';
import AWS from '/public/assets/icons/AWS-icon.svg';
import CPP from '/public/assets/icons/CPP-icon.svg';
import Cesium from '/public/assets/icons/Cesium-icon.svg';
import ElevenLabs from '/public/assets/icons/11Labs-icon.svg';
import Git from '/public/assets/icons/Git-icon.svg';
import HTML from '/public/assets/icons/HTML-icon.svg';
import Udio from '/public/assets/icons/udio-icon.svg';
import CS from '/public/assets/icons/cs-icon.svg';
import OpenAI from '/public/assets/icons/openai-icon.svg';
import Threejs from '/public/assets/icons/threejs-icon.svg';
import Typescript from '/public/assets/icons/ts-icon.svg';
import Unity from '/public/assets/icons/unity-icon.svg';
import UE from '/public/assets/icons/unreal-icon.svg';

interface ProjectData{
    id: string,
    title: string;
    shortDescription: string;
    fullDescription: string;
    technologies: {name: string, icon: string}[];
    keyFeatures: { title: string; body: string}[];
    images: string[];
    youtubeLink?: string;
    githubLink?: string;
}

export class PortfolioOverlay{
    get isVisible(): boolean {
        return this._isVisible;
    }

    set isVisible(value: boolean) {
        this._isVisible = value;
    }
    private overlay!: HTMLElement;
    private container!: HTMLElement;
    private stateManager: GameStateManager;
    private _isVisible: boolean;
    private detailsContainer!: HTMLElement ;

    private projects: ProjectData[] = [
        {
            id: 'project1',
            title: 'GeoAdventure',
            shortDescription: 'GeoAdventure is a 3D educational game that teaches geography and history',
            fullDescription: 'GeoAdventure is a 3D educational game that teaches geography and history. Players can explore a 1:1 scale Earth environment (Generated using Cesium), complete quests, and learn about different cultures and landmarks. By integrating ChatGPT players can query an in game assistant to get taken directly to locations such as asking the assistant "Where is the largest mountain?" will teleport players directly to Mount Everest in game.',
            technologies: [
                {name:'Unreal Engine', icon:UE},
                {name:'Cesium', icon:Cesium},
                {name:'ChatGPT', icon:OpenAI},
                {name:'C++', icon:CPP},
                {name:'Git', icon:Git}],
            images: [
                GeoAdventure0,
                GeoAdventure1,
                GeoAdventure2,
                GeoAdventure3,
                GeoAdventure4,
                GeoAdventure5,
            ],
            keyFeatures: [
                {title: "Combat & Flight Mechanics", body: "Seamless player interaction in 1:1 scale Earth environment"},
                {title: "AI Integration", body: "Custom ChatGPT assistant for navigation and information"},
                {title: "Dynamic Quest System", body: "20+ unique challenges and educational objectives"},
                {title: "Real-world Scale", body: "By utilising Google maps data we have generated a 1:1 scale of the Earth to allow players to explore and learn about real-world locations in-game"},
            ],
            youtubeLink: 'https://www.youtube.com/embed/jcHXC0uW1jo?si=23XkSOFUbfGHS9w-',
        },
        {
            id: 'project-darkshrine',
            title: 'Firelink Shrine Inspired Portfolio',
            shortDescription: 'An interactive portfolio scene inspired by Dark Souls’ Firelink Shrine, featuring moody ambience and cryptic NPC dialogue.',
            fullDescription: 'This portfolio project recreates the contemplative atmosphere of Firelink Shrine with ambient music, sparse lighting, and NPCs delivering cryptic, Dark Souls–style dialogue. It blends game-inspired narrative and exploration to showcase my programming skills and creative vision, using Three.js for 3D interaction and immersive storytelling.',
            technologies: [
                {name:'Eleven Labs', icon: ElevenLabs},
                {name:'Udio', icon: Udio},
                {name:'Three.js', icon:Threejs},
                {name:'TypeScript', icon:Typescript},
                {name:'Blender', icon:Blender},
                {name:'HTML/CSS', icon:HTML},
                {name:'Git', icon:Git}],
            images: [
                PortfolioImage1,
                PortfolioImage2,
                PortfolioImage3,
                PortfolioImage4,
            ],
            keyFeatures: [
                { title: "Immersive 3D Environment", body: "Isometric, low-poly scene inspired by Firelink Shrine’s mood and design" },
                { title: "Cryptic NPC Dialogue", body: "Dark Souls–style cryptic and dramatic NPC lines with a comedic edge" },
                { title: "Ambient Soundscape", body: "Original ambient music generated to evoke Firelink Shrine’s contemplative atmosphere" },
                { title: "Interactive Exploration", body: "Players can interact with NPCs to learn about my projects and skills" }
            ],
            youtubeLink: 'https://www.youtube.com/embed/your-video-id', // Replace with actual demo if available
            githubLink: 'https://github.com/gianni35011/interactive-portfolio-showcase'
        },
        {
            id: 'project2',
            title: 'MindQuest',
            shortDescription: 'A turn-based RPG that integrates learning mechanics into combat.',
            fullDescription: 'MindQuest is a turn-based RPG where knowledge is power. Players engage in battles where answering subject-based questions enhances their combat abilities. The game features a unique deck-building system, strategic combat, and a dynamically generated world influenced by player choices.',
            technologies: [
                {name:'Unity', icon: Unity},
                {name:'C#', icon: CS},
                {name:'AWS', icon: AWS},
                {name:'Git', icon: Git}],
            images: [
                MindQuest0,
                MindQuest1,
                MindQuest2,
                MindQuest3,
                MindQuest4,
                MindQuest5
            ],
            keyFeatures: [
                {title: "Knowledge-Based Combat", body: "Answer subject-based questions to boost attacks and dodge incoming damage."},
                {title: "Deck-Building System", body: "Customize your combat style by building a deck of knowledge cards."},
                {title: "Turn-Based Strategy", body: "Plan your moves carefully as enemies adapt to your tactics."},
                {title: "RPG Progression", body: "Unlock new abilities, collect powerful items, and grow stronger as you progress."},
                {title: "Procedural Events", body: "Quests and enemy spawns adjust based on previous player actions."},
                {title: "Multiplayer & Community Features", body: "Integrate user-created question decks to challenge friends and share knowledge."},
                {title: "Adaptive Learning", body: "The game tracks performance and suggests areas for improvement based on player choices."},
                {title: "Item Crafting & Equipment", body: "Collect and craft powerful items to aid in combat and exploration."}
            ],
            youtubeLink: 'https://www.youtube.com/embed/5ELjVpXemNY?si=Ha2xn2EfFiHJAVWV',
        }
        ];


    constructor() {
        this.stateManager = GameStateManager.getInstance();
        this._isVisible = false;
        this.createOverlay();
        this.createDetailView();
        this.setupEventListeners();
    }

    private createOverlay(){
        this.overlay = document.createElement('div');
        this.overlay.className = 'portfolio-overlay';

        this.container = document.createElement('div');
        this.container.className = 'portfolio-container';

        const projects = document.createElement('div');
        projects.className = 'projects-grid';

        this.projects.forEach(project => {
            const card = this.createProjectCard(project);
            projects.appendChild(card);
        })

        this.container.innerHTML = `<h1>My Portfolio</h1>`;

        this.container.appendChild(projects);
        this.overlay.appendChild(this.container);
        document.body.appendChild(this.overlay);

        this.addStyles();
    }

    private createDetailView(){
        this.detailsContainer = document.createElement('div');
        this.detailsContainer.className = 'detail-container';

        const imageModal = document.createElement('div');
        imageModal.className = 'image-modal-portfolio';
        imageModal.innerHTML =`
            <div class="modal-content">
                <img class="modal-image" src="" alt="Full-size image">
            </div>
        `;

        this.overlay.appendChild(this.detailsContainer);
        this.overlay.appendChild(imageModal);
    }

    private createProjectCard(project: ProjectData): HTMLElement{
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <h2>${project.title}</h2>
            <p>${project.shortDescription}</p>
        `;
        card.addEventListener('click', () => { this.showProjectDetails(project) });
        return card;
    }

    private showProjectDetails(project: ProjectData) {
        if (!this.detailsContainer) return;

        this.detailsContainer.innerHTML = `
        <div class="detail-content">
            <button class="back-button"><- Back to Projects</button>
            <div class="project-header">
                <h2>${project.title}</h2>
                <p class="project-description">${project.fullDescription}</p>
                <div class="project-links">
                    ${project.githubLink ? `<a href="${project.githubLink}" class="github-link" target="_blank">
                    </i>View Source</a>` : ``}
                </div>  
            </div>
            
            <div class="media-container">
                <div class="main-media">
                ${project.youtubeLink
                    ? `<div class="video-wrapper"><iframe src="${project.youtubeLink}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;" allowfullscreen></iframe></div>`
                        : project.images.length > 0
                        ? `<img src="${project.images[0]}" alt="${project.title}">`
                        : ``}
                </div>
                <div class ="media-grid">
                    ${project.images.map( img => `
                        <div class="media-item">
                            <img src="${img}" alt="${project.title} Screenshot">
                        </div>                        
                        `).join('')}
                </div>
            </div>
            
            <div class="project-body">
                <div class="key-features">
                    <h3>Key Features</h3>
                    <div class="feature-grid">
                        ${project.keyFeatures.map( feature =>  `
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
                            <img src="${tech.icon}" alt="${tech.name} Icon">
                             <span>${tech.name}</span>                            
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        `;

        this.container.style.opacity = '0';
        this.container.style.visibility = 'hidden';

        this.detailsContainer.style.opacity = '1';
        this.detailsContainer.style.visibility = 'visible';

        const backButton = this.detailsContainer.querySelector('.back-button');
        backButton?.addEventListener('click', () => this.showProjectGrid());

        setTimeout(() => {
            const allImages = this.detailsContainer.querySelectorAll('.main-media img, .media-item img');
            const modal = document.querySelector('.image-modal-portfolio') as HTMLElement;
            const modalImg = document.querySelector('.modal-image') as HTMLImageElement;

            allImages.forEach(img => {
                img.addEventListener('click', () => {
                    const imgElement = img as HTMLImageElement;
                    modal.style.display = 'flex';
                    modalImg.src = imgElement.src;
                });
            });


            modal.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }, 100);
    }

    private showProjectGrid(){
        if (!this.detailsContainer) return;
        this.detailsContainer.style.opacity = '0';
        this.detailsContainer.style.visibility = 'hidden';

        this.container.style.opacity = '1';
        this.container.style.visibility = 'visible';

    }

    private addStyles(){
        const styles = `
            .portfolio-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(30, 30, 40, 0.85);
                backdrop-filter: blur(8px);
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.7s;
                display: flex;
                justify-content: center;
                align-items: flex-start;
                z-index: 1000;
                overflow-y: auto;
            }

            .portfolio-overlay.visible {
                opacity: 1;
                visibility: visible;
            }

            .portfolio-container {
                width: 100%;
                max-width: 900px;
                margin: 2rem auto;
                background: rgba(255,255,255,0.08);
                border-radius: 24px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.18);
                padding: 2rem;
                color: #f5f5fa;
                font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
                transition: box-shadow 0.3s;
            }

            .projects-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
                gap: 1.5rem;
            }

            .project-card {
                background: rgba(255,255,255,0.16);
                border-radius: 18px;
                box-shadow: 0 4px 16px rgba(0,0,0,0.10);
                padding: 1.2rem;
                transition: transform 0.2s, box-shadow 0.2s;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            .project-card:hover, .project-card:active {
                transform: translateY(-4px) scale(1.03);
                box-shadow: 0 8px 32px rgba(0,0,0,0.18);
                background: rgba(255,255,255,0.22);
            }
            
            .detail-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(30,30,40,0.95);
                backdrop-filter: blur(12px);
                color: #fff;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.7s;
                z-index: 1100;
                overflow-y: auto;
                padding: 0;
            }

            .detail-content {
                max-width: 900px;
                margin: 2rem auto;
                background: rgba(255,255,255,0.10);
                border-radius: 24px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.18);
                padding: 2rem;
            }

            .back-button {
                background: rgba(255,255,255,0.18);
                border: none;
                color: #222;
                font-weight: 600;
                padding: 0.6rem 1.2rem;
                border-radius: 8px;
                cursor: pointer;
                margin-bottom: 1.2rem;
                transition: background 0.2s, color 0.2s;
            }

            .back-button:hover, .back-button:active {
                background: #fff;
                color: #222;
            }

            .project-header {
                margin-bottom: 1.5rem;
            }

            .project-description {
                background: rgba(255,255,255,0.05);
                padding: 1.2rem;
                border-radius: 12px;
                margin-bottom: 1.2rem;
                font-size: 1rem;
                color: #e0e0f0;
            }

            .media-container {
                margin-bottom: 1.5rem;
            }

            .main-media {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 1rem;
            }
            .main-media img {
                width: 100%;
                height: 220px;
                object-fit: cover;
                border-radius: 14px;
            }
            .video-wrapper {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                margin: 0 auto;
            }
            .video-wrapper iframe {
                width: 720px;
                height: 405px;
                max-width: 98vw;
                max-height: 60vw;
                border-radius: 16px;
                box-shadow: 0 4px 24px rgba(0,0,0,0.18);
                background: #222;
            }
            @media (max-width: 900px) {
                .video-wrapper iframe {
                    width: 98vw;
                    height: 56vw;
                }
            }
            @media (max-width: 700px) {
                .main-media img {
                    height: 120px;
                }
                .video-wrapper iframe {
                    width: 98vw;
                    height: 56vw;
                }
            }
            @media (max-width: 480px) {
                .main-media img {
                    height: 80px;
                }
                .video-wrapper iframe {
                    width: 98vw;
                    height: 56vw;
                }
            }

            .media-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 0.7rem;
            }

            .media-item {
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.10);
                background: rgba(255,255,255,0.08);
            }

            .media-item img {
                width: 100%;
                height: 100px;
                object-fit: cover;
                border-radius: 12px;
                transition: transform 0.2s;
            }

            .media-item:hover img {
                transform: scale(1.04);
            }

            .feature-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                gap: 1rem;
                margin-bottom: 1.2rem;
            }

            .feature-item {
                background: rgba(255,255,255,0.08);
                padding: 1rem;
                border-radius: 12px;
                font-size: 0.98rem;
            }

            .tools-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
                gap: 0.7rem;
                margin-top: 0.5rem;
            }

            .tool-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 0.7rem;
                background: rgba(255,255,255,0.07);
                border-radius: 10px;
            }

            .tool-item img {
                width: 32px;
                height: 32px;
                margin-bottom: 0.3rem;
            }

            .github-link {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                background: #333;
                color: white;
                text-decoration: none;
                padding: 0.6rem 1.2rem;
                border-radius: 6px;
                transition: background 0.2s;
                margin-top: 0.7rem;
            }

            .github-link:hover {
                background: #444;
            }

            .image-modal-portfolio {
                display: none;
                position: fixed;
                z-index: 2000;
                left: 0;
                top: 0;
                width: 100vw;
                height: 100vh;
                background-color: rgba(0, 0, 0, 0.95);
                justify-content: center;
                align-items: center;
            }

            .modal-content {
                position: relative;
                max-width: 90vw;
                max-height: 90vh;
            }

            .modal-image {
                width: 100%;
                height: auto;
                max-height: 90vh;
                object-fit: contain;
            }

            @media (max-width: 700px) {
                .portfolio-container, .detail-content {
                    max-width: 98vw;
                    padding: 1rem;
                }

                .projects-grid {
                    grid-template-columns: 1fr;
                    gap: 1rem;
                }

                .media-grid {
                    grid-template-columns: 1fr 1fr;
                }

                .feature-grid {
                    grid-template-columns: 1fr;
                }

                .tools-grid {
                    grid-template-columns: 1fr 1fr;
                }

                .media-item img {
                    height: 70px;
                }

                .main-media img {
                    height: 120px;
                }
            }

            @media (max-width: 480px) {
                .portfolio-container, .detail-content {
                    padding: 0.5rem;
                }

                .media-item img {
                    height: 50px;
                }

                .back-button {
                    padding: 0.5rem 0.8rem;
                }
            }
        `;
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    private setupEventListeners(){
        this.stateManager.onStateEnter(GameState.PORTFOLIO_VIEW, () =>{
            this.show();
        });

        this.overlay.addEventListener('click', (e) => {
            if(e.target === this.overlay){
                this.hide();
                if (this.stateManager.previous == GameState.GAME_START_SCREEN) {
                    this.stateManager.setState(GameState.GAME_START_SCREEN);
                } else {
                    this.stateManager.setState(GameState.CAMERA_TRANSITION_EXIT);
                }
            }
        });
    }

    show(){
        this._isVisible = true;
        this.overlay.classList.add('visible');
        this.overlay.style.pointerEvents = 'auto';
    }

    hide(){
        this._isVisible = false;
        this.overlay.classList.remove('visible');
        this.overlay.style.pointerEvents = 'none';
    }
}
