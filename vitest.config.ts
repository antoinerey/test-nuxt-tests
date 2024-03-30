import { defineConfig } from 'vitest/config'
import { loadNuxt, buildNuxt } from '@nuxt/kit'
import { type ViteConfig } from '@nuxt/schema'
import vuePlugin from '@vitejs/plugin-vue'

async function getViteConfig() {
    const nuxt = await loadNuxt({
        cwd: process.cwd(),
        dev: false,
        overrides: { ssr: false },
    })

    return new Promise<ViteConfig>((resolve, reject) => {
        nuxt.hook('vite:extendConfig', (config, { isClient }) => {
            if (isClient) {
                resolve(config)
                throw new Error('_stop_')
            }
        })

        buildNuxt(nuxt).catch((err) => {
            if (!err.toString().includes('_stop_')) {
                reject(err)
            }
        })
    }).finally(() => nuxt.close())
}

export default defineConfig(async () => {
    const config = await getViteConfig()

    // Allow `.vue` components to be understood by Vitest. I'm not sure why
    // it's not the case already since we pull the Vite config use by Nuxt.
    config.plugins ||= []
    config.plugins.unshift(vuePlugin(config.vue))

    // Configure tests to run in `jsdom`. By default, they run in a Node.js
    // environment, but we do need stuff like the Window object, or the DOM.
    config.test ||= {}
    config.test.environment = 'jsdom'

    // Force Vite to inline Nuxt dependencies so that the virtual module paths
    // (such as `#build`) are properly resolved through the Vite aliases.
    config.test.server ||= {}
    config.test.server.deps ||= {}
    config.test.server.deps.inline ||= []
    config.test.server.deps.inline.push(/\/node_modules\/nuxt\//)

    return config
})