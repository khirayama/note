import { HomeMobilePage } from 'presentations/containers/HomeMobilePage';
import { SubMobilePage } from 'presentations/containers/SubMobilePage';
import { IRoute } from 'router/Router';

export const routes: IRoute[] = [
  {
    path: '/',
    title: 'Home',
    component: (): typeof HomeMobilePage => {
      return HomeMobilePage;
    },
  },
  {
    path: '/sub',
    title: 'Sub',
    component: (): typeof SubMobilePage => {
      return SubMobilePage;
    },
  },
];
