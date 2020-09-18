import { Fragment, h } from '@stencil/core';
import {
  Route,
  createStaticRouter,
  staticState,
  match,
  matchAny,
} from './stencil-router-v2';
import { getPage } from './data.server/prismic';
import state from './store';
import { getDocsData } from './data.server/docs';

export const Router = createStaticRouter();

export default Router;

export const Routes = () => (
  <Router.Switch>
    <Route
      path="/"
      mapParams={staticState(getPage)}
      render={(_, data) => (
        <Fragment>
          <SiteHeader />
          <landing-page data={data} />
        </Fragment>
      )}
    />

    <Route path={match('/blog', { exact: true })}>
      <SiteHeader />
      <blog-page />
    </Route>

    <Route
      path={match('/blog/:slug')}
      render={({ slug }) => (
        <Fragment>
          <SiteHeader />
          <blog-post slug={slug} />
        </Fragment>
      )}
    />

    <Route path="/cordova">
      <SiteHeader />
      <cordova-landing-page />
    </Route>

    <Route path="/enterprise">
      <SiteHeader />
      <capacitor-enterprise />
    </Route>

    <Route path="/community">
      <SiteHeader />
      <capacitor-community />
    </Route>

    <Route
      path={matchAny(['/docs/:id*', '/docs'])}
      mapParams={staticState(getDocsData)}
      render={(_, data) => <docs-component data={data} />}
    />

    <Route
      path={match('/solution/:solutionId*')}
      render={({ solutionId }) => (
        <Fragment>
          <SiteHeader />
          <solution-page solutionId={solutionId} />
        </Fragment>
      )}
    />
  </Router.Switch>
);

Router.onChange((newUrl, _oldUrl) => {
  (window as any).gtag('config', 'UA-44023830-42', {
    page_path: newUrl.pathname + newUrl.search,
  });

  state.showTopBar = !newUrl.pathname.includes('/docs');

  // if (!oldUrl || oldUrl.pathname !== newUrl.pathname) {
  //   state.isLeftSidebarIn = false;
  //   state.showTopBar = true;
  //   state.pageTheme = 'light';
  // }

  // Reset scroll position
  // requestAnimationFrame(() => window.scrollTo(0, 0));

  // if (newUrl.hash) {
  //   const id = newUrl.hash.slice(1);
  //   setTimeout(() => {
  //     const el = document.getElementById(id);
  //     if (el) {
  //       el.scrollIntoView && el.scrollIntoView();
  //     }
  //   }, 50);
  // }
});

const SiteHeader = () => (
  <Fragment>
    <site-platform-bar productName="Capacitor" />
    <capacitor-site-header />
  </Fragment>
);

export const handleRoutableLinkClick = (e: MouseEvent) => {
  if (e.metaKey || e.ctrlKey) {
    return;
  }

  if (e && (e.which == 2 || e.button == 4)) {
    return;
  }

  if ((e.target as HTMLElement).tagName === 'A') {
    const href = (e.target as HTMLAnchorElement).href;
    const u = new URL(href);
    if (u.origin === window.location.origin) {
      e.stopPropagation();
      e.preventDefault();
      Router.push(u.pathname);
    }
  }
};
