<?php

$whitelist = array(
  '2011:4860:4000::/36',
  '2414:6800:4000::/36',
  '2608:f8b0:4000::/36',
  '2801:3f0:4000::/36',
  '2b00:1450:4000::/36',
  '2d0f:fb50:4000::/36',
);

/**
 * Checks if the requesting IP is in our whitelist
 * Returns true if it is in the whitelist, false otherwise
 */
function ip_in_whitelist($whitelist)
{
  $ip = get_ip();

  // Check if the IP is in our defined whitelist
  foreach ($whitelist as $subnet) {
    if (ip_in_subnet($ip, $subnet) == true) {
      return true;
    }
  }

  return false;
}

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
  $ip_net_bits = substr($ip_bits, 0, $netmask_len);
  $range_net_bits = substr($range_bits, 0, $netmask_len);

  // If the network bits are identical, then this IP is part of the subnet
  return ($ip_net_bits == $range_net_bits);
}

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

if (ip_in_whitelist($whitelist) == true) {
  echo 'Yay, carry on';
} else {
  header('HTTP/1.0 403 Forbidden');
  echo 'IP not in whitelist';
}