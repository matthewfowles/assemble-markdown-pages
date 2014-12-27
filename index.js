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

     var settings = {
         src: params.assemble.options.markdownPages.src,
         dest: params.assemble.options.markdownPages.dest,
         subFolder: params.assemble.options.markdownPages.subFolder || false,
         gfm: params.assemble.options.markdownPages.gfm || true,
         tables: params.assemble.options.markdownPages.tables || true,
         breaks: params.assemble.options.markdownPages.breaks || false,
         pedantic: params.assemble.options.markdownPages.pedantic || false,
         sanitize: params.assemble.options.markdownPages.sanitize || true,
         smartLists: params.assemble.options.markdownPages.smartLists || true,
         smartypants: params.assemble.options.markdownPages.smartypants || false

     }

     marked.setOptions({
         renderer: new marked.Renderer(),
         gfm: settings.gfm,
         tables: settings.tables,
         breaks: settings.breaks,
         pedantic: settings.pedantic,
         sanitize: settings.sanitize,
         smartLists: settings.smartLists,
         smartypants: settings.smartypants
     });

     if (!settings.src || !settings.dest) {
         return console.error(chalk.red('have not entered required parameters'));
     }


     var files = glob.sync(settings.src, [options]);


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