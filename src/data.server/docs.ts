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
  template?: 'guide' | 'reference';
}

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
let referenceToc: TableOfContents;
const getTableOfContents = async (template: 'guide' | 'reference') => {
  if (template === 'reference') {
    if (!referenceToc) {
      const referenceTocPath = join(docsDir, 'reference', 'README.md');
      referenceToc = await parseTableOfContents(referenceTocPath, pagesDir);
    }
    return referenceToc;
  }
  if (!guideToc) {
    const guideTocPath = join(docsDir, 'README.md');
    guideToc = await parseTableOfContents(guideTocPath, pagesDir);
  }
  return guideToc;
};

const getTemplateFromPath = (path: string): 'guide' | 'reference' => {
  if (typeof path === 'string') {
    const re = /\/docs\/([^\/]+).*/;
    const m = re.exec(path);

    if (m) {
      const p = m[1];
      if (p === 'reference' || p === 'apis') {
        return 'reference';
      }
    }
  }
  return 'guide';
};
