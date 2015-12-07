/**
 * Created by administrator on 7/12/15.
 */
imagePath = new ReactiveVar();

Template.fileUpload.helpers({
    productPhotoCallback: function (e) {
        return {
            finished: function (index, fileInfo, context) {
                imagePath.set(fileInfo.url);
                return false;
            }
        }
    },
    imageSrc: function () {
        return imagePath.get();
    }
});