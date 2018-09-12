import { HomeDesktopPage } from 'presentations/containers/HomeDesktopPage';
import { SubDesktopPage } from 'presentations/containers/SubDesktopPage';
import { IRoute } from 'router/Router';

export const routes: IRoute[] = [
  {
    path: '/',
    title: 'Home',
    component: (): typeof HomeDesktopPage => {
      return HomeDesktopPage;
    },
  },
  {
    path: '/sub',
    title: 'Sub',
    component: (): typeof SubDesktopPage => {
      return SubDesktopPage;
    },
  },
];
