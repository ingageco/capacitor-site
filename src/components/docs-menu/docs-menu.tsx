import {
  Component,
  ComponentInterface,
  Event,
  EventEmitter,
  Host,
  Method,
  Prop,
  State,
  Watch,
  h,
} from '@stencil/core';
import { href } from '../../stencil-router-v2';
import type { TableOfContents } from '@stencil/ssg';
import Router from '../../router';
import state from '../../store';
import type { DocsTemplate } from '../../data.server/docs';

@Component({
  tag: 'docs-menu',
  styleUrl: 'docs-menu.scss',
  scoped: true,
})
export class SiteMenu implements ComponentInterface {
  @Prop() template: DocsTemplate;

  @Prop() toc: TableOfContents;

  @State() expandList = [];

  @State() showOverlay = false;

  @Event() menuToggled: EventEmitter;

  @Method()
  async toggleOverlayMenu() {
    this.showOverlay = !this.showOverlay;
  }

  @Watch('showOverlay')
  showOverlayChange() {
    this.menuToggled.emit(this.showOverlay);
  }

  componentWillLoad() {
    this.expandActive();
    Router.onChange(() => this.expandActive());
  }

  expandActive() {
    const activeIndex = this.toc.root.findIndex(
      t => t.children && t.children.some(c => c.url === Router.activePath),
    );
    if (!this.expandList.includes(activeIndex)) {
      this.expandList = [...this.expandList, activeIndex];
    }
  }

  toggleParent = (itemNumber: number) => {
    return (e: MouseEvent) => {
      e.preventDefault();

      if (this.expandList.includes(itemNumber)) {
        this.expandList.splice(this.expandList.indexOf(itemNumber), 1);
        this.expandList = [...this.expandList];
      } else {
        this.expandList = [...this.expandList, itemNumber];
      }
    };
  };

  render() {
    return (
      <Host
        class={{
          'menu-overlay-visible': this.showOverlay,
        }}
      >
        <div class="sticky">
          <div>
            <div class="menu-header">
              <app-menu-toggle icon="close" />
              <a {...href('/')} class="menu-header__logo-link">
                {state.pageTheme === 'dark' ? (
                  <img
                    src="/assets/img/heading/logo-white.png"
                    alt="Capacitor Logo"
                  />
                ) : (
                  <img
                    src="/assets/img/heading/logo-black.png"
                    alt="Capacitor Logo"
                  />
                )}
              </a>
              <a {...href('/docs')} class="menu-header__docs-link">
                Docs
              </a>
              <version-select />
            </div>
            <ul class="section-list">
              <li>
                <a
                  {...href('/docs')}
                  class={{ active: this.template === 'guide' }}
                >
                  Guides
                </a>
              </li>
              <li>
                <a
                  {...href('/docs/plugins')}
                  class={{ active: this.template === 'plugins' }}
                >
                  Plugins
                </a>
              </li>
              <li>
                <a
                  {...href('/docs/reference/cli')}
                  class={{ active: this.template === 'reference' }}
                >
                  CLI
                </a>
              </li>
            </ul>
            <ul class="menu-list">
              {this.toc?.root.map((item, i) => {
                const active = item.url === Router.activePath;
                const expanded = this.expandList.includes(i);

                if (item.children && item.children.length > 0) {
                  return (
                    <li class={{ collapsed: !expanded }}>
                      <a
                        href={
                          /* href only for no-js, otherwise it'll toggle w/out navigating */
                          item.children[0].url
                        }
                        onClick={this.toggleParent(i)}
                      >
                        <ion-icon
                          name={expanded ? 'chevron-down' : 'chevron-forward'}
                        />
                        <span class="section-label">{item.text}</span>
                      </a>
                      <ul>
                        {item.children.map(childItem => {
                          return (
                            <li>
                              {childItem.url ? (
                                <a
                                  {...href(childItem.url)}
                                  class={{
                                    'link-active':
                                      childItem.url === Router.activePath,
                                  }}
                                >
                                  {childItem.text}
                                </a>
                              ) : (
                                <a
                                  rel="noopener"
                                  class="link--external"
                                  target="_blank"
                                  href="#"
                                >
                                  {childItem.text}
                                </a>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  );
                }

                return (
                  <li>
                    {item.url ? (
                      <a
                        {...href(item.url)}
                        class={{
                          'section-active': active,
                        }}
                      >
                        <span class="section-active-indicator" />
                        <span class="section-label">{item.text}</span>
                      </a>
                    ) : (
                      <a
                        rel="noopener"
                        class="link--external"
                        target="_blank"
                        href="#"
                      >
                        {item.text}
                      </a>
                    )}
                  </li>
                );
              })}

              {this.template === 'guide' ? (
                <li class="docs-menu menu-footer">
                  <a {...href('/docs/apis')}>
                    <span class="section-label">Plugins</span>
                    <span class="arrow">-&gt;</span>
                  </a>
                </li>
              ) : (
                <li class="menu-footer">
                  <a {...href('/docs')}>
                    <span class="section-label">Guides</span>
                    <span class="arrow">-&gt;</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </Host>
    );
  }
}
