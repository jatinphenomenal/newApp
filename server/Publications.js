/**
 * Created by administrator on 4/12/15.
 */

Meteor.publish('allTemplates',function(){
   return Templates.find({});
});

Meteor.publish('allDetails',function(){
    return Student.find({});
});

Meteor.publish('filterData',function(id){
    return[ Student.find({_id:id}),
            Company.find({})
        ]
});