var User;
(function() {
    var instance;

    User = function User(param) {
        if (instance) {
            return instance;
        }

        instance = this;

        // all the functionality
        this.firstName = 'John';
        this.lastName = 'Doe';

        // this.inside()


        this.inside = function() {
            console.log(this);
        }



        return instance;
    };

    var test = function() {
        console.log(this)
    }

    this._test = function() {
        console.log(this)
    }
}());