import { HomeMobilePage } from 'presentations/containers/HomeMobilePage';
import { IRoute } from 'router/Router';

export const routes: IRoute[] = [
  {
    path: '/',
    title: 'Home',
    component: (): typeof HomeMobilePage => {
      return HomeMobilePage;
    },
  },
];
