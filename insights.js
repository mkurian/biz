//# dc.js
'use strict';

/* jshint globalstrict: true */
/* global dc,d3,crossfilter */


var quarterChart = dc.pieChart("#quarter-chart");
var yearlyChart = dc.rowChart("#yearly-chart");
var monthChart = dc.rowChart("#month-chart");
var customerChart = dc.rowChart("#customer-chart");
var moveChart = dc.compositeChart("#monthly-move-chart");
var volumeChart = dc.barChart("#monthly-volume-chart");
var amountChart = dc.rowChart("#amount-cutomer-chart");
var customerDataTable = dc.dataTable("#dc-data-table");
var customerDataCount = dc.dataCount("#dc-data-count");
var accountChart = dc.rowChart("#account-chart");

var bills_quarterChart = dc.pieChart("#bills_quarter-chart");
var bills_yearlyChart = dc.rowChart("#bills_yearly-chart");
var bills_monthChart = dc.rowChart("#bills_month-chart");
var bills_customerChart = dc.rowChart("#bills_customer-chart");
var bills_customerDataTable = dc.dataTable("#bills_dc-data-table");
var bills_customerDataCount = dc.dataCount("#bills_dc-data-count");
var bills_moveChart = dc.compositeChart("#bills_monthly-move-chart");
var bills_volumeChart = dc.barChart("#bills_monthly-volume-chart");
var bills_amountChart = dc.rowChart("#bills_amount-cutomer-chart");
var bills_accountChart = dc.rowChart("#bills_account-chart");

var quarterChartPayment = dc.pieChart("#quarter-chart-payment");
var yearlyChartPayment = dc.rowChart("#yearly-chart-payment");
var monthChartPayment = dc.rowChart("#month-chart-payment");
var customerChartPayment = dc.rowChart("#customer-chart-payment");
var customerDataTablePayment = dc.dataTable("#dc-data-table-payment");
var accountChartPayment = dc.rowChart("#account-chart-payment");
var moveChartPayment = dc.compositeChart("#monthly-move-chart-payment");
var volumeChartPayment = dc.barChart("#monthly-volume-chart-payment");
var amountChartPayment = dc.rowChart("#amount-customer-chart-payment");
var customerDataCountPayment = dc.dataCount("#dc-data-count-payment");


var checks_quarterChart = dc.pieChart("#checks_quarter-chart");
var checks_yearlyChart = dc.rowChart("#checks_yearly-chart");
var checks_monthChart = dc.rowChart("#checks_month-chart");
var checks_customerChart = dc.rowChart("#checks_customer-chart");
var checks_customerDataTable = dc.dataTable("#checks_dc-data-table");
var checks_customerDataCount = dc.dataCount("#checks_dc-data-count");
var checks_moveChart = dc.compositeChart("#checks_monthly-move-chart");
var checks_volumeChart = dc.barChart("#checks_monthly-volume-chart");
var checks_amountChart = dc.rowChart("#checks_amount-cutomer-chart");
var checks_accountChart = dc.rowChart("#checks_account-chart");

var startDate = new Date(2008, 6, 1);
var endDate = new Date(2012, 6, 1);
var zero = d3.format("04d");

var quarterGroupLength = 4;

var customerDimension;
var dateDimension;
var amountDimension;

var top3customerName;

var refCustomer =
function(){
    return top3customerName;
}

var filterTable = function(type){
    if(type == "Sales"){
       var customerName = $("#name").val();
        var amtGT = $("#amountGreaterThan").val();
        var amtLT = $("#amountLessThan").val();
        var sDate = $("#dateBegin").val();
        var eDate = $("#dateEnd").val();

        if(customerName != ""){
            //customerDimension.filter(customerName);
            customerChart.filter(customerName);
        }
        if(sDate != "" && eDate != ""){
            //dateDimension.filter([sDate, eDate]);
            customerDataTable.filter([sDate, eDate]);
        }
        if(amtGT != "" && amtLT != ""){
            amountDimension.filter([amtGT, amtLT]);
            amountChart.filter([amtGT, amtLT]);
    }
}else if(type =="Expense"){
     var customerName = $("#bills_name").val();
        var amtGT = $("#bills_amountGreaterThan").val();
        var amtLT = $("#bills_amountLessThan").val();
        var sDate = $("#bills_dateBegin").val();
        var eDate = $("#bills_dateEnd").val();

        if(customerName != ""){
            //customerDimension.filter(customerName);
            bills_customerChart.filter(customerName);
        }
        if(sDate != "" && eDate != ""){
            //dateDimension.filter([sDate, eDate]);
            bills_customerDataTable.filter([sDate, eDate]);
        }
        if(amtGT != "" && amtLT != ""){
            // amountDimension.filter([amtGT, amtLT]);
            bills_amountChart.filter([amtGT, amtLT]);
    }

}else if(type =="Payment"){
     var customerName = $("#namePayment").val();
        var amtGT = $("#amountGreaterThanPayment").val();
        var amtLT = $("#amountLessThanPayment").val();
        var sDate = $("#dateBeginPayment").val();
        var eDate = $("#dateEndPayment").val();

        if(customerName != ""){
            //customerDimension.filter(customerName);
            customerChartPayment.filter(customerName);
        }
        if(sDate != "" && eDate != ""){
            //dateDimension.filter([sDate, eDate]);
            customerDataTablePayment.filter([sDate, eDate]);
        }
        if(amtGT != "" && amtLT != ""){
            // amountDimension.filter([amtGT, amtLT]);
            amountChartPayment.filter([amtGT, amtLT]);
    }
}
else if(type =="Checks"){
     var customerName = $("#nameChecks").val();
        var amtGT = $("#amountGreaterThanChecks").val();
        var amtLT = $("#amountLessThanChecks").val();
        var sDate = $("#dateBeginChecks").val();
        var eDate = $("#dateEndChecks").val();

        if(customerName != ""){
            //customerDimension.filter(customerName);
            customerChartChecks.filter(customerName);
        }
        if(sDate != "" && eDate != ""){
            //dateDimension.filter([sDate, eDate]);
            customerDataTableChecks.filter([sDate, eDate]);
        }
        if(amtGT != "" && amtLT != ""){
            // amountDimension.filter([amtGT, amtLT]);
            amountChartChecks.filter([amtGT, amtLT]);
    }
}

}


