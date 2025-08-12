import { GameState, GameStateManager } from "../engine/GameStateManager.ts";
import SoundManager from "../engine/SoundManager.ts";

export class StartScreen {
    private overlay!: HTMLElement;
    private container!: HTMLElement;
    private stateManager: GameStateManager;

    constructor(videoPath: string) {
        this.stateManager = GameStateManager.getInstance();
        this.createOverlay(videoPath);
        this.setupEventListeners();
        this.show();
        const soundManager = SoundManager.getInstance();
        soundManager.load('startScreen', [videoPath]);
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
        source.type = 'video/webm';

        videoBackground.appendChild(source);
        this.overlay.appendChild(videoBackground);

        // Create animated background elements
        const backgroundElements = document.createElement('div');
        backgroundElements.className = 'background-elements';

        // Create floating particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
            backgroundElements.appendChild(particle);
        }
        this.overlay.appendChild(backgroundElements);

        // Create content container
        this.container = document.createElement('div');
        this.container.className = 'start-screen-container';

        // Add animated title with typing effect
        const titleContainer = document.createElement('div');
        titleContainer.className = 'title-container';

        const title = document.createElement('h1');
        title.className = 'start-screen-title';
        title.textContent = 'Interactive Portfolio';
        titleContainer.appendChild(title);

        const titleUnderline = document.createElement('div');
        titleUnderline.className = 'title-underline';
        titleContainer.appendChild(titleUnderline);

        this.container.appendChild(titleContainer);

        // Add enhanced subtitle
        const subtitle = document.createElement('p');
        subtitle.className = 'start-screen-subtitle';
        subtitle.innerHTML = 'Explore my <span class="highlight">3D world</span> to discover my projects and skills';
        this.container.appendChild(subtitle);

        // Add description
        const description = document.createElement('p');
        description.className = 'start-screen-description';
        description.textContent = 'Navigate through an immersive experience showcasing my development journey';
        this.container.appendChild(description);

        // Create enhanced start button with icon
        const startButtonContainer = document.createElement('div');
        startButtonContainer.className = 'start-button-container';

        const startButton = document.createElement('button');
        startButton.className = 'start-button';
        startButton.innerHTML = `
            <span class="button-content">
                <span class="button-icon">🚀</span>
                <span class="button-text">Begin Journey</span>
            </span>
            <div class="button-ripple"></div>
        `;
        startButton.addEventListener('click', () => {
            this.hide();
            this.stateManager.setState(GameState.LOADING);
        });
        startButtonContainer.appendChild(startButton);
        this.container.appendChild(startButtonContainer);

        // Create enhanced direct access section
        const directAccessContainer = document.createElement('div');
        directAccessContainer.className = 'direct-access-container';

        const directAccessTitle = document.createElement('p');
        directAccessTitle.className = 'direct-access-title';
        directAccessTitle.innerHTML = 'Quick Access <span class="arrow">→</span>';
        directAccessContainer.appendChild(directAccessTitle);

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'direct-buttons-container';

        // Enhanced Portfolio button
        const portfolioButton = document.createElement('button');
        portfolioButton.className = 'direct-button portfolio-button';
        portfolioButton.innerHTML = `
            <span class="button-icon">💼</span>
            <span class="button-label">Portfolio</span>
            <div class="button-glow"></div>
        `;
        portfolioButton.addEventListener('click', () => {
            this.stateManager.setState(GameState.PORTFOLIO_VIEW);
        });
        buttonContainer.appendChild(portfolioButton);

