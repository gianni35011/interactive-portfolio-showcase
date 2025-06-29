import './style.css'
// Third-party libraries
import * as THREE from 'three'
import {Mesh} from 'three'
import {OrbitControls} from "three/addons/controls/OrbitControls.js"

// Engine components
import Camera from './engine/camera'
import Light from './engine/light'
import {Graphics} from './engine/graphics.ts'
import {initPhysics} from "./engine/physics.ts"
import SoundManager from "./engine/SoundManager.ts"
import Animator from "./engine/AnimationHandler.ts"
import {DialogueManager} from "./engine/DialogueManager.ts"
import {MusicManager} from "./engine/MusicManager.ts"
import {FogSystem} from "./engine/FogSystem.ts"
import {GameState, GameStateManager} from "./engine/GameStateManager.ts"

// Entity components
import MyWorld from './entities/world.ts'
import {Player, PlayerDependencies} from "./entities/player.ts"
import {NPC, NPCDependencies} from "./entities/NPC.ts"
import {Skybox} from "./entities/SkyBox.ts"
import Fire from "./entities/fire.ts"

// UI components
import {PortfolioOverlay} from "./ui/PortfolioOverlay.ts"
import {EducationOverlay} from "./ui/EducationOverlay.ts"
import {LoadingScreen} from "./ui/LoadingScreen.ts"
import {StartScreen} from "./ui/StartScreen.ts"

// Asset loaders
import loader, {loadAnimatedAsset, loadStaticAsset, loadStaticAsset_02, loadStaticAssetArray} from './tools/loader.ts'

// Asset URLs
// World assets
import groundUrl from '/public/assets/world/ground/ground.glb'
import waterUrl from '/public/assets/world/ground/water.glb'
import treesUrl from '/public/assets/world/ground/foliage_lowpoly.glb'
import grassUrl from '/public/assets/world/ground/grass/grass.glb'
import centralRuinsUrl from '/public/assets/world/ground/centralRuins/centralRuins.glb'
import mountainsUrl from '/public/assets/world/ground/mountains/untitled.glb'
import worldCollisionUrl from '/public/assets/world/world_collision.glb'
import SkyBoxUrl from '/public/assets/world/skybox/NightSkyHDRI002_4K-HDR.exr'

// Character assets
import playerUrl from '/public/assets/adventurers/Rogue.glb'
import npcUrl from '/public/assets/adventurers/Barbarian_NoWeapons.glb'
import npc2Url from '/public/assets/adventurers/Mage.glb'

// Audio assets
import Audio00Url from '/public/assets/voiceLines/ProjectsNPC/1_ProjectsNPC.mp3'
import Audio01Url from '/public/assets/voiceLines/ProjectsNPC/2_ProjectsNPC.mp3'
import Audio02Url from '/public/assets/voiceLines/ProjectsNPC/3_ProjectsNPC.mp3'
import WizardVoice00Url from '/public/assets/voiceLines/EducationNPC/00_WizardVoice.mp3'
import WizardVoice01Url from '/public/assets/voiceLines/EducationNPC/01_WizardVoice.mp3'
import BackgroundVideo from '/assets/assets/background-video.webm';

// Configuration
const DEBUG = false;
const GRASS_COUNT = 15000;

/**
 * Initialize the start screen and set up state transitions
 */
async function startScreen() {
    new StartScreen(BackgroundVideo);
    const stateManager = GameStateManager.getInstance();
    new PortfolioOverlay(); // Initialize portfolio overlay
    new EducationOverlay();
    new MusicManager();
    stateManager.onStateEnter(GameState.LOADING, async () => {
        await initializeGame();
    });
}

/**
 * Main game initialization function
 */