d3.csv("testinvoices.csv", function (data) {
            /* since its a csv file we need to format the data a bit */
            var dateFormat = d3.time.format("%m/%d/%Y");
            var numberFormat = d3.format(".2f");

            data.forEach(function (d) {
                d.dd = dateFormat.parse(d.date);
                d.month = d3.time.month(d.dd); // pre-calculate month for better performance
            });

           var ndx = crossfilter(data);
            var all = ndx.groupAll();

            var accountDimension = ndx.dimension(function (d) {
                return d.account;
            });

             var accountGroup = accountDimension.group().reduceSum(function (d) {
                return d.amount;
            });

         var accountGroupLength = accountGroup.all().length;

            accountChart.width(200)
                     .height( (accountGroupLength == 1) ?  80: (30 * accountGroupLength ) )
                    .margins({top: 20, left: 10, right: 10, bottom: 20})
                    .group(accountGroup)
                    .dimension(accountDimension)
                    .colors(d3.scale.category20b())
                    .label(function (d) {
                        return d.key;
                    })
                    .ordering(function(d){return - d.value;})
                    .title(function (d) {
                        return d.value;
                    })
                    // .elasticX(true)
                    .xAxis().ticks(4);

            customerDimension = ndx.dimension(function (d) {
                return d.customer;
            });

            var yearlyDimension = ndx.dimension(function (d) {
                        return d.dd.getFullYear();
               });

            var yearlySum = yearlyDimension.group().reduceSum(function (d) {
                return d.amount;
            });

            var yearlySumLength = yearlySum.all().length;

            dateDimension = ndx.dimension(function (d) {
                return d.dd;
            });

            var monthDimension = ndx.dimension(function (d) {
                return d.dd.getMonth();
            });

            var amountByMonthGroup = monthDimension.group().reduceSum(function (d) {
                return d.amount;
            });

             var amountByDateGroup = dateDimension.group().reduceSum(function (d) {
                return d.amount;
            });

             amountDimension = ndx.dimension(function (d) {
                return d.amount;
            });
            var amountGroup = amountDimension.group();
            var sumByCustomer = customerDimension.group().reduceSum(function (d) {
                return d.amount;
            });

            var topCustomers = sumByCustomer.top(10);
           top3customerName = topCustomers[2].key;

            var quarter = ndx.dimension(function (d) {
                var month = d.dd.getMonth();
                if (month <= 2)
                    return "Q1";
                else if (month > 3 && month <= 5)
                    return "Q2";
                else if (month > 5 && month <= 8)
                    return "Q3";
                else
                    return "Q4";
            });
            var quarterGroup = quarter.group().reduceSum(function (d) {
                return d.amount;
            });


            var monthDimension = ndx.dimension(function (d) {
                var month = d.dd.getMonth();
                 switch (month) {
                 case 0:
                        return "A.Jan";
                    case 1:
                        return "B.Feb";
                    case 2:
                        return "C.Mar";
                    case 3:
                        return "D.Apr";
                    case 4:
                        return "E.May";
                    case 5:
                        return "F.Jun";
                    case 6:
                        return "G.Jul";
                    case 7:
                        return "H.Aug";
                    case 8:
                        return "I.Sep";
                    case 9:
                        return "J.Oct";
                    case 10:
                        return "K.Nov";
                    case 11:
                        return "L.Dec";
                        }
            });


            var monthGroup = monthDimension.group().reduceSum(function (d) {
                return d.amount;
            });

            var monthGroupLength = monthGroup.all().length;


            monthChart.width(150)
                    .height(30 * monthGroupLength + 20)
                    .margins({top: 20, left: 10, right: 10, bottom: 20})
                    .group(monthGroup)
                    .dimension(monthDimension)
                    .colors(d3.scale.category10())
                    .label(function (d) {
                        return d.key.split(".")[1];
                    })
                    .title(function (d) {
                        return d.value;
                    })
                    // .elasticX(true)
                    .xAxis().ticks(4);

            amountChart
                    // .width(10)
                    // .height(10)
                    // .margins({top: 20, left: 10, right: 10, bottom: 20})
                    .group(amountGroup)
                    .dimension(amount)
                    .colors(d3.scale.category20b())
                    .label(function (d) {
                        return d.key.split(".")[1];
                    })
                    .title(function (d) {
                        return d.value;
                    })
                    // .elasticX(true)
                    .xAxis().ticks(4);


        var customerGroup = customerDimension.group();
        var customerGroupLength = customerGroup.all().length;
            customerChart.width(150)
                    .height(41 * customerGroupLength)
                    .margins({top: 20, left: 10, right: 10, bottom: 20})
                    .group(sumByCustomer)
                    .dimension(customerDimension)
                    .colors(d3.scale.category20b())
                    .label(function (d) {
                        return d.key;
                    })
                    .ordering(function(d){return - d.value;})
                    .title(function (d) {
                        return d.value;
                    })
                    // .elasticX(true)
                    .xAxis().ticks(4);

            var dayOfWeek = ndx.dimension(function (d) {
                var day = d.dd.getDay();
                switch (day) {
                    case 0:
                        return "0.Sun";
                    case 1:
                        return "1.Mon";
                    case 2:
                        return "2.Tue";
                    case 3:
                        return "3.Wed";
                    case 4:
                        return "4.Thu";
                    case 5:
                        return "5.Fri";
                    case 6:
                        return "6.Sat";
                }
            });
            var dayOfWeekGroup = dayOfWeek.group();

            quarterChart
                    .width(120)
                     .height(quarterGroupLength * 30 + 20)
                    .radius(60)
                    .innerRadius(30)
                    .dimension(quarter)
                    .colors(d3.scale.category10())
                    .group(quarterGroup);

            yearlyChart.width(150)
                    .margins({top: 20, left: 10, right: 10, bottom: 20})
                    .dimension(yearlyDimension)
                    .group(yearlySum)
                    .height(36*yearlySumLength + 20)
                    .colors(d3.scale.category10())
                    .label(function (d) {
                        return d.key;
                    })
                    .title(function (d) {
                        return d.value;
                    })
                    // .elasticX(true)
                    .xAxis().ticks(4);

            moveChart.width(700)
                    .height(300)
                    .transitionDuration(100)
                    .margins({top: 30, right: 50, bottom: 25, left: 40})
                    .dimension(dateDimension)
                    .mouseZoomable(true)
                    .x(d3.time.scale().domain([startDate, endDate]))
                    .round(d3.time.month.round)
                    .xUnits(d3.time.months)
                    .elasticY(true)
                    .renderHorizontalGridLines(true)
                   // .legend(dc.legend().x(800).y(10).itemHeight(13).gap(5))
                    .brushOn(false)
                    .rangeChart(volumeChart)
                    .compose([
                        dc.lineChart(moveChart)
                                .group(amountByDateGroup, "Monthly Sales")
                                .dimension(dateDimension)
                               .valueAccessor(function (d) {
                                    return d.value;
                                })
                                 .renderArea(true)
//                                 .stack(amountByDateGroup, "Monthly Index Move", function (d) {
//                                     return d.value;
//                                 })
                                .title(function (d) {
                                    var value = d.data.value.avg ? d.data.value.avg : d.data.value;
                                    if (isNaN(value)) value = 0;
                                    return dateFormat(d.data.key) + "\n" + numberFormat(value);
                                })
                    ])
                    .xAxis();

            volumeChart.width(700)
                    .height(40)
                    .margins({top: 0, right: 50, bottom: 20, left: 40})
                    .dimension(dateDimension)
                    .group(amountByDateGroup)
                    .centerBar(true)
                    .gap(1)
                    .x(d3.time.scale().domain([startDate, endDate]))
                    .round(d3.time.month.round)
                    .xUnits(d3.time.months);

            customerDataCount
                    .dimension(ndx)
                    .group(all);

            customerDataTable
                    .dimension(dateDimension)
                    .group(function (d) {
                        var format = d3.format("02d");
                        return format((d.dd.getMonth() + 1)) + "/"  + d.dd.getFullYear() ;
                    })
                    .size(500)
                    .columns([
                        function (d) {return d.date;},
                        function (d) {return d.amount;},
                        function (d) {return d.customer;},
                        function (d) {return d.account;}
                    ])
                    .ordering(function(d){return d.date;})
                    .renderlet(function (table) {
                        table.selectAll(".dc-table-group").classed("info", true);
                    });

            dc.renderAll();

        }
);



