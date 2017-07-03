---
layout: post
title: Rendering large HTML tables
description: I tried to improve the rendering (front-end) of a large HTML table and managed to produce some great results.
---

I recently had to improve the rendering (front-end) of a large HTML table and had such great results that I decided to write up a blog post about it.

Here's what the table look like:

<img src="/public/html_table/table.png" alt="Large table" style="border:1px solid #777">

The table had about 7 or 8 columns and about 3000 rows. Using Chrome's performance analyser, I could observe that the 2 largest time consumers for the page load were javascript and the DOM rendering.

<table style="text-align:center;margin-bottom:1rem;">
	<tr>
		<td markdown="span">![Trial 1]({{ site.baseurl }}/public/html_table/a1.png)</td>
		<td markdown="span">![Trial 2]({{ site.baseurl }}/public/html_table/a2.png)</td>
		<td markdown="span">![Trial 3]({{ site.baseurl }}/public/html_table/a3.png)</td>
	</tr>
	<tr style="font-size:10px;">
		<td>Trial 1</td>
		<td>Trial 2</td>
		<td>Trial 3</td>
	</tr>
</table>

### Optimising JavaScript

I already knew what javascript was slowing the page. I had 2 links in each row of the table that needed to be initialised so a popup form would appear when clicked. All 3000 rows would have 2 popup handlers initialised at page load.

<img src="/public/html_table/popup.png" alt="Popup form" style="border:1px solid #777;margin:0 auto;">

If you don't know what part of your JS was slowing down the page, you can find out quite easily by following the call tree.

<img src="/public/html_table/call_tree.png" alt="Call tree" style="border:1px solid #777;margin:0 auto;">

To fix this I only initialise the link on first click. It's a tradeoff between time on page load vs. time on click. The time on click is so fast that it was worth it (when actually clicking a link, there's no noticeable increase in the time taken for the popup to appear).

Here's the performance improvement after this:

<table style="text-align:center;margin-bottom:1rem;">
	<tr>
		<td markdown="span">![Trial 1]({{ site.baseurl }}/public/html_table/b1.png)</td>
		<td markdown="span">![Trial 2]({{ site.baseurl }}/public/html_table/b2.png)</td>
		<td markdown="span">![Trial 3]({{ site.baseurl }}/public/html_table/b3.png)</td>
	</tr>
	<tr style="font-size:10px;">
		<td>Trial 1</td>
		<td>Trial 2</td>
		<td>Trial 3</td>
	</tr>
</table>

The total scripting time was reduced from an average of 1936.4ms to 392.7ms (that's 4.9x faster).

### Optimising DOM rendering

After observing the page loading, I thought that as the table loads, the column widths are constantly adjusted. I made the columns fixed width but this actually didn't improve the page load time at all.

While doing this, I noticed that if I didn't have the tab displayed on my screen (i.e. I was in another tab) the page would load much faster. At this point I realised that if the entire table was just rendered in one fell swoop (instead of rendering each row as it loads), then it would render much faster. So, I displayed a spinner until the page was fully loaded, then un-hid the table on page load. The results were also pretty good:

<table style="text-align:center;margin-bottom:1rem;">
	<tr>
		<td markdown="span">![Trial 1]({{ site.baseurl }}/public/html_table/c1.png)</td>
		<td markdown="span">![Trial 2]({{ site.baseurl }}/public/html_table/c2.png)</td>
		<td markdown="span">![Trial 3]({{ site.baseurl }}/public/html_table/c3.png)</td>
	</tr>
	<tr style="font-size:10px;">
		<td>Trial 1</td>
		<td>Trial 2</td>
		<td>Trial 3</td>
	</tr>
</table>

The total rendering time reduced from an average of 1454.8ms to 957.2ms (1.5x faster).

### Conclusion

I managed to reduce the page load time by 2041.3ms (scripting and rendering is now 2.5x faster) with very little decrease in usability. Hope you found this useful - I was trying to demonstrate just how important frontend benchmarks and optimisations are, because often when we think about improving performance, we only think about the backend.