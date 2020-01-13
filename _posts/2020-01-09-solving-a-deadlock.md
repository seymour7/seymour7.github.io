---
layout: post
title: Solving a MySQL Deadlock
description: Solving a deadlock in a simple, elegant way.
---

A deadlock occurs when you have 2 processes that are both waiting on each other to release a lock on a resource.

Imagine we have 2 threads in a Java application:
* Thread 1 acquires a lock on resource A
* Thread 2 acquires a lock on resource B
* In order to continue execution (and release the lock on resource A), Thread 1 waits until resource B is free
* In order to continue execution (and release the lock on resource B), Thread 2 waits until resource A is free

Neither thread will ever finish execution, and our app has reached a deadlock.

You can actually try this for yourself on a MySQL table:
```
mysql> CREATE TABLE a (id int primary key, value int);
Query OK, 0 rows affected (0.01 sec)

mysql> INSERT INTO a VALUES (1, 0), (2, 0), (3, 0), (4, 0);
Query OK, 4 rows affected (0.01 sec)
Records: 4  Duplicates: 0  Warnings: 0

mysql console 1:
step 1> START TRANSACTION;
step 3> UPDATE a SET value = 1 WHERE id = 2;
step 5> UPDATE a SET value = 1 WHERE id = 1;

mysql console 2:
step 2> START TRANSACTION;
step 4> UPDATE a SET value = 1 WHERE id = 1;
step 6> UPDATE a SET value = 1 WHERE id = 2;

ERROR 1213 (40001): Deadlock found when trying to get lock; try restarting transaction
```

Recently I was working on a multi-threaded application that had this problem. It was a Java application with 16 threads. Each thread would update a batch of 10 rows in a MySQL table every 1ms. When updating a row in MySQL, an exclusive lock is set on that particular row - blocking any other transaction from updating it. It didn't happen often, but on occasion 2 threads would be waiting on each other to release a row lock, causing a deadlock.

I considered a few different solutions:
* Restarting the transaction if a deadlock occured.<br>Problem: I'd be updating my rows with stale data
* Restarting the entire process if a deadlock occured.<br>Problem: This could potentially make the app a lot slower.
* Make each thread ‘claim' a row before trying to update it. If it's already claimed, find another row to update.<br>Problem: This adds a lot of complexity to the app and slows down performance as well

Before continuing, I took a break and thought more about the cause of a deadlock. All threads were performing 10 updates each on the same MySQL table. The only way a deadlock could occur is if the order and timing matched a very particular pattern. I couldn't control the timing, but I could control the order of updates.

In fact, if I ordered all updates in the same way (e.g. by ascending order of the row id), this would eliminate the possibility of a deadlock.

But why are updates occuring in a random order anyway? It turns out the application fetches 100 rows from the database and picks 10 to update. However, in order to prevent the 16 threads from always updating the same 10 rows, it would shuffle the list of 100 rows first. This means that the 10 updates would always occur in some random order.

I modified the application so that before updating the 10 rows, it would order the updates in ascending order of the row id. I deployed the app and that was the end of the deadlocks.

Deadlocks can occur in many different ways, but in this case, the lesson learned is:

> If you're locking resources in a multi-threaded application, make sure all threads are locking in the same order (order based on an attribute of the resource).

In simpler terms:

> If you're updating rows in a multi-threaded application, make sure all threads are updating the rows in order of the row id (ascending or descending).
