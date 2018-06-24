---
layout: post
title: What Makes PHP a Bad Language
description: Most developers hate PHP. Here are some of the reasons why it's such a bad language.
---

If you're a developer you've probably already heard that PHP is an awful language. Many devs will jump on the bandwagon of detesting PHP without actually knowing what makes PHP a bad language. In this blog post, I'm going to write some of the most important points, ordered in what I feel is most relevant first, that makes PHP so universally hated.

### PHP is unreliable

PHP often leaves you hoping for the best and that things will just magically work out. Here are a few examples:

* `==` is not [transitive](https://en.wikipedia.org/wiki/Transitive_relation)<br />
`"foo" == true`, and `"foo" == 0`... but, `true != 0`<br />
If `$price = 0`, then `$price == 'e'` returns `true`<br />
If you think you can handle it, see PHP's complicated type comparison table [here](http://php.net/manual/en/types.comparisons.php)
* `array_search`, `strpos`, and similar functions return `0` if they find the needle at position 0, but `false` if they don't find it at all. It would be much better if PHP returned `-1` or raised an exception, because, if you use `false` as an index PHP will silently convert it to `0` for you. Thus, no exception will be thrown, instead, your script will do the wrong thing with no warning.
* `json_decode` returns `null` for invalid input, even though `null` is also a perfectly valid object for JSON to decode to - this function is completely unreliable unless you also call `json_last_error` every time you use it.
* Incrementing (`++`) a `null` produces `1`. Decrementing (`--`) a `null` produces `null`.
* Once a variable is made a reference, it's stuck as a reference. There's no obvious way to detect this and un-referencing requires unsetting the variable entirely.

### PHP is inconsistent

PHP has many inconsistencies which can lead to confusion and wasted development time. Similar things should look and behave in similar ways. Here's just a small sample of these inconsistencies:

* Some function names have underscores, some don't<br />
`strpos`, `str_rot13`<br />
`htmlentities`, `html_entity_decode`
* Some function names use "to" instead of 2<br />
`deg2rad`, `strtolower`
* Order of function arguments is inconsistent<br />
`array_filter($array, $callback)`<br />
`array_map($callback, $array)`
* Variable names are case-sensitive, but function and class names are not.
* All of the (many...) sort functions operate in-place and return nothing, but `array_reverse` returns a new array.
* Classes allow variable declaration (before assignment) for class attributes, whereas the procedural part of the language does not.

### PHP is unpredictable

Sometimes PHP will behave in very surprising ways. For example:

* Extra arguments to a function are ignored (except with built-in functions, which raise an exception). Missing arguments will simply be set to `null` (without raising an exception).
* Function arguments with defaults can appear before function arguments without, even though the documentation points out that by doing this "things will not work as expected" (but PHP still allows it).
* Integers are signed and 32-bit on 32-bit platforms. Unlike most languages, there is no automatic bigint promotion, thus you can end up with surprises like negative file sizes.
* Array functions often have confusing behavior because they can accept, and will thus have to operate on, associative arrays<br />
`array_diff(["foo"=> 123, "bar"=> 456], ["foo"=> 456, "bar"=> 123])`<br />
`array_diff` will return no differences in these arrays, because it treats them like sets: it compares only values, and ignores order.
* The error reporting level `E_ALL` includes all error categories, except `E_STRICT` (was fixed in `5.4.0`).

### PHP is not concise

Sometimes PHP is not clear and can be far from "short and sweet". For example:

* If a function might need to do two slightly different things, PHP just has two functions. In Python, you might do `.sort(reverse=True)`. In PHP, there's a separate function called `rsort()`.
* Array unpacking can be done with the `list($a, $b) = [‘foo', ‘bar']` operation. `list()` has function-like syntax just like array. This should have been given dedicated syntax, or at least named something less confusing.
* There is no exponentiation operator, only the `pow` function.
* There are a lot of aliases<br />
`is_int`/`is_integer`/`is_long`<br />
`implode`/`join`<br />
`die`/`exit`
* There are way too many XML packages: DOM (OO), DOM XML (not), libxml, SimpleXML, "XML Parser", XMLReader/XMLWriter. There are also three MySQL libraries: mysql, mysqli, and PDO.

### PHP is hard to debug

Another shortfall of PHP, not to sneak through unnoticed, is that it can be difficult to fix when something goes wrong. Again, see a few examples below:

* PHP does not have any interactive debugging (variable inspection, breakpoints, etc.).
* PHP errors don't provide stack traces. You have to install an extension, xdebug, to generate them (but you can't for fatal errors - fatal errors can't be caught by anything).
* Parse errors such as forgetting the closing quote in a string raises an exception with the line number being the last line of the file.
* Trying to access a non-existent object property, i.e., `$foo->x` produces a warning. Warnings are often suppressed on live systems, making it difficult to replicate problems on a production environment.

I've left out many other issues with PHP. As you may have noticed, many of these issues are not insurmountable, but they're just problems that a developer shouldn't have to deal with. If you're starting a new project, I'd recommend choosing Python (Django) or Node.js over PHP. Hope you found this post useful and learnt something new.
