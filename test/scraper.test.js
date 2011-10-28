var log = require('logging').from(__filename);

var Jobvite = require('../lib/jobvite'),
    Reports = Jobvite.Reports,
    Request = require('request');

var USER_AGENT = 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C)';

var settings = {
	uri: 'https://hire.jobvite.com/Login/Login.aspx?l=1',
	//uri: 'https://report.jobvite.com/Reports/CustomReport2.aspx?cr=6jI9VfwP',
    //uri: 'https://report.jobvite.com/Reports/CustomReport2.aspx?cr=6jI9VfwP&login=1&se=4thvrfbqpht1tmidya0bjy2b&sr=35&rt=https://hire.jobvite.com',
	headers: {
		'User-Agent': 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C)',
        'Cookie': 'ASP.NET_SessionId=4thvrfbqpht1tmidya0bjy2b' +
                'http-cookie-8hr=R2448853460; ' +
                'uidc=sZ9oZfwf; ' +
                'webServer=IADJBVTWEB01P; ' +
                'rememberme=true; ' +
                'rememberstarttime=12/7/2010 2:18:02 PM; ' +
                'JobviteAuth=F9F80251B56C582466A73B1545DBEB43DDADB3D60362E1AE6D07B9A78043B37125C61C431FA28738FCFC68003D5BEEEEF9C25F4A9D61516D84CF51C2734242C810F110CEED2B3F2CB86E1B6A2C2E7E3FB502EB6C44532AB2821709C7DA44DD195636F69C9FD874D2818158CE1FD5DD7ADDAD07D2B2C629DD5ACFCA9B1973AEE8A445C1BE; ' +
                '_mkto_trk=id:703-ISJ-362&token:_mch-jobvite.com-1291759916218-72563; ' +
                'lithiumSSO:jobvite=vSTkwfWUbp73WTdO_7jOqK6N8mBILP0g-_YvFDw9hYfHwrYvOKcTJHhx0_HWyAqutOGNqh-dhtSral1RscC0zt9Rq3G908LKNX2T-c-gxm998VRTE2C3A8NjVih8xpCPbnqSHA_mTQpBATh-l3w1AxBBEymT2RWx_l3h0S87S8Xaiq6D6HtYueokaBepz5KaQx02b05TL8WRK-qMVbf9fztED74r1Cff1LfSFBgnHQrQu6eh7lVjtrINbJyRJ5F_9ECh_UI3OSNFhK950kYzP4WU-gMloiJk3vwXm-SiOIU1HNTfUmwLrlY_3W9rW94yeBtDS4ITAeE5-dFRMt3Z5rv_On4vcUGVii8sAQDXztC-teNq3JVmNGLBAeBRh49FVIO6Oci3Yr1JL-gTviPwG0WL'
	}
};



 settings = {
	uri: 'https://hire.jobvite.com/Login/Login.aspx?l=1',
    method: 'POST',
    body: 'PageData=&__EVENTTARGET=LoginButton&__EVENTARGUMENT=&__VIEWSTATE=%2FwEPDwUKLTU4ODA5Mjg0OWQYAQUeX19Db250cm9sc1JlcXVpcmVQb3N0QmFja0tleV9fFgIFCUF1dG9Mb2dpbgUHU3VibWl0MQ%3D%3D&__EVENTVALIDATION=%2FwEWAgKuvoTcBwL26uW2Ag%3D%3D&UserName=dylan.greene@opower.com&Password=Jobvite%21&AutoLogin=on&recaptcha_response_field=',
	headers: {
		'User-Agent': 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C)',
        'Cookie': 'ASP.NET_SessionId=4thvrfbqpht1tmidya0bjy2b' +
                'http-cookie-8hr=R2448853460; ' +
                'uidc=sZ9oZfwf; ' +
                'webServer=IADJBVTWEB01P; ' +
                'rememberme=true; ' +
                'rememberstarttime=12/7/2010 2:18:02 PM; ' +
                'JobviteAuth=F9F80251B56C582466A73B1545DBEB43DDADB3D60362E1AE6D07B9A78043B37125C61C431FA28738FCFC68003D5BEEEEF9C25F4A9D61516D84CF51C2734242C810F110CEED2B3F2CB86E1B6A2C2E7E3FB502EB6C44532AB2821709C7DA44DD195636F69C9FD874D2818158CE1FD5DD7ADDAD07D2B2C629DD5ACFCA9B1973AEE8A445C1BE; ' +
                '_mkto_trk=id:703-ISJ-362&token:_mch-jobvite.com-1291759916218-72563; ' +
                'lithiumSSO:jobvite=vSTkwfWUbp73WTdO_7jOqK6N8mBILP0g-_YvFDw9hYfHwrYvOKcTJHhx0_HWyAqutOGNqh-dhtSral1RscC0zt9Rq3G908LKNX2T-c-gxm998VRTE2C3A8NjVih8xpCPbnqSHA_mTQpBATh-l3w1AxBBEymT2RWx_l3h0S87S8Xaiq6D6HtYueokaBepz5KaQx02b05TL8WRK-qMVbf9fztED74r1Cff1LfSFBgnHQrQu6eh7lVjtrINbJyRJ5F_9ECh_UI3OSNFhK950kYzP4WU-gMloiJk3vwXm-SiOIU1HNTfUmwLrlY_3W9rW94yeBtDS4ITAeE5-dFRMt3Z5rv_On4vcUGVii8sAQDXztC-teNq3JVmNGLBAeBRh49FVIO6Oci3Yr1JL-gTviPwG0WL'
	}
};

    function getViewstate(body) {
        // <input type="hidden" name="__VIEWSTATE" id="__VIEWSTATE" value="/wEPDwUKLTU4ODA5Mjg0OWQYAQUeX19Db250cm9sc1JlcXVpcmVQb3N0QmFja0tleV9fFgIFCUF1dG9Mb2dpbgUHU3VibWl0MQ==" />
        return body.match(/__VIEWSTATE" value="([^"]*)"/)[1];
    }
    function getEventValidation(body) {
        // __EVENTVALIDATION" value="/wEWAgKuvoTcBwL26uW2Ag==" />
        return body.match(/__EVENTVALIDATION" value="([^"]*)"/)[1];
    }

    var session_cookies;

    function encodeCookies(cookies) {

        var cookieArray = cookies.concat(session_cookies).map(function(cookie){
                return cookie.split(';')[0];
        });

        return cookieArray.join(';')
    }

    function getTitle(data) {
        return data.length < 1000 ? 'no title' : data.match('<title[^>]*>([^<]*)<\/title>')[1];

    }

    function getLogin(){
        var options = {
            uri: 'https://hire.jobvite.com/Login/Login.aspx',
            headers: {
                'User-Agent': USER_AGENT,
                'set-cookie': []
            }
        };
        log('get login');


        Request(options, function(err, response, body) {

            //log(response); return;

            
            log('got login');
            login(err, response, body);
        });
    }

    function login(err, response, body) {
        if (err) {
            log(err);
            return false;
        }

        session_cookies = response.headers['set-cookie'];
        var viewstate = getViewstate(body);
        var eventValidation = getEventValidation(body);

        var options = {
            followRedirect: false,
            uri: 'https://hire.jobvite.com/Login/Login.aspx?ReturnUrl=%2fReports%2fCustomReport2.aspx%3fcr%3d6jI9VfwP%3fl%3d1',
            method: 'POST',
            body: 'PageData=' +
                    '&__EVENTTARGET=LoginButton' +
                    '&__EVENTARGUMENT=' +
                    '&__VIEWSTATE=' + encodeURIComponent(viewstate) +
                    '&__EVENTVALIDATION=' + encodeURIComponent(eventValidation) +
                    '&UserName=dylan.greene@opower.com' +
                    '&Password=Jobvite%21' +
                    '&AutoLogin=on' +
                    '&recaptcha_response_field=',
            headers: {
                'User-Agent': USER_AGENT,
                'Cookie': encodeCookies(session_cookies),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        log('get login');

        Request.post(options, function(err, response, body) {
            log('---------------------------');
            log('title', getTitle(body));

            getReport(err, response, body)

        });


        return true;
    }

    function getReport(err, response, body) {
        if (err) {
            log(err);
            return false;
        }


        var cookies = response.headers['set-cookie'];
        //var viewstate = getViewstate(body);
        //var eventValidation = getEventValidation(body);

        var options = {
            followRedirect: false,
            uri: 'https://report.jobvite.com/Reports/CustomReport2.aspx?cr=6jI9VfwP',
            method: 'POST',
            headers: {
                'User-Agent': USER_AGENT,
                'Cookie': encodeCookies(cookies)
            }
        };

        Request(options, function(err, response, body) {
            log('======================');
            log('title', getTitle(body));
            log('Home Free!');
            //console.log(body);
            process(body);

        });

        return true;
    }



    function process(data) {
        log('in process');

        if (!data) {
            log('no data');
            return false;
        }

        var title = getTitle(data);

        log('title', title);
        if (title != 'Jobvite - Report') {
            log('report did not load');
            return false;
        }

        data = data.match('<div id="ReportGriddiv">\s*<table[^>]*>(.*)<\/table>');
        var table = data[0];
        log('table length', table.length);

        table = table.replace(/<\/t[dr]>/g, '');
        var rows = table.split(/<tr[^>]*>/);
        var start = 4;
        var total = rows.length - start;
        log('rows', total);

        total = 4;

        for (var n=start; n < start + total; n++) {
            var cols = rows[n].split(/<td[^>]*>/);
            log(n, cols);
        }
        return true;
    }

    function cachedCopy() {
        var Cache = require('../lib/util/cache');
        Cache.load('test/data/scrape.body', process, true);
    }

    function load(){
        var success;
        log('load ready');
        Request(settings, function (err, response, body) {
            log('request complete', response.statusCode);

            if (err) {
                log('error happened', err);
            }

            if (response.statusCode == 200) {
                log('body length', body.length);
                success = process(body);
            }


            !success && log(response, body);


            log('process complete');

        });
    }

//load();

getLogin();

