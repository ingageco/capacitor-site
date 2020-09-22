import {
  Component,
  Listen,
  Prop,
  ComponentInterface,
  State,
  h,
} from '@stencil/core';
import Helmet from '@stencil/helmet';
import { RenderJsxAst } from '@stencil/ssg';
import { DocsData } from '../../data.server/docs';

@Component({
  tag: 'docs-component',
  styleUrl: 'docs-component.scss',
})
export class DocsComponent implements ComponentInterface {
  menuEl!: HTMLDocsMenuElement;

  @Prop() data: DocsData;

  @State() showBackdrop = false;

  @Listen('menuToggleClick')
  toggleMenu() {
    this.menuEl.toggleOverlayMenu();
  }

  @Listen('menuToggled')
  menuToggled(ev: CustomEvent) {
    const isOpen = ev.detail;
    this.showBackdrop = isOpen;
  }

  backdropClicked = () => {
    this.menuEl.toggleOverlayMenu();
  };

  render() {
    const { data, showBackdrop } = this;

    if (!data) {
      return (
        <div class="container">
          <strong>Page Not Found</strong>
        </div>
      );
    }

    return (
      <div class="container">
        <Helmet>
          <title>
            {data.title ? `${data.title} - Capacitor` : 'Capacitor'}
          </title>
          {data.description && (
            <meta
              name="description"
              content={`${data.description} - Official Capacitor Documentation`}
            />
          )}
        </Helmet>

        <app-menu-toggle />

        <site-backdrop visible={showBackdrop} onClick={this.backdropClicked} />

        <docs-menu
          ref={el => (this.menuEl = el)}
          template={data.template}
          toc={data.tableOfContents}
        />

        <div class="content-container">
          <docs-header template={data.template} />
          <div class="app-marked">
            <div class="doc-content">
              <div class="measure-lg">
                <RenderJsxAst ast={data.ast} />
                <contributor-list contributors={data.contributors} />
                <lower-content-nav navigation={data.navigation} />
              </div>
            </div>

            <in-page-navigation
              pageLinks={data.headings}
              repoFileUrl={data.repoFileUrl}
            />
          </div>
        </div>
      </div>
    );
  }
}