        // Enhanced Education button
        const educationButton = document.createElement('button');
        educationButton.className = 'direct-button education-button';
        educationButton.innerHTML = `
            <span class="button-icon">🎓</span>
            <span class="button-label">Education</span>
            <div class="button-glow"></div>
        `;
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
                z-index: 1000;
                overflow: hidden;
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
                z-index: -2;
                filter: brightness(0.4) contrast(1.1);
            }
            
            .background-elements {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                pointer-events: none;
            }
            
            .floating-particle {
                position: absolute;
                width: 4px;
                height: 4px;
                background: linear-gradient(45deg, #6e8efb, #a777e3);
                border-radius: 50%;
                box-shadow: 0 0 10px rgba(110, 142, 251, 0.6);
                animation: floatUp linear infinite;
            }
            
            @keyframes floatUp {
                0% {
                    transform: translateY(100vh) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100px) rotate(360deg);
                    opacity: 0;
                }
            }
            
            .start-screen-container {
                max-width: 900px;
                text-align: center;
                color: white;
                padding: 3rem 2rem;
                background: rgba(15, 15, 25, 0.85);
                border-radius: 24px;
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.15);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
                transform: translateY(50px);
                opacity: 0;
                transition: all 1.5s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
            }
            
            .start-screen-container::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                transition: left 0.8s;
            }
            
            .start-screen-container:hover::before {
                left: 100%;
            }
            
            .start-screen-overlay.visible .start-screen-container {
                transform: translateY(0);
                opacity: 1;
            }
            
            .title-container {
                position: relative;
                display: inline-block;
                margin-bottom: 2rem;
            }
            
            .start-screen-title {
                font-size: 4rem;
                font-weight: 700;
                margin: 0;
                letter-spacing: 3px;
                background: linear-gradient(135deg, #ffffff, #6e8efb, #a777e3);
                background-size: 300% 300%;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: gradientShift 4s ease-in-out infinite;
                text-shadow: none;
            }
            
            @keyframes gradientShift {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
            }
            
            .title-underline {
                position: absolute;
                width: 100%;
                height: 4px;
                bottom: -10px;
                left: 0;
                background: linear-gradient(135deg, #6e8efb, #a777e3);
                border-radius: 2px;
                transform: scaleX(0);
                animation: underlineGrow 1s ease-out 0.5s forwards;
            }
            
            @keyframes underlineGrow {
                to { transform: scaleX(1); }
            }
            
            .start-screen-subtitle {
                font-size: 1.4rem;
                margin-bottom: 1rem;
                opacity: 0.9;
                font-weight: 300;
                line-height: 1.6;
            }
            
            .highlight {
                color: #6e8efb;
                font-weight: 600;
                text-shadow: 0 0 20px rgba(110, 142, 251, 0.5);
            }
            
            .start-screen-description {
                font-size: 1rem;
                margin-bottom: 3rem;
                opacity: 0.7;
                font-weight: 300;
                max-width: 600px;
                margin-left: auto;
                margin-right: auto;
                line-height: 1.5;
            }
            
            .start-button-container {
                margin-bottom: 3rem;
            }
            
            .start-button {
                background: linear-gradient(135deg, #6e8efb, #a777e3);
                color: white;
                font-size: 1.3rem;
                font-weight: 600;
                padding: 1.2rem 3rem;
                border: none;
                border-radius: 50px;
                cursor: pointer;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 8px 30px rgba(110, 142, 251, 0.4);
                position: relative;
                overflow: hidden;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .start-button::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                transition: left 0.6s;
            }
            
            .start-button:hover::before {
                left: 100%;
            }
            
            .start-button:hover {
                transform: translateY(-5px) scale(1.05);
                box-shadow: 0 15px 40px rgba(110, 142, 251, 0.6);
            }
            
            .start-button:active {
                transform: translateY(-2px) scale(1.02);
            }
            
            .button-content {
                position: relative;
                z-index: 2;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
            }
            
            .button-icon {
                font-size: 1.2rem;
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            
            .direct-access-container {
                border-top: 1px solid rgba(255, 255, 255, 0.2);
                padding-top: 2rem;
                margin-top: 1rem;
            }
            
            .direct-access-title {
                margin-bottom: 1.5rem;
                font-size: 1.1rem;
                opacity: 0.8;
                font-weight: 400;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
            }
            
            .arrow {
                font-size: 1.2rem;
                animation: bounce 2s infinite;
            }
            
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateX(0); }
                40% { transform: translateX(5px); }
                60% { transform: translateX(3px); }
            }
            
            .direct-buttons-container {
                display: flex;
                justify-content: center;
                gap: 2rem;
                flex-wrap: wrap;
            }
            
            .direct-button {
                background: rgba(255, 255, 255, 0.1);
                color: white;
                border: 2px solid rgba(255, 255, 255, 0.3);
                padding: 1rem 2rem;
                border-radius: 16px;
                cursor: pointer;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
                backdrop-filter: blur(10px);
                min-width: 140px;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
            }
            
            .direct-button .button-icon {
                font-size: 1.5rem;
                transition: transform 0.3s ease;
            }
            
            .direct-button .button-label {
                font-size: 0.9rem;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .direct-button:hover {
                transform: translateY(-3px);
                border-color: rgba(255, 255, 255, 0.6);
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            }
            
            .direct-button:hover .button-icon {
                transform: scale(1.2);
            }
            
            .portfolio-button:hover {
                border-color: #a777e3;
                color: #a777e3;
                box-shadow: 0 10px 25px rgba(167, 119, 227, 0.3);
            }
            
            .education-button:hover {
                border-color: #6e8efb;
                color: #6e8efb;
                box-shadow: 0 10px 25px rgba(110, 142, 251, 0.3);
            }
            
            .button-glow {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
                border-radius: 16px;
                opacity: 0;
                transition: opacity 0.4s ease;
            }
            
            .direct-button:hover .button-glow {
                opacity: 1;
            }
            
            /* Responsive design */
            @media (max-width: 768px) {
                .start-screen-container {
                    padding: 2rem 1.5rem;
                    margin: 1rem;
                }
                
                .start-screen-title {
                    font-size: 2.8rem;
                    letter-spacing: 2px;
                }
                
                .start-screen-subtitle {
                    font-size: 1.2rem;
                }
                
                .start-button {
                    font-size: 1.1rem;
                    padding: 1rem 2.5rem;
                }
                
                .direct-buttons-container {
                    gap: 1rem;
                }
                
                .direct-button {
                    min-width: 120px;
                    padding: 0.8rem 1.5rem;
                }
            }
            
            @media (max-width: 480px) {
                .start-screen-title {
                    font-size: 2.2rem;
                }
                
                .direct-buttons-container {
                    flex-direction: column;
                    align-items: center;
                }
                
                .direct-button {
                    width: 200px;
                }
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
        this.overlay.classList.add('visible');
    }

    hide(): void {
        this.overlay.classList.remove('visible');
    }
}
