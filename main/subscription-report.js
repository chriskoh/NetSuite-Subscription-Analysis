function subscriptions(request, response){	// initial function called as default function in script
	
	if(request.getMethod() == 'GET'){	// as script is run
	
		function1();
	}
	else{								// after submit is pushed
	
		function2();
	}
}

function function1()
{
	
	var form = nlapiCreateForm('Deferred Revenue Subscriptions');
	
	// Variables from user input
	form.addField('date_start', 'date', 'Start Date (First day of the month)').setDefaultValue('1/1/2014');
	form.addField('date_end', 'date', 'Due Date (Last day of the month)').setDefaultValue('1/31/2014');
	
	// 
	var select11 = form.addField('monthamount', 'select', 'Months').setLayoutType('normal','startcol');
	select11.addSelectOption('','');
	select11.addSelectOption('12', '12 Months');
	select11.addSelectOption('24','24 Months');
	
	// Subscription types 
	var select12 = form.addField('accountselect', 'select', 'Type').setLayoutType('normal','startcol');
	select12.addSelectOption('','');
	select12.addSelectOption('WB', 'Whistleblower');
	select12.addSelectOption('one','WorldNetWeekly 1yr');
	select12.addSelectOption('two','WorldNetWeekly 2yr');
	
	form.addSubmitButton('Submit');
	response.writePage(form);
}

