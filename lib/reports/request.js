var log = require('logging').from(__filename);

var extend = require('../util/extend'),
    Hacks = require('../util/hacks'),
    Request = require('../util/request');

var USER_AGENT = 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C)';

var session_cookies;

var options = {
    report_id: false,
    jobvite_username: false, //user@domain.com',
    jobvite_password: false, //'password',
    onComplete: false,
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
        return row.length > 1 ? {
            id: getId(row[1]),
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


function getData() {
    if (!options.jobvite_username || !options.jobvite_password || !options.report_id) {
        log('options is missing required fields', options);
        options.onComplete && options.onComplete(false);
    } else {
        getLogin();
    }
}



function getLogin(){
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
        login(err, response, body);
    });
}

function login(err, response, body) {
    if (err) {
        log('error', err);
        options.onComplete && options.onComplete(false);
        return false;
    }

    session_cookies = response.headers['set-cookie'];
    var viewstate = Hacks.getViewstate(body);
    var eventValidation = Hacks.getEventValidation(body);

    var settings = {
        followRedirect: false,
        uri: 'https://hire.jobvite.com/Login/Login.aspx?ReturnUrl=%2fReports%2fCustomReport2.aspx%3fcr%3d' + options.report_id + '%3fl%3d1',
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
        getReport(err, response, body)
    });
    return true;
}

function getReport(err, response, body) {
    if (err) {
        log('error', err);
        options.onComplete && options.onComplete(false);
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
        process(body);

    });

    return true;
}



function process(data) {
    //log('in process');

    if (!data) {
        log('no data');
        options.onComplete && options.onComplete(false);
        return false;
    }
    var title = Hacks.getTitle(data);
    if (title != 'Jobvite - Report') {
        log('report did not load');
        options.onComplete && options.onComplete(false);
        return false;
    }

    data = data.match('<div id="ReportGriddiv">\s*<table[^>]*>(.*)<\/table>');
    var table = data[0];
    log('table length', table.length);

    table = table.replace(/<\/t[dr]>/g, '');
    var rows = table.split(/<tr[^>]*>/);
    var start = 4;
    var total = rows.length - start;
    log('total data rows', total);

    var returnData = [];
    for (var n=start; n < start + total; n++) {
        var cols = rows[n].split(/<td[^>]*>/);
        if (cols.length > 1) {
            cols.shift();

            returnData.push(options.format ? options.format(cols) : cols);
        }
    }

    options.onComplete && options.onComplete(returnData);
    return true;
}


module.exports.config = config;
module.exports.getData = getData;
