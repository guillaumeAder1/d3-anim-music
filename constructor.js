function ConstructorFunction(param) {
    console.log(param)
    this.someProp1 = "1";
    this.someProp2 = "2";
    this.options = param;

    //constructor 

    init();

    function init() {
        console.log('inininini')
        console.log(param)
    }
}