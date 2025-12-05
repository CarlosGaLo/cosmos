// router/wikiRoutes.js
// Rutas para la Wiki - Añade estas rutas a tu archivo principal de router

import ArticlesList from '@/modules/wiki/ArticleList.vue';
import ArticleDetail from '@/modules/wiki/ArticleDetail.vue';

export const wikiRoutes = [
  {
    path: '/wiki',
    name: 'WikiHome',
    component: ArticlesList,
    meta: {
      title: 'Wiki - Artículos'
    }
  },
  {
    path: '/wiki/:slug',
    name: 'ArticleDetail',
    component: ArticleDetail,
    props: true,
    meta: {
      title: 'Wiki - Detalle del Artículo'
    }
  },
  {
    path: '/wiki/type/:type',
    name: 'ArticlesByType',
    component: ArticlesList,
    props: true,
    meta: {
      title: 'Wiki - Artículos por Tipo'
    }
  }
];