import type { MapParamData } from '../stencil-router-v2';
import type { MarkdownResults } from '@stencil/ssg/parse';

export interface BlogData extends MarkdownResults {}

export const getBlogData: MapParamData = async ({ slug }) => {
  return {
    slug,
  };
};
