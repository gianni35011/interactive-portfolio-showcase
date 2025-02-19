import { defineConfig} from "vite";

export default defineConfig(({
    build: {
        target: 'esnext',
        assetsDir: 'assets',
        copyPublicDir: true
    },
    base: '/',
    assetsInclude: ['**/*.gltf', '**/*.glb', '**/*.mp3', '**/*.ogg', '**/*.wav', '**/*.jpg', '**/*.png', '**/*.jpeg', '**/*.svg', '**/*.json'],
    publicDir:' public'
}))