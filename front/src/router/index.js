import { createRouter, createWebHistory } from "vue-router";

import { wikiRoutes } from "./wikiRoutes";

const routes = [
  {
    path: "/",
    name: "init",
    component: () => import("../views/Wikirol.vue"),
  },
  {
    path: "/wikirol",
    name: "wikirol",
    component: () => import("../views/Wikirol.vue"),
  },
  {
    path: "/big/:id?",
    name: "bigArticle",
    component: () => import("../components/wiki/BigArticle.vue"),
  },
  {
    path: "/signin",
    name: "singin",
    component: () => import("../views/RegisterView.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/my-character-sheets",
    name: "myCharacterSheets",
    component: () =>
      import("../components/sheetComponent/MyCharacterSheets.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/recover-password",
    component: () => import("../views/RecoverPassword.vue"),
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("../views/DashboardView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/adventures",
    name: "aventuras",
    component: () => import("../components/Adventures/Adventures.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/adventures/:id?",
    name: "adventuresPlay",
    component: () => import("../views/Adventures.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/contacto",
    name: "contacto",
    component: () => import("../components/wiki/Formulario.vue"),
  },
  {
    path: "/insertData",
    name: "insertData",
    component: () => import("../views/InsertData.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/characterSheet",
    name: "character",
    components: { default: () => import("../views/CosmosRolSheet.vue") },
  },
  {
    path: "/rules",
    name: "RuleList",
    component: () => import("../views/RuleList.vue"),
  },
  {
    path: "/rules/:id",
    name: "RuleDetail",
    component: () => import("../components/rules/RuleDetail.vue"),
  },
  {
    path: "/spell",
    name: "SpellList",
    component: () =>
      import("../components/sheetComponent/pieces/SpellList.vue"),
  },
  {
    path: "/spell/:id",
    name: "SpellDetail",
    component: () =>
      import("../components/sheetComponent/pieces/SpellDetail.vue"),
  },
  {
    path: "/creature",
    name: "CreatureList",
    component: () => import("../views/CreatureView.vue"),
  },
  {
    path: "/creature/create",
    name: "CreatureForm",
    component: () => import("../components/Creatures/CreateCreature.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/creature/show",
    name: "SearchCreature",
    component: () => import("../components/Creatures/SearchCreature.vue"),
  },
  {
    path: "/creature/show/:id",
    name: "ShowCreature",
    component: () => import("../components/Creatures/ShowCreature.vue"),
  },
  {
    path: "/creature/modify/:id",
    name: "ModifyCreature",
    component: () => import("../components/Creatures/ModifyCreature.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/initiative",
    name: "initiative",
    component: () => import("../views/rolUtils.vue"),
  },
  {
    path: "/character-tester",
    name: "characterTester",
    component: () =>
      import("../modules/character/components/CharacterTester.vue"),
  },
  ...wikiRoutes,
  {
    path: "/:catchAll(.*)",
    name: "404",
    component: () => import("../components/Vacuum.vue"),
  },
];

const router = createRouter({
  history: createWebHistory("/"),
  routes,
  scrollBehavior() {
    document.getElementById("app").scrollIntoView();
  },
});

export default router;
