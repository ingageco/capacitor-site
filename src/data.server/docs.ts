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

export type DocsTemplate = 'guide' | 'plugins' | 'cli';

export const getDocsData: MapParamData = async ({ id }) => {
  if (!id) {
    id = 'index.md';
  }

  const results: DocsData = await parseMarkdown(join(docsDir, id), {
    headingAnchors: true,
    useCache: false,
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

let guideToc: TableOfContents;
let pluginsToc: TableOfContents;
let cliToc: TableOfContents;
const getTableOfContents = async (template: DocsTemplate) => {
  if (template === 'plugins') {
    if (!pluginsToc) {
      const pluginsTocPath = join(docsDir, 'plugins', 'README.md');
      pluginsToc = await parseTableOfContents(pluginsTocPath, pagesDir);
    }
    return pluginsToc;
  }

  if (template === 'cli') {
    if (!cliToc) {
      const cliTocPath = join(docsDir, 'reference', 'cli', 'README.md');
      cliToc = await parseTableOfContents(cliTocPath, pagesDir);
    }
    return cliToc;
  }

  if (!guideToc) {
    const guideTocPath = join(docsDir, 'README.md');
    guideToc = await parseTableOfContents(guideTocPath, pagesDir);
  }
  return guideToc;
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
      if (p === 'cli') {
        return 'cli';
      }
    }
  }
  return 'guide';
};
