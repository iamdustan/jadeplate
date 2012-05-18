(function(provide) {
  var _ = require('underscore');
  
  function StackViewVM(vm, options) {
    this.vm = vm;
    this.options = _.defaults(options || {}, {
      pushState: function() {}
    });
    
    this.stack = ko.observableArray();
    
    this.active = ko.computed(function() {
      if(this.stack().length == 0) var r = null;
      else var r = this.stack()[this.stack().length-1];
      return r;
    }, this);
  }
  
  StackViewVM.prototype = {
    push: function(name, title, options) {
      this.stack.push({ name: name, title: title, options: options });
    },
    pop: function() {
      this.stack.pop();
    },
    popTo: function(name) {
      var stack = this.stack();
      while(stack.length > 0 && stack[stack.length-1].name !== name) {
        stack.pop();
      }
      this.stack(stack);
    }
  };
  
  provide('components/stackview', StackViewVM);
})(provide);