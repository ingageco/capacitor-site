import type { MapParamData } from '../stencil-router-v2';
import {
  getPageNavigation,
  parseMarkdown,
  parseTableOfContents,
  PageNavigation,
  MarkdownResults,
  TableOfContents,
} from '@stencil/ssg/parse';
import { join } from 'path';
import { getGithubData } from './github';
import { getPluginApiData, getPluginApiIndexData } from './plugin-api';

const repoRootDir = join(__dirname, '..', '..');
const pagesDir = join(repoRootDir, 'pages');
const docsDir = join(pagesDir, 'docs');

export interface DocsData extends MarkdownResults {
  contributors?: string[];
  lastUpdated?: string;
  navigation?: PageNavigation;
  repoFileUrl?: string;
  tableOfContents?: TableOfContents;
  template?: DocsTemplate;
}

export type DocsTemplate = 'guide' | 'plugins' | 'reference';

export const getDocsData: MapParamData = async ({ id }) => {
  if (!id) {
    id = 'index.md';
  }

  const results: DocsData = await parseMarkdown(join(docsDir, id), {
    headingAnchors: true,
    async beforeSerialize(frag) {
      const pluginApis = Array.from(frag.querySelectorAll('plugin-api'));
      pluginApis.map(pluginApi => {
        const data = getPluginApiData(pluginApi.getAttribute('name'));
        pluginApi.setAttribute('api', JSON.stringify(data));
      });

      const pluginApiIndexes = Array.from(frag.querySelectorAll('plugin-api-index'));
      pluginApiIndexes.map(pluginApiIndex => {
        const data = getPluginApiIndexData(pluginApiIndex.getAttribute('name'));
        pluginApiIndex.setAttribute('api', JSON.stringify(data));
      });
    },
  });

  results.template = getTemplateFromPath(results.filePath);

  results.tableOfContents = await getTableOfContents(results.template);

  results.navigation = await getPageNavigation(pagesDir, results.filePath, {
    tableOfContents: results.tableOfContents,
  });

  const githubData = await getGithubData(repoRootDir, results.filePath);

  results.lastUpdated = githubData.lastUpdated;
  results.repoFileUrl = githubData.repoFileUrl;

  results.contributors = [];
  if (Array.isArray(githubData.contributors)) {
    results.contributors.push(...githubData.contributors);
  }
  if (Array.isArray(results.attributes?.contributors)) {
    results.contributors.push(...results.attributes.contributors);
  }
  results.contributors = Array.from(new Set(results.contributors));

  return results;
};

const cachedToc = new Map<string, TableOfContents>();

const getTableOfContents = async (template: DocsTemplate) => {
  let toc = cachedToc.get(template);
  if (!toc) {
    let tocPath: string;
    if (template === 'reference' || template === 'plugins') {
      tocPath = join(docsDir, template, 'README.md');
    } else {
      tocPath = join(docsDir, 'README.md');
    }
    toc = await parseTableOfContents(tocPath, pagesDir);
    cachedToc.set(template, toc);
  }
  return toc;
};

const getTemplateFromPath = (path: string): DocsTemplate => {
  if (typeof path === 'string') {
    const re = /\/docs\/([^\/]+).*/;
    const m = re.exec(path);

    if (m) {
      const p = m[1];
      if (p === 'plugins' || p === 'apis') {
        return 'plugins';
      }
      if (p === 'reference') {
        return 'reference';
      }
    }
  }
  return 'guide';
};
