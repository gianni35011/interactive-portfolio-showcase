import {GameState, GameStateManager} from "../engine/GameStateManager.ts";

interface ProjectData{
    id: string,
    title: string;
    shortDescription: string;
    fullDescription: string;
    technologies: string[];
    keyFeatures: { title: string; body: string}[];
    images: string[];
    youtubeLink?: string;
    liveLink?: string;
    githubLink?: string;
}

export class PortfolioOverlay{
    private overlay!: HTMLElement;
    private container!: HTMLElement;
    private stateManager: GameStateManager;
    private isVisible: boolean;
    private detailsContainer: HTMLElement ;

    private projects: ProjectData[] = [
        {
            id: 'project1',
            title: 'GeoAdventure',
            shortDescription: 'GeoAdventure is a 3D educational game that teaches geography and history',
            fullDescription: 'GeoAdventure is a 3D educational game that teaches geography and history. Players can explore a 1:1 scale Earth environment, complete quests, and learn about different cultures and landmarks.',
            technologies: ['Unreal Engine', 'Cesium', 'ChatGPT'],
            images: [
                'src/assets/portfolioAssets/geoadventure/0_GeoAdventure.png',
                'src/assets/portfolioAssets/geoadventure/1_GeoAdventure.png',
                'src/assets/portfolioAssets/geoadventure/2_GeoAdventure.png',
                'src/assets/portfolioAssets/geoadventure/3_GeoAdventure.png',
                'src/assets/portfolioAssets/geoadventure/4_GeoAdventure.png',
                'src/assets/portfolioAssets/geoadventure/5_GeoAdventure.png'
            ],
            keyFeatures: [
                {title: "Combat & Flight Mechanics", body: "Seamless player interaction in 1:1 scale Earth environment"},
                {title: "Ai Integration", body: "Custom ChatGPT assistant for navigation and information"},
                {title: "Dynamic Quest System", body: "20+ unique challenges and educational objectives"},
                {title: "Real-world Scale", body: "Cesium for Unreal Engine plugin integration"},
            ],
            youtubeLink: 'https://www.youtube.com/embed/LwSHAgCfX-I?si=T42gVXMH2K1YC67X',
            liveLink: 'https://example.com',
            githubLink: 'https://github.com',
        },
        ];


    constructor() {
        this.stateManager = GameStateManager.getInstance();
        this.isVisible = false;
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
        this.overlay.appendChild(this.detailsContainer);
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
                <div class="project-links">
                    ${project.githubLink ? `<a href="${project.githubLink}" class="github-link" target="_blank">
                    <i class="fab fa-github">
                    </i>View Source</a>` : ``}
                </div>  
            </div>
            
            <div class="media-container">
                <div class="main-media">
                    ${project.images.length > 0 ? `<img src="${project.images[0]}" alt="${project.title}">` : ``}
                </div>
                <div class ="media-grid">
                    ${project.images.slice(1).map( img => `
                        <div class="media-item">
                            <img src="${img}" alt="${project.title} Screenshot">
                        </div>                        
                        `).join('')}
                    <div class="media-item video-wrapper">
                        <iframe src="${project.youtubeLink}"  frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;" allowfullscreen></iframe>
                    </div>
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
                        `).join('')};
                </div>
            </div>
            
            <div class="tech-stack">
                <h3>Technologies</h3>
                <div class="tools-grid">
                    ${project.technologies.map(tech => `
                        <div class="tool-item">
                            <img src="src/assets/icons/${tech.toLowerCase()}-icon.svg" alt="${tech} Icon">
                             <span>${tech}</span>                            
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        `;

        // this.detailsContainer.innerHTML = `
        // <div class = "detail-content">
        //     <button class="back-button"><- Back to Projects</button>
        //     <h2>${project.title}</h2>
        //     <div class ="project-details">
        //         <p>${project.fullDescription}</p>
        //             <div class="technologies">
        //                 ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        //             </div>
        //             <div class="project-links">
        //                 <a href="${project.liveLink}">Live Demo</a>
        //                 <a href="${project.githubLink}" target="_blank">GitHub</a>
        //             </div>
        //     </div>
        // </div>
        // `;

        this.container.style.opacity = '0';
        this.container.style.visibility = 'hidden';

        this.detailsContainer.style.opacity = '1';
        this.detailsContainer.style.visibility = 'visible';

        const backButton = this.detailsContainer.querySelector('.back-button');
        backButton?.addEventListener('click', () => this.showProjectGrid());
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

            .tech-tag {
                display: inline-block;
                background: rgba(255, 255, 255, 0.2);
                padding: 0.3rem 0.8rem;
                border-radius: 20px;
                margin: 0.25rem;
                font-size: 0.9rem;
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
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 2rem;
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
        `;
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    private setupEventListeners(){
        this.stateManager.onStateEnter(GameState.PORTFOLIO_VIEW, () =>{
            this.show()
        });

        this.overlay.addEventListener('click', (e) => {
            if(e.target === this.overlay){
                this.hide();
                this.stateManager.setState(GameState.CAMERA_TRANSITION_EXIT);
            }
        });
    }

    show(){
        this.isVisible =true;
        this.overlay.classList.add('visible');
    }

    hide(){
        this.overlay.classList.remove('visible');
    }
}