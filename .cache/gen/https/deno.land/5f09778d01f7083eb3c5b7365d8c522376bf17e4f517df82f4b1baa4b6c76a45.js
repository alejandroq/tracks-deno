function transformDirectivesForPreCsp1Firefox(directives, basePolicy) {
    const result = Object.assign({}, basePolicy);
    const { connectSrc } = directives;
    if (connectSrc) {
        result.xhrSrc = connectSrc;
    }
    Object.keys(directives).forEach((key) => {
        if (key !== 'connectSrc') {
            result[key] = directives[key];
        }
    });
    const { scriptSrc } = directives;
    if (scriptSrc) {
        const optionsValues = [];
        if (scriptSrc.indexOf("'unsafe-inline'") !== -1) {
            optionsValues.push('inline-script');
        }
        if (scriptSrc.indexOf("'unsafe-eval'") !== -1) {
            optionsValues.push('eval-script');
        }
        if (optionsValues.length !== 0) {
            result.options = optionsValues;
        }
    }
    return result;
}
export default function transformDirectivesForBrowser(browser, directives) {
    if (!browser || browser.getBrowserName() !== 'Firefox') {
        return directives;
    }
    const osName = browser.getOSName();
    if (osName === 'iOS') {
        return directives;
    }
    const browserVersion = parseFloat(browser.getBrowserVersion());
    if (osName === 'Android' && browserVersion < 25 ||
        browser.getPlatformType(true) === 'mobile' && browserVersion < 32) {
        return transformDirectivesForPreCsp1Firefox(directives, { defaultSrc: ['*'] });
    }
    else if (browserVersion >= 4 && browserVersion < 23) {
        const basePolicy = {};
        if (browserVersion < 5) {
            basePolicy.allow = ['*'];
            if (directives.defaultSrc) {
                basePolicy.allow = directives.defaultSrc;
                directives = Object.assign({}, directives);
                delete directives.defaultSrc;
            }
        }
        else {
            basePolicy.defaultSrc = ['*'];
        }
        return transformDirectivesForPreCsp1Firefox(directives, basePolicy);
    }
    else {
        return directives;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtLWRpcmVjdGl2ZXMtZm9yLWJyb3dzZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0cmFuc2Zvcm0tZGlyZWN0aXZlcy1mb3ItYnJvd3Nlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFRQSxTQUFTLG9DQUFvQyxDQUFFLFVBQXNCLEVBQUUsVUFBc0I7SUFFM0YsTUFBTSxNQUFNLEdBQVEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFHbEQsTUFBTSxFQUFFLFVBQVUsRUFBRSxHQUFHLFVBQVUsQ0FBQztJQUNsQyxJQUFJLFVBQVUsRUFBRTtRQUNkLE1BQU0sQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDO0tBQzVCO0lBR0QsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUN0QyxJQUFJLEdBQUcsS0FBSyxZQUFZLEVBQUU7WUFDeEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxHQUF1QixDQUFDLENBQUM7U0FDbkQ7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUdILE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxVQUFVLENBQUM7SUFDakMsSUFBSSxTQUFTLEVBQUU7UUFDYixNQUFNLGFBQWEsR0FBRyxFQUFFLENBQUM7UUFFekIsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDL0MsYUFBYSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUNyQztRQUNELElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUM3QyxhQUFhLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQ25DO1FBRUQsSUFBSSxhQUFhLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUM5QixNQUFNLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQztTQUNoQztLQUNGO0lBRUQsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUVELE1BQU0sQ0FBQyxPQUFPLFVBQVUsNkJBQTZCLENBQ25ELE9BQVksRUFDWixVQUFzQjtJQUd0QixJQUFJLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxjQUFjLEVBQUUsS0FBSyxTQUFTLEVBQUU7UUFDdEQsT0FBTyxVQUFVLENBQUM7S0FDbkI7SUFFRCxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7SUFFbkMsSUFBSSxNQUFNLEtBQUssS0FBSyxFQUFFO1FBQ3BCLE9BQU8sVUFBVSxDQUFDO0tBQ25CO0lBRUQsTUFBTSxjQUFjLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUM7SUFFL0QsSUFDRSxNQUFNLEtBQUssU0FBUyxJQUFJLGNBQWMsR0FBRyxFQUFFO1FBQzNDLE9BQU8sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssUUFBUSxJQUFJLGNBQWMsR0FBRyxFQUFFLEVBQ2pFO1FBQ0EsT0FBTyxvQ0FBb0MsQ0FBQyxVQUFVLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDaEY7U0FBTSxJQUFJLGNBQWMsSUFBSSxDQUFDLElBQUksY0FBYyxHQUFHLEVBQUUsRUFBRTtRQUNyRCxNQUFNLFVBQVUsR0FBZSxFQUFFLENBQUM7UUFDbEMsSUFBSSxjQUFjLEdBQUcsQ0FBQyxFQUFFO1lBQ3RCLFVBQVUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUV6QixJQUFJLFVBQVUsQ0FBQyxVQUFVLEVBQUU7Z0JBQ3pCLFVBQVUsQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQztnQkFDekMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUMzQyxPQUFPLFVBQVUsQ0FBQyxVQUFVLENBQUM7YUFDOUI7U0FDRjthQUFNO1lBQ0wsVUFBVSxDQUFDLFVBQVUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQy9CO1FBRUQsT0FBTyxvQ0FBb0MsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7S0FDckU7U0FBTTtRQUNMLE9BQU8sVUFBVSxDQUFDO0tBQ25CO0FBQ0gsQ0FBQyJ9