d3.csv("testbills.csv", function (data) {

            /* since its a csv file we need to format the data a bit */
            var dateFormat = d3.time.format("%m/%d/%Y");
            var numberFormat = d3.format(".2f");

            data.forEach(function (e) {
                e.dd = dateFormat.parse(e.date);
                e.month = d3.time.month(e.dd); // pre-calculate month for better performance
            });

            var ndx = crossfilter(data);
            var all = ndx.groupAll();

            var customerDimension = ndx.dimension(function (d) {
                return d.vendor;
            });


            var yearlyDimension = ndx.dimension(function (d) {
   						return d.dd.getFullYear();
               });

            var yearlySum = yearlyDimension.group().reduceSum(function (d) {
                return d.amount;
            });

            var yearlySumLength = yearlySum.all().length;

            var dateDimension = ndx.dimension(function (d) {
                return d.dd;
            });

             var monthDimension = ndx.dimension(function (d) {
                return d.dd.getMonth();
            });

            var amountByMonthGroup = monthDimension.group().reduceSum(function (d) {
                return d.amount;
            });

             var amountByDateGroup = dateDimension.group().reduceSum(function (d) {
                return d.amount;
            });

            var amount = ndx.dimension(function (d) {
                return d.amount;
            });
            var amountGroup = amount.group();

            var sumByCustomer = customerDimension.group().reduceSum(function (d) {
                return d.amount;
            });

              var accountDimension = ndx.dimension(function (d) {
                return d.account;
            });

             var accountGroup = accountDimension.group().reduceSum(function (d) {
                return d.amount;
            });

         var accountGroupLength = accountGroup.all().length;

            bills_accountChart.width(200)
                     .height(30 * accountGroupLength + 30)
                    .margins({top: 20, left: 10, right: 10, bottom: 20})
                    .group(accountGroup)
                    .dimension(accountDimension)
                    .colors(d3.scale.category20b())
                    .label(function (d) {
                        return d.key;
                    })
                    .ordering(function(d){return - d.value;})
                    .title(function (d) {
                        return d.value;
                    })
                    // .elasticX(true)
                    .xAxis().ticks(4);

 			var topCustomers = sumByCustomer.top(10);
           var quarter = ndx.dimension(function (d) {
                var month = d.dd.getMonth();
                if (month <= 2)
                    return "Q1";
                else if (month > 3 && month <= 5)
                    return "Q2";
                else if (month > 5 && month <= 8)
                    return "Q3";
                else
                    return "Q4";
            });
            var quarterGroup = quarter.group().reduceSum(function (d) {
                return d.amount;
            });


              var monthDimension = ndx.dimension(function (d) {
                var month = d.dd.getMonth();
                 switch (month) {
                 case 0:
                        return "A.Jan";
                    case 1:
                        return "B.Feb";
                    case 2:
                        return "C.Mar";
                    case 3:
                        return "D.Apr";
                    case 4:
                        return "E.May";
                    case 5:
                        return "F.Jun";
                    case 6:
                        return "G.Jul";
                    case 7:
                        return "H.Aug";
                    case 8:
                        return "I.Sep";
                    case 9:
                        return "J.Oct";
                    case 10:
                        return "K.Nov";
                    case 11:
                        return "L.Dec";
                        }
            });


		var monthGroup = monthDimension.group().reduceSum(function (d) {
                return d.amount;
            });;
		 var monthGroupLength = monthGroup.all().length;

			bills_monthChart.width(150)
			.height(30 * monthGroupLength +20)
                    .margins({top: 20, left: 10, right: 10, bottom: 20})
                    .group(monthGroup)
                    .dimension(monthDimension)
                    .colors(d3.scale.category10())
                    .label(function (d) {
                        return d.key.split(".")[1];
                    })
                    .title(function (d) {
                        return d.value;
                    })
                    // .elasticX(true)
                    .xAxis().ticks(4);

            bills_amountChart
            // .width(150)
            //         .height(180)
            //         .margins({top: 20, left: 10, right: 10, bottom: 20})
                    .group(amountGroup)
                    .dimension(amount)
                    .colors(d3.scale.category20b())
                    .label(function (d) {
                        return d.key.split(".")[1];
                    })
                    .title(function (d) {
                        return d.value;
                    })
                    // .elasticX(true)
                    .xAxis().ticks(4);


		var customerGroup = customerDimension.group();
		var customerGroupLength = customerGroup.all().length;
			bills_customerChart.width(150)
			    .height(41 * customerGroupLength)
                    .margins({top: 20, left: 10, right: 10, bottom: 20})
                    .group(sumByCustomer)
                    .dimension(customerDimension)
                    .colors(d3.scale.category20b())
                    .label(function (d) {
                        return d.key;
                    })
                    .title(function (d) {
                        return d.value;
                    })
					.ordering(function(d){return - d.value;})
                    // .elasticX(true)
                    .xAxis().ticks(4);

            var dayOfWeek = ndx.dimension(function (d) {
                var day = d.dd.getDay();
                switch (day) {
                    case 0:
                        return "0.Sun";
                    case 1:
                        return "1.Mon";
                    case 2:
                        return "2.Tue";
                    case 3:
                        return "3.Wed";
                    case 4:
                        return "4.Thu";
                    case 5:
                        return "5.Fri";
                    case 6:
                        return "6.Sat";
                }
            });
            var dayOfWeekGroup = dayOfWeek.group();

            var quarter = ndx.dimension(function (d) {
                var month = d.dd.getMonth();
                if (month <= 2)
                    return "Q1";
                else if (month > 3 && month <= 5)
                    return "Q2";
                else if (month > 5 && month <= 8)
                    return "Q3";
                else
                    return "Q4";
            });
            var quarterGroup = quarter.group().reduceSum(function (d) {
                return d.amount;
            });


            bills_quarterChart
                    .width(120)
                     .height(quarterGroupLength * 30 + 20)
                    .radius(60)
                    .innerRadius(30)
                    .dimension(quarter)
                    .colors(d3.scale.category10())
                    .group(quarterGroup);

            bills_yearlyChart.width(150)
                    .margins({top: 20, left: 10, right: 10, bottom: 20})
                    .dimension(yearlyDimension)
                    .group(yearlySum)
                     .height(36*yearlySumLength + 20)
                    .colors(d3.scale.category10())
                    .label(function (d) {
                        return d.key;
                    })
                    .title(function (d) {
                        return d.value;
                    })
                    // .elasticX(true)
                    .xAxis().ticks(4);



            bills_moveChart.width(700)
                    .height(300)
                    .transitionDuration(100)
                    .margins({top: 30, right: 50, bottom: 25, left: 40})
                    .dimension(dateDimension)
                    .mouseZoomable(true)
                    .x(d3.time.scale().domain([startDate, endDate]))
                    .round(d3.time.month.round)
                    .xUnits(d3.time.months)
                    .elasticY(true)
                    .renderHorizontalGridLines(true)
                   // .legend(dc.legend().x(800).y(10).itemHeight(13).gap(5))
                    .brushOn(false)
                    .rangeChart(bills_volumeChart)
                    .compose([
                        dc.lineChart(bills_moveChart)
                                .group(amountByDateGroup, "Monthly Sales")
                                .dimension(dateDimension)
                               .valueAccessor(function (d) {
                                    return d.value;
                                })
                                 .renderArea(true)
//                                 .stack(amountByDateGroup, "Monthly Index Move", function (d) {
//                                     return d.value;
//                                 })
                                .title(function (d) {
                                    var value = d.data.value.avg ? d.data.value.avg : d.data.value;
                                    if (isNaN(value)) value = 0;
                                    return dateFormat(d.data.key) + "\n" + numberFormat(value);
                                })
                    ])
                    .xAxis();

            bills_volumeChart.width(700)
                    .height(40)
                    .margins({top: 0, right: 50, bottom: 20, left: 40})
                    .dimension(dateDimension)
                    .group(amountByDateGroup)
                    .centerBar(true)
                    .gap(1)
                    .x(d3.time.scale().domain([startDate, endDate]))
                    .round(d3.time.month.round)
                    .xUnits(d3.time.months);


            bills_customerDataCount
                    .dimension(ndx)
                    .group(all);

            bills_customerDataTable
                    .dimension(dateDimension)
                    .group(function (d) {
                        var format = d3.format("02d");
                        return format((d.dd.getMonth() + 1)) + "/"  + d.dd.getFullYear() ;
                    })
                    .size(500)
                    .columns([
                        function (d) {return d.date;},
                        function (d) {return d.amount;},
                        function (d) {return d.vendor;},
                        function (d) {return d.account;}
                    ])
                    .sortBy(function (d) {
                        return d.amount;
                    })
                    .order(d3.descending)
                    .renderlet(function (table) {
                        table.selectAll(".dc-table-group").classed("info", true);
                    });

            dc.renderAll();
        }
);

