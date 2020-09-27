import { Component, Prop, h } from '@stencil/core';
import { Heading } from '@ionic-internal/ionic-ds';

import { BlogPost } from './blog-common';
import { BlogData } from '../../data.server/blog';




@Component({
  tag: 'blog-page',
  styleUrl: 'blog-page.scss',
  scoped: true
})
export class BlogPage {
  @Prop() data: { pages: BlogData[] };

  componentWillLoad() {
    this.data.pages.sort((a, b) => {
      if (a.date > b.date) return -1;
      if (a.date < b.date) return 1;
      return 0;
    })
  }

  render() {

    if (this.data) {
      return [
        <AllPosts data={this.data} />,
        <pre-footer />,
        <newsletter-signup />,
        <capacitor-site-footer />
      ]
    }

    return null;
  }
}


const AllPosts = ({ data }: { data: any }) => {

  return (
    <div class="blog-posts">
      <hgroup class="blog-posts__heading">
        <Heading level={3}>Blog</Heading>
      </hgroup>
      {data.pages.map(p => <BlogPost data={p} single={false} />)}
    </div>
  )
}