import { HomeDesktopPage } from 'presentations/containers/HomeDesktopPage';
import { IRoute } from 'router/Router';

export const routes: IRoute[] = [
  {
    path: '/',
    title: 'Home',
    component: (): typeof HomeDesktopPage => {
      return HomeDesktopPage;
    },
  },
];
