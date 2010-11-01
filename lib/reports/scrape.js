

var log = require('logging').from(__filename),
    soda = require('soda'),
    extend = require('../util/extend'),
    browser;


var CUSTOM_REPORT_URL = '/Login/Login.aspx?ReturnUrl=%2fReports%2fCustomReport2.aspx%3fcr%3d';

var options = {
    report_id: false, //'xxxx',
    selenium_host: 'localhost',
    selenium_port: 4444,
    selenium_url: 'https://hire.jobvite.com/',
    selenium_browser: 'firefox',
    jobvite_username: false, //user@domain.com',
    jobvite_password: false, //'password',
    helper_functions: {
        /* examples
            name: "function(s){ var a = s ? s.split('=') : false;  return a && a.length ? a[1] : ''; }",
            people: "function($td){ var str = $td.html() || '';  return str.split('<br>') }; "
        */
    },
    data: {
        /* examples:
        id: "getId($tr.find('td:nth(1) a').attr('href'))",
        date: "$tr.find('td:nth(0)').text()",
        lastName: "$tr.find('td:nth(2)').text()",
        firstName: "$tr.find('td:nth(3)').text()",
        status: "$tr.find('td:nth(4)').text()",
        jobId: "getId($tr.find('td:nth(5) a').attr('href'))",
        department: "$tr.find('td:nth(6)').text()",
        recruiters: "people($tr.find('td:nth(7)'))"
        */
   }
};

function config(options_) {
    extend(options, options_);
    return this;
}

function data_getter() {
    return "(function($){" +
            (options.helper_functions ?
            '\nvar ' +
                options.helper_functions.map(function(func, name) {
                    return  name + " = " + func;
                }).join(',\n ') +
                ';\n' : '') +
            "return JSON.stringify($.makeArray($('#ReportGriddiv table tbody tr').map(" +
            "function(x, tr){ " +
            "   var $tr = $(tr); " +
            "   return " +
            "{ " +
                options.data.map(function(func, name) {
                    return name + ': ' + func;
                }).join(',\n ') +
            "} })));})(this.browserbot.getCurrentWindow().jQuery)";
}


function init_browser() {
    if (browser && browser.sessionId) {
        log('Re-using browser');
    } else {
        log('Creating new browser');
        
        browser = soda.createClient({
                    host: options.selenium_host,
                    port: options.selenium_port,
                    url: options.selenium_url,
                    browser: options.selenium_browser,
                    timeout_in_second: 60000 });

        browser.on('command', function(cmd, args){
            log(' \x1b[33m%s\x1b[0m: %s', cmd, args.join(', '));
        });
    }
}

function niceTime(ms) {
    var sec = ms/1000,
        min = Math.floor(sec/60);
    sec = Math.round(sec % 60);
    return (min > 0 ? min + ' min ' : '') + sec + ' seconds';
}

function getData(callback) {

    init_browser();

    var startTime = +new Date();
    browser
        .chain
        .session()
        .open(CUSTOM_REPORT_URL + options.report_id)
        .type('UserName', options.jobvite_username)
        .type('Password', options.jobvite_password)
        .click('LoginButton')
        .waitForPageToLoad(200000)
        .getTitle(function(title){
            log('Page is ready', title);
            if(title != 'Jobvite - Report') {
                log('POSSIBLE ERROR', 'page title', title);
            }
        })
        .getEval(data_getter(), function(result) {
            log('data ready');
            setTimeout(function() {
                callback(JSON.parse(result), 20);
            })
        })
        .testComplete()
        .end(function(err){
            var time = niceTime(new Date() - startTime);
            if (err) {
                log('ERROR', 'loading page', time, err);
                log('Trying again in 30 seconds');
                setTimeout(function(){
                    log('Trying again!');
                    getData(callback);
                }, 60 * 1000);
                callback();
            } else {
                log('Success', 'finished loading', time);
            }
        });
}

module.exports.getData = getData;
module.exports.config = config;