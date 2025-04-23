import { GameState, GameStateManager } from "../engine/GameStateManager.ts";

export class StartScreen {
    private overlay: HTMLElement;
    private container: HTMLElement;
    private stateManager: GameStateManager;
    private _isVisible: boolean = true;

    constructor(videoPath: string) {
        this.stateManager = GameStateManager.getInstance();
        this.createOverlay(videoPath);
        this.setupEventListeners();
        this.show(); // Show by default when created
    }

    private createOverlay(videoPath: string): void {
        // Create main overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'start-screen-overlay';

        // Create video background
        const videoBackground = document.createElement('video');
        videoBackground.className = 'background-video';
        videoBackground.autoplay = true;
        videoBackground.muted = true;
        videoBackground.loop = true;
        videoBackground.playsInline = true;

        const source = document.createElement('source');
        source.src = videoPath;
        source.type = 'video/mp4';

        videoBackground.appendChild(source);
        this.overlay.appendChild(videoBackground);

        // Create content container
        this.container = document.createElement('div');
        this.container.className = 'start-screen-container';

        // Add title
        const title = document.createElement('h1');
        title.className = 'start-screen-title';
        title.textContent = 'Interactive Portfolio';
        this.container.appendChild(title);

        // Add subtitle
        const subtitle = document.createElement('p');
        subtitle.className = 'start-screen-subtitle';
        subtitle.textContent = 'Explore my 3D world to discover my projects and skills';
        this.container.appendChild(subtitle);

        // Create start button
        const startButton = document.createElement('button');
        startButton.className = 'start-button';
        startButton.textContent = 'Start Experience';
        startButton.addEventListener('click', () => {
            this.hide();
            this.stateManager.setState(GameState.LOADING);
        });
        this.container.appendChild(startButton);

        // Create direct access section
        const directAccessContainer = document.createElement('div');
        directAccessContainer.className = 'direct-access-container';

        const directAccessTitle = document.createElement('p');
        directAccessTitle.className = 'direct-access-title';
        directAccessTitle.textContent = 'Or view directly:';
        directAccessContainer.appendChild(directAccessTitle);

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'direct-buttons-container';

        // Portfolio button
        const portfolioButton = document.createElement('button');
        portfolioButton.className = 'direct-button portfolio-button';
        portfolioButton.textContent = 'Portfolio';
        portfolioButton.addEventListener('click', () => {
            this.hide();
            this.stateManager.setState(GameState.PORTFOLIO_VIEW);
        });
        buttonContainer.appendChild(portfolioButton);

        // Education button
        const educationButton = document.createElement('button');
        educationButton.className = 'direct-button education-button';
        educationButton.textContent = 'Education';
        educationButton.addEventListener('click', () => {
            this.stateManager.setState(GameState.EDUCATION_VIEW);
        });
        buttonContainer.appendChild(educationButton);

        directAccessContainer.appendChild(buttonContainer);
        this.container.appendChild(directAccessContainer);

        this.overlay.appendChild(this.container);
        document.body.appendChild(this.overlay);

        this.addStyles();
    }

    private addStyles(): void {
        const styles = `
            .start-screen-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                opacity: 0;
                visibility: hidden;
                transition: opacity 1s ease-in-out;
                z-index: 2000;
            }
            
            .start-screen-overlay.visible {
                opacity: 1;
                visibility: visible;
            }
            
            .background-video {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
                z-index: -1;
                filter: brightness(0.4);
            }
            
            .start-screen-container {
                max-width: 800px;
                text-align: center;
                color: white;
                padding: 2rem;
                background: rgba(0, 0, 0, 0.6);
                border-radius: 12px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                transform: translateY(30px);
                opacity: 0;
                transition: all 1.2s ease-out;
            }
            
            .start-screen-overlay.visible .start-screen-container {
                transform: translateY(0);
                opacity: 1;
            }
            
            .start-screen-title {
                font-size: 3.5rem;
                margin-bottom: 1rem;
                letter-spacing: 2px;
                text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
            }
            
            .start-screen-subtitle {
                font-size: 1.2rem;
                margin-bottom: 3rem;
                opacity: 0.8;
            }
            
            .start-button {
                background: linear-gradient(135deg, #6e8efb, #a777e3);
                color: white;
                font-size: 1.2rem;
                padding: 1rem 2.5rem;
                border: none;
                border-radius: 50px;
                cursor: pointer;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                box-shadow: 0 4px 20px rgba(107, 142, 251, 0.4);
                margin-bottom: 2.5rem;
            }
            
            .start-button:hover {
                transform: translateY(-3px);
                box-shadow: 0 6px 25px rgba(107, 142, 251, 0.6);
            }
            
            .direct-access-container {
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                padding-top: 1.5rem;
            }
            
            .direct-access-title {
                margin-bottom: 1rem;
                font-size: 1rem;
                opacity: 0.7;
            }
            
            .direct-buttons-container {
                display: flex;
                justify-content: center;
                gap: 1.5rem;
            }
            
            .direct-button {
                background: transparent;
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.3);
                padding: 0.7rem 1.5rem;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .direct-button:hover {
                background: rgba(255, 255, 255, 0.1);
                border-color: rgba(255, 255, 255, 0.5);
            }
            
            .portfolio-button:hover {
                border-color: #a777e3;
                color: #a777e3;
            }
            
            .education-button:hover {
                border-color: #6e8efb;
                color: #6e8efb;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    private setupEventListeners(): void {
        // Listen for a game reset state to show the start screen again
        this.stateManager.onStateEnter(GameState.GAME_RESET, () => {
            this.show();
        });
    }

    show(): void {
        this._isVisible = true;
        this.overlay.classList.add('visible');
    }

    hide(): void {
        this._isVisible = false;
        this.overlay.classList.remove('visible');
    }
}