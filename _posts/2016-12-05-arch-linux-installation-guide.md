---
layout: post
title: The Friendliest Arch Linux Installation Guide on the Interwebs
description: A simple guide to install Arch Linux with KDE
---

I've had a few friends that wanted to try out Arch Linux but have given up after the grueling installation process. In this post I demonstrate how I usually perform a fresh Arch Linux installation.

This guide (like most Arch installation guides) is really just a simplified version of what's on the wiki [here](https://wiki.archlinux.org/index.php/installation_guide), so consider referring to it as well.

## Prelude

[Download](https://www.archlinux.org/download/) an Arch Linux ISO (I'm using `archlinux-2016.12.01-dual.iso` for this tutorial).

I then use `dd` to make a bootable USB drive. You can view guides on how to do this in various OS's [here](https://wiki.archlinux.org/index.php/USB_flash_installation_media).

## Pre-installation

### Boot and check internet

Boot the Arch Linux image.

Select `Boot Arch Linux (x86_64)`.

![]({{ site.baseurl }}/public/arch_install/0010.png)

You'll be automatically logged in on a console, as root

![]({{ site.baseurl }}/public/arch_install/0020.png)

Make sure your internet connection is working:
{% highlight bash %}
ping -c 4 google.com
{% endhighlight %}

![]({{ site.baseurl }}/public/arch_install/0030.png)

If it's not working you'll need to [fix this](https://wiki.archlinux.org/index.php/installation_guide#Connect_to_the_Internet) before continuing.

If you're using wifi, you'll need to configure a connection to it. First, we'll use `wifi-menu` to create a *connection profile*.

{% highlight bash %}
wifi-menu -o
{% endhighlight %}

Follow the prompts.

List your profiles using

{% highlight bash %}
netctl list
{% endhighlight %}

Once you have identified the name of your newly created profile, establish a connection

{% highlight bash %}
netctl start wpl1s0-myconnection
{% endhighlight %}

### Partition the hard drive

Check your current partitions with
{% highlight bash %}
fdisk -l
{% endhighlight %}

![]({{ site.baseurl }}/public/arch_install/0040.png)

Each hard drive is assigned to a *block device* such as `/dev/sda`, `/dev/sdb`, `/dev/sdc` etc.

You can ignore `/dev/loop0` - it's used to mount the image that we just booted from (so its files can be accessed).

I'll be installing Arch on `/dev/sda`, an 8GB hard drive.

I like to use `cfdisk` to create the partitions

{% highlight bash %}
cfdisk
{% endhighlight %}

You can also use other tools such as `fdisk` or `parted`, [etc](https://wiki.archlinux.org/index.php/Partitioning#Partitioning_tools).

Select `dos` as the label type<br />
Choose [`gpt`](https://en.wikipedia.org/wiki/GUID_Partition_Table) for harddisks bigger than 2 TB and machines using UEFI (instead of BIOS) - otherwise, just choose [`dos`](https://en.wikipedia.org/wiki/Master_boot_record).

![]({{ site.baseurl }}/public/arch_install/0050.png)

I'm only going to create 1 partition for the root directory (`/`)<br />
It's optional to create a separate partition for swap space, but I don't because I hardly use swap (my PC's have lots of ram - 12GB+) and thus don't mind having sub-optimal swap file performance (you can still create a swap file on your root parition, its just slightly less efficient than allocating a partition to it)<br />
There are many more complicated partitioning schemes for varying purposes which you can explore on the Arch Wiki [partitioning page](https://wiki.archlinux.org/index.php/partitioning)

At this point, you may have to delete/modify some of your old partitions first, remember to be careful when doing this.

Select `New`

![]({{ site.baseurl }}/public/arch_install/0060.png)

Enter the partition size. I assign the entire free space for this partition.

![]({{ site.baseurl }}/public/arch_install/0070.png)

Make the partition `primary` - you can only boot an operating system from a primary partition

![]({{ site.baseurl }}/public/arch_install/0080.png)

Select `bootable` to make this partition a bootable partition.

![]({{ site.baseurl }}/public/arch_install/0090.png)

Select `write` to write the partition changes

![]({{ site.baseurl }}/public/arch_install/0100.png)

Type `Yes`

![]({{ site.baseurl }}/public/arch_install/0110.png)

Select `Quit` to exit the partition manager

![]({{ site.baseurl }}/public/arch_install/0120.png)

Verify the partitions using `fdisk -l`

![]({{ site.baseurl }}/public/arch_install/0130.png)

Note that hard drive partitions are represented by an additional number on the block device, i.e. the 1st partition on the drive is `/dev/sda1`, 2nd partition is `/dev/sda2` etc.

Format (create filesystem on) the primary partition using
{% highlight bash %}
mkfs.ext4 /dev/sda1
{% endhighlight %}

![]({{ site.baseurl }}/public/arch_install/0140.png)

## Install Arch Linux base system

Mount the primary partition that we just created to `/mnt`
{% highlight bash %}
mount /dev/sda1 /mnt
{% endhighlight %}

![]({{ site.baseurl }}/public/arch_install/0150.png)

Select the mirrors that the Arch base packages will be downloaded from. This step isn't mandatory but highly recommended.

Using nano, find all the mirrors from your country and move them to the top of the list

{% highlight bash %}
nano /etc/pacman.d/mirrorlist
{% endhighlight %}

![]({{ site.baseurl }}/public/arch_install/0155.png)

Note that nano displays some handy commands at the bottom such as "Where Is" and "Cut Text". The `^` symbol refers to the Ctrl key.

Now install the Arch Linux base packages
{% highlight bash %}
pacstrap /mnt base base-devel
{% endhighlight %}
This will automatically download and install all the required packages

![]({{ site.baseurl }}/public/arch_install/0160.png)

## Configure system

### Generate fstab

Create an fstab file
{% highlight bash %}
genfstab /mnt >> /mnt/etc/fstab
{% endhighlight %}

Short for 'file system table' it describes how your partitions should be automatically mounted in the filesystem. In our case its just mounting the partition `/dev/sda1` to the root, `/`, dir.

Manually verify the fstab entries
{% highlight bash %}
cat /mnt/etc/fstab
{% endhighlight %}

![]({{ site.baseurl }}/public/arch_install/0170.png)

If you notice something wrong with it (such as duplicate entries from running `genfstab` twice), then just edit the fstab file and correct it.

### Chroot

Switch to the newly installed system (starts a new interactive shell with `/mnt` as the root dir)

{% highlight bash %}
arch-chroot /mnt /bin/bash
{% endhighlight %}

![]({{ site.baseurl }}/public/arch_install/0180.png)

### Set the time zone

First list the available timezones
{% highlight bash %}
ls /usr/share/zoneinfo/
{% endhighlight %}

My time region is `Africa/Johannesburg`

![]({{ site.baseurl }}/public/arch_install/0190.png)

Now set the timezone
{% highlight bash %}
ln -s /usr/share/zoneinfo/Africa/Johannesburg /etc/localtime
{% endhighlight %}

Generate `/etc/adjtime`
{% highlight bash %}
hwclock --systohc
{% endhighlight %}

![]({{ site.baseurl }}/public/arch_install/0200.png)

### Configure locale (system language)

Edit `/etc/locale.gen` and uncomment `en_US.UTF-8 UTF-8`

{% highlight bash %}
nano /etc/locale.gen
{% endhighlight %}

![]({{ site.baseurl }}/public/arch_install/0210.png)

Generate locales
{% highlight bash %}
locale-gen
{% endhighlight %}

![]({{ site.baseurl }}/public/arch_install/0220.png)

Create `/etc/locale.conf` and add `LANG=en_US.UTF-8`
{% highlight bash %}
nano /etc/locale.conf
{% endhighlight %}

![]({{ site.baseurl }}/public/arch_install/0230.png)

### Hostname

Set your hostname
{% highlight bash %}
nano /etc/hostname
{% endhighlight %}

![]({{ site.baseurl }}/public/arch_install/0240.png)

Set the same hostname in `/etc/hosts`
{% highlight bash %}
nano /etc/hosts
{% endhighlight %}

![]({{ site.baseurl }}/public/arch_install/0250.png)

### Network

Make network connections persistent (runs on startup)

{% highlight bash %}
systemctl enable dhcpcd
{% endhighlight %}

![]({{ site.baseurl }}/public/arch_install/0260.png)

If you're using wifi install the following packages so you can connect to the wifi after rebooting.

{% highlight bash %}
pacman -S iw wpa_supplicant dialog
{% endhighlight %}

![]({{ site.baseurl }}/public/arch_install/0265.png)

### Root password

Set the root password
{% highlight bash %}
passwd
{% endhighlight %}

![]({{ site.baseurl }}/public/arch_install/0270.png)

### Install the boot loader (GRUB)

Install GRUB. If you have more than 1 OS on your machine, `os-prober` will take care of that and automatically add the other OS's to your grub menu.

{% highlight bash %}
pacman -S grub os-prober
grub-install /dev/sda
{% endhighlight %}

![]({{ site.baseurl }}/public/arch_install/0280.png)
![]({{ site.baseurl }}/public/arch_install/0290.png)

Generate a GRUB configuration file

{% highlight bash %}
grub-mkconfig -o /boot/grub/grub.cfg
{% endhighlight %}

![]({{ site.baseurl }}/public/arch_install/0300.png)

### Reboot

Finally, exit from the chroot, unmount the partitions and reboot your Arch Linux. Make sure you have removed the installation media too.

{% highlight bash %}
exit
umount /mnt
reboot
{% endhighlight %}

![]({{ site.baseurl }}/public/arch_install/0310.png)

Select `Arch Linux` from the boot menu

![]({{ site.baseurl }}/public/arch_install/0320.png)

Log in to your newly installed Arch system as root user and password that you made during installation.

![]({{ site.baseurl }}/public/arch_install/0330.png)

## Post installation

### Wifi connection

If you're using wifi, you'll need to establish a connection again using the same method as earlier (`wifi-menu`, `netctl` etc.).

### Package management

Enable multilib repository. This is necessary to run 32-bit applications on our 64-bit installation of Arch Linux.

{% highlight bash %}
nano /etc/pacman.conf
{% endhighlight %}

Uncomment:
{% highlight bash %}
[multilib]
Include = /etc/pacman.d/mirrorlist
{% endhighlight %}

![]({{ site.baseurl }}/public/arch_install/0350.png)

Then update the package list and upgrade with `pacman -Syu`

![]({{ site.baseurl }}/public/arch_install/0355.png)

### Users and groups

Create a new normal user
{% highlight bash %}
useradd -m -g users -G wheel,storage,power -s /bin/bash michael
{% endhighlight %}

And set the password for the account
{% highlight bash %}
passwd michael
{% endhighlight %}

![]({{ site.baseurl }}/public/arch_install/0370.png)

Check that you have sudo installed so our normal user can perform administrative tasks (it should have already been installed from the [`base-devel`](https://www.archlinux.org/groups/x86_64/base-devel/) package group which we installed earlier)
{% highlight bash %}
pacman -S sudo
{% endhighlight %}

![]({{ site.baseurl }}/public/arch_install/0390.png)

Add the new user `michael` to the sudoers group
{% highlight bash %}
EDITOR=nano visudo
{% endhighlight %}

Uncomment
{% highlight bash %}
%wheel ALL=(ALL) ALL
{% endhighlight %}

![]({{ site.baseurl }}/public/arch_install/0400.png)

Now all users in `wheel` group can use sudo (thats why we added `michael` to `wheel` earlier)

### Install desktop environment (kde)

Install Xorg first (this is a *display server* required for kde, and pretty much any GUI application)
{% highlight bash %}
pacman -S xorg xorg-xinit
{% endhighlight %}

![]({{ site.baseurl }}/public/arch_install/0420.png)

The package group [`xorg`](https://www.archlinux.org/groups/x86_64/xorg/) installs a bunch of video drivers so you don't have to worry about manually finding yours.

Install kde plasma 5
{% highlight bash %}
pacman -S plasma
{% endhighlight %}

![]({{ site.baseurl }}/public/arch_install/0450.png)

Start SDDM on startup. SDDM is a display manager installed from the `plasma` package group. It is a login GUI displayed at the end of the boot process.
{% highlight bash %}
systemctl enable sddm
{% endhighlight %}

![]({{ site.baseurl }}/public/arch_install/0460.png)

Edit the SDDM theme to look like plasma

SDDM doesn't look great in KDE. However you can easily fix that by changing the theme

{% highlight bash %}
nano /etc/sddm.conf
{% endhighlight %}

Set the following parameters

{% highlight bash %}
[Theme]
Current=breeze
CursorTheme=breeze_cursors
{% endhighlight %}

![]({{ site.baseurl }}/public/arch_install/0470.png)

Install kde base applications - konsole, dolphin [etc.](https://www.archlinux.org/packages/extra/any/kde-meta-kdebase/)
{% highlight bash %}
pacman -S kde-meta-kdebase
{% endhighlight %}

![]({{ site.baseurl }}/public/arch_install/0475.png)

Finally, reboot and use your password to login

{% highlight bash %}
reboot
{% endhighlight %}

![]({{ site.baseurl }}/public/arch_install/0480.png)
![]({{ site.baseurl }}/public/arch_install/0490.png)

If everything looks good, make SDDM auto-login (I like to do this, but you don't have to)

Open konsole (alt+space, type konsole, press enter)
{% highlight bash %}
sudo nano /etc/sddm.conf
{% endhighlight %}

Note: `sudo` is required now because we're logged in as `michael`, not `root`

Set:
{% highlight bash %}
[Autologin]
User=michael
Session=plasma.desktop
{% endhighlight %}

![]({{ site.baseurl }}/public/arch_install/0500.png)

Reboot and now the SDDM greeter should be skipped.

### Other

#### Install sound drivers

ALSA is already included with the linux kernel and is recommended because usually it works out of the box (it just needs to be unmuted).

Unmute audio and test if sound works

![]({{ site.baseurl }}/public/arch_install/0510.png)

OSS is a viable alternative in case ALSA does not work.

#### Add an AUR helper

The Arch User Repository is a community-driven repository of packages. Some packages include `spotify`, `skype` and `dropbox`. The easiest way to install packages from the AUR is by using an AUR helper and the one I like to use is called `packer`. [Other AUR helpers](https://wiki.archlinux.org/index.php/AUR_helpers) do exist.

To install `packer`, you have to download and build it manually. I've made a [shell script](https://gist.githubusercontent.com/seymour7/d1f4651a8089c5ec6f0c5a896a78ee34/raw/packer_install.sh) that does this automatically which you can run using:

{% highlight bash %}
curl -s https://gist.githubusercontent.com/seymour7/d1f4651a8089c5ec6f0c5a896a78ee34/raw/packer_install.sh | bash
{% endhighlight %}

![]({{ site.baseurl }}/public/arch_install/0520.png)

Use `packer` in the same way as `pacman` (`packer -S <package>`). Don't use `sudo` in front of `packer`, if it needs administrative permissions it will ask you to enter the root password.

![]({{ site.baseurl }}/public/arch_install/0530.png)

#### Shorten grub timeout

I like to reduce the GRUB timeout from 5 seconds down to 2 seconds.

{% highlight bash %}
sudo nano /etc/default/grub
{% endhighlight %}

Set

{% highlight bash %}
GRUB_TIMEOUT=2
{% endhighlight %}

![]({{ site.baseurl }}/public/arch_install/0540.png)

Then run

{% highlight bash %}
sudo grub-mkconfig -o /boot/grub/grub.cfg
{% endhighlight %}

![]({{ site.baseurl }}/public/arch_install/0550.png)

#### Get config files from github

I store a few of my config files on github, such as my bash config (`~/.bashrc`). To retrieve them, I simply cd to my home directory and clone the repo. There are many benefits to storing your config on github, but it's really up to you.

#### Other

There are many post-installation configurations that one could do - see [this page](https://wiki.archlinux.org/index.php/General_recommendations) on the Arch wiki for other ideas.

## Random Tips

Every week or two you'll want to run `sudo pacman -Syu` and `packer -Syu` to keep your packages up to date.

To remove a package I usually use `pacman -Rs package_name`. The `Rs` means: remove the package and its dependencies which are not required by any other installed package.
