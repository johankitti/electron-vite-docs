import { defineConfig, DefaultTheme } from 'vitepress'

const sidebar: DefaultTheme.Sidebar = {
  '/': [
    {
      text: 'Guide',
      items: [
        { text: 'Introduction', link: '/guide/introduction' },
        { text: 'Getting Started', link: '/guide/' },
        { text: 'Features', link: '/guide/features' },
        { text: 'CLI', link: '/guide/cli' },
        { text: 'Project Structure', link: '/guide/project-structure' },
        { text: 'Use HMR in Renderer', link: '/guide/hmr-in-renderer' },
        { text: 'Hot Reloading', link: '/guide/hot-reloading' },
        { text: 'Building for Production', link: '/guide/build' },
        { text: 'Env Variables and Modes', link: '/guide/env-and-mode' },
        { text: 'Multiple Windows', link: '/guide/mutli-windows' },
        { text: 'Debugging in VSCode', link: '/guide/debugging' }
      ]
    },
    {
      text: 'Config',
      items: [{ text: 'Config Reference', link: '/config/' }]
    },
    {
      text: 'API',
      items: [{ text: 'API Reference', link: '/api/' }]
    }
  ]
}

const nav: DefaultTheme.NavItem[] = [
  {
    text: 'Guide',
    link: '/guide/',
    activeMatch: '^/guide|api|about/'
  },
  { text: 'Config', link: '/config/', activeMatch: '^/config/' },
  {
    text: 'Links',
    items: [
      { text: 'Vite', link: 'https://vitejs.dev/' },
      {
        text: 'create-electron',
        link: 'https://github.com/alex8088/quick-start/tree/master/packages/create-electron'
      }
    ]
  },
  {
    text: 'v1.0.7',
    items: [
      {
        text: 'Changelog',
        link: 'https://github.com/alex8088/electron-vite/blob/master/CHANGELOG.md'
      }
    ]
  }
]

export default defineConfig({
  lang: 'en-US',
  title: 'electron-vite',
  description: 'Next generation Electron build tooling based on Vite.',
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }]
  ],
  srcDir: 'docs',
  lastUpdated: true,
  themeConfig: {
    algolia: {
      appId: '',
      apiKey: '',
      indexName: ''
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/alex8088/electron-vite'
      }
    ],
    localeLinks: {
      text: 'English',
      items: [{ text: '简体中文', link: 'https://cn-evite.netlify.app/' }]
    },
    logo: '/favicon.svg',
    footer: {
      message: 'Released under the MIT License',
      copyright: 'Copyright © 2022-present Alex Wei & Powered by Vite'
    },
    nav,
    sidebar
  }
})
