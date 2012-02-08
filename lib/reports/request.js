var log = require('logging').from('Jobvite.' + __filename);

var extend = require('../util/extend'),
    Hacks = require('../util/hacks'),
    Request = require('request');

var USER_AGENT = 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C)';

var session_cookies;

var debug = false;

var options = {
    report_id: false,
    jobvite_username: false, //user@domain.com',
    jobvite_password: false, //'password',
    format: function(row) {
        /*
            0 '12/17/2010'
            1 '<a href="../Hiring/ViewCandidate.aspx?a=pFKkafwD">Dan Finkelstein</a>'
            2 'Homework/Quiz'
            3 'Job Board'
            4 'Service: Craigslist, Url: http://sfbay.craigslist.org/sfc/sof/2098141344.html'
            5 '<a href="../Hiring/ViewJob.aspx?j=olLpVfwa">Senior Performance Engineer</a>'
            6 'Engineering - Engineers'
            7 'Debbie Mayer'
            8 'Jeff Barrett<br>Jeff Kolesky'
        */
        if (!row[1]) {
            debug && log('no id', row);
            return false;
        }
        var id = getId(row[1]);
        return id && row.length > 1 ? {
            id: id,
            date: row[0],
            name: removeHTML(row[1]),
            status: row[2],
            sourceType: row[3],
            source: row[4],
            title: removeHTML(row[5]),
            jobId: getId(row[5]),
            department: row[6],
            recruiters: people(row[7]),
            managers: people(row[8])
        } : false;
   }
};

