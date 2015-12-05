var expect = chai.expect;

if (!(typeof MochaWeb === 'undefined')){
    MochaWeb.testOnly(function(){
        describe("Item", function(){
            it("can be created", function(){
                Posts.insert({content: 'hello world'});

                expect(Student.find().count()).to.equal(1);

                Student.remove({});
            });
        });
    });
}