import config from './config.ts';
function goodBrowser() {
    return ['Content-Security-Policy'];
}
const handlersByBrowserName = {
    'Android Browser'(browser) {
        const osVersionName = browser.getOS().versionName;
        if (osVersionName && parseFloat(osVersionName) < 4.4) {
            return [];
        }
        return ['Content-Security-Policy'];
    },
    Chrome(browser) {
        const browserVersion = parseFloat(browser.getBrowserVersion());
        if (browserVersion >= 14 && browserVersion < 25) {
            return ['X-WebKit-CSP'];
        }
        else if (browserVersion >= 25) {
            return ['Content-Security-Policy'];
        }
        else {
            return [];
        }
    },
    'Chrome Mobile'(browser, options) {
        if (browser.getOSName() === 'iOS') {
            return ['Content-Security-Policy'];
        }
        else {
            return handlersByBrowserName['Android Browser'](browser, options);
        }
    },
    Firefox(browser) {
        const osName = browser.getOSName();
        if (osName === 'iOS') {
            return ['Content-Security-Policy'];
        }
        const browserVersion = parseFloat(browser.getBrowserVersion());
        if (osName === 'Android') {
            if (browserVersion >= 25) {
                return ['Content-Security-Policy'];
            }
            else {
                return ['X-Content-Security-Policy'];
            }
        }
        else if (browser.getPlatformType(true) === 'mobile') {
            if (browserVersion >= 32) {
                return ['Content-Security-Policy'];
            }
            else {
                return ['X-Content-Security-Policy'];
            }
        }
        else if (browserVersion >= 23) {
            return ['Content-Security-Policy'];
        }
        else if (browserVersion >= 4 && browserVersion < 23) {
            return ['X-Content-Security-Policy'];
        }
        else {
            return [];
        }
    },
    'Internet Explorer'(browser) {
        const browserVersion = parseFloat(browser.getBrowserVersion());
        const header = browserVersion < 12 ? 'X-Content-Security-Policy' : 'Content-Security-Policy';
        return [header];
    },
    'Microsoft Edge': goodBrowser,
    'Microsoft Edge Mobile': goodBrowser,
    Opera(browser) {
        const browserVersion = parseFloat(browser.getBrowserVersion());
        if (browserVersion >= 15) {
            return ['Content-Security-Policy'];
        }
        else {
            return [];
        }
    },
    Safari(browser) {
        const browserVersion = parseFloat(browser.getBrowserVersion());
        if (browserVersion >= 7) {
            return ['Content-Security-Policy'];
        }
        else if (browserVersion >= 6) {
            return ['X-WebKit-CSP'];
        }
        else {
            return [];
        }
    },
};
export default function getHeaderKeysForBrowser(browser, options) {
    if (!browser) {
        return config.allHeaders;
    }
    if (options.disableAndroid && browser.getOSName() === 'Android') {
        return [];
    }
    const browserName = browser.getBrowserName();
    if (Object.prototype.hasOwnProperty.call(handlersByBrowserName, browserName)) {
        return handlersByBrowserName[browserName](browser, options);
    }
    else {
        return config.allHeaders;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LWhlYWRlci1rZXlzLWZvci1icm93c2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2V0LWhlYWRlci1rZXlzLWZvci1icm93c2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sTUFBTSxNQUFNLGFBQWEsQ0FBQztBQUlqQyxTQUFTLFdBQVc7SUFDbEIsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDckMsQ0FBQztBQU1ELE1BQU0scUJBQXFCLEdBQTBCO0lBQ25ELGlCQUFpQixDQUFFLE9BQU87UUFDeEIsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDLFdBQVcsQ0FBQztRQUNsRCxJQUFJLGFBQWEsSUFBSSxVQUFVLENBQUMsYUFBYSxDQUFDLEdBQUcsR0FBRyxFQUFFO1lBQ3BELE9BQU8sRUFBRSxDQUFDO1NBQ1g7UUFDRCxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQsTUFBTSxDQUFFLE9BQU87UUFDYixNQUFNLGNBQWMsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQztRQUMvRCxJQUFJLGNBQWMsSUFBSSxFQUFFLElBQUksY0FBYyxHQUFHLEVBQUUsRUFBRTtZQUMvQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDekI7YUFBTSxJQUFJLGNBQWMsSUFBSSxFQUFFLEVBQUU7WUFDL0IsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7U0FDcEM7YUFBTTtZQUNMLE9BQU8sRUFBRSxDQUFDO1NBQ1g7SUFDSCxDQUFDO0lBRUQsZUFBZSxDQUFFLE9BQU8sRUFBRSxPQUFPO1FBQy9CLElBQUksT0FBTyxDQUFDLFNBQVMsRUFBRSxLQUFLLEtBQUssRUFBRTtZQUNqQyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztTQUNwQzthQUFNO1lBQ0wsT0FBTyxxQkFBcUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLE9BQU8sRUFB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