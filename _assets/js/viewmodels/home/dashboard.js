(function(provide) {

  var _ = require( 'underscore' ),
      $ = require( 'ender' ),
      graphing = require( 'components/graphing' ),
      PieChart = graphing.PieChart,
      BarChart = graphing.BarChart;

  function DashboardVM() {
    this.data = [
    {
      type : 'PieChart',
      title : 'Sample Chart',
      items : [
        {
          description : 'Sample Description',
          value : 18
        },
        {
          description : 'Sample Description',
          value : 12
        },
        {
          description : 'Sample Description',
          value : 21
        },
        {
          description : 'Sample Description',
          value : 7
        }
      ]
    },
    {
      type : 'PieChart',
      title : 'Sample Chart',
      items : [
        {
          description : 'Sample Description',
          value : 12
        },
        {
          description : 'Sample Description',
          value : 15
        },
        {
          description : 'Sample Description',
          value : 26
        },
        {
          description : 'Sample Description',
          value : 5
        }
      ]
    },
    {
      type : 'BarChart',
      title : 'Sample Chart',
      items : [{
        column : 'Sample Column',
        item : [ 'Sample', 'Sample', 'Sample' ],
        val : [ 10, 40, 160 ]
      },
      {
        column : 'Sample Column',
        item : [ 'Sample', 'Sample', 'Sample' ],
        val : [ 10, 40, 160 ]
      },
      {
        column : 'Sample Column',
        items : [ 'Sample', 'Sample', 'Sample' ],
        val : [ 10, 40, 160 ]
      },
      {
        column : 'Sample Column',
        item : [ 'Sample', 'Sample', 'Sample' ],
        val : [ 10, 40, 160 ]
      }
      ]
    },
    {
      type : 'BarChart',
      title : 'Sample Chart',
      items : [{
        column : 'Sample Column',
        item : [ 'Sample', 'Sample', 'Sample' ],
        val : [ 10, 40, 160 ]
      },
      {
        column : 'Sample Column',
        item : [ 'Sample', 'Sample', 'Sample' ],
        val : [ 10, 40, 160 ]
      },
      {
        column : 'Sample Column',
        items : [ 'Sample', 'Sample', 'Sample' ],
        val : [ 10, 40, 160 ]
      },
      {
        column : 'Sample Column',
        item : [ 'Sample', 'Sample', 'Sample' ],
        val : [ 10, 40, 160 ]
      }
      ]
    }
    ];

    this.charts = []
  }
  
  DashboardVM.prototype = {
    initialize : function() {
      this.drawCharts();
    },
    
    drawCharts : function() {
      var diameter = _.min( [ ($('#chart1').width() * .5), 400 ] ),
          wells = [ '#chart1', '#chart2', '#chart3', '#chart4' ];
      for( var i = 0, dl = this.data.length; i < dl; i++ ) {
        var chart = this.data[i];
        if( chart.type === 'PieChart' ) {
          var PieData = [];
          for( var j = 0, pd = chart.items.length; j < pd; j ++) {
            PieData.push( chart.items[j].value );
          }
          this.charts[i] = new PieChart( wells[i], PieData );
          this.charts[i].render();
        } else if ( chart.type === 'BarChart' ) {
          this.charts[i] = new BarChart( wells[i], chart.items )
          this.charts[i].render();
        }
      }
      /*
      var diameter = _.min( [ ($('#chart1').width() * .5), 400 ] )
      PieChart( '#chart1', [ 38, 11, 17, 12 ], { width : diameter, height : diameter } );
      PieChart( '#chart2', [ 56, 12, 49, 15 ], { width : diameter, height : diameter } );
      window.onresize = _.throttle( function() {
        diameter = _.min( [ ($('#chart1').width() * .5), 400 ] )
        $( '#chart1' ).html( '' );
        $( '#chart2' ).html( '' );
        PieChart( '#chart1', [ 38, 11, 17, 12 ], { width : diameter, height : diameter } );
        PieChart( '#chart2', [ 56, 12, 49, 15 ], { width : diameter, height : diameter } );
      }, 100);
      */
    }
  };

  provide("views/home/dashboard", DashboardVM);
})(provide);