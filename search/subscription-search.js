function subsearch() {
    var reciptsFilter2 = new Array();
    reciptsFilter2[0] = new nlobjSearchFilter('trandate', null, 'after', '1/1/14');
    reciptsFilter2[1] = new nlobjSearchFilter('account', null, 'is', ['296', '405', '406', '410', '411']); // 4220, 4242, 4244, 4246, 4248
    reciptsFilter2[2] = new nlobjSearchFilter('type', null, 'anyof', ['CashSale', 'CashRfnd', 'Check', 'CustInvc', 'Deposit']);
    reciptsFilter2[3] = new nlobjSearchFilter('amount', null, 'notequalto', '0');

    var reciptsColumns2 = new Array();
    reciptsColumns2[0] = new nlobjSearchColumn('internalid').setSort();
    reciptsColumns2[1] = new nlobjSearchColumn('trandate');
    reciptsColumns2[2] = new nlobjSearchColumn('type');
    reciptsColumns2[3] = new nlobjSearchColumn('account');
    reciptsColumns2[4] = new nlobjSearchColumn('amount');
    reciptsColumns2[5] = new nlobjSearchColumn('custitem_subscription_months', 'item');


    var reciptsResults2 = nlapiSearchRecord('transaction', null, reciptsFilter2, reciptsColumns2);
    var allResults = new Array();

    allResults = allResults.concat(reciptsResults2);

    // 1000-??
    while (reciptsResults2.length == 1000) {
        var lastId2 = reciptsResults2[999].getValue('internalid');

        reciptsFilter2[3] = new nlobjSearchFilter('internalidNumber', null, 'greaterthan', lastId2);
        // or equal to error pulling invoice 1156389 coming from being at position 999
        var reciptsResults2 = nlapiSearchRecord('transaction', null, reciptsFilter2, reciptsColumns2);

        allResults = allResults.concat(reciptsResults2);
        logx('length check', allResults.length);
    }

    logx('final length', allResults.length);

    var internalidArray = new Array();
    var trandateArray = new Array();
    var typeArray = new Array();
    var accountArray = new Array();
    var amountArray = new Array();
    var submonthArray = new Array();

    for (var x = 0; x < allResults.length; x++) {

        result = allResults[x];

        internalidArray = internalidArray.concat(result.getValue('internalid'));
        trandateArray = trandateArray.concat(result.getValue('trandate'));
        typeArray = typeArray.concat(result.getText('type'));
        accountArray = accountArray.concat(result.getValue('account'));
        amountArray = amountArray.concat(result.getValue('amount'));
        submonthArray = submonthArray.concat(result.getValue('custitem_subscription_months', 'item'));
    }

    var internalidFile = nlapiCreateFile('internalid.txt', 'PLAINTEXT', internalidArray);
    internalidFile.setFolder(337294);
    nlapiSubmitFile(internalidFile);

    var trandateFile = nlapiCreateFile('trandate.txt', 'PLAINTEXT', trandateArray);
    trandateFile.setFolder(337294);
    nlapiSubmitFile(trandateFile);

    var typeFile = nlapiCreateFile('type.txt', 'PLAINTEXT', typeArray);
    typeFile.setFolder(337294);
    nlapiSubmitFile(typeFile);

    var accountFile = nlapiCreateFile('account.txt', 'PLAINTEXT', accountArray);
    accountFile.setFolder(337294);
    nlapiSubmitFile(accountFile);

    var amountFile = nlapiCreateFile('amount.txt', 'PLAINTEXT', amountArray);
    amountFile.setFolder(337294);
    nlapiSubmitFile(amountFile);

    var submonthFile = nlapiCreateFile('submonth.txt', 'PLAINTEXT', submonthArray);
    submonthFile.setFolder(337294);
    nlapiSubmitFile(submonthFile);
    logx('files', 'files written');
}
