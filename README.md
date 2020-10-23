# FileUploader

**js-file-uploader: HTML5 + Javascript asyncronous file upload.**  
*v. 2 - Massimo Cassandro - (c) 2017/2020*

[demo](https://massimo-cassandro.github.io/js-file-uploader/demo/)
|
[wiki](https://massimo-cassandro.github.io/js-file-uploader/wiki)

[GitHub](https://github.com/massimo-cassandro/js-file-uploader)
|
[npm](https://www.npmjs.com/package/@massimo-cassandro/js-file-uploader)

Fileuploader automates and simplifies uploading files to HTML pages.

Uploads are performed asynchronously via an Ajax call to a server-side script that must register the file and return a JSON string.

Although the default settings are based on Bootstrap 4, FileUploader is entirely and easily configurable from scratch and can be adapted to any layout.

The [demo](https://massimo-cassandro.github.io/js-file-uploader/demo/) folder contains many examples of FileUploader using.

Take a look at [wiki pages](https://massimo-cassandro.github.io/js-file-uploader/wiki) for detailed usage and configuration instructions.

Works with all modern browser (tested thanks to [Browserstack Open Source program](https://www.browserstack.com/open-source)).

## Installation

FileUploader can be installed using npm:

```
npm i --save @massimo-cassandro/js-file-uploader
```

More info on [wiki](https://massimo-cassandro.github.io/js-file-uploader/wiki) pages.


## Changelog

### V. 2.0 (Oct 2020)
* All rewritten as ES6 module
* Dropped check and callback for legacy browsers
* New demo pages
* Wiki pages (in progress)

### Version 1.4-1.7 (Jul-Sep 2020) 
* SVG images support
* Mixed SVG + Bitmap images allowed
* ability to add an extra custom help text
* aspect ratio constrain (see specific demo page)
* Bootstrap moved to dev-dependencies in package json

### Version 1.3 (Aug 2019)
* Fancybox integration
* items sorting
* Handling of disabled and required status
* Extra fields

### Version 1.0-1.2 (2017)
* First production releases with basic features
