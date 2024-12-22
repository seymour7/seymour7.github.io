---
layout: post
title: Whitelisting IPv6 subnets with php
description: This post demonstrates how to create an ipv6 whitelist without the need to create large integers with external libraries
---

If you would like to restrict access to a page on your website using an IP
whitelist, there's a few ways you can do this (e.g. in your http server
config). In this post, I'm going to show you how to achieve this in php, but
only for ipv6 addresses.

Whitelists for IPv4 have already been developed numerous times (see
[here](https://pgregg.com/blog/2009/04/php-algorithms-determining-if-an-ip-is-within-a-specific-range/)). This can be done easily by converting the ipv4
address to a 32bit integer (using php's `ip2long()` function), bitshifting the integer and comparing the network bits. The
same technique can't be used for ipv6 addresses however, because these addresses consist
of 128 bits and hence, are too large for a native php integer type (subsequently, there is no php function to convert an ipv6 address to an integer).

## Whitelisting IPv6 subnets

First, we define our subnets in an array. I'll be using CIDR notation
(xx.xx.xx.xx/xx) for my subnets, but at the end of this post I discuss ways to
support other formats.

{% highlight php %}
$whitelist = array(
  '2011:4860:4000::/36',
  '2414:6800:4000::/36',
  '2608:f8b0:4000::/36',
  '2801:3f0:4000::/36',
  '2b00:1450:4000::/36',
  '2d0f:fb50:4000::/36',
);
{% endhighlight %}

I like to leave a trailing comma in the array definition so you don't forget
the comma when adding new elements to the array.

Next, we create a function that fetches the client's IP address and iterates
over the whitelist subnets to check if the client IP belongs to any of them.

{% highlight php %}
/**
 * Checks if the requesting IP is in our whitelist
 * Returns true if it is in the whitelist, false otherwise
 */
function ip_in_whitelist($whitelist)
{
  $ip = $_SERVER['REMOTE_ADDR'];

  // Check if the IP is in our defined whitelist
  foreach ($whitelist as $subnet) {
    if (ip_in_subnet($ip, $subnet) == true) {
      return true;
    }
  }

  return false;
}
{% endhighlight %}

Before creating the `ip_in_subnet()` function, we define a function which just takes
the binary representation of an IP address and converts it into a 128 character-long string
of bits (1's and 0's). You'll see why this function is useful in the next step.

{% highlight php %}
/**
 * Converts the binary representation of an IP into a string of bits
 */
function inet_to_bits($inet)
{
  // Unpacks from a binary string into an array
  $unpacked = unpack('A*', $inet);
  $unpacked = str_split($unpacked[1]);
  $ip_bits = '';
  foreach ($unpacked as $char) {
    $ip_bits .= str_pad(decbin(ord($char)), 8, '0', STR_PAD_LEFT);
  }
  return $ip_bits;
}
{% endhighlight %}

The next function is the main part of the whitelister. It uses php's
`inet_pton()` function to convert the IP address of the client and an IP from
the subnet into their binary representations. It then converts them to a
string of bits (using the function we just defined above) and compares the
network part of the addresses to see if they belong to the same subnet.

{% highlight php %}
/**
 * Checks if the given IP is in the given subnet (CIDR notation: xx.xx.xx.xx/xx)
 * Returns true if it is in the subnet, false otherwise
 */
function ip_in_subnet($ip, $subnet)
{
  // Converts a human-readable IP address into its binary representation
  $binary_ip = inet_pton($ip);

  // Converts the binary IP into a string of bits.
  // We can't convert the IP to an int (using, for example ip2long()) because php only
  // natively supports unsigned 32 bit ints, while an ipv6 address is 128 bits.
  // If we want, we could make use of some php libraries (e.g. BC Math or GMP) to create a 128
  // bit int, but this is not necessary because we don't need to perform any math operations
  // on this int anyway.
  // Instead, we just convert the IP to a string which is sufficient because we only need to
  // use it for a single string comparison later.
  $ip_bits = inet_to_bits($binary_ip);

  // Get the bit string for the subnet address, as well as the length of the subnet mask (in bits)
  list($range, $netmask_len) = explode('/', $subnet, 2); //$netmask_len is aka. the CIDR prefix
  $binary_range = inet_pton($range);
  $range_bits = inet_to_bits($binary_range);

  // Get the network bits of the given IP address and the subnet address
  $ip_net_bits = str_pad(substr($ip_bits, 0, $netmask_len), $netmask_len, '0', STR_PAD_RIGHT);
  $range_net_bits = str_pad(substr($range_bits, 0, $netmask_len), $netmask_len, '0', STR_PAD_RIGHT);

  // If the network bits are identical, then this IP is part of the subnet
  return ($ip_net_bits == $range_net_bits);
}
{% endhighlight %}

Finally, you can test if your whitelist is working with the following code. It's useful to set the
correct HTTP headers if the client is not part of the whitelist so that they know why they have
been blocked.

{% highlight php %}
if (ip_in_whitelist($whitelist) == true) {
  echo 'Yay, carry on';
} else {
  header('HTTP/1.0 403 Forbidden');
  echo 'IP not in whitelist';
}
{% endhighlight %}

## Some notes to consider

### Forwarded IP headers / Getting the client IP correctly

You may have noticed that I obtained the client IP using `$_SERVER['REMOTE_ADDR']`. If you're running a simple web server this will most likely be fine. However, in my case for example, the application server was located behind a load balancer. Thus, `$_SERVER['REMOTE_ADDR']` actually reflects the IP of the load balancer and not the client. A much safer way of getting the client's IP would first check to see if the `HTTP_X_FORWARDED_FOR` header was set. The following function does exactly that:

{% highlight php %}
/**
 * Returns the IP address of the client.
 */
function get_ip() {
  if (isset($_SERVER['HTTP_X_FORWARDED_FOR']) && $_SERVER['HTTP_X_FORWARDED_FOR'] != '') {
    $fwd_addresses = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
    $ip_address = $fwd_addresses[0];
  } else {
    $ip_address = $_SERVER['REMOTE_ADDR'];
  }

  return $ip_address;
}
{% endhighlight %}

### Subnets in other formats

CIDR notation is most commonly used to specify subnets, but 2 other common formats are:

1. Wildcard: `2011:4860:4000::` ; `2011::3526`
2. Start-End range: `1:2:3:4:5:6:7:8`-`1:2:3:4:5:6:7:10`

I'll leave this as a challenge for you to figure out :)

### Object orientation

You'll probably want to add IPv4 validation to this and write your own class that can be used to check all types of subnets. Jalle19 has already written quite a nice class which you can find <a href="https://github.com/Jalle19/php-whitelist-check">here</a> and, either use as-is or draw some inspiration for your own class.

## Download source

You can download the source for this IPv6 whitelist <a href="{{ site.baseurl }}/public/whitelist.phps">here</a>.

----
Edit 22 Dec 2024:<br>
Thanks to Lukáš Sieber for suggesting the following:

> I had to make a small adjustment because in some cases the script evaluated the input IP address incorrectly.
> 
> Example:<br>
> IPv6 prefix: 2a13:50c0:50::/56<br>
> IPv6 address: 2a13:50c0:50::1
> 
> In bit form it is like this:<br>
> 0010101000010011010100001100000000000000001010000 (IPv6 prefix)<br>
> 00101010000100110101000011000000000000000000010100000000000000 (IPv6 address)<br>
> Here you can see that the prefix has been translated into less than 56 characters in bit form.
> 
> The modification consisted of adding 0 from the right to the length of 56 characters (for both the address and the prefix):<br>
> $ip_net_bits = str_pad(substr($ip_bits, 0, $netmask_len), $netmask_len, '0', STR_PAD_RIGHT);<br>
> $range_net_bits = str_pad(substr($range_bits, 0, $netmask_len), $netmask_len, '0', STR_PAD_RIGHT);