d3.csv("testpayments.csv", function (data) {
            /* since its a csv file we need to format the data a bit */
            var dateFormat = d3.time.format("%m/%d/%Y");
            var numberFormat = d3.format(".2f");

            data.forEach(function (e) {
                e.dd = dateFormat.parse(e.date);
                e.month = d3.time.month(e.dd); // pre-calculate month for better performance
            });

          var ndx = crossfilter(data);
            var all = ndx.groupAll();

            var customerDimension = ndx.dimension(function (d) {
                return d.customer;
            });


            var yearlyDimension = ndx.dimension(function (d) {
   						return d.dd.getFullYear();
               });

            var yearlySum = yearlyDimension.group().reduceSum(function (d) {
                return d.amount;
            });

            var yearlySumLength = yearlySum.all().length;

            var dateDimension = ndx.dimension(function (d) {
                return d.dd;
            });

             var monthDimension = ndx.dimension(function (d) {
                return d.dd.getMonth();
            });

            var amountByMonthGroup = monthDimension.group().reduceSum(function (d) {
                return d.amount;
            });

             var amountByDateGroup = dateDimension.group().reduceSum(function (d) {
                return d.amount;
            });

            var amount = ndx.dimension(function (d) {
                return d.amount;
            });
            var amountGroup = amount.group();

            var sumByCustomer = customerDimension.group().reduceSum(function (d) {
                return d.amount;
            });

 			var topCustomers = sumByCustomer.top(10);


            var quarter = ndx.dimension(function (d) {
                var month = d.dd.getMonth();
                if (month <= 2)
                    return "Q1";
                else if (month > 3 && month <= 5)
                    return "Q2";
                else if (month > 5 && month <= 8)
                    return "Q3";
                else
                    return "Q4";
            });
            var quarterGroup = quarter.group().reduceSum(function (d) {
                return d.amount;
            });



            quarterChartPayment
                    .width(120)
                     .height(quarterGroupLength * 30 + 20)
                    .radius(60)
                    .innerRadius(30)
                    .dimension(quarter)
                    .colors(d3.scale.category10())
                    .group(quarterGroup);

              var monthDimension = ndx.dimension(function (d) {
                var month = d.dd.getMonth();
                 switch (month) {
                 case 0:
                        return "A.Jan";
                    case 1:
                        return "B.Feb";
                    case 2:
                        return "C.Mar";
                    case 3:
                        return "D.Apr";
                    case 4:
                        return "E.May";
                    case 5:
                        return "F.Jun";
                    case 6:
                        return "G.Jul";
                    case 7:
                        return "H.Aug";
                    case 8:
                        return "I.Sep";
                    case 9:
                        return "J.Oct";
                    case 10:
                        return "K.Nov";
                    case 11:
                        return "L.Dec";
                        }
            });


		var monthGroup = monthDimension.group().reduceSum(function (d) {
                return d.amount;
            });;
		 var monthGroupLength = monthGroup.all().length;

			monthChartPayment.width(150)
			.height(30 * monthGroupLength + 20)
                    .margins({top: 20, left: 10, right: 10, bottom: 20})
                    .group(monthGroup)
                    .gap(3)
                    .dimension(monthDimension)
                    .colors(d3.scale.category10())
                    .label(function (d) {
                        return d.key.split(".")[1];
                    })
                    .title(function (d) {
                        return d.value;
                    })
                    // .elasticX(true)
                    .xAxis().ticks(4);

            amountChartPayment
            // .width(150)
            //         .height(180)
            //         .margins({top: 20, left: 10, right: 10, bottom: 20})
                    .group(amountGroup)
                    .dimension(amount)
                    .colors(d3.scale.category20b())
                    .label(function (d) {
                        return d.key.split(".")[1];
                    })
                    .title(function (d) {
                        return d.value;
                    })
                    // .elasticX(true)
                    .xAxis().ticks(4);


		var customerGroup = customerDimension.group();
		var customerGroupLength = customerGroup.all().length;
			customerChartPayment.width(150)
			    .height(41 * customerGroupLength)
                    .margins({top: 20, left: 10, right: 10, bottom: 20})
                    .group(sumByCustomer)
                    .dimension(customerDimension)
                    .colors(d3.scale.category20b())
                    .label(function (d) {
                        return d.key;
                    })
                    .title(function (d) {
                        return d.value;
                    })
                    .renderlet(function(chart){
                      chart.selectAll("g.x text")
                        .attr('transform', "rotate(-65)");
                    })
					.ordering(function(d){return - d.value;})
                    // .elasticX(true)
                    .xAxis().ticks(4);

             var accountDimension = ndx.dimension(function (d) {
                return d.method;
            });

             var accountGroup = accountDimension.group().reduceSum(function (d) {
                return d.amount;
            });


         var accountGroupLength = accountGroup.all().length;
            accountChartPayment.width(200)
                     .height(30 * accountGroupLength + 30)
                    .margins({top: 20, left: 10, right: 10, bottom: 20})
                    .group(accountGroup)
                    .dimension(accountDimension)
                    .colors(d3.scale.category20b())
                    .label(function (d) {
                        return d.key;
                    })
                    .ordering(function(d){return - d.value;})
                    .title(function (d) {
                        return d.value;
                    })
                    // .elasticX(true)
                    .xAxis().ticks(4);

            var dayOfWeek = ndx.dimension(function (d) {
                var day = d.dd.getDay();
                switch (day) {
                    case 0:
                        return "0.Sun";
                    case 1:
                        return "1.Mon";
                    case 2:
                        return "2.Tue";
                    case 3:
                        return "3.Wed";
                    case 4:
                        return "4.Thu";
                    case 5:
                        return "5.Fri";
                    case 6:
                        return "6.Sat";
                }
            });
            var dayOfWeekGroup = dayOfWeek.group();



            yearlyChartPayment.width(150)
                    .margins({top: 20, left: 10, right: 10, bottom: 20})
                    .dimension(yearlyDimension)
                    .group(yearlySum)
                     .height(36*yearlySumLength + 20)
                    .colors(d3.scale.category10())
                    .label(function (d) {
                        return d.key;
                    })
                    .title(function (d) {
                        return d.value;
                    })
                    // .elasticX(true)
                    .xAxis().ticks(4);


            moveChartPayment.width(700)
                    .height(300)
                    .transitionDuration(100)
                    .margins({top: 30, right: 50, bottom: 25, left: 40})
                    .dimension(dateDimension)
                    .mouseZoomable(true)
                    .x(d3.time.scale().domain([startDate, endDate]))
                    .round(d3.time.month.round)
                    .xUnits(d3.time.months)
                    .elasticY(true)
                    .renderHorizontalGridLines(true)
                   // .legend(dc.legend().x(800).y(10).itemHeight(13).gap(5))
                    .brushOn(false)
                    .rangeChart(volumeChartPayment)
                    .compose([
                        dc.lineChart(moveChartPayment)
                                .group(amountByDateGroup, "Monthly Sales")
                                .dimension(dateDimension)
                               .valueAccessor(function (d) {
                                    return d.value;
                                })
                                 .renderArea(true)
//                                 .stack(amountByDateGroup, "Monthly Index Move", function (d) {
//                                     return d.value;
//                                 })
                                .title(function (d) {
                                    var value = d.data.value.avg ? d.data.value.avg : d.data.value;
                                    if (isNaN(value)) value = 0;
                                    return dateFormat(d.data.key) + "\n" + numberFormat(value);
                                })
                    ])
                    .xAxis();

            volumeChartPayment.width(700)
                    .height(40)
                    .margins({top: 0, right: 50, bottom: 20, left: 40})
                    .dimension(dateDimension)
                    .group(amountByDateGroup)
                    .centerBar(true)
                    .gap(1)
                    .x(d3.time.scale().domain([startDate, endDate]))
                    .round(d3.time.month.round)
                    .xUnits(d3.time.months)
                    ;


            customerDataCountPayment
                    .dimension(ndx)
                    .group(all);

            customerDataTablePayment
                    .dimension(dateDimension)
                    .group(function (d) {
                        var format = d3.format("02d");
                        return format((d.dd.getMonth() + 1)) + "/"  + d.dd.getFullYear() ;
                    })
                    .size(500)
                    .columns([
                        //function (d) {return d.number;},
                        function (d) {return d.date;},
                        function (d) {return d.amount;},
                        function (d) {return d.method;},
                        function (d) {return d.customer;}
                        // ,function (d) {return d.days;}
                    ])
                    .sortBy(function (d) {
                        return d.number;
                    })
                    .order(d3.ascending)
                    .renderlet(function (table) {
                        table.selectAll(".dc-table-group").classed("info", true);
                    });

            dc.renderAll();

        }
);




