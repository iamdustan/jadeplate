(function(provide) {
  var _ = require('underscore');
  
  /** DataGrid viewmodel.
   *  
   * @param data an array or observable array of data rows. Each row much be an object, 
   *  with keys indicating the name of the column and values with the data value for that
   *  row.
   * @param [columns] optional array of columns to display. This is useful to set the 
   *  order of the columns (since JS objects are unordered), or to change the display name  
   *  of columns in your data. Pass either an array of keys or {key: value} pairs to 
   *  specify the name to be used for that key. Ex: ["name", "email"] or [{name: "Full 
   *  Name"}, {email: "Email Address"}]
   */
  function DataGridVM(data, columns, options) {
    this.options = options || {};
    // turn columns into a map of: {key: 'key', label: 'Value'}
    if(columns) {
      var columns = _.map(columns, function(c) {
        if(_.isObject(c)) return c;
        return { key: c, label: c };
      });
    }
    else {
      var columns = _.map(_.keys(ko.utils.unwrapObservable(data)[0]), function(c) {
        return { key: c, label: c };
      });
    }
    var self = this;
    this.columns = ko.observableArray(_.map(columns, function(c) {
      return _.defaults(c, {
        sortable: (!c.key) ? false : (c.sortable === false) ? false : true,
        sorted: ko.observable(false),
        asc: ko.observable(false),
        link: (c.click) ? true : false,
        label: '',
        sort: function() {
          if(!this.sortable) return;
          var _col = this;
          _.each(self.columns(), function(c) {
            if(c == _col) return; 
            c.sorted(false); 
            c.asc(false); 
          });
          this.sorted(true);
          this.asc(!this.asc());
          self.onSort(this, (this.asc()) ? "ASC" : "DESC");
        }
      });
    }));
    
    this.rows = ko.observableArray([]);
    if(ko.isObservable(data)) {
      data.subscribe(_.bind(this.refreshData, this));
    }
    this.refreshData(ko.utils.unwrapObservable(data));
    
  }
  
  DataGridVM.prototype = {
    // re-build data array from the given array
    refreshData: function(data) {
      var self = this;
      var data = _.map(data, function(row) {
        return { cells: _.map(self.columns(), function(column) {
          var r = {
            click: function(vm) { column.click(row); },
            link: column.link
          };
          if(!column.key) return _.extend(r, { type: column.type, value: null });
          return _.extend(r, { 
            value: (('undefined' != typeof row[column.key]) ? 
                    (column.format ? column.format(row[column.key]) : row[column.key])
                    : null), 
            type: null 
          });
        }) };
      });
      
      this.rows(data);
    },
    onSort: function(column, direction) {
      _.isFunction(this.options.onSort) && this.options.onSort(column.key, direction);
    }
  };
  
  provide("components/datagrid", DataGridVM);
})(provide);