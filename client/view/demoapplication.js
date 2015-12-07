
selectedTemplate = new ReactiveVar();
newTemplateName = new ReactiveVar();

/*---------------Created--------------------------*/

Template.home.created = function(){
    Meteor.subscribe('allTemplates');
}


/*---------------Helpers--------------------------*/

Template.mainTemplate.helpers({
    myTemplate:function(){
        return selectedTemplate.get();
    }
});

Template.home.helpers({
    templates:function(){
        return Templates.find({});
    }
});

Template.addTemplate.helpers({
    newTemplate:function(){
        return newTemplateName.get();
    }
});

Template.allData.helpers({
    allData:function(){
        return Student.find({});
    }
});

Template.details.helpers({
    name:function() {
        return Student.findOne({'_id':this.template.toString()}).name;
    },
    cName:function() {
        var data=Student.findOne({'_id':this.template.toString()});
        return Company.findOne({'_id':data.companyId}).name;
    }
});

/*---------------Events--------------------------*/

Template.home.events({
    'change #drpTemplate':function(){
       selectedTemplate.set($("#drpTemplate option:selected").val())
    }
});

Template.addTemplate.events({
    'keyup #txtTemplate':function(){
        newTemplateName.set($('#txtTemplate').val());
    },
    'click #btnAddTemplate':function(){
        alert('Added');
    }
});