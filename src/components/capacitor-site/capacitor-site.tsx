import { Component, h } from '@stencil/core';
import { Routes } from '../../router';
import state from '../../store';

@Component({
  tag: 'capacitor-site',
  styleUrl: 'capacitor-site.scss',
})
export class App {
  render() {
    return (
      <main class={`page-theme--${state.pageTheme}`}>
        <Routes />
      </main>
    );
  }
}