async function initializeGame() {
    const stateManager = GameStateManager.getInstance();
    stateManager.setState(GameState.LOADING);
    
    // Set up loading screen
    const loadingScreen = new LoadingScreen();
    
    try {
        // Initialize physics
        const Rapier = await initPhysics();
        
        // Set up asset loading with progress tracking
        const assetsToLoad = [
            { name: 'ground', loader: () => loader(groundUrl) },
            { name: 'player', loader: () => loadAnimatedAsset(playerUrl) },
            { name: 'npc', loader: () => loadAnimatedAsset(npcUrl) },
            { name: 'npc2', loader: () => loadAnimatedAsset(npc2Url) },
            { name: 'trees', loader: () => loadStaticAsset(treesUrl) },
            { name: 'grass', loader: () => loadStaticAsset(grassUrl) },
            { name: 'centralRuins', loader: () => loadStaticAssetArray(centralRuinsUrl) },
            { name: 'mountains', loader: () => loadStaticAsset_02(mountainsUrl) },
            { name: 'water', loader: () => loadStaticAsset_02(waterUrl) },
            { name: 'worldCollision', loader: () => loader(worldCollisionUrl) }
        ];
        
        const totalAssets = assetsToLoad.length;
        let loadedAssets = 0;
        
        // Create progress updater
        const updateProgress = () => {
            loadedAssets++;
            const progress = (loadedAssets / totalAssets) * 100;
            loadingScreen.updateProgress(progress);
        };
        
        // Load all assets with progress tracking
        const loadedResults = await Promise.all(
            assetsToLoad.map(async (asset) => {
                try {
                    const result = await asset.loader();
                    updateProgress();
                    return { name: asset.name, data: result, success: true };
                } catch (error) {
                    console.error(`Failed to load asset: ${asset.name}`, error);
                    updateProgress();
                    return { name: asset.name, data: null, success: false };
                }
            })
        );
        
        // Extract loaded assets into named variables
        const assets = loadedResults.reduce((acc, item) => {
            acc[item.name] = item.data;
            return acc;
        }, {} as Record<string, any>);
        
        // Set up scene
        const scene = new THREE.Scene();
        const light = new Light();
        const camera = new Camera();
        const dialogueManager = new DialogueManager();
        
        // Set up rendering
        const graphics = new Graphics({ scene, camera });
        graphics.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(graphics.domElement);
        
        // Initialize NPCs
        const npc = createProjectsNPC(assets.npc, Rapier, dialogueManager);
        const npc2 = createEducationNPC(assets.npc2, Rapier, dialogueManager);
        
        if (npc) scene.add(npc);
        if (npc2) scene.add(npc2);
        
        // Initialize player
        const player = createPlayer(assets.player, Rapier, npc, npc2);
        if (player) {
            scene.add(player);
            scene.add(player.debugMesh);
        }
        
        // Initialize world
        if (assets.ground && assets.worldCollision) {
            const world = new MyWorld({
                visuals: assets.ground.scene,
                collision: assets.worldCollision.scene,
                physicsEngine: Rapier
            });
            scene.add(world);
            scene.add(world.debugMesh);
        }
        
        // Add environment elements
        addEnvironmentToScene(scene, assets);
        
        // Add fire
        const soundManager = SoundManager.getInstance();
        const fire = new Fire(9.5, 0.25, 10.2);
        scene.add(fire);
        fire.addHelperToScene(scene);
        scene.add(light);
        camera.add(soundManager.getListener());

        // Initialize skybox
        new Skybox(scene, graphics, SkyBoxUrl);
        
        // Initialize music and fog

        scene.fog = new FogSystem(new THREE.Color().setHex(0xDFE9F3), 0.005);
        
        // Set up debug controls if needed
        if (DEBUG) {
            const controls = new OrbitControls(camera, graphics.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.25;
            controls.screenSpacePanning = false;
            controls.maxPolarAngle = Math.PI / 2;
        }
        
        // Initialize UI overlays
        //new PortfolioOverlay();
        //new EducationOverlay();
        
        // Set up game loop
        let cameraInitialized = false;
        stateManager.setState(GameState.PLAYING);
        graphics.onUpdate((dt: number) => {
            if (!player || !npc || !npc2) return;
            
            npc.update(dt);
            npc2.update(dt);
            player.update(dt);
            Rapier.step();
            light.update(player);
            fire.update(dt);
            
            if (!DEBUG) camera.update(player, dt);
            if (!cameraInitialized) {
                camera.updateLookAtTarget(player);
                cameraInitialized = true;
            }
        });
        
        // Transition to main game state
        stateManager.setState(GameState.PLAYING);
        
    } catch (error) {
        console.error('Failed to initialize game:', error);
    }
}

/**
 * Create and configure the player entity
 */
function createPlayer(playerMesh: Mesh | null, physicsEngine: any, npc: any, npc2: any) {
    if (!playerMesh) return null;
    
    const dependencies: PlayerDependencies = {
        soundManager: new SoundManager(),
        animator: new Animator(playerMesh),
        physicsEngine,
    };
    
    const player = new Player(dependencies, playerMesh);
    
    if (npc) player.registerInteractableObject(npc);
    if (npc2) player.registerInteractableObject(npc2);
    
    return player;
}

/**
 * Create and configure the projects NPC
 */
function createProjectsNPC(npcMesh: Mesh | null, physicsEngine: any, dialogueManager: DialogueManager) {
    if (!npcMesh) return null;
    
    const dependencies: NPCDependencies = {
        soundManager: new SoundManager(),
        animator: new Animator(npcMesh),
        physicsEngine,
        dialogueManager,
        dialogueEntries: [
            {
                text: "Ah… another traveler. Drawn here by fate, or by purpose? It matters not. All who walk this path seek something.",
                audioPath: Audio00Url
            },
            {
                text: "I have witnessed creations born of skill and resolve—each bearing the mark of its maker. Some shaped in quiet reflection, others tempered through challenge and strife.",
                audioPath: Audio01Url
            },
            {
                text: "If knowledge is what you seek, then look upon them. Their purpose is clear to those with the will to see.",
                audioPath: Audio02Url
            }
        ],
    };
    
    return new NPC(dependencies, npcMesh);
}

/**
 * Create and configure the education NPC
 */
function createEducationNPC(npcMesh: Mesh | null, physicsEngine: any, dialogueManager: DialogueManager) {
    if (!npcMesh) return null;
    
    const dependencies: NPCDependencies = {
        soundManager: new SoundManager(),
        animator: new Animator(npcMesh),
        physicsEngine,
        dialogueManager,
        dialogueEntries: [
            {
                text: "You walk the path of progress… I know it well. The long nights, the silent battles fought beneath flickering lamps.",
                audioPath: WizardVoice00Url
            },
            {
                text: "If you would know the foundations upon which I stand—then look, and see for yourself.",
                audioPath: WizardVoice01Url
            },
        ],
        npcType: 'education',
    };
    
    return new NPC(
        dependencies, 
        npcMesh, 
        new THREE.Vector3(8, 0, 20.25), 
        new THREE.Vector3(0, 2, 0), 
        "Idle"
    );
}

/**
 * Add environment elements to the scene
 */
function addEnvironmentToScene(scene: THREE.Scene, assets: Record<string, any>) {
    // Add trees
    if (assets.trees) scene.add(assets.trees);
    
    // Add mountains
    if (assets.mountains) scene.add(assets.mountains);
    if(assets.water) scene.add(assets.water);
    
    // Add central ruins
    if (assets.centralRuins) {
        for (const centralRuin of assets.centralRuins) {
            scene.add(centralRuin);
        }
    }
    
    // Add grass instances
    if (assets.grass) {
        const grassGeometry = assets.grass.geometry;
        const grassMaterial = assets.grass.material;
        
        const instancedGrass = new THREE.InstancedMesh(grassGeometry, grassMaterial, GRASS_COUNT);
        scene.add(instancedGrass);
        
        const dummy = new THREE.Object3D();
        for (let i = 0; i < GRASS_COUNT; i++) {
            dummy.position.set(
                Math.random() * 72 - 25,
                0,
                Math.random() * 72 - 25
            );
            dummy.rotation.y = Math.random() * Math.PI * 2;
            dummy.scale.setScalar(Math.random() * 0.5 + 0.75 + 1);
            dummy.updateMatrix();
            instancedGrass.setMatrixAt(i, dummy.matrix);
        }
    }
}

// Start the application
startScreen().catch(error => {
    console.error('Failed to initialize:', error);
});