d3.csv("checks.json", function (data) {

            /* since its a csv file we need to format the data a bit */
            var dateFormat = d3.time.format("%Y-%m-%d/");
            var numberFormat = d3.format(".2f");

            data.forEach(function (e) {
                e.dd = dateFormat.parse(e.txnDate);
                e.month = d3.time.month(e.dd); // pre-calculate month for better performance
            });

            var ndx = crossfilter(data);
            var all = ndx.groupAll();

            var customerDimension = ndx.dimension(function (d) {
                return d.nameId;
            });


            var yearlyDimension = ndx.dimension(function (d) {
   						return d.dd.getFullYear();
               });

            var yearlySum = yearlyDimension.group().reduceSum(function (d) {
                return d.amount;
            });

            var yearlySumLength = yearlySum.all().length;

            var dateDimension = ndx.dimension(function (d) {
                return d.dd;
            });

             var monthDimension = ndx.dimension(function (d) {
                return d.dd.getMonth();
            });

            var amountByMonthGroup = monthDimension.group().reduceSum(function (d) {
                return d.amount;
            });

             var amountByDateGroup = dateDimension.group().reduceSum(function (d) {
                return d.amount;
            });

            var amount = ndx.dimension(function (d) {
                return d.amount;
            });
            var amountGroup = amount.group();

            var sumByCustomer = customerDimension.group().reduceSum(function (d) {
                return d.amount;
            });

              var accountDimension = ndx.dimension(function (d) {
                return d.accountLineDetails.description;
            });

             var accountGroup = accountDimension.group().reduceSum(function (d) {
                return d.amount;
            });

         var accountGroupLength = accountGroup.all().length;

            checks_accountChart.width(200)
                     .height(30 * accountGroupLength + 30)
                    .margins({top: 20, left: 10, right: 10, bottom: 20})
                    .group(accountGroup)
                    .dimension(accountDimension)
                    .colors(d3.scale.category20b())
                    .label(function (d) {
                        return d.key;
                    })
                    .ordering(function(d){return - d.value;})
                    .title(function (d) {
                        return d.value;
                    })
                    // .elasticX(true)
                    .xAxis().ticks(4);

 			var topCustomers = sumByCustomer.top(10);
           var quarter = ndx.dimension(function (d) {
                var month = d.dd.getMonth();
                if (month <= 2)
                    return "Q1";
                else if (month > 3 && month <= 5)
                    return "Q2";
                else if (month > 5 && month <= 8)
                    return "Q3";
                else
                    return "Q4";
            });
            var quarterGroup = quarter.group().reduceSum(function (d) {
                return d.amount;
            });


              var monthDimension = ndx.dimension(function (d) {
                var month = d.dd.getMonth();
                 switch (month) {
                 case 0:
                        return "A.Jan";
                    case 1:
                        return "B.Feb";
                    case 2:
                        return "C.Mar";
                    case 3:
                        return "D.Apr";
                    case 4:
                        return "E.May";
                    case 5:
                        return "F.Jun";
                    case 6:
                        return "G.Jul";
                    case 7:
                        return "H.Aug";
                    case 8:
                        return "I.Sep";
                    case 9:
                        return "J.Oct";
                    case 10:
                        return "K.Nov";
                    case 11:
                        return "L.Dec";
                        }
            });


		var monthGroup = monthDimension.group().reduceSum(function (d) {
                return d.amount;
            });;
		 var monthGroupLength = monthGroup.all().length;

			checks_monthChart.width(150)
			.height(30 * monthGroupLength +20)
                    .margins({top: 20, left: 10, right: 10, bottom: 20})
                    .group(monthGroup)
                    .dimension(monthDimension)
                    .colors(d3.scale.category10())
                    .label(function (d) {
                        return d.key.split(".")[1];
                    })
                    .title(function (d) {
                        return d.value;
                    })
                    // .elasticX(true)
                    .xAxis().ticks(4);

            checks_amountChart
            // .width(150)
            //         .height(180)
            //         .margins({top: 20, left: 10, right: 10, bottom: 20})
                    .group(amountGroup)
                    .dimension(amount)
                    .colors(d3.scale.category20b())
                    .label(function (d) {
                        return d.key.split(".")[1];
                    })
                    .title(function (d) {
                        return d.value;
                    })
                    // .elasticX(true)
                    .xAxis().ticks(4);


		var customerGroup = customerDimension.group();
		var customerGroupLength = customerGroup.all().length;
			checks_customerChart.width(150)
			    .height(41 * customerGroupLength)
                    .margins({top: 20, left: 10, right: 10, bottom: 20})
                    .group(sumByCustomer)
                    .dimension(customerDimension)
                    .colors(d3.scale.category20b())
                    .label(function (d) {
                        return d.key;
                    })
                    .title(function (d) {
                        return d.value;
                    })
					.ordering(function(d){return - d.value;})
                    // .elasticX(true)
                    .xAxis().ticks(4);

            var dayOfWeek = ndx.dimension(function (d) {
                var day = d.dd.getDay();
                switch (day) {
                    case 0:
                        return "0.Sun";
                    case 1:
                        return "1.Mon";
                    case 2:
                        return "2.Tue";
                    case 3:
                        return "3.Wed";
                    case 4:
                        return "4.Thu";
                    case 5:
                        return "5.Fri";
                    case 6:
                        return "6.Sat";
                }
            });
            var dayOfWeekGroup = dayOfWeek.group();

            var quarter = ndx.dimension(function (d) {
                var month = d.dd.getMonth();
                if (month <= 2)
                    return "Q1";
                else if (month > 3 && month <= 5)
                    return "Q2";
                else if (month > 5 && month <= 8)
                    return "Q3";
                else
                    return "Q4";
            });
            var quarterGroup = quarter.group().reduceSum(function (d) {
                return d.amount;
            });


            checks_quarterChart
                    .width(120)
                     .height(quarterGroupLength * 30 + 20)
                    .radius(60)
                    .innerRadius(30)
                    .dimension(quarter)
                    .colors(d3.scale.category10())
                    .group(quarterGroup);

            checks_yearlyChart.width(150)
                    .margins({top: 20, left: 10, right: 10, bottom: 20})
                    .dimension(yearlyDimension)
                    .group(yearlySum)
                     .height(36*yearlySumLength + 20)
                    .colors(d3.scale.category10())
                    .label(function (d) {
                        return d.key;
                    })
                    .title(function (d) {
                        return d.value;
                    })
                    // .elasticX(true)
                    .xAxis().ticks(4);



            checks_moveChart.width(700)
                    .height(300)
                    .transitionDuration(100)
                    .margins({top: 30, right: 50, bottom: 25, left: 40})
                    .dimension(dateDimension)
                    .mouseZoomable(true)
                    .x(d3.time.scale().domain([startDate, endDate]))
                    .round(d3.time.month.round)
                    .xUnits(d3.time.months)
                    .elasticY(true)
                    .renderHorizontalGridLines(true)
                   // .legend(dc.legend().x(800).y(10).itemHeight(13).gap(5))
                    .brushOn(false)
                    .rangeChart(checks_volumeChart)
                    .compose([
                        dc.lineChart(checks_moveChart)
                                .group(amountByDateGroup, "Monthly Sales")
                                .dimension(dateDimension)
                               .valueAccessor(function (d) {
                                    return d.value;
                                })
                                 .renderArea(true)
//                                 .stack(amountByDateGroup, "Monthly Index Move", function (d) {
//                                     return d.value;
//                                 })
                                .title(function (d) {
                                    var value = d.data.value.avg ? d.data.value.avg : d.data.value;
                                    if (isNaN(value)) value = 0;
                                    return dateFormat(d.data.key) + "\n" + numberFormat(value);
                                })
                    ])
                    .xAxis();

            checks_volumeChart.width(700)
                    .height(40)
                    .margins({top: 0, right: 50, bottom: 20, left: 40})
                    .dimension(dateDimension)
                    .group(amountByDateGroup)
                    .centerBar(true)
                    .gap(1)
                    .x(d3.time.scale().domain([startDate, endDate]))
                    .round(d3.time.month.round)
                    .xUnits(d3.time.months);


            checks_customerDataCount
                    .dimension(ndx)
                    .group(all);

            checks_customerDataTable
                    .dimension(dateDimension)
                    .group(function (d) {
                        var format = d3.format("02d");
                        return format((d.dd.getMonth() + 1)) + "/"  + d.dd.getFullYear() ;
                    })
                    .size(500)
                    .columns([
                        function (d) {return d.date;},
                        function (d) {return d.amount;},
                        function (d) {return d.vendor;},
                        function (d) {return d.account;}
                    ])
                    .sortBy(function (d) {
                        return d.amount;
                    })
                    .order(d3.descending)
                    .renderlet(function (table) {
                        table.selectAll(".dc-table-group").classed("info", true);
                    });

            dc.renderAll();
        }
);

// Determine the current version of dc with `dc.version`
d3.selectAll("#version").text(dc.version);
