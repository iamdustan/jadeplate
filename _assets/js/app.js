(function() {
  var $ = require('ender'),
      _ = require('underscore');

  // History control
  var app_location = window.location.pathname, 
      app_name = "MX-Merchant",
      app_section, app_subsection;
  
  var history = {
    _disableUpdates: false,
    _initialState: {},
    // Update the browser state (using either 'pushState' if method is 'push' or 
    // 'replaceState' if method is 'replace'
    _updateState: function(method, paths, data, addlTitle) {
      if(history._disableUpdates) return;
      var app_history = '/' + paths.join('/'),
          title = app_name + " - " + paths[0] + " - " + paths[1] + ((addlTitle) ? ' - ' + addlTitle : '');
      if(window.history[method + 'State']) {
        window.history[method + 'State']( { paths: paths, data: data, title: title }, title, app_history); // Add to history
        document.title = title;
      }
      else if(method === 'push') {
        window.location.href = '//' + window.location.host + app_history;
      }
    },
    pushState: function(paths, data, addlTitle) {
      var args = Array.prototype.slice.call(arguments);
      args.unshift('push');
      history._updateState.apply(history, args);
    },
    replaceState: function(paths, data, addlTitle) {
      var args = Array.prototype.slice.call(arguments);
      args.unshift('replace');
      history._updateState.apply(history, args);
    },
    onPopState: function(e) {
      if(e.state) {
        history.handlePath(e.state);
      }
      else {
        history.handlePath( history._initialState );
      }
    },
    handlePath: function(state) {
      for(var i = 0, j = App.sections().length; i < j; i++ ) {
        if(state.paths[0] == App.sections()[i].name()) {
          var additional = _.clone(state.paths);
          additional.shift(); additional.shift();
          for(var k = 0, l = App.sections()[i].children().length; k < l; k++) {
            if(state.paths[1] == App.sections()[i].children()[k].name()) {
              history._disableUpdates = true;
              if( !App.sections()[i].children()[k].active() ) {
                App.sections()[i].children()[k].activate();
              }
              App.sections()[i].children()[k].history(additional, state.data);
              if (state.title) document.title = state.title;
              else document.title = app_name;
              history._disableUpdates = false;
            }
          }
        }
      }
    },
    loadPath: function(initial) {
      var paths = window.location.pathname.split('/');
      paths = _(paths).without("");
      if(paths.length > 0) {
        history.handlePath({ paths: paths });
        history._initialState = { paths: paths };
      }
      else {
        history._initialState = { paths: initial };
        history.replaceState(initial, {});
      }
    }
  }
  window.onpopstate = history.onPopState;
  
  
  
  var current_menu = null;
  function Section(name, children) {
    this.name = ko.observable(name);
    this.dropdown_open = ko.observable(false);
    
    this.children = ko.observableArray(children);
    
    this.active = ko.computed(function() {
      return _.any(this.children(), function(vm) {
        return vm.active();
      });
    }, this);
    this.active.subscribe(function() {
      if(this.active()) {
        app_section = this.name();
      }  
    }, this);
    
    this.activate = function() {
      app_section = name;
      this.children()[0].activate();
    }
    this.open = function(  ) {
      // Only one menu open at a time
      if( current_menu == null ) {
        current_menu = this;
        this.dropdown_open( !this.dropdown_open() );
      } else if( current_menu == this ) {
        current_menu = null;
        this.dropdown_open( !this.dropdown_open() );
      } else if( current_menu != this ) {
        current_menu.dropdown_open( false );
        current_menu = this;
        this.dropdown_open( !this.dropdown_open() );
      }
    }
  }
  
  
  var active_section = null;
  function SubSection(name, dom, viewmodel) {
    this.name = ko.observable(name);
    this.active = ko.observable(false);
    
    // Reference to the instance of the viewmodel for this section
    // Initially null, will be set when we first activate the section
    var vm = null;
    
    // Activate this section, initializing viewmodel if necessary
    this.activate = function() {
      if(active_section) active_section.deactivate();
      this.active(true);
      active_section = this;
      app_subsection = name;
      // Pushes to history
      history.pushState([app_section, app_subsection]);
      // lazy-bind the viewmodel the first time we activate this section
      if(!vm && dom && viewmodel) {
        console.log("Initializing and binding " + this.name() + " viewmodel");
        vm = new viewmodel(this);
        if(document.getElementById(dom)) {
          ko.applyBindings(vm, document.getElementById(dom));
        }
        if(vm.initialize) vm.initialize();
      }
    }
    
    this.menuactivate = function() {
      this.activate();
      // Toggle the menu
      current_menu.dropdown_open( !current_menu.dropdown_open() );
      current_menu = null;
    }

    // Deactivate this section
    this.deactivate = function() {
      this.active(false);
    }
    
    this.history = function(path, data) {
      if(vm && vm.updateState) vm.updateState(path, data);
    }
    
    this.pushHistory = function(paths, data, title) {
      history.pushState([app_section, app_subsection].concat(paths), data, title);
    }
    
    // Extend the viewmodel with this SubSection object, so that the viewmodel has 
    // access to the active property
    if(viewmodel) {
      _.extend(viewmodel.prototype, this);
    }
  }
  
  
  
  
  function AppVM() {
    //console.log("AppVM")
    this.sections = ko.observableArray([
      new Section("Home", [
        new SubSection("Dashboard", 'dashboard-section', require("views/home/dashboard")),
        new SubSection("Inbox", 'inbox-section', require("views/home/inbox"))
      ]),
      new Section("Customers", [
        new SubSection("Manage", null, require('views/customers/manage')),
        new SubSection("Connections", null, require('views/customers/connections')),
        new SubSection("Marketing", null, require('views/customers/marketing'))
      ]),
      new Section("Invoices", [
        new SubSection("Manage", null, require('views/invoices/manage')),
        new SubSection("Recurring", null, require('views/invoices/recurring')),
        new SubSection("Inventory", null, require('views/invoices/inventory')),
        new SubSection("Discount", null, require('views/invoices/discount')),
        new SubSection("Tax", null, require('views/invoices/tax')),
        new SubSection("Settlement", null, require('views/invoices/settlement'))
      ]),
      new Section("Reports", [
        new SubSection("Sales", null, require('views/reports/sales')),
        new SubSection("Funding", null, require('views/reports/funding')),
        new SubSection("Chargebacks", null, require('views/reports/chargebacks')),
        new SubSection("Qualifications", null, require('views/reports/qualification')),
        new SubSection("Research", null, require('views/reports/research')),
        new SubSection("Statements", null, require('views/reports/statements')),
        new SubSection("Devices", null, require('views/reports/devices')),
        new SubSection("Orders", null, require('views/reports/orders')),
        new SubSection("Products", null, require('views/reports/products')),
        new SubSection("Settlement", null, require('views/reports/settlement')),
        new SubSection("Taxes", null, require('views/reports/taxes')),
        new SubSection("Users", null, require('views/reports/users'))
      ]),
      new Section("Charts", [
        new SubSection("Sales", null, require('views/charts/sales')),
        new SubSection("Funding", null, require('views/charts/funding')),
        new SubSection("Chargebacks", null, require('views/charts/chargebacks'))
      ]),
      new Section("PCI-DSS", [
        new SubSection("", null, require('views/pci/index'))
      ]),
      new Section("Setup", [
        new SubSection("Fraud", null, require('views/setup/fraud')),
        new SubSection("Auto-Close", null, require('views/setup/autoclose')),
        new SubSection("User", null, require('views/setup/user')),
        new SubSection("Device", null, require('views/setup/device')),
        new SubSection("Time", null, require('views/setup/time')),
        new SubSection("Receipt", null, require('views/setup/receipt'))
      ])
    ]);
    
    this.active_section = ko.computed(function() {
      return _.find(this.sections(), function(s) { return s.active() === true; });
    }, this);
    this.active_subsection = ko.computed(function() {
      var s = this.active_section();
      if(!s) return null;
      return _.find(s.children(), function(sub) { return sub.active() === true; });
    }, this);
    
  }

  AppVM.prototype = {}
  var App = new AppVM();
  $(document).ready(function() {
    console.log("===== PAGE HAS LOADED =====");

    ko.applyBindings(App, document.getElementById('header'));
    // Click off of to close menu
    $('#main' ).bind( 'click', function( e ) {
      if(current_menu) {
        current_menu.dropdown_open( !current_menu.dropdown_open() );
        current_menu = null;
      }
    });

    history.loadPath(['Home', 'Dashboard']);

  });

  provide('app', App);
  
})();
