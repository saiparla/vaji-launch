import vikeReact from 'vike-react/config'

export default {
  extends: [vikeReact],
  title: 'వజ్రోత్సవ ప్రారంభ వేడుకలు - Vaji Inauguration',
  favicon: '/vaji-launch/favicon.ico',
  ssr: true,
  clientRouting: true,
  prerender: {
    noExtraDir: true
  }
}