function function2()
{
	// import user's data
	var setStartDate  = new Date(request.getParameter('date_start'));	// Import start
	var setEndDate    = new Date(request.getParameter('date_end')); // end
	var setMonths     = Number(request.getParameter('monthamount')); // months
	var setAccounts   = request.getParameter('accountselect'); // account
	
	// set compare accounts based on subscription type
	if(setAccounts == 'WB'){
		
		var setAccount1 = Number(296);
		var setAccount2 = Number(296);
	}else if(setAccounts == 'one'){
		
		var setAccount1 = '405';
		var setAccount2 = '406';
	}else if(setAccounts =='two'){
		
		var setAccount1 = Number(410);
		var setAccount2 = Number(411);
	}
	
	// Set date points for calculations
	var setEndDateForCompare    = nlapiAddDays(setEndDate, 1);
	var setEndDateForSearch     = new Date(request.getParameter('date_start'));
	setEndDateForSearch         = nlapiAddDays(setEndDateForSearch, -1);
	var numberOfMonths          = monthDiff(setStartDate, setEndDateForCompare);
	var xAxisDate               = new Date(request.getParameter('date_start'));
	var yAxisDate               = new Date(request.getParameter('date_start'));
	yAxisDate                   = nlapiAddMonths(yAxisDate, -12);
	var graphStartDate          = new Date(request.getParameter('date_start'));
	var printStartDate          = new Date(request.getParameter('date_start'));
	var printEndDate            = nlapiAddMonths(printStartDate, 1);
	var graphEndDate            = new Date(request.getParameter('date_end'));
	graphEndDate                = nlapiAddMonths(graphEndDate, (setMonths - 1));
	var setStartDateForCompare  = new Date(request.getParameter('date_start'));
		
	// Load data from searches
	var accfile       = nlapiLoadFile(387824);					// load files
	var accountfile   = accfile.getValue();					// change file to a string
	var accountarray  = accountfile.split(",");				// change string to array
	
	var amtfile       = nlapiLoadFile(387825);
	var amountfile    = amtfile.getValue();
	var amountarray   = amountfile.split(",");
	
	var intfile         = nlapiLoadFile(387826);
	var internalidfile  = intfile.getValue();
	var internalidarray = internalidfile.split(",");
	
	var tdtfile         = nlapiLoadFile(387827);
	var trandatefile    = tdtfile.getValue();
	var trandatearray   = trandatefile.split(",");
	
	var typfile   = nlapiLoadFile(387828);
	var typefile  = typfile.getValue();
	var typearray = typefile.split(",");
	
	var subfile   = nlapiLoadFile(387978);
	var subsfile  = subfile.getValue();
	var subsarray = subsfile.split(",");
	
	var checkArray  = new Array();
	var checkArray2 = new Array();
	
	var dupeid = Number(0);
				
	// Begin HTML
	html  = '<html>';
	html += '<head>';
	html += '<script src="https://system.netsuite.com/core/media/media.nl?id=359359&c=811217&h=65afe36a877be122622c&_xt=.js"></script>';
	html += '<link rel="stylesheet" type="text/css" href="https://system.netsuite.com/core/media/media.nl?id=359360&c=811217&h=abac63b2f4466bfbd7ac&_xt=.css">'; 
	html += '</head>';
	html += '<body>';

	// Create table / header row
	html += '<table class="sortable" id="datatable" style="display: inline-block; margin-right:50px">' +
				'<tr>' +
				'<td> </td>' +
				'<td>Subscriptions</td>';
	
	// print column for each month
	for(var x = new Date(graphStartDate); x < new Date(graphEndDate); x = nlapiAddMonths(x, 1)){
		html += '<td>' + x.format("mmm yyyy") + '</td>';
	}
	html += '</tr>';
	
	// temporary variable to hold totals
	var allTotals = new Array();
	var monthyTotals = new Array();
	var monthlyTotalCounter = Number(0);
	
	// get values for months from allResults
	for(var x = new Date(graphStartDate); x < new Date(setEndDateForCompare); x = nlapiAddMonths(x, 1)){
		
		var total = Number(0);
		var endDate = nlapiAddMonths(x, 1);
		endDate = nlapiAddDays(endDate, -1);
		var lastRecord = Number(0);
		
		for(var y = 0; y < amountarray.length; y++){
		
			if(new Date(trandatearray[y]) <= new Date(endDate) && new Date(trandatearray[y]) >= new Date(x) && Number(subsarray[y]) == Number(setMonths)){	// if date is within start and end, and subscription length matches
				
				if(Number(accountarray[y]) == Number(setAccount1) || Number(accountarray[y]) == Number(setAccount2)){   // if the transaction account matches either of the subscription accounts
					
					total = Number(total) + Number(amountarray[y]);
				}
			}
		}
		allTotals.push(total);
	}
		
	// Create dynamic variables
	var w = window;
	for(var y = new Date(graphStartDate); y < new Date(graphEndDate); y = nlapiAddMonths(y, 1)){
		w["array_" + y] = Number(0);
	}
	
	// print data
	var monthCounter = Number(0);
	var totalArray = new Array();
	for(var x = new Date(graphStartDate); x < new Date(setEndDateForCompare); x = nlapiAddMonths(x, 1)){
		
		// print current month and total for month
		html += '<tr>' +
		'<td>' + x.format("mmm yyyy") + '</td>' +
		'<td>' + allTotals[monthCounter].toFixed(2) + '</td>';
		var displayUntil = nlapiAddMonths(x, (setMonths - 1));
		var displayAfter = x;
		
		// print the deferred revenue amount (total / number of subscription months).  
		for(var y = new Date(graphStartDate); y < new Date(graphEndDate); y = nlapiAddMonths(y, 1)){
			if(y <= displayUntil && y >= displayAfter){
				var displayValue = allTotals[monthCounter] / setMonths;
				html += '<td>' + displayValue.toFixed(2) + '</td>';
				var monthNumber = Number(y.getMonth());
				totalArray[monthNumber] += Number(displayValue);
				w["array_" + y] += displayValue;
			}
			else if(y >= displayUntil){
				html += '<td> - </td>';
			}
			else if(y <= displayAfter){
				html += '<td> - </td>';
			}
		}
		html += '</tr>';
		
		monthCounter++;
		monthlyTotalCounter++;
	}
	
	// Print total row
	html += '<tr>' +
	'<td>Totals</td>' +
	'<td> - </td>';
	for(var y = new Date(graphStartDate); y < new Date(graphEndDate); y = nlapiAddMonths(y, 1)){
		var displayNumber = w["array_" + y];
		html += '<td>' + displayNumber.toFixed(2) + '</td>';
	}
	html += '</tr>';
	
	html += '</table>';	
	html +=	'</body>' +
			'</html>';
	
	var form2 = nlapiCreateForm('Deferred Revenue Subscriptions');
	var myInlineHtml = form2.addField('custpage_btn', 'inlinehtml');
	myInlineHtml.setDefaultValue(html);
	
	response.writePage(form2);
	
	logx('end', 'end');
}
