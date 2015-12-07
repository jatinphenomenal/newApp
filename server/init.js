/*
* Create by -- Soniya Agrawal
* Initialize multiple image uploader plugin with specific path.......
* */

Meteor.startup(function () {

    var TMP_UPLOAD_DIR = process.env.PWD + '/uploads/tempPhotos';
    var UPLOAD_DIR = process.env.PWD + '/uploads';

    if (process.env.UPLOAD_DIR) {
        UPLOAD_DIR = process.env.UPLOAD_DIR;
    }

    if (process.env.TMP_UPLOAD_DIR) {
        TMP_UPLOAD_DIR = process.env.TMP_UPLOAD_DIR;
    }

    UploadServer.init({
        tmpDir: TMP_UPLOAD_DIR,
        uploadDir: UPLOAD_DIR,
        checkCreateDirectories: true,
        //disableImageResize: false,
        acceptFileTypes: /.*\.(jpg|JPG|jpeg|JPEG|gif|GIF|png|PNG|doc|DOC|pdf|PDF|ods|ODS|xls|XLS|fods|FODS|ots|OTS)/ ,
        //imageTypes: '.(gif|jpg|png|pdf)',
        //imageVersions: {normal: {width: 734, height: 455}, productView: {width: 288, height: 180}, preview : {width: 118, height:100}, carouselThumb : {width: 64, height:48}},

        getDirectory: function(fileInfo, formData) {
            //console.log(fileInfo);
            if (formData && formData.directoryName != null) {
                return formData.directoryName;
            }
            return "";
        },
        getFileName: function(fileInfo, formData) {
            if (formData && formData.prefix != null) {
                return formData.prefix + '_' + fileInfo.name.replace(/[ &\/\\#,+()$~%'":*?<>{}]/g, '');
            }
            return fileInfo.name;
        },
        finished: function(fileInfo, formData) {
            //console.log(fileInfo);
           /* if (formData && formData._id != null) {
                Items.update({_id: formData._id}, { $push: { uploads: fileInfo }});
            }*/
        },

        processImage: function (fs, imageMagick, currentFolder, fileInfo, options, formData, counter, finish) {

            var ensureExists = function(fs, folder, cb) {
                fs.mkdir(folder, 0744, function(err) {
                    if (err) {
                        if (err.code == 'EEXIST') cb(null); // ignore the error if the folder already exists
                        else cb(err); // something else went wrong
                    } else cb(null); // successfully created folder
                });

            };

            var generateSubdir = function (fs, imageMagick, currentFolder, fileInfo, options, formData, counter, finish) {
                Object.keys(options.imageVersions).forEach(function (version) {
                    counter += 1;
                    var opts = options.imageVersions[version];
                    var fromFile = currentFolder + '/' + fileInfo.name;
                    var versionFolder = currentFolder+"/"+version;
                    var toFile = versionFolder +"/"+fileInfo.name;

                    ensureExists(fs, versionFolder, function(err) {
                        if (err)
                         console.log(err);

                        gm(fromFile)
                            .autoOrient()
                            .background('#ffffffff')
                            .resize(opts.width, opts.height+">")
                            .gravity('Center')
                            .extent(opts.width, opts.height)
                            .write(toFile, function(error) {
                                if (error) {
                                    console.log(error);
                                }

                                fs.chmod(toFile, 0744, function(err){});
                                finish();
                            });
                    });

                });
            };

            var applyWatermark = function (fs, imageMagick, currentFolder, fileInfo, options, formData, counter, finish) {
                var fromFile = currentFolder + '/' + fileInfo.name;
                var destFile = currentFolder + '/watermark.' + fileInfo.name;

                var watermarkImage = process.env.PWD + '/public/images/watermark.png';
                if (process.env.NODE_ENV === "production") {
                    watermarkImage = process.env.PWD + '/app/programs/web.browser/app/images/watermark.png';
                }

                gm(fromFile)
                    .composite(watermarkImage)
                    .geometry('+5+5')
                    .gravity('SouthWest')
                    .write(destFile, function (error) {
                        if (!error) {
                            fs.renameSync(destFile, fromFile);
                        }
                        generateSubdir(fs, imageMagick, currentFolder, fileInfo, options, formData, counter, finish);
                    });
            };

            if (options.imageTypes.test(fileInfo.name)) {
                applyWatermark(fs, imageMagick, currentFolder, fileInfo, options, formData, counter, finish);
            }

            return counter + Object.keys(options.imageVersions).length;
        }
    });
});