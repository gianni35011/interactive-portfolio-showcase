import {NPC} from "../entities/NPC.ts";
import {GameState, GameStateManager} from "./GameStateManager.ts";

export class DialogueManager{
    private active = false;
    private box!: HTMLDivElement;
    private textToDisplay: string[] = [];
    private currentPageIndex: number = 0;
    private currentTextPos: number = 0;
    private intervalId: number | null = null;
    private isAnimating = false;

    private stateManager = GameStateManager.getInstance();

    // @ts-ignore
    private currentNPC: NPC | null = null;

    constructor() {
        this.initUI();

        this.stateManager.onStateExit(GameState.DIALOGUE, () => {
            this.hide();
        });

    }

    private initUI() {
        this.box = document.createElement('div')
        this.box.id = 'dialogue-box';
        this.box.innerHTML = `
            <div id="dialogue-text"></div>
            <button id="dialogue-close">Continue</button>
        `
        this.box.style.display = 'none';
        document.body.appendChild(this.box);
        document.getElementById('dialogue-close')?.addEventListener('click', () => this.handleContinue());
    }

    startDialogue(npc: NPC, text: string[]){
        this.active = true;
        this.currentNPC = npc;
        this.textToDisplay = text;
        this.currentPageIndex = 0;
        this.currentTextPos = 0;
        this.box.style.display = 'block';

        if(this.intervalId !== null){
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        this.startAnimation();

    }

    handleContinue(){
        if(this.isAnimating){
            this.clearAnimation();
            const currentPage = this.textToDisplay[this.currentPageIndex];
            document.getElementById('dialogue-text')!.textContent = currentPage;
            this.currentTextPos = currentPage.length;
        } else {
            this.currentPageIndex++;
            if(this.currentPageIndex < this.textToDisplay.length){
                this.currentTextPos = 0;
                this.startAnimation();
            } else {
                this.hide();
            }
        }
    }

    private startAnimation(){
        const dialogueText = document.getElementById('dialogue-text')!;
        dialogueText.textContent = '';
        this.isAnimating = true;

        this.intervalId = window.setInterval(() => {
            if(this.currentPageIndex >= this.textToDisplay.length){
                this.clearAnimation();
                return;
            }

            const currentPage = this.textToDisplay[this.currentPageIndex];
            if(this.currentTextPos < currentPage.length){
                dialogueText.textContent = currentPage.substring(0, this.currentTextPos + 1);
                this.currentTextPos++;
            } else {
                this.clearAnimation();
            }
        }, 50)
    };

    private clearAnimation(){
        if(this.intervalId !== null){
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isAnimating = false;
    }

    hide(){
        this.active = false;
        this.currentNPC = null;
        this.box.style.display = 'none';
        this.currentTextPos = 0;
        this.clearAnimation();
        console.log("Dialogue hidden");
        this.stateManager.setState(GameState.CAMERA_TRANSITION_ENTER);
    }



    get isActive(){
        return this.active;
    }

}