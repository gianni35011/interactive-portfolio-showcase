import { defineConfig} from "vite";
import path from 'path'

export default defineConfig(({
    build: {
        target: 'esnext',
        assetsDir: 'assets',
        copyPublicDir: true,
        sourcemap: true,
    },
    base: '/interactive-portfolio-showcase/',
    assetsInclude: ['**/*.gltf', '**/*.glb', '**/*.mp3', '**/*.ogg', '**/*.wav', '**/*.jpg', '**/*.png', '**/*.jpeg', '**/*.svg', '**/*.json', '**/*.exr'],
    publicDir: 'public',
    resolve:{
        alias: {
            '/public': path.resolve(__dirname, 'public')
        }
    }
}))