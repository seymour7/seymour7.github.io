---
layout: post
title: The Ultimate Guide to Reverting Git Merges
description: Everything you need to know about reverting both pushed and unpushed git merges.
---

### How to Undo an Unpushed Merge

If you’ve done a merge and haven’t pushed it yet, undoing the merge is very simple.

Use the `git reset` command to return to the revision before the merge, thereby effectively undoing it.

```
$ git reset --hard <commit-hash-before-merge>
```

If you don't have the hash of the commit before the merge at hand, you can use `git log` to find it out or you can use the following variation of the reset command:

```
$ git reset --hard HEAD~1
```

This way, using `HEAD~1`, you're telling git to go back to the commit before the current `HEAD` revision, which should be the commit before the merge.

Note: In both cases, we need to use the `--hard` option. This means that any local uncommitted changes will be discarded - if you have valuable uncommitted changes, be sure to use git stash before.

After doing the above `git reset`, you’ll notice that any changes from the merge will be undone and you can continue working as normal.

### How to Undo a Pushed Merge

Undoing a pushed merge is a bit more complicated. Before getting to it, we need to learn a bit more about commits and git merges.

#### What is a commit parent?

Every commit has a parent commit. When you `git commit` normally, the current commit becomes the parent commit of the new commit that you’re creating.

To view the parent of a commit, use `git show --pretty=raw <commit-hash>`.

#### What is a merge commit?

When a branch named `feature` is merged with `master`, a new “merge commit” is created on the branch `master`. A merge commit is the same as a normal commit except that it has 2 parents. In this case, the 2 parents of the merge commit will be the previous head of `master` and the head of `feature`.

PIC

On running `git show`, the new commit displays both the parents:

```
$ git show

commit ae2058cf5cafe807af44114d15bac65fc4efd714 (HEAD -> master)
Merge: bf75d61d8f1 12d62bfa0e0
```

#### How does git revert work?

```
git revert <commit-hash>
```

The revert command in git takes in a commit hash and compares the changes with the parent. The delta or the diff is calculated and the negation of it is applied as a new commit.

What happens if we want to revert a merge commit? The merge commit has 2 parents and git won’t know automatically which parent was the mainline, and which parent was the branch you want to unmerge.

#### Reverting a merge commit

```
$ git revert -m 1 <merge-commit-hash>
```

Let's take a closer look at what this command will do:

* `git revert` will make sure that a new commit is created to revert the effects of that unwanted merge. 
* The `-m 1` option tells git that we want to keep the parent side of the merge (which is the branch we had merged into).
* Finally, make sure to specify the actual merge commit's hash.

The `-m` option specifies the parent number. This is because a merge commit has more than one parent, and git does not know automatically which parent was the mainline, and which parent was the branch you want to unmerge.

When you view a merge commit in the output of `git log`, you will see its parents listed on the line that begins with `Merge:`

```
commit ae2058cf5cafe807af44114d15bac65fc4efd714
Merge: bf75d61d8f1 12d62bfa0e0
Author: Michael Seymour <michael@example.com>
Date:   Sun May 08 13:52:29 2022 +0100

Merge branch 'my-branch'
```

In this situation, `git revert ae2058cf5ca -m 1` will get you the tree as it was in `bf75d61d8f1`, and `git revert -m 2` will reinstate the tree as it was in `12d62bfa0e0`.

PIC

To better understand the parent commits, you can run:<br>
`git log bf75d61d8f1` or `git log 12d62bfa0e0`

#### Why can’t we use git reset this time?

`git revert` will make sure that a new commit is created to revert the effects of that unwanted merge. This is in contrast to `git reset`, where we effectively "remove" a commit from the history. Hence, `git revert` is a better solution in cases where you've already pushed to remote as altering the history of the remote repo can cause problems for the other developers using the repo.

### References

* https://www.git-tower.com/learn/git/faq/undo-git-merge
* https://stackoverflow.com/q/7099833
* https://levelup.gitconnected.com/reverting-a-merge-commit-7de2e9114c7d
* https://git-school.github.io/visualizing-git/#free
