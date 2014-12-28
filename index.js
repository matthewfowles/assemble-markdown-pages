 var fs = require('fs');
 var glob = require("glob");
 var yfm = require('yfm');
 var path = require('path');
 var marked = require('marked');
 var chalk = require('chalk');



 var options = {
     stage: 'render:pre:pages'
 };


 var markdownPages = function(params, next) {

    if(!params.assemble.options.markdownPages) {
        console.error(chalk.red('You have not entered required parameters for assemble markdown pages'));
        next();
        return;
    }

     var settings = {
         src: params.assemble.options.markdownPages.src,
         dest: params.assemble.options.markdownPages.dest,
         subFolder: params.assemble.options.markdownPages.subFolder || false,
         gfm: function() {
             if (typeof params.assemble.options.markdownPages.gfm !== 'undefined') {
                 return params.assemble.options.markdownPages.gfm;
             } else {
                 return true;
             }
         },
         tables: function() {
             if (typeof params.assemble.options.markdownPages.tables !== 'undefined') {
                 return params.assemble.options.markdownPages.tables;
             } else {
                 return true;
             }
         },
         breaks: function() {
             if (typeof params.assemble.options.markdownPages.breaks !== 'undefined') {
                 return params.assemble.options.markdownPages.breaks;
             } else {
                 return false;
             }
         },
         pedantic: function() {
             if (typeof params.assemble.options.markdownPages.pedantic !== 'undefined') {
                 return params.assemble.options.markdownPages.pedantic;
             } else {
                 return false;
             }
         },
         sanitize: function() {
             if (typeof params.assemble.options.markdownPages.sanitize !== 'undefined') {
                 return params.assemble.options.markdownPages.sanitize;
             } else {
                 return true;
             }
         },
         smartLists: function() {
             if (typeof params.assemble.options.markdownPages.smartLists !== 'undefined') {
                 return params.assemble.options.markdownPages.smartLists;
             } else {
                 return true;
             }
         },
         smartypants: function() {
             if (typeof params.assemble.options.markdownPages.smartypants !== 'undefined') {
                 return params.assemble.options.markdownPages.smartypants;
             } else {
                 return false;
             }
         }

     }


     marked.setOptions({
         renderer: new marked.Renderer(),
         gfm: settings.gfm(),
         tables: settings.tables(),
         breaks: settings.breaks(),
         pedantic: settings.pedantic(),
         sanitize: settings.sanitize(),
         smartLists: settings.smartLists(),
         smartypants: settings.smartypants()
     });


     if (!settings.src || !settings.dest) {
         console.error(chalk.red('You have not entered required parameters for assemble markdown pages'));
         next();
         return;
     }

     var files = [];

     function isArray(object) {
         return object.constructor === Array;
     }

     if (isArray(settings.src)) {
         for (var i = settings.src.length - 1; i >= 0; i--) {
             files.push.apply(files, glob.sync(settings.src[i], [options]));
         };
     } else {
         files = glob.sync(settings.src, [options]);
     }


     if (files.length === 0) {
         console.info(chalk.cyan('no markdown files to process'))
         return;
     }


     var count = 0;

     for (var i = files.length - 1; i >= 0; i--) {
         var data = fs.readFileSync(files[i], {
             encoding: 'utf8'
         });

         var content = yfm(data);

         content.content = marked(content.content);


         // Work out filenames and paths

         var filename = function() {
             var extname = path.extname(files[i]);
             var basename = path.basename(files[i], extname);
             var url = basename.replace(/\s+/g, '-').toLowerCase();
             var destination;
             var filename;

             if (settings.subFolder) {
                 destination = path.join(settings.dest, url, 'index.html');
                 filename = 'index.html';
             } else {
                 destination = path.join(settings.dest, url + '.html');
                 filename = url + '.html';
             }

             return {
                 extname: extname,
                 basename: basename,
                 url: url,
                 destination: destination,
                 filename: filename
             }

         }();


         var page = {
             dirname: settings.dest,
             filename: filename.filename,
             pageName: filename.filename,
             pagename: filename.filename,
             basename: path.basename(filename.filename, '.html'),
             src: files[i],
             dest: filename.destination,
             assets: '',
             ext: filename.extname,
             extname: filename.extname,
             page: content.content,
             data: content.context
         }

         params.assemble.options.pages.push(page);


         count += 1;
         console.info('Converted ' + chalk.cyan(filename.url + filename.extname));


     };


     console.info(chalk.cyan(count + ' files converted!'));


     next();

 };

 markdownPages.options = options;
 module.exports = markdownPages;