function getId(str) {
    str = str || '';
    var match = str.match(/\?[^=]*=([^"]*)"/);
    if (!match || match.length < 1) {
        debug && log(log, 'getId match error', str, match);
        return false;
    }
    return match[1];
}

function people(str) {
    str = str || '';
    return str.split('<br>')
}

function removeHTML(data){
    data = data || '';
    return data.replace(/<([^>]*)>/g, '');
}

function config(options_) {
    extend(options, options_);
    return this;
}


function getData(callback) {
    if (!options.jobvite_username || !options.jobvite_password || !options.report_id) {
        log('options is missing required fields', options);
        callback && callback(false);
    } else {
        getLogin(callback);
    }
}



function getLogin(callback){
    var settings = {
        uri: 'https://hire.jobvite.com/Login/Login.aspx',
        headers: {
            'User-Agent': USER_AGENT,
            'set-cookie': []
        }
    };
    //log('get login');

    Request(settings, function(err, response, body) {
        //log('got login');
        login(err, response, body, callback);
    });
}

function login(err, response, body, callback) {
    if (err) {
        log('error', err);
        callback && callback(false);
        return false;
    }

    session_cookies = response.headers['set-cookie'];
    var viewstate = Hacks.getViewstate(body);
    var eventValidation = Hacks.getEventValidation(body);

    if (!viewstate) {
        log('Jobvite issue...', 'No viewstate...', Hacks.getTitle(body));
        callback(false);
    }

    if (!eventValidation) {
        //log('Jobvite issue...', 'No eventValidation...', Hacks.getTitle(body));
        //callback(false);
    }


    var settings = {
        followRedirect: false,
        uri: 'https://hire.jobvite.com/Login/Login.aspx?ReturnUrl=%2fReports%2fCustomReport2.aspx%3fcr%3d' + options.report_id + '%3fl%3d1%3flogin%3d1',
        method: 'POST',
        body: 'PageData=' +
                '&__EVENTTARGET=LoginButton' +
                '&__EVENTARGUMENT=' +
                '&__VIEWSTATE=' + encodeURIComponent(viewstate) +
                '&__EVENTVALIDATION=' + encodeURIComponent(eventValidation) +
                '&UserName=' + encodeURIComponent(options.jobvite_username) +
                '&Password=' + encodeURIComponent(options.jobvite_password) +
                '&AutoLogin=on' +
                '&recaptcha_response_field=',
        headers: {
            'User-Agent': USER_AGENT,
            'Cookie': Hacks.encodeCookies(session_cookies),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    //log('get login');

    Request.post(settings, function(err, response, body) {
        //log('---------------------------');
        //log('title', Hacks.getTitle(body));
        getReport(err, response, body, callback)
    });
    return true;
}

function getReport(err, response, body, callback) {
    if (err) {
        log('error', err);
        callback && callback(false);
        return false;
    }

    var cookies = response.headers['set-cookie'];
    var settings = {
        followRedirect: false,
        uri: 'https://report.jobvite.com/Reports/CustomReport2.aspx?cr=' + options.report_id,
        method: 'POST',
        headers: {
            'User-Agent': USER_AGENT,
            'Cookie': Hacks.encodeCookies(session_cookies, cookies)
        }
    };

    Request(settings, function(err, response, body) {
        //log('======================');
        //log('title', Hacks.getTitle(body));
        //log('Home Free!');
        generateReport(err, response, body, callback);

    });

    return true;
}


function generateReport(err, response, body, callback) {
    if (err) {
        log('error', err);
        callback && callback(false);
        return false;
    }

    var cookies = response.headers['set-cookie'];
    var viewstate = Hacks.getViewstate(body);

    if (!viewstate) {
        log('Jobvite issue... No viewstate...', Hacks.getTitle(body));
        log(body);
        return callback(false);
    }

    var settings = {
        followRedirect: false,
        uri: 'https://report.jobvite.com/Reports/CustomReport2.aspx?cr=' + options.report_id,
        method: 'POST',
        body: 'PageData=' +
                '&__VIEWSTATE=' + encodeURIComponent(viewstate) +
                '&__EVENTTARGET=btnRefresh' +
                '&__EVENTARGUMENT=' + encodeURIComponent('<Filters><NormalFilters></NormalFilters><DateRangeFilters></DateRangeFilters></Filters>') +
                '&pageState=0' +
                '&hdnShouldEmail=' +
                '&hdnFilterCount=' +
                '&AddDateToTitle=' +
                '&ReportDescription=' + encodeURIComponent('Using this for data scraping.') +
                '&ReportCategory=8192' +
                '&IsPrivateReport=checked' +
                '&IncludeAuthorInfoInExcel=' +
                '&ShowFiltersInExcel=',
        headers: {
            'Referer': 'https://report.jobvite.com/Reports/CustomReport2.aspx?cr=6jI9VfwP',
            'User-Agent': USER_AGENT,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': Hacks.encodeCookies(session_cookies, cookies)
        }
    };

    Request(settings, function(err, response, body) {
        //log('======================');
        //log('title', Hacks.getTitle(body));
        //log('Home Free!');
        //__EVENTARGUMENT=%3CFilters%3E%3CNormalFilters%3E%3C%2FNormalFilters%3E%3CDateRangeFilters%3E%3C%2FDateRangeFilters%3E%3C%2FFilters%3E&pageState
        //__EVENTARGUMENT=%3CFilters%3E%3CNormalFilters%3E%3C%2FNormalFilters%3E%3CDateRangeFilters%3E%3C%2FDateRangeFilters%3E%3C%2FFilters%3E
        process(body, callback);

    });

    return true;
}


function process(data, callback) {
    //log('in process');


    if (!data) {
        log('no data');
        callback && callback(false);
        return false;
    }
    var title = Hacks.getTitle(data);
    if (title != 'Jobvite - Report') {
        log('report did not load');
        callback && callback(false);
        return false;
    }

    debug && log('data length before', data.length);

    var tableStart = data.indexOf('<div id="ReportGriddiv">'),
        tableEnd = data.indexOf('</tbody>', tableStart + 10000);

    if (tableStart < 0) {
        log('START NOT FOUND');
    }

    debug && log('table start', tableStart, 'table end', tableEnd);

    var table = data.substr(tableStart, tableEnd-tableStart); //= data[1];
    debug && log('table length', table.length);

    table = table.replace(/<\/t[dr]>/g, '');
    var rows = table.split(/<tr[^>]*>/);
    var start = 4;
    var total = rows.length - start;
    debug && log('total data rows', total);

    if (total < 200) {
        log('POSSIBLE DATA PROBLEM', 'data rows', total);
    }

    var returnData = [];
    var n, t = start + total;
    for (n=start; n < t; n++) {
        var cols = rows[n].split(/<td[^>]*>/);
        if (cols.length > 1) {
            cols.shift();
            returnData.push(options.format ? options.format(cols) : cols);
        }
    }

    log('done looping through data');

    log(callback ? 'calling back now...' : 'no callback!?');

    callback && callback(returnData);
    return true;
}

module.exports.config = config;
module.exports.getData = getData;
