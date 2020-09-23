import { Component, Host, h, State, Listen } from '@stencil/core';
import { href } from '../../stencil-router-v2';

@Component({
  tag: 'version-select',
  styleUrl: 'version-select.scss',
  scoped: true,
})
export class VersionSelect {
  @State() expanded = false;

  @Listen('click', { target: 'window' })
  closeSelect() {
    if (this.expanded) {
      this.expanded = false;
    }
  }

  openSelect = (ev: UIEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    this.expanded = !this.expanded;
  };

  render() {
    return (
      <Host role="navigation" aria-label="Documentation Version Selector">
        <a
          {...href('/docs')}
          aria-label="Version 2.x Docs"
          class="version-selected"
          onClick={this.openSelect}
        >
          <span>v2</span>
          <ion-icon name="chevron-down-outline" />
        </a>
        <div class="version-selector" hidden={!this.expanded}>
          <a {...href('/docs')} aria-label="Version 2.x Docs">
            v2
          </a>
          <a {...href('/docs')} aria-label="Version 3.x Docs">
            v3 (beta)
          </a>
          <a
            href="https://github.com/ionic-team/capacitor/releases"
            target="_blank"
            class="releases"
          >
            All Releases
          </a>
        </div>
      </Host>
    );
  }
}
