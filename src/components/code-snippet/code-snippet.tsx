import { Component, Host, h, Prop, Build } from '@stencil/core';

const loadedPrismLangs: { [lang: string]: Promise<void> } = {};

// use an exact version so the cdn response is heavily cached
const prismCdn = `https://cdn.jsdelivr.net/npm/prismjs@1.21.0`;

@Component({
  tag: 'code-snippet',
  styleUrl: 'code-snippet.scss',
  shadow: true,
})
export class CodeSnippet {
  @Prop() language: string;
  @Prop() code: string;

  codeRef: HTMLElement;

  componentDidLoad() {
    if (Build.isBrowser) {
      const prismLang = this.language;

      if (!loadedPrismLangs.core) {
        loadedPrismLangs.core = new Promise(resolve => {
          const s = document.createElement('script');
          s.onload = () => resolve();
          s.src = `${prismCdn}/prismjs.min.js`;
        });
      }
      loadedPrismLangs.core
        .then(() => {
          if (window.Prism && window.Prism.highlightElement) {
            if (!loadedPrismLangs[prismLang]) {
              loadedPrismLangs[prismLang] = new Promise(resolve => {
                const s = document.createElement('script');
                s.onload = () => resolve();
                s.src = `${prismCdn}/components/prism-${prismLang}.min.js`;
              });
            }
            loadedPrismLangs[prismLang].then(() => {
              window.Prism.highlightElement(this.codeRef, false);
            });
          } else {
            console.warn('Prism not loaded');
          }
        })
        .catch(e => {
          console.error(e);
        });
    }
  }

  render() {
    return (
      <Host>
        <pre>
          <code class={`language-${this.language}`} ref={e => (this.codeRef = e)}>
            {this.code.trim()}
          </code>
        </pre>
      </Host>
    );
  }
}
