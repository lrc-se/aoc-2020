Advent of Code 2020
===================

This year's puzzles will be solved using Vue 3 and TypeScript, exploring the possibilities and limitations of both.

Running
-------

```bash
$ yarn install    # install dependencies
$ yarn serve      # start development server
$ yarn lint       # lint and auto-fix files
$ yarn lint-nofix # lint and don't auto-fix files
$ yarn build      # build for production
```

When building for production, the base path can be changed by defining the `VUE_BASE_PATH` environment variable.
Also remember to [configure server routing](https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations).

Puzzles
-------

### Day 1

Solved with simple, performant `for` loops.

### Day 2

Using regex matching, destructuring and functional techniques.

### Day 3

Utilizing modulo arithmetic and the convenient fact that strings can be indexed into directly.

### Day 4

This time the focus ended up being on enums and indexable types (and some regexes).

### Day 5

Taking advantage of built-in binary literal conversion. Since `String.prototype.replaceAll()` support is still sketchy I rolled my own substitution function.

### Day 6

Sets to the rescue!

### Day 7

Regexes and recursion in perfect(?) harmony.

### Day 8

Using the prototype system directly, with error handling.

### Day 9

Back to `for` loops. Yay!

### Day 10

Using recursion with a dynamically populated cache for the second part, which increases its performance by many orders of magnitude (viz. makes it workable at all).
Also, as it turns out, taking advantage of `number`-to-`string` coercion for plain object keys was easier than using `Map`s due to the rigidity and limited control flow analysis capabilities of the TypeScript compiler.

### Day 11

Made a proper visualization of the solutions this time, based on CSS classes and background images.
Performance varies quite a bit between browsers (the test cases are deliberately slowed down for clarity).
