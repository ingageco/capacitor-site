import { Component, Host, h } from '@stencil/core';
import { href } from '../../stencil-router-v2';

@Component({
  tag: 'version-select',
  styleUrl: 'version-select.scss',
})
export class VersionSelect {
  render() {
    return (
      <Host role="navigation" aria-label="Documentation Version Selector">
        <a {...href('/docs')} class="version-selected">
          <span>v3</span>
          <ion-icon name="chevron-down-outline" />
        </a>
        <div class="version-selector">
          <a {...href('/docs')}>v3</a>
          <a {...href('/docs')}>v2</a>
        </div>
      </Host>
    );
  }
}
