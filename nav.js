//# dc.js Getting Started and How-To Guide
'use strict';

/* jshint globalstrict: true */
/* global dc,d3,crossfilter */

d3.select("#btnExpenses")
      .on("click", function() {  
          d3.select("#expenses-container").style("display", "block");
          d3.select("#sales-container").style("display", "none");
          d3.select("#payments-container").style("display", "none");

          
//          // how do I get the charts to reset all of their filters and transition during the redraw?
//          if ((expByCampusChart.filters().length | 
//              functionChart.filters().length | 
//              functionPieChart.filters().length) > 0) {
//            dc.redrawAll("expenses");
//          }
//          else {
//            dc.renderAll("expenses");
//          }

          dc.renderAll("expenses");
//          formatXAxis();      

//          setUpToolTips();
        });

    d3.select("#btnSales")
      .on("click", function() {  
          d3.select("#expenses-container").style("display", "none");
          d3.select("#sales-container").style("display", "block");
          d3.select("#payments-container").style("display", "none");

//          // use workaround to check for # of filters present & either redrawAll or renderAll
//          if ((revByCampusChart.filters().length | 
//              sourceOfRevenueChart.filters().length | 
//              revSourcePieChart.filters().length) > 0) {
//            dc.redrawAll("revenue");
//          }
//          else {
//            dc.renderAll("revenue");
//          }
          dc.renderAll("revenue");

//          formatXAxis();

//          setUpToolTips();
        });

    d3.select("#btnPayments")
      .on("click", function() {  
          d3.select("#payments-container").style("display", "block");
          d3.select("#sales-container").style("display", "none");
          d3.select("#expenses-container").style("display", "none");
          
                   
//          // use workaround to check for # of filters present & either redrawAll or renderAll
//          if ((targetExpByCampusChart.filters().length | 
//              targetExpenseChart.filters().length | 
//              targetExpensePieChart.filters().length) > 0) {
//            dc.redrawAll("targetExpenses");
//          }
//          else {
//            dc.renderAll("targetExpenses");
//          }

          dc.renderAll("targetExpenses");
//          formatXAxis();

//          setUpToolTips();
        });
