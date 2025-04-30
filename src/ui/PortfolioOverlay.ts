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
            id: 'threejs-portfolio',
            title: 'Interactive 3D Portfolio',
            shortDescription: 'A low-poly, isometric 3D portfolio inspired by Firelink Shrine, built with Three.js.',
            fullDescription: 'This interactive portfolio, built with Three.js, features a low-poly isometric village inspired by Firelink Shrine. Users can explore the environment, interact with NPCs, and learn about my projects in an engaging and immersive way. The design reflects my passion for game-inspired web experiences while showcasing my skills in 3D development.',
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
                { title: "Explorable 3D World", body: "A fully interactive environment where users can navigate and discover my projects." },
                { title: "NPC Interactions", body: "NPCs provide information about my work, delivering dialogue inspired by Dark Souls-style storytelling." },
                { title: "Low-Poly Art Style", body: "Designed with a nostalgic, game-like aesthetic inspired by *The Legend of Zelda: Link’s Awakening* remake." },
                { title: "Dark Souls-Inspired Atmosphere", body: "Modeled after Firelink Shrine, my portfolio features NPCs that share project details in a cryptic, lore-driven manner, much like the NPCs in *Dark Souls*." },
                { title: "Optimized for the Web", body: "Built with Three.js for smooth performance and compatibility across modern browsers." },
                { title: "AI-Enhanced Experience", body: "Utilizing generative AI, the project includes voice acting (via Eleven Labs) and music (via Udio) for an immersive experience." }
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
        imageModal.className = 'image-modal';
        imageModal.innerHTML =`
            <div class="modal-content">
                <span class="close-modal">&times;</span>
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
            const modal = document.querySelector('.image-modal') as HTMLElement;
            const modalImg = document.querySelector('.modal-image') as HTMLImageElement;
            const closeModal = document.querySelector('.close-modal') as HTMLElement;

            allImages.forEach(img => {
                img.addEventListener('click', () => {
                    const imgElement = img as HTMLImageElement;
                    modal.style.display = 'flex';
                    modalImg.src = imgElement.src;
                });
            });

            // Close modal when clicking the × or outside the image
            closeModal.addEventListener('click', () => {
                modal.style.display = 'none';
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
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

            .portfolio-overlay.visible {
                opacity: 1;
                visibility: visible;
            }

            .portfolio-container {
                max-width: 1200px;
                padding: 2rem;
                color: white;
                transform: translateY(50px);
                opacity: 0;
                transition: all 1s ease-out;
            }

            .portfolio-overlay.visible .portfolio-container {
                transform: translateY(0);
                opacity: 1;
            }

            .projects-grid {
                display: grid;
                grid-template-columns: repeat(3, minmax(300px, 1fr));
                gap: 2rem;
                margin-top: 2rem;
            }

            .project-card {
                background: rgba(255, 255, 255, 0.1);
                padding: 1.5rem;
                border-radius: 8px;
                transition: transform 0.3s ease;
            }

            .project-card:hover {
                transform: translateY(-5px);
            }
            
            */Project card stylings */
            
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
                margin-bottom: 2rem;
            }

            .back-button {
                background: transparent;
                border: 1px solid white;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                cursor: pointer;
                margin-bottom: 1rem;
                transition: all 0.3s ease;
            }

            .back-button:hover {
                background: white;
                color: black;
            }

            .project-links {
                margin-top: 2rem;
            }

            .project-links a {
                display: inline-block;
                color: white;
                text-decoration: none;
                margin-right: 1rem;
                padding: 0.5rem 1rem;
                border: 1px solid white;
                border-radius: 4px;
                transition: all 0.3s ease;
            }

            .project-links a:hover {
                background: white;
                color: black;
            }
            
            
            /* Media Grid */
            
            .project-header {
                margin-bottom: 2.5rem;
            }
            
            .project-header h2 {
                font-size: 2.2rem;
                margin-bottom: 1rem;
                color: #ffffff;
            }
            
            .project-header p {
                font-size: 1.1rem;
                line-height: 1.6;
                color: rgba(255, 255, 255, 0.9);
                max-width: 90%;
                margin-bottom: 1.5rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .project-description {
                background: rgba(255, 255, 255, 0.05);
                padding: 1.5rem;
                border-radius: 8px;
                margin-bottom: 2rem;
                font-size: 1.1rem;
                line-height: 1.6;
                color: rgba(255, 255, 255, 0.9);
            }
            


            .media-container {
                display: grid;
                gap: 1rem;
                margin-bottom: 2rem;
            }
            
            .main-media {
                border-radius: 8px;
                overflow: hidden;
            }
            
            .main-media img {
                width: 100%;
                height: 400px;
                object-fit: cover;
                border-radius: 8px;
            }
            
            .media-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
            }
            
            .media-item {
                position: relative;
                border-radius: 8px;
                overflow: hidden;
                cursor: pointer;
                transition: transform 0.3s ease;
            }
            
            .media-item:hover {
                transform: translateY(-3px);
            }
            
            .media-item img {
                width: 100%;
                height: 200px;
                object-fit: cover;
            }
            
            .video-wrapper {
                position: relative;
                padding-bottom: 56.25%; /* 16:9 aspect ratio */
            }
            
            .video-wrapper iframe {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border-radius: 8px;
            }
            
            .feature-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1.5rem;
                margin-top: 1rem;
            }
            
            .feature-item {
                background: rgba(255, 255, 255, 0.05);
                padding: 1.5rem;
                border-radius: 8px;
                text-align: center;
            }
            
            .feature-item i {
                font-size: 2rem;
                margin-bottom: 1rem;
                color: #4CAF50;
            }
            
            .tools-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 1rem;
                margin-top: 1rem;
            }
            
            .tool-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 1rem;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
            }
            
            .tool-item img {
                width: 40px;
                height: 40px;
                margin-bottom: 0.5rem;
            }
            
            .github-link {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                background: #333;
                padding: 0.75rem 1.5rem;
                border-radius: 4px;
                transition: all 0.3s ease;
            }
            
            .github-link:hover {
                background: #444;
            }
            
            /* Image Modal */
                    .image-modal {
            display: none;
            position: fixed;
            z-index: 2000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.95);
            justify-content: center;
            align-items: center;
        }
        
        .modal-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
        }
        
        .modal-image {
            width: 100%;
            height: auto;
            max-height: 90vh;
            object-fit: contain;
        }
        
        .close-modal {
            position: absolute;
            top: -40px;
            right: 0;
            color: white;
            font-size: 35px;
            font-weight: bold;
            cursor: pointer;
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
