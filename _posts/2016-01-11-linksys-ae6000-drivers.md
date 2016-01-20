---
layout: post
title: Installing drivers for the Linksys AE6000 wifi dongle on Arch Linux
description: A quick guideline on the installation of the required chipset drivers for the Linksys AE6000 on Arch Linux
---

## Prelude

I bought a [Linksys AE6000](http://www.linksys.com/p/P-AE6000/) wifi dongle for use on my Raspberry Pi, which runs [Arch Linux ARM](http://archlinuxarm.org/) (for ARMv6). When plugged into the Pi's usb port, it didn't work. Unfortunately, the required drivers for the AE6000 were not provided by the base packages which were installed by default.

You can check if the wifi dongle has been correctly loaded by running <code>ip&nbsp;link</code> to see if the wifi interface was created (usually it starts with the letter "w", e.g. `wlp2s1`). In my case, this was the output of the command:

{% highlight bash %}
[alarm@alarmpi ~]$ ip link
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: eth0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc fq_codel state DOWN mode DEFAULT group default qlen 1000
    link/ether b8:27:eb:2e:76:55 brd ff:ff:ff:ff:ff:ff
{% endhighlight %}

As you can see, no interface was created for the dongle.

## My realisation while searching for drivers

In my search for drivers, I spent a lot of time googling for the name of the product, "Linksys AE6000", to no avail. After talking to a fellow linux guru, I learnt that most wireless adapters are based on only a few chipsets. What you actually want to find is a linux driver for the adapter's chipset.

One easy way to find the chipset info is to run `lsusb` while the dongle is plugged in.

{% highlight bash %}
[alarm@alarmpi ~]$ lsusb
Bus 001 Device 004: ID 13b1:003e Linksys AE6000 802.11a/b/g/n/ac Wireless Adapter [MediaTek MT7610U]
Bus 001 Device 003: ID 0424:ec00 Standard Microsystems Corp. SMSC9512/9514 Fast Ethernet Adapter
Bus 001 Device 002: ID 0424:9512 Standard Microsystems Corp. SMC9512/9514 USB Hub
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
{% endhighlight %}

The text in the square brackets, `MediaTek MT7610U`, is the chipset.

If you don't have the device yet, you could always do some googling. After a bit of googling, I found [this page](https://wikidevi.com/wiki/Linksys_AE6000) that contains the chipset.

Now, after googling for the chipset, "MediaTek MT7610U", instead of the product name, it took me only about 2 minutes to find a nicely built package in the AUR (`mt7610u_wifi_sta`) for the chipset drivers.

## Installation

Finally, this is how I went about installing the required drivers for the Linksys AE6000. All you need to do is install the following chipset driver from the AUR using the AUR helper of your choice:

{% highlight bash %}
packer -S mt7610u_wifi_sta
{% endhighlight %}

After this, reboot, and you will see the new interface in the output of <code>ip&nbsp;link</code>. I was now able to use the dongle to connect to my wifi network.

{% highlight bash %}
[alarm@alarmpi ~]$ ip link
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: eth0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc fq_codel state DOWN mode DEFAULT group default qlen 1000
    link/ether b8:27:eb:2e:76:55 brd ff:ff:ff:ff:ff:ff
3: ra0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP mode DORMANT group default qlen 1000
    link/ether c0:56:27:b9:81:48 brd ff:ff:ff:ff:ff:ff
{% endhighlight %}

## Other installation info

If you don't want to use the AUR, you can also download the linux source files for the chipset drivers off [their website](http://www.mediatek.com/en/downloads1/downloads/mt7610u-usb/) and build it yourself. Remember to install `base-devel` because it's not installed by default on Arch Linux ARM.