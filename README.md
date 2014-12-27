assemble-markdown-pages
=======================

Assemble plugin for building pages from markdown files. Pages can contain YAML front matter. This solves the problem of having to place markdown inside Handlebars templates and rebuild. You can now convert markdown straight to HTML. Also allows you to place YAML front matter at the top of your Markdown.


## install 

`npm install --save assemble-markdown-pages`


## usage

This plugin is designed to work with Assemble and extend it's funtionality. you will need to call the npm module in the Grunt setup in your gruntfile. 

Example 

``` javascript

assemble: {
  options: {
    assets: 'assets',
    plugins: ['assemble-markdown-pages'],
    partials: ['includes/**/*.hbs'],
    layout: ['layouts/default.hbs'],
    data: ['data/*.{json,yml}']
  },
  site: {
    src: ['docs/*.hbs'],
    dest: './'
  }
},

```    

In the plugins section you have called the npm module.


## Options

There are some required options you need to pass. Also some optional ones that allow you to change the default styling.

Options Example:  

``` javascript

assemble: {
  options: {
    assets: 'assets',
    plugins: ['assemble-markdown-pages'],
    partials: ['includes/**/*.hbs'],
    layout: ['layouts/default.hbs'],
    data: ['data/*.{json,yml}'],
    markdownPages: {
        src: 'src/posts/**/*.md', // required  (string) || (Array)
        dest: 'articles/', // required
        subFolder: false,  // default
        gfm: true, // default
        tables: true, // default
        breaks: false, // default
        pedantic: false, // default
        sanitize: true, // default
        smartLists: true, // default
        smartypants: false // default
    }
  },
  site: {
    src: ['docs/*.hbs'],
    dest: './'
  }
},

``` 

### src

A Glob pattern to the source of your markdown pages.


### Dest

The destination you wish your converted markdown files to end up at.


### subFolder

If set to false all your HTML files will be generated with the name of the markdown file with the `.html` extention. However if you wish to not have `.html` on the end of your URL's then set `subFolder` to true. When set to true this will create a folder with the markdown file name in your destination and the file will become `index.html` giving you clean url's

### markdown 

The plugin using the Marked Module to convert the Markdown into HTML. The rest of the options are markdown options. You can find out what each of the the options does [https://github.com/chjj/marked](here). 

There is currently no support for the Renderer option. This is as default. Please create a feature request if you wish to see this in future version's


## New Features

To request new feature's please create an issue tagged feature. Also fell free to contribute with pull requests.Currently all files are flattened. There will be an option in future to expand directories.




