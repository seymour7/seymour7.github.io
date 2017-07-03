---
layout: post
title: Rendering large HTML tables
description: I tried to improve the rendering (front-end) of a large HTML table and managed to produce some great results.
---

I recently had to improve the rendering (front-end) of a large HTML table and had such great results that I decided to write up a blog post about it.
 
Here's what the table look like:
 
![Large table]({{ site.baseurl }}/public/html_table/table.png)
 
The table had about 7 or 8 columns and about 3000 rows. Using Chrome's performance analyser, I could observe that the 2 largest time consumers for the page load were javascript and the DOM rendering.
 
![Trial 1]({{ site.baseurl }}/public/html_table/a1.png)
![Trial 2]({{ site.baseurl }}/public/html_table/a2.png)
![Trial 3]({{ site.baseurl }}/public/html_table/a3.png)
 
### Optimising JavaScript
 
I already knew what javascript was slowing the page. I had 2 links in each row of the table that needed to be initialised so a popup form would appear when clicked. All 3000 rows would have a picker initialised at page load.
 
![Popup form]({{ site.baseurl }}/public/html_table/popup.png)
 
If you don't know what part of your JS was slowing down the page, you can find out quite easily by following the call tree.

![Call tree]({{ site.baseurl }}/public/html_table/call_tree.png)

To fix this I only initialise the link on first click. It's a tradeoff between time on page load vs time on click. The time on click is so fast that it was worth it (plus these links aren't frequently used).
 
Here's the performance improvement after this:
 
![Trial 1]({{ site.baseurl }}/public/html_table/b1.png)
![Trial 2]({{ site.baseurl }}/public/html_table/b2.png)
![Trial 3]({{ site.baseurl }}/public/html_table/b3.png)
 
When actually clicking a link, there's no noticeable increase in the time taken for the popup to appear.
 
### Optimising DOM rendering
 
After observing the page loading, I thought that as the table loads, the column widths are constantly adjusted. I made the columns fixed width but this actually didn't improve the page load time at all.
 
While doing this, I notice that if I didn't have the tab displayed on my screen (i.e. I was in another tab) the page would load much faster. At this point I realised that if the entire table was just rendered in one fell swoop (instead of rendering each row as it loads), then it would render much faster. So, I displayed a spinner until the page was fully loaded, then un-hid the table on page load. The results were great:
 
![Trial 1]({{ site.baseurl }}/public/html_table/c1.png)
![Trial 2]({{ site.baseurl }}/public/html_table/c2.png)
![Trial 3]({{ site.baseurl }}/public/html_table/c3.png)
 
### Conclusion
 
I managed to reduce the page load time by X% with very little decrease in usability. Hope you found this useful. It's like I just swapped my corolla for a ferrari for free.
 
Sometimes you spend so long improving backend performance you forget to run frontend benchmarks and it's nice to be aware of a few frontend optimisations
