(function(provide) {
  var DataGrid  = require('components/datagrid'),
      StackView = require('components/stackview'),
      _         = require('underscore'),
      ko        = require('ko');
  
  function InboxVM() {
    this.data = ko.observableArray([
      { id: 12345, from: "Priority Payment Systems", subject: "MX POS tab has been replaced with INVOICES tab", message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse metus nulla, adipiscing sit amet pretium eget, iaculis auctor nunc. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam in massa mi. Quisque pharetra, risus non malesuada vehicula, eros purus ultricies purus, ut auctor nibh risus sit amet massa. Nunc lorem mi, tempus viverra mattis in, eleifend et elit. Etiam mattis ipsum non elit vestibulum auctor. Proin ac urna eget arcu aliquam semper. Morbi bibendum, odio vel pretium feugiat, neque turpis pulvinar quam, eget scelerisque ante odio vitae justo. Sed eu risus vel libero semper ultrices. Pellentesque arcu ipsum, sollicitudin in iaculis quis, sollicitudin non velit. In imperdiet, massa nec interdum rhoncus, orci justo interdum metus, porttitor ornare magna ipsum eget dolor. Fusce rhoncus est eget lorem lobortis eu blandit arcu fringilla. Donec sem risus, viverra et pellentesque nec, aliquam at nisi. Aliquam mattis velit nec diam adipiscing aliquam. Sed egestas pretium eros dapibus venenatis. Nunc eu feugiat urna.", priority: "Urgent", dateCreated: new Date(2012, 1, 13) },
      { id: 12345, from: "Priority Payment Systems", subject: "MX POS tab has been replaced with INVOICES tab", message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse metus nulla, adipiscing sit amet pretium eget, iaculis auctor nunc. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam in massa mi. Quisque pharetra, risus non malesuada vehicula, eros purus ultricies purus, ut auctor nibh risus sit amet massa. Nunc lorem mi, tempus viverra mattis in, eleifend et elit. Etiam mattis ipsum non elit vestibulum auctor. Proin ac urna eget arcu aliquam semper. Morbi bibendum, odio vel pretium feugiat, neque turpis pulvinar quam, eget scelerisque ante odio vitae justo. Sed eu risus vel libero semper ultrices. Pellentesque arcu ipsum, sollicitudin in iaculis quis, sollicitudin non velit. In imperdiet, massa nec interdum rhoncus, orci justo interdum metus, porttitor ornare magna ipsum eget dolor. Fusce rhoncus est eget lorem lobortis eu blandit arcu fringilla. Donec sem risus, viverra et pellentesque nec, aliquam at nisi. Aliquam mattis velit nec diam adipiscing aliquam. Sed egestas pretium eros dapibus venenatis. Nunc eu feugiat urna.", priority: "", dateCreated: new Date(2011, 12, 15) },
      { id: 12345, from: "Priority Payment Systems", subject: "MX POS tab has been replaced with INVOICES tab", message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse metus nulla, adipiscing sit amet pretium eget, iaculis auctor nunc. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam in massa mi. Quisque pharetra, risus non malesuada vehicula, eros purus ultricies purus, ut auctor nibh risus sit amet massa. Nunc lorem mi, tempus viverra mattis in, eleifend et elit. Etiam mattis ipsum non elit vestibulum auctor. Proin ac urna eget arcu aliquam semper. Morbi bibendum, odio vel pretium feugiat, neque turpis pulvinar quam, eget scelerisque ante odio vitae justo. Sed eu risus vel libero semper ultrices. Pellentesque arcu ipsum, sollicitudin in iaculis quis, sollicitudin non velit. In imperdiet, massa nec interdum rhoncus, orci justo interdum metus, porttitor ornare magna ipsum eget dolor. Fusce rhoncus est eget lorem lobortis eu blandit arcu fringilla. Donec sem risus, viverra et pellentesque nec, aliquam at nisi. Aliquam mattis velit nec diam adipiscing aliquam. Sed egestas pretium eros dapibus venenatis. Nunc eu feugiat urna.", priority: "Urgent", dateCreated: new Date(2011, 9, 16) },
      { id: 12345, from: "Priority Payment Systems", subject: "MX POS tab has been replaced with INVOICES tab", message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse metus nulla, adipiscing sit amet pretium eget, iaculis auctor nunc. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam in massa mi. Quisque pharetra, risus non malesuada vehicula, eros purus ultricies purus, ut auctor nibh risus sit amet massa. Nunc lorem mi, tempus viverra mattis in, eleifend et elit. Etiam mattis ipsum non elit vestibulum auctor. Proin ac urna eget arcu aliquam semper. Morbi bibendum, odio vel pretium feugiat, neque turpis pulvinar quam, eget scelerisque ante odio vitae justo. Sed eu risus vel libero semper ultrices. Pellentesque arcu ipsum, sollicitudin in iaculis quis, sollicitudin non velit. In imperdiet, massa nec interdum rhoncus, orci justo interdum metus, porttitor ornare magna ipsum eget dolor. Fusce rhoncus est eget lorem lobortis eu blandit arcu fringilla. Donec sem risus, viverra et pellentesque nec, aliquam at nisi. Aliquam mattis velit nec diam adipiscing aliquam. Sed egestas pretium eros dapibus venenatis. Nunc eu feugiat urna.", priority: "", dateCreated: new Date(2010, 1, 1) }
    ]);
    this.datagrid = new DataGrid(this.data, [
      {key: 'from', label: "From"}, 
      {key: 'subject', label: "Subject", click: _.bind(this.goToMessage, this)}, 
      {key: 'priority', label: "Priority"},
      {key: 'dateCreated', label: "Date", format: this.formatDate},
      {type: 'delete', click: _.bind(this.deleteMessage, this)}
    ], {
      onSort: _.bind(this.onSort, this)
    });
    
    this.stack = new StackView(this);
    this.stack.push('inbox', 'Inbox');
    
    this.detail = ko.observable(false);
    this.currentMessage = ko.observable();
    var self = this;
    self.goToInbox = function(message) {
      self.pushHistory();
      self.stack.popTo('inbox');
    }
    
    this.modal = ko.observable(false);
  }
  
  InboxVM.prototype = {
    onSort: function(key, direction) {
      this.data.sort(function(left, right) {
        return left[key] == right[key] ? 0 : (left[key] < right[key] ? -1 : 1);
      });
      if(direction === "DESC") this.data.reverse();
    },
    goToMessage: function(message) {
      this.currentMessage(message);
      this.stack.push('message', message.subject);
      this.pushHistory(['message', '' + message.id], { message: message }, message.subject);
    },
    deleteMessage: function(message) {
      this.data.remove(message);
    },
    formatDate: function(val) {
      return '' + val.getMonth()
             + '/' + val.getDate()
             + '/' + val.getFullYear()
             + ' ' + val.getHours()
             + ':' + val.getMinutes();
    },
    updateState: function(paths, data) {
      if(paths[0] == 'message') {
        this.goToMessage(_.find(this.data(), function(d) { return d.id == paths[1]; }));
      }
      else {
        this.goToInbox();
      }
    }
  };
  
  provide("views/home/inbox", InboxVM);
})(provide);
