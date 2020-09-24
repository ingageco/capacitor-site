import { Build, Component, Prop, h } from '@stencil/core';
import { getPluginApiHtml } from '../../data.server/plugin-api';

@Component({
  tag: 'plugin-api',
  styleUrl: 'plugin-api.scss',
})
export class PluginApi {
  // @Element() el: Element;
  @Prop() name: string;
  @Prop() index = false;
  content: string;

  componentWillLoad() {
    if (Build.isServer) {
      return getPluginApiHtml(this.name, this.index).then(html => {
        this.content = html;
      });
    }
  }

  // componentDidUpdate() {
  //   this.bindHeadings(this.el);
  // }

  // bindHeadings(el: Element) {
  //   if (Build.isServer) {
  //     return;
  //   }

  //   const headings = Array.from(el.querySelectorAll('h1,h2,h3,h4,h5'));
  //   headings.forEach(h => {
  //     h.classList.add('anchor-link-relative');
  //     var link = document.createElement('anchor-link');
  //     link.className = 'hover-anchor';
  //     if (h.id) {
  //       link.to = h.id;
  //     }
  //     link.innerHTML = '#';
  //     h.insertBefore(link, h.firstChild);
  //   });
  // }

  render() {
    return <div innerHTML={this.content} />;
  }
}
