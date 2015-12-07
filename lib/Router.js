/**
 * Created by administrator on 4/12/15.
 */

Router.route("/", {
    name:'home'
});

Router.route("/addTemplate", {
    name:'addTemplate'
});

Router.route("/contactus", {
    name: "contactus"
});

Router.route("/fileUpload", {
    name: "fileUpload"
});

Router.route("/allData", {
    name: "allData",
    waitOn:function(){
        Meteor.subscribe('allDetails');
    }
});

Router.route("/details/:_id?", {
    name: "details",
    data: function() {
        return {template:this.params._id};
    },
    waitOn:function(){
        return [Meteor.subscribe("filterData", this.params._id)];
    }
});


