
export class LoadingScreen {
    private element!: HTMLElement;
    private progressBar!: HTMLElement;
    private progressText!: HTMLElement;

    constructor() {
        this.createLoadingScreen();
        this.show();
    }

    private createLoadingScreen() {
        this.element  = document.createElement('div');
        this.element.className = 'loading-screen';

        const content = document.createElement('div');
        content.className = 'loading-content';

        const title = document.createElement('h1');
        title.textContent = 'Loading';
        content.appendChild(title);

        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';

        this.progressBar = document.createElement('div');
        this.progressBar.className = 'progress-bar';

        this.progressText = document.createElement('div');
        this.progressText.className = 'progress-text';
        this.progressText.textContent = '0%';

        progressContainer.appendChild(this.progressBar);
        progressContainer.appendChild(this.progressText);
        content.appendChild(progressContainer);

        this.element.appendChild(content);
        document.body.appendChild(this.element);

        this.addStyles();
    }

    public updateProgress(percentage: number) {
        percentage = Math.min(Math.max(percentage, 0), 100);

        this.progressBar.style.width = `${percentage}%`;
        this.progressText.textContent = `${Math.round(percentage)}%`;

        if (percentage >= 100) {
            setTimeout(() => {
                this.hide();
                // Transition to PLAYING state will now be handled in main.ts
                // with the fade effect
            }, 500);
        }
    }

    private addStyles() {
            const styles = `
            .loading-screen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #000;
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2000;
                transition: opacity 0.5s ease-out;
            }
            
            .loading-content {
                text-align: center;
                color: white;
                max-width: 80%;
            }
            
            .loading-content h1 {
                font-size: 3rem;
                margin-bottom: 2rem;
            }
            
            .progress-container {
                width: 100%;
                height: 30px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                overflow: hidden;
                position: relative;
            }
            
            .progress-bar {
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, #3a6186, #89253e);
                transition: width 0.3s ease-out;
            }
            
            .progress-text {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                color: white;
                font-weight: bold;
            }
        `;

            const styleSheet = document.createElement('style');
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }

    public hide() {
        this.element.style.opacity = '0';
        this.element.style.pointerEvents = 'none';

        // Remove completely after transition
        setTimeout(() => {
            this.element.remove();
        }, 500);
    }

    public show() {
        this.element.style.opacity = '1';
        this.element.style.pointerEvents = 'auto';
    }
}
