import type { MapParamData } from '../stencil-router-v2';
import fs from 'fs';

import {
  parseMarkdown,
  MarkdownResults,
  JsxAstNode
} from '@stencil/ssg/parse';


export interface BlogData extends MarkdownResults {
  authorName?: string;
  authorEmail?: string;
  authorUrl?: string;
  authorImageName?: string;
  authorDescription?: string;
  description?: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  date?: string;
  preview?: boolean;
}


export const getAllBlogData: MapParamData = async () => {
  
  const results: BlogData[] = [];

  const fileNames = fs.readdirSync('blog');

  await Promise.all(fileNames.map(async (file) => {        
    const fileName = file.split('.')[0];
    const page = await getFormattedData(fileName, true);

    results.push(page);
  }));

  results.sort((a: BlogData, b: BlogData) => {
    if (a.date > b.date) return -1;
    if (a.date < b.date) return 1;
    return 0;
  })
    
  return results;
}


export const getBlogData: MapParamData = async ({ slug }) => {
  return getFormattedData(slug);
}


const getFormattedData = async (slug: string, preview = false) => {
  const opts = getParseOpts(preview);
  const results: BlogData = await parseMarkdown(`blog/${slug}`, opts);

  const authorString = results.attributes.author;
  const emailIndex = authorString.indexOf('<');
  results.authorName = authorString.slice(0, emailIndex).trim();
  results.authorEmail = authorString.slice(emailIndex + 1, authorString.indexOf('>')).trim();
  results.authorUrl = results.attributes.authorUrl;
  results.authorImageName = results.attributes.authorImageName;
  results.authorDescription = results.attributes.authorDescription;

  results.date = (new Date(results.attributes.date)).toISOString();

  results.featuredImage = results.attributes.featuredImage;
  results.featuredImageAlt = results.attributes.featuredImageAlt;

  results.preview = hasPreviewMarker(results.ast);

  return results;
}

const hasPreviewMarker = (ast: JsxAstNode[]) => {
  const hasPreview = ast.find((item) => item[0] === 'preview-end');

  return !!hasPreview;
}

const getParseOpts = (preview: boolean) => {
  if (preview) {
    return {
      async beforeSerialize(frag: DocumentFragment) {  
        if (frag.querySelector('preview-end')) {            
          const notInPreview = frag.querySelectorAll('preview-end ~ *');                   
  
          notInPreview.forEach(el => el.remove());
        }          
      }
    };
  }

  return {};
}
