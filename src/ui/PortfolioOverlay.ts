import {GameState, GameStateManager} from "../engine/GameStateManager.ts";

export class PortfolioOverlay{
    private overlay: HTMLElement;
    private container: HTMLElement;
    private stateManager: GameStateManager;
    private isVisible: boolean;

    constructor() {
        this.stateManager = GameStateManager.getInstance();
        this.isVisible = false;
        this.createOverlay();
        this.setupEventListeners();
    }

    private createOverlay(){
        this.overlay = document.createElement('div');
        this.overlay.className = 'portfolio-overlay';

        this.container = document.createElement('div');
        this.container.className = 'portfolio-container';

        this.container.innerHTML = `
            <h1>My Portfolio</h1>
            <div class="projects-grid">
                <!-- Add your projects here -->
                <div class="project-card">
                    <h2>Project 1</h2>
                    <p>Description of project 1</p>
                </div>
                <!-- Add more project cards as needed -->
            </div>
        `;

        this.overlay.appendChild(this.container);
        document.body.appendChild(this.overlay);

        this.addStyles();
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
                align-items: center;
                z-index: 1000;
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
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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