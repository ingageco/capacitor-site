import { Component, Prop, Host, h } from '@stencil/core';
import type { PageNavigation } from '@stencil/ssg';
import { href } from '../../stencil-router-v2';

@Component({
  tag: 'lower-content-nav',
  styleUrl: 'lower-content-nav.css',
})
export class LowerContentNav {
  @Prop() navigation: PageNavigation;

  render() {
    const n = this.navigation;
    if (!n) {
      return null;
    }
    return (
      <Host>
        {n.previous?.url ? (
          <a {...href(n.previous.url)} class="pull-left btn btn--secondary">
            {n.previous.title && n.previous.title.length < 32
              ? n.previous.title
              : 'Back'}
          </a>
        ) : null}
        {n.next?.url ? (
          <a {...href(n.next.url)} class="pull-right btn btn--primary">
            {n.next.title && n.next.title.length < 32 ? n.next.title : 'Next'}
          </a>
        ) : null}
      </Host>
    );
  }
}
