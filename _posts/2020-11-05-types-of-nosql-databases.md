---
layout: post
title: Types of NoSQL Databases
description: There are many non-relational databases, each with their own pros and cons, that developers should know when to use.
---

### Why do we need this blog post?

Most people have only had experience with relational databases but there are many other types of databases, each with their own pros and cons, that developers should know when to use.

### Why are relational databases most popular?

The theory behind non-relational databases has been around since the 1970's, but back then, storage was extremely expensive. Thus, database types that optimised for storage space, such as relational databases, are the ones that became popular. Relational databases store [normalised data](https://en.wikipedia.org/wiki/Database_normalization), meaning no redundant data is stored. Databases that weren't normalised were not financially viable at the time. In the 80-90s, people kept using relational databases and then in the 2000's, NoSQL databases started popping up because we were no longer constrained by storage, but rather, the main bottleneck now is compute. However, despite this rise in popularity, relational databases are still used the most today. This is most likely because people already have a lot of experience with them, it is often the type of database that developers first learn to use and also because many apps are already built with relational databases.

### Types of databases

* Relational
  * Characteristics
    * Stores data in one or more tables of columns and rows, with a unique key identifying each row.
    * Supports [referential integrity](https://en.wikipedia.org/wiki/Referential_integrity)
    * Supports [ACID transactions](https://en.wikipedia.org/wiki/ACID)
    * Strict schema enforcement ([schema-on-write](https://www.delltechnologies.com/en-us/blog/schema-read-vs-schema-write-started/))
    * Queried using SQL
  * Examples
    * MySQL, MariaDB, PostgreSQL, Oracle, MSSQL
  * Pros
    * Data integrity is enforced
    * Avoids data duplication
    * ACID-compliant
    * Well-documented, lots of tutorials and stackoverflow answers
  * Cons
    * Difficult to scale writes
    * Has row locking
    * Not designed to handle unstructured/semi-structured data
  * Use cases
    * An ecommerce platform where you have users linked to orders linked to items etc., and many other use cases
* Key-value
  * Characteristics
    * Allows storing arbitrary data via a specific key
    * Schemaless (values can be anything)
    * It is effectively a dictionary/hash table stored on disk
  * Examples
    * Amazon DynamoDB, RocksDB
  * Pros
    * Low latency reads & writes
    * Scales easily and cheaply
  * Cons
    * Can only query/search by key
    * No data integrity
  * Use cases
    * Config data, url shortener etc.
* In-memory key-value
  * Characteristics
    * Same as key-value, but data is stored in memory (RAM)
    * Can be configured to persist data, but not the primary focus
  * Examples
    * Redis, memcached, Amazon ElastiCache
  * Pros
    * Extremely low latency
  * Cons
    * Can be hard to scale
  * Use cases
    * Caching, leaderboards, real-time analytics, etc.
* Document (a.k.a. document-orientated)
  * Characteristics
    * Similar to key-value, but value is a document
    * MongoDB actually uses a key value store called WiredTiger as their default storage engine
    * Documents are typically JSON, BSON, XML
    * Schemaless
    * Documents are stored in collections (not tables)
    * Optimised more for speed and scalability rather than space
  * Examples
    * MongoDB, DocumentDB, Couchbase, DynamoDB, Firebase
  * Pros
    * Fast writes
    * Scalability
    * Schemaless allows changing data structure without downtime
  * Cons
    * Not ACID compliant
    * Relationships/cross references not enforced
    * Can't join documents/collections in a single query
    * Joins can be slow
    * Data is usually duplicated
  * Use cases
    * Storing user metadata, product inventory etc., and many other use cases
* Wide-column (a.k.a. column-orientated)
  * Characteristics
    * Somewhere in between a document store and a relational DB
    * Uses tables, columns, rows etc.
  * Examples
    * Cassandra, Keyspaces (AWS), HBase, Bigtable
  * Pros
    * Same pros as a document db
    * Can query/update individual columns
    * More efficient aggregation operations
  * Cons
    * Same cons as a document db
  * Use cases
    * Storing events, messages etc.
* Graph
  * Characteristics
    * Based on graph theory
    * Data represented as network of nodes, edges and properties
    * Data is stored in nodes (schemaless)
  * Examples
    * Neo4j, OrientDB, TitanDB, Neptune (AWS)
  * Pros
    * Optimised for querying data with complex relations
  * Cons
    * Difficult for developers to learn
    * Poor performance of aggregation operations
  * Use cases
    * Social networks, recommendation engines, gps navigation
* Search
  * Characteristics
    * Stores non-relational, document-based data
    * Built to be able to index large volumes of full text (e.g. logs)
    * Primary focus is on full text search and fuzzy matching
  * Examples
    * Elasticsearch, Splunk, Apache Solr
  * Pros
    * Optimised full text searching
    * Highly scalable
    * Schemaless
    * Other search options such as suggestions
  * Cons
    * Expensive
    * Low durability
    * No transaction support
    * Not efficient for writing/reading other than searching
    * Can be difficult to manage
  * Use cases
    * Search results on ecommerce website, searching logs, input form autosuggest
* Time series
  * Characteristics
    * Collect, store and process data sequenced by time
    * Heavily write oriented
    * Designed to handle constant streams of data
    * Typically append-only (on modification after ingestion)
    * Aggregation/down sampling features to lower archive data footprint
  * Examples
    * InfluxDB, Prometheus, graphite, Timestream (AWS)
  * Pros
    * Can handle high ingestion rates
    * Optimised for time-based aggregation queries (mean, std dev, max etc.)
  * Cons
    * Can only deal with time-series data
    * Reads are a lot slower than writes
    * Does not support transactions
    * Append-only
  * Use cases
    * IoT sensor collection, app metrics, log monitoring, alerting
* Ledger
  * Characteristics
    * An immutable database
    * If you try to update a value, it creates a new entry with a diff
  * Examples
    * Amazon Quantum Ledger Database
  * Pros
    * Complete, immutable, and verifiable history of all changes to application data
    * Also provides cryptographic mechanism to verify integrity of data
  * Cons
    * Can grow large in size
  * Use cases
    * Highly regulated industries e.g. banking, systems of record, supply chain, healthcare, registrations

### Bonus Section! (hosting options)

There are 3 database hosting options:

* On-premises
  * Database fully maintained by organization on servers running within their data centers
  * More control, but usually more expensive and time consuming
* Cloud hosted
  * Servers are maintained by cloud providers
  * Organizations maintain database software and operating system running on the machine
  * Flexible scaling and no server upkeep, but no control over physical server and potential network limitations
* Serverless (database-as-a-service)
  * Database maintained by service provider
  * Organizations only charged for usage of service (storage, bandwidth etc.)
  * Can be cost effective
  * Zero upkeep: database maintenance, patching, infrastructure support etc. is outsourced
