---
layout: page
title: Blog
---

<section>
  <table>
    {% for post in site.posts %}
      <tr>
        <td><i class="icon-clock"></i> <time datetime="{{post.date|date:"%F"}}">{{post.date|date:"%d %b %Y"}}</time></td>  
        <td><a href="{{site.baseurl}}{{ post.url }}">{{ post.title }}</a></td>
      </tr>
    {% endfor %}
  </table>
</section>