---
layout: post
title: MySQL Schema Change Without Downtime
description: Alter large MySQL tables without blocking reads or writes.
---

When altering large MySQL tables (> 200MB) it can block reads or writes for a long time. In this post, I'll explain how to alter a large table without any downtime.

First, let's look at how MySQL does an `ALTER TABLE`:
1. Lock the table
2. Make a copy of the table
3. Modify the copy (the "new table")
4. Copy all the rows into the new table
5. Swap the old and new tables
6. Unlock the table

How can we avoid the blocking (steps 1 & 6)? Here are some options:
* Do it at 2am on Sunday morning
  * Problem: Not fun for developers, lowers developer productivity.
* Do a planned failover (aka. "rolling schema upgrade")
  * Start with slaves and, once the schema change is applied to the slave, promote one of the slaves to the new master, demote the old master to a slave and execute the schema change on it.
  * Problem: Can break replication for some schema changes, requires high availability infrastructure.
* Make MySQL use row versioning
  * Tell MySQL this table has a new version of the schema. Then, you can still read from old row versions but when writing a new row, it writes in the new row format.
  * Problem: MySQL still doesn't support row versioning.
* Handle the `ALTER` process yourself
  * Manually perform the same steps the server takes (without locking).
  * Problems: discussed below

The last option is my preferred so I'll go ahead and explain that. You perform the `ALTER` steps manually, with the following changes:

1. ~~Lock the table~~
2. Make a copy of the table
3. Modify the copy (the "new table")
4. Copy all the rows into the new table
   1. Add triggers to keep track of changes
5. Swap the old and new tables
6. ~~Unlock the table~~

As we're not locking the table, your application can continue to read/write to the original table. It will take some time to copy rows to the new table, so we add triggers to the old table that update or insert corresponding rows in the new table.

Some notes on the above process:
* Remember to make backups before trying this
* Do multiple, smaller chunks of `INSERT..SELECT` when copying data to the new table
  * Helps to avoid deadlocks
  * Try make the chunks small enough so each one takes about 0.5s
  * Start at the low-end of the primary key
* The triggers should only copy columns that are common between the 2 tables.
* To swap the old and new tables, we can atomically rename the old table to something else and the new table to the old table.
  * Don't forget to alter the foreign keys to point to the new table

Problems with above process:
* It's a lot slower than just letting MySQL handle the `ALTER`
* The table you're altering can't have triggers already defined

I hope this post has helped if you find yourself altering some large tables. If you have any questions or corrections, you can message me [@mikeseym](https://twitter.com/mikeseym) on twitter.
