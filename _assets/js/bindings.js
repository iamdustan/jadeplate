;(function(ko) {
  var $ = require('ender');
  
  ko.bindingHandlers.modalShow = {
    update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
      var value = ko.utils.unwrapObservable(valueAccessor());
      $('body').toggleClass('with-modal', value);
      $(element).toggleClass('show', value);
    }
  };
  
  
  
  ko.bindingHandlers.confirm = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
      $element = $(element),
        value = valueAccessor();
      var options = value;
      if(typeof value == 'function')
        options = { confirm: value }
      
      options.onProceed = function(trigger, clicked) {
        if(typeof options.confirm == 'function')
          options.confirm.call(viewModel);
      };
      options.onCancel = function(trigger, clicked) {
        if(typeof options.cancel == 'function')
          options.cancel.call(viewModel);
      };
      
      $element.on('click', function(e) {
        $(this).append('<div class="fast-confirm">Yes or no?</div>');
        $(this).css('position', 'relative');
        e.preventDefault();
        return false;
      });
    }
  }
  
  
  
  // show/hide a layer in the navigation stack
  ko.bindingHandlers.stack = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
      var value       = valueAccessor(),
          allBindings = allBindingsAccessor(),
          stackName   = ko.utils.unwrapObservable(allBindings.stackName);
      if(value() === null) return $(element).hide();
      if(stackName === value().name) $(element).show()
      else $(element).hide();
    }
  }
})(ko);