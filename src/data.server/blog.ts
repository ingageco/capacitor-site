import type { MapParamData } from '../stencil-router-v2';
import fs from 'fs';

import {
  parseMarkdown,
  MarkdownResults
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
}


export const getAllBlogData: MapParamData = async () => {
  
  const results: { pages: BlogData[] } = {
    pages: []
  }
  const fileNames = fs.readdirSync('blog');

  await Promise.all(fileNames.map(async (file) => {
        
    const slug = file.split('.')[0];
    const page = await getFormattedData(slug, true);

    results.pages.push(page);
  }));
    
  return results;
}


export const getBlogData: MapParamData = async ({ slug }) => getFormattedData(slug);


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

  return results;
}

const getParseOpts = (preview: boolean) => {
  if (preview) {
    return {
      async beforeSerialize(frag: DocumentFragment) {
        const previewMarker = frag.querySelector('hr.preview-end');
  
        if (previewMarker) {            
          const notInPreview = frag.querySelectorAll('hr.preview-end ~ *');             
          previewMarker.remove();         
  
          notInPreview.forEach(el => el.remove());
        }          
      }
    }
  } else {
    return {
      headingAnchors: true,
      async beforeSerialize(frag: DocumentFragment) {
        frag.querySelector('hr.preview-end')?.remove();
      }, 
    }
  }
}
