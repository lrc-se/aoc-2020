<template>
  <header>
    <h1>Advent of Code 2020</h1>
  </header>
  <main><router-view /></main>
</template>

<style>
* {
  box-sizing: border-box;
}

html {
  font-size: 16px;
}

body {
  margin: 0;
  padding: 2em;
  color: #fefeff;
  background-color: #000;
  font-family: sans-serif;
  font-size: 1em;
  line-height: 1.4;
  text-align: center;
  overflow-y: scroll;
}

.button {
  margin: .5em;
  padding: .5em 1em;
  border-radius: 4px;
  cursor: pointer;
}

.center {
  width: 1024px;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
}

.border {
  border: 1px solid #fff;
  border-radius: 4px;
}
</style>
