export default defineNuxtConfig({
    devtools: {enabled: false},
    app: {
        // head
        head: {
            title: 'AI指南专业版',
            meta: [
                {name: 'viewport', content: 'width=device-width, initial-scale=1'},
                {
                    name: 'referrer',
                    content: 'no-referrer'
                },
                {
                    name: 'referrer',
                    content: 'always'
                },
                {
                    name: 'referrer',
                    content: 'strict-origin-when-cross-origin'
                }
            ],
            link: [{rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}],
            script: [
                {
                    src: 'https://www.googletagmanager.com/gtag/js?id=G-7X3KPN3R02',
                    async: true
                },
                {
                    src: '/ga.js'
                },
                {
                    src: 'https://challenges.cloudflare.com/turnstile/v0/api.js'
                },
                {
                    src:'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8210373406341452',
                    async: true,
                    crossorigin: 'anonymous'
                }
            ]

        }
    },
    // build modules
    modules: [
        '@element-plus/nuxt',
        '@nuxtjs/tailwindcss',
        '@nuxtjs/device',
        '@nuxtjs/i18n'
    ],
    i18n: {
        defaultLocale: 'cn',
        langDir: './assets/lang/',
        locales: [
            {
                code: 'en',
                name: 'English',
                iso: 'en-US',
                file: 'en-US.json'
            },
            {
                code: 'cn',
                name: '中文',
                iso: 'zh-CN',
                file: 'zh-CN.json'
            }
        ],
    },
    plugins: [
    ],
    nitro: {
        devProxy: {}
    },
    runtimeConfig: {
        openaiApiKey: '',
        proxyUrl: ''
    }
})