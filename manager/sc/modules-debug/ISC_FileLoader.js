
/*

  SmartClient Ajax RIA system
  Version v9.0p_2013-08-08/PowerEdition Deployment (2013-08-08)

  Copyright 2000 and beyond Isomorphic Software, Inc. All rights reserved.
  "SmartClient" is a trademark of Isomorphic Software, Inc.

  LICENSE NOTICE
     INSTALLATION OR USE OF THIS SOFTWARE INDICATES YOUR ACCEPTANCE OF
     ISOMORPHIC SOFTWARE LICENSE TERMS. If you have received this file
     without an accompanying Isomorphic Software license file, please
     contact licensing@isomorphic.com for details. Unauthorized copying and
     use of this software is a violation of international copyright law.

  DEVELOPMENT ONLY - DO NOT DEPLOY
     This software is provided for evaluation, training, and development
     purposes only. It may include supplementary components that are not
     licensed for deployment. The separate DEPLOY package for this release
     contains SmartClient components that are licensed for deployment.

  PROPRIETARY & PROTECTED MATERIAL
     This software contains proprietary materials that are protected by
     contract and intellectual property law. You are expressly prohibited
     from attempting to reverse engineer this software or modify this
     software for human readability.

  CONTACT ISOMORPHIC
     For more information regarding license rights and restrictions, or to
     report possible license violations, please contact Isomorphic Software
     by email (licensing@isomorphic.com) or web (www.isomorphic.com).

*/

var isc = window.isc ? window.isc : {};if(window.isc&&!window.isc.module_FileLoader){isc.module_FileLoader=1;isc._moduleStart=isc._FileLoader_start=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc._moduleEnd&&(!isc.Log||(isc.Log && isc.Log.logIsDebugEnabled('loadTime')))){isc._pTM={ message:'FileLoader load/parse time: ' + (isc._moduleStart-isc._moduleEnd) + 'ms', category:'loadTime'};
if(isc.Log && isc.Log.logDebug)isc.Log.logDebug(isc._pTM.message,'loadTime');
else if(isc._preLog)isc._preLog[isc._preLog.length]=isc._pTM;
else isc._preLog=[isc._pTM]}isc.definingFramework=true;


//> @class isc
// The <code>isc</code> object contains global methods and objects of the Isomorphic SmartClient
// framework.
// <P>
// See also +link{group:simpleNamesMode,Simple Names mode}.
//
// @treeLocation Client Reference/System
// @visibility external
//<

//> @groupDef simpleNamesMode
// When SmartClient runs in "simple names" mode (the default), all ISC Classes and several
// global methods are installed as JavaScript global variables, that is, properties of the
// browser's "window" object.  When simple names mode is disabled (called "portal mode"),
// the framework uses only the global variable: "isc" and global variables prefixed with
// "isc_".
// <P>
// Portal mode is intended for applications which must integrate with fairly arbitrary
// JavaScript code written by third-party developers, and/or third party JavaScript frameworks,
// where it is important that each framework stays within it's own namespace.
// <P>
// <var class="smartclient">
// In portal mode, all references to ISC classes and global functions must be prefixed with
// "isc.", for example:<pre>
//
//      Canvas.create(addProperties({}, myDefaults))
//
// </pre>would become<pre>
//
//      isc.Canvas.create(isc.addProperties({}, myDefaults));
//
// </pre>
// </var>
// Portal mode is enabled by setting <code>window.isc_useSimpleNames = false</code> <b>before</b>
// SmartClient is loaded, generally inside the &lt;head&gt; element.
//
// @treeLocation Client Reference/System
// @title Simple Names mode
// @visibility external
//<





var isc = window.isc ? window.isc : {};
isc._start = new Date().getTime();

// versioning - values of the form ${value} are replaced with user-provided values at build time.
// Valid values are: version, date, project (not currently used)
isc.version = "v9.0p_2013-08-08/PowerEdition Deployment";
isc.versionNumber = "v9.0p_2013-08-08";
isc.buildDate = "2013-08-08";
isc.expirationDate = "";

// license template data
isc.licenseType = "PowerEdition";
isc.licenseCompany = "Isomorphic Software";
isc.licenseSerialNumber = "ISC_POWER_NIGHTLY";
isc.licensingPage = "http://smartclient.com/product/";

isc._$debugModules = "debugModules";
isc._$nonDebugModules = "nonDebugModules";
isc.checkForDebugAndNonDebugModules = function () {
    if (isc.checkForDebugAndNonDebugModules._loggedWarning) return;
    var debugModules = isc['_' + this._$debugModules],
        haveDebugModules = debugModules != null && debugModules.length > 0,
        nonDebugModules = isc['_' + this._$nonDebugModules],
        haveNonDebugModules = nonDebugModules != null && nonDebugModules.length > 0;

    if (haveDebugModules && haveNonDebugModules) {
        isc.logWarn("Both Debug and non-Debug modules were loaded; the Debug versions of '" +
        debugModules.join("', '") + "' and the non-Debug versions of '" + nonDebugModules.join("', '") +
        "' were loaded. Mixing Debug and non-Debug modules is not supported and may lead to " +
        "JavaScript errors and/or unpredictable behavior. " +
        "To fix, ensure that only modules in the modules/ folder or the modules-debug/ " +
        "folder are loaded and clear the browser cache. If using Smart GWT, also clear the " +
        "GWT unit cache and recompile.");
        isc.checkForDebugAndNonDebugModules._loggedWarning = true;
    }
};

isc._optionalModules = {
    SCServer: {present: "true", name: "SmartClient Server", serverOnly: true, isPro: true},
    Drawing: {present: "${includeDrawing}", name: "Drawing Module"},
    PluginBridges: {present: "true", name: "PluginBridges Module"},
    RichTextEditor: {present: "true", name: "RichTextEditor Module"},
    Calendar: {present: "true", name: "Calendar Module"},
    Analytics: {present: "false", name: "Analytics Module"},
    Charts: {present: "true", name: "Charts Module"},
    Tools: {present: "${includeTools}", name: "Portal and Tools Module"},
    NetworkPerformance: {present: "true", name: "Network Performance Module"},
    // alias for NetworkPerformance
    FileLoader: {present: "true", name: "Network Performance Module"},
    RealtimeMessaging: {present: "false", name: "RealtimeMessaging Module"},
    // Enterprise Features
    serverCriteria: {present: "true", name: "Server Advanced Filtering", serverOnly: true, isFeature: true},
    customSQL: {present: "true", name: "SQL Templating", serverOnly: true, isFeature: true},
    chaining: {present: "true", name: "Transaction Chaining", serverOnly: true, isFeature: true},
    batchDSGenerator: {present: "false", name: "Batch DS-Generator", serverOnly: true, isFeature: true},
    batchUploader: {present: "true", name: "Batch Uploader", serverOnly: true, isFeature: true},
    transactions: {present: "true", name: "Automatic Transaction Management", serverOnly: true, isFeature: true}
};
isc.canonicalizeModules = function (modules) {
    if (!modules) return null;

    // canonicalize to Array, split on comma
    if (isc.isA.String(modules)) {
        if (modules.indexOf(",") != -1) {
            modules = modules.split(",");
            var trimLeft = /^\s+/, trimRight = /\s+$/;
            for (var i=0; i<modules.length; i++) {
                modules[i] = modules[i].replace(trimLeft, "").replace(trimRight, "");
            }
        } else modules = [modules];
    }
    return modules;
};
isc.hasOptionalModules = function (modules) {
    // ease of use shortcut, null value means no optional module requirements
    if (!modules) return true;

    modules = isc.canonicalizeModules(modules);

    for (var i = 0; i < modules.length; i++) if (!isc.hasOptionalModule(modules[i])) return false;
    return true;
};
isc.getMissingModules = function (requiredModules) {
    var result = [];
    requiredModules = isc.canonicalizeModules(requiredModules);
    for (var i = 0; i < requiredModules.length; i++) {
        var module = requiredModules[i];
        if (!isc.hasOptionalModule(module)) result.add(isc._optionalModules[module]);
    }
    return result;
};
isc.hasOptionalModule = function (module) {
    var v = isc._optionalModules[module];
    if (!v) {
        if(isc.Log) isc.Log.logWarn("isc.hasOptionalModule - unknown module: " + module);
        return false;
    }
    // has module or devenv
    return v.present == "true" || v.present.charAt(0) == "$";
};
isc.getOptionalModule = function (module) {
    return isc._optionalModules[module];
};

// default to "simple names" mode, where all ISC classes are defined as global variables
isc._useSimpleNames = window.isc_useSimpleNames;
if (isc._useSimpleNames == null) isc._useSimpleNames = true;

// register with the OpenAjax hub, if present
if (window.OpenAjax) {
    // OpenAjax insists on only numbers and dots.  This regex will convert eg 5.6b3 to 5.6.03,
    // which is not really accurate
    isc._numericVersion = isc.versionNumber.replace(/[a-zA-Z_]+/, ".0");
    OpenAjax.registerLibrary("SmartClient", "http://smartclient.com/SmartClient",
                             isc._numericVersion,
                             { namespacedMode : !isc._useSimpleNames,
                               iscVersion : isc.version,
                               buildDate : isc.buildDate,
                               licenseType : isc.licenseType,
                               licenseCompany : isc.licenseCompany,
                               licenseSerialNumber : isc.licenseSerialNumber });
    OpenAjax.registerGlobals("SmartClient", ["isc"]);
}


isc._longDOMIds = window.isc_useLongDOMIDs;

// add a property to global scope.  This property will always be available as "isc[propName]" and
// will also be available as "window[propName]" if we are in "simpleNames" mode.
// NOTE: even in simpleNames mode, where we assume it's OK to put things into global scope, we
// should still think carefully about creating globals.  Eg a variable like "params" which holds the
// current URL parameters (which we used to have) could easily get clobbered by some sloppy global
// JS, causing mysterious crashes.  Consider creating a class method (eg Page.getWidth()) or class
// property (Log.logViewer) instead, or making the variable isc.myMethod() or isc.myProperty.
isc._$iscPrefix = "isc.";
isc.addGlobal = function (propName, propValue) {
    if (propName.indexOf(isc._$iscPrefix) == 0) propName = propName.substring(4);
    isc[propName] = propValue;
    if (isc._useSimpleNames) window[propName] = propValue;
}





//>Offline

//XXX need to determine this flag correctly at load time
isc.onLine = true;

isc.isOffline = function () {
    return !isc.onLine;
};
isc.goOffline = function () { isc.onLine = false; };
isc.goOnline = function () { isc.onLine = true; };
if (window.addEventListener) {
    window.addEventListener("online", isc.goOnline, false);
    window.addEventListener("offline", isc.goOffline, false);
}
//<Offline





// =================================================================================================
// IMPORTANT :If you update this file, also update FileLoader.js that has a subset of these checks
// =================================================================================================





//>    @object    Browser
// Object containing flags indicating basic attributes of the browser.
// @treeLocation Client Reference/Foundation
// @visibility external
//<
isc.addGlobal("Browser", {
    isSupported:false
});


// ----------------------------------------------------------------
// Detecting browser type
// ----------------------------------------------------------------

//>    @classAttr    Browser.isOpera        (boolean : ? : R)
//        Are we in Opera ?
//<
isc.Browser.isOpera = (navigator.appName == "Opera" ||
                    navigator.userAgent.indexOf("Opera") != -1);

//>    @classAttr    Browser.isNS (boolean : ? : R)
//        Are we in Netscape (including Navigator 4+, NS6 & 7, and Mozilla)
//      Note: Safari also reports itself as Netscape, so isNS is true for Safari.
//<
isc.Browser.isNS = (navigator.appName == "Netscape" && !isc.Browser.isOpera);

//>    @classAttr    Browser.isIE        (boolean : ? : R)
//        Are we in Internet Explorer?
//<
isc.Browser.isIE = (navigator.appName == "Microsoft Internet Explorer" &&
                    !isc.Browser.isOpera) ||
                   navigator.userAgent.indexOf("Trident/") != -1;

//>    @classAttr    Browser.isMSN        (boolean : ? : R)
//      Are we in the MSN browser (based on MSIE, so isIE will be true in this case)
//<
isc.Browser.isMSN = (isc.Browser.isIE && navigator.userAgent.indexOf("MSN") != -1);


//>    @classAttr    Browser.isMoz        (boolean : ? : R)
//        Are we in any Mozilla-derived browser, that is, a browser based on Netscape's Gecko
//      engine? (includes Mozilla and Netscape 6+)
//<
isc.Browser.isMoz = (navigator.userAgent.indexOf("Gecko") != -1) &&
    // NOTE: Safari sends "(like Gecko)", but behaves differently from Moz in many ways

    (navigator.userAgent.indexOf("Safari") == -1) &&
    (navigator.userAgent.indexOf("AppleWebKit") == -1) &&
    !isc.Browser.isIE;

//>    @classAttr    Browser.isCamino (boolean : false : R)
//  Are we in Mozilla Camino?
//<
isc.Browser.isCamino = (isc.Browser.isMoz && navigator.userAgent.indexOf("Camino/") != -1);

//>    @classAttr    Browser.isFirefox (boolean : false : R)
//  Are we in Mozilla Firefox?
//<
isc.Browser.isFirefox = (isc.Browser.isMoz && navigator.userAgent.indexOf("Firefox/") != -1);


//> @classAttr  Browser.isAIR    (boolean : ? : R)
// Is this application running in the Adobe AIR environment?
//<
isc.Browser.isAIR = (navigator.userAgent.indexOf("AdobeAIR") != -1);

//>    @classAttr    Browser.isWebKit (boolean : ? : R)
// Are we in a WebKit-based browser (Safari, Chrome, mobile Safari and Android, others).
//<
isc.Browser.isWebKit = navigator.userAgent.indexOf("WebKit") != -1;

//>    @classAttr    Browser.isSafari (boolean : ? : R)
// Are we in Apple's "Safari" browser? Note that this property will also be set for other
// WebKit based browsers (such as Google Chrome).
//<
// As far as we know all "true" Safari implementations idenify themselves in the userAgent with
// the string "Safari".
// However the GWT hosted mode browser on OSX is also based on apple webkit and should be treated
// like Safari but is not a Safari browser and doesn't identify itself as such in the useragent
// Reported UserAgent:
//  Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_5; en-us) AppleWebKit/525.18 (KHTML, like Gecko)
isc.Browser.isSafari = isc.Browser.isAIR || navigator.userAgent.indexOf("Safari") != -1 ||
                        navigator.userAgent.indexOf("AppleWebKit") != -1;


//> @classAttr Browser.isChrome (boolean : ? : R)
// Are we in the Google Chrome browser?
//<
// Behaves like Safari in most ways
isc.Browser.isChrome = isc.Browser.isSafari && (navigator.userAgent.indexOf("Chrome/") != -1);


if (!isc.Browser.isIE && !isc.Browser.isOpera && !isc.Browser.isMoz &&
    !isc.Browser.isAIR && !isc.Browser.isWebkit && !isc.Browser.isSafari)
{
    if (navigator.appVersion.indexOf("MSIE") != -1) {
        isc.Browser.isIE = true;
    }
}

// ----------------------------------------------------------------
// END Detecting browser type
// ----------------------------------------------------------------


//>    @classAttr Browser.minorVersion        (number : ? : R)
//        Browser version, with minor revision included (4.7, 5.5, etc).
//
// NOTE: In Firefox 16+, Browser.minorVersion will equal Browser.version by design. See
// Firefox +externalLink{https://bugzilla.mozilla.org/show_bug.cgi?id=728831,Bug 728831}.
//<
if (navigator.userAgent.indexOf("Trident/") >= 0 &&
    navigator.userAgent.lastIndexOf("rv:") >= 0)
{

    isc.Browser.minorVersion = parseFloat(navigator.userAgent.substring(navigator.userAgent.lastIndexOf("rv:") + "rv:".length));
} else {
    isc.Browser.minorVersion = parseFloat(isc.Browser.isIE
                                      ? navigator.appVersion.substring(navigator.appVersion.indexOf("MSIE") + 5)
                                      : navigator.appVersion );
}
if (!isc.Browser.isIE) (function () {


    var needle, pos;
    if (navigator.appVersion) {
        // Safari
        needle = "Version/";
        pos = navigator.appVersion.indexOf(needle);
        if (pos >= 0) {
            isc.Browser.minorVersion = parseFloat(navigator.appVersion.substring(pos + needle.length));
            return;
        }
    }

    var ua = navigator.userAgent;

    needle = "Chrome/";
    pos = ua.indexOf(needle);
    if (pos >= 0) {
        isc.Browser.minorVersion = parseFloat(ua.substring(pos + needle.length));
        return;
    }

    // Handle Camino before Firefox because Camino includes "(like Firefox/x.x.x)" in the UA.
    needle = "Camino/";
    pos = ua.indexOf(needle);
    if (pos >= 0) {
        isc.Browser.minorVersion = parseFloat(ua.substring(pos + needle.length));
        return;
    }

    needle = "Firefox/";
    pos = ua.indexOf(needle);
    if (pos >= 0) {
        isc.Browser.minorVersion = parseFloat(ua.substring(pos + needle.length));
        return;
    }

    if (ua.indexOf("Opera/") >= 0) {
        needle = "Version/";
        pos = ua.indexOf(needle);
        if (pos >= 0) {
            isc.Browser.minorVersion = parseFloat(ua.substring(pos + needle.length));
            return;
        } else {
            // Opera 9.64
            needle = "Opera/";
            pos = ua.indexOf(needle);
            isc.Browser.minorVersion = parseFloat(ua.substring(pos + needle.length));
            return;
        }
    }
})();

//>    @classAttr    Browser.version        (number : ? : R)
//        Browser major version number (integer: 4, 5, etc).
//<
isc.Browser.version = parseInt(isc.Browser.minorVersion);

// actually means IE6 or earlier, which requires radically different optimization techniques
isc.Browser.isIE6 = isc.Browser.isIE && isc.Browser.version <= 6;


//>    @classAttr    Browser.caminoVersion (string : ? : R)
//        For Camino-based browsers, the Camino version number.
//<
if (isc.Browser.isCamino) {
    // Camino Version is the last thing in the userAgent
    isc.Browser.caminoVersion =
        navigator.userAgent.substring(navigator.userAgent.indexOf("Camino/") +7);
}

if (isc.Browser.isFirefox) {
//>    @classAttr    Browser.firefoxVersion (string : ? : R)
//        For Firefox-based browsers, the Firefox version number.
//          - 0.10.1    is Firefox PR 1
//      After this the version numbers reported match those in the about dialog
//          - 1.0       is Firefox 1.0
//          - 1.0.2     is Firefox 1.0.2
//          - 1.5.0.3   is Firefox 1.5.0.3
//<
    var userAgent = navigator.userAgent,
        firefoxVersion = userAgent.substring(userAgent.indexOf("Firefox/")+ 8),
        majorMinorVersion = firefoxVersion.replace(/([^.]+\.[^.]+)\..*/, "$1");
    isc.Browser.firefoxVersion          = firefoxVersion;
    isc.Browser.firefoxMajorMinorNumber = parseFloat(majorMinorVersion);
}

//>    @classAttr    Browser.geckoVersion (integer : ? : R)
//        For Gecko-based browsers, the Gecko version number.
//      Looks like a datestamp:
//          - 20011019 is Netscape 6.2
//          - 20020530 is Mozilla 1.0
//          - 20020823 is Netscape 7.0
//          - 20020826 is Mozilla 1.1
//          - 20021126 is Mozilla 1.2
//          - 20030312 is Mozilla 1.3
//          - 20030624 is Mozilla 1.4
//          - 20031007 is Mozilla 1.5
//          - 20031120 is Mozilla 1.5.1 (Mac only release)
//          - 20040113 is Mozilla 1.6
//          - 20040616 is Mozilla 1.7
//          - 20040910 is Mozilla 1.73
//          - 20041001 is Mozilla Firefox PR1 (-- also see firefox version)
//          - 20041107 is Mozilla Firefox 1.0
//          - 20050915 is Mozilla Firefox 1.0.7
//          - 20051107 is Mozilla Firefox 1.5 RC2
//          - 20051111 is Mozilla Firefox 1.5 final
//          - 20060426 is Mozilla Firefox 1.5.0.3
//          - 20061010 is Mozilla Firefox 2.0
//          - 20070321 is Netscape 8.1.3 - LIES - really based on Firefox 1.0 codebase
//          - 20071109 is Firefox 3.0 beta 1
//          - 20080529 is Firefox 3.0
//          - 20100101 is Firefox 4.0.1
//<

if (isc.Browser.isMoz) {
    isc.Browser._geckoVIndex = navigator.userAgent.indexOf("Gecko/") + 6;
    // The 'parseInt' actually means we could just grab everything from the
    // end of "Gecko/" on, as we know that even if the gecko version is followed
    // by something, there will be a space before the next part of the UA string
    // However, we know the length, so just use it
    isc.Browser.geckoVersion = parseInt(
        navigator.userAgent.substring(
            isc.Browser._geckoVIndex, isc.Browser._geckoVIndex+8
        )
    );



    if (isc.Browser.isFirefox) {
        // clamp 1.0.x series to last known pre 1.5 version (1.0.7)
        if (isc.Browser.firefoxVersion.match(/^1\.0/)) isc.Browser.geckoVersion = 20050915;
        // clamp 2.0.x series to one day before near-final FF3 beta
        else if (isc.Browser.firefoxVersion.match(/^2\.0/)) isc.Browser.geckoVersion = 20071108;
    }


    if (isc.Browser.version >= 17) isc.Browser.geckoVersion = 20121121;
}

// Doctypes
//  Are we in strict standards mode.  This applies to IE6+ and all Moz 1.0+.
//
//  In strict mode, browsers attempt to behave in a more standards-compliant manner.  Of course,
//  standards interpretation varies pretty drastically between browser makers, so this is in effect
//  just another fairly arbitrary set of behaviors which continues to vary across browser makers,
//  and now also across modes within the same browser.
//
// Traditionally, we have essentially 3 cases to consider:
// - BackCompat / Quirks mode. This is the rendering used if docType is not specified, or if
//   specified as 'Transitional' or 'Frameset' / with no URI
//   (EG: <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">)
//   This is the default mode.
// - Strict. Completely standards complient.
//   Triggered by
//   <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
// - "Almost Strict" (AKA Transitional).
//   In IE this matches Strict mode completely.
//   In Moz it matches strict mode except for rendering of images within tables - see
//   http://developer.mozilla.org/en/docs/Images%2C_Tables%2C_and_Mysterious_Gaps
//   Triggered "transitional" doctype with URI
//   Reports document.compatMode as "CSS1Compat"
// - http://developer.mozilla.org/en/docs/Gecko%27s_%22Almost_Standards%22_Mode
// - http://www.htmlhelp.com/reference/html40/html/doctype.html
// - http://developer.mozilla.org/en/docs/Mozilla%27s_DOCTYPE_sniffing
//
// - we also have the HTML5 doctype to consider - <!DOCTYPE html>. Only applies to modern
//   browsers, and required for some of our more recent features (EG some drawing approaches)
//   We don't explicitly have a flag to differentiate between this and "isStrict"

//> @classAttr  Browser.isStrict    (boolean : ? : R)
//  Are we in strict standards mode.
//<
// HACK: Netscape6 does not report document.compatMode, so we can't tell that a DOCTYPE has been
// specified, but Netscape6 IS affected by a DOCTYPE.  So, in Netscape6, assume we're always in
// strict mode.  At the moment (3/30/03) all strict mode workarounds have identical behavior in
// normal mode.

isc.Browser.isStrict = document.compatMode == "CSS1Compat";
if (isc.Browser.isStrict && isc.Browser.isMoz) {

    isc.Browser._docTypePublicID = document.doctype.publicId;
    isc.Browser._docTypeSystemID = document.doctype.systemId;

}

// See http://developer.mozilla.org/en/docs/Mozilla%27s_DOCTYPE_sniffing
// See Drawing.test.html for some test cases
isc.Browser.isTransitional = /.*(Transitional|Frameset)/.test((document.all && document.all[0] && document.all[0].nodeValue) || (document.doctype && document.doctype.publicId));

isc.Browser.isIE7 = isc.Browser.isIE && isc.Browser.version == 7;

//> @classAttr Browser.isIE8 (boolean : ? : R)
// Returns true if we're running IE8 and we're in IE8 mode
// IE8 has a 'back-compat' type mode whereby it can run using IE7 rendering logic.
// This is explicitly controlled via the meta tags:
//
//    &lt;meta http-equiv="X-UA-Compatible" content="IE=8" /&gt;
// or
//    &lt;meta http-equiv="X-UA-Compatible" content="IE=7" /&gt;
//
// In beta versions IE8 reported itself version 7 and ran in IE7 mode unless the explicit IE8
// tag was present
// In final versions (observed on 8.0.6001.18702) it reports a browser version of 8 and runs
// in IE8 mode by default - but can be switched into IE7 mode via the explicit IE=7 tag.
//
// We therefore want to check the document.documentMode tag rather than just the standard
// browser version when checking for IE8
//<
isc.Browser.isIE8 = isc.Browser.isIE && isc.Browser.version>=8 && document.documentMode == 8;

//<
//> @classAttr Browser.isIE8Strict (boolean : ? : R)
// Are we in IE8 [or greater] strict mode.
// <P>
// In IE8 when the meta tag is present to trigger IE7 / IE8 mode the document is in
//
//    &lt;meta http-equiv="X-UA-Compatible" content="IE=8" /&gt;
//    &lt;meta http-equiv="X-UA-Compatible" content="IE=7" /&gt;
//
// If this tag is present, the document is in strict mode even if no DOCTYPE was present.
// The presence of this tag can be detected as document.documentMode being 8 rather than 7.
// document.compatMode still reports "CSS1Compat" as with earlier IE.
//<
// IE9 running in IE9 mode will report as IE8Strict:true. This makes sense since rendering quirks
// introduced in IE8 Strict, such as requiring explicit "overflow:hidden" in addition
// to table-layout-fixed in order to clip cells horizontally in tables apply in both places.
// For cases where we really need to distinguish we can check isc.Browser.version or isc.Browser.isIE9

isc.Browser.isIE8Strict = isc.Browser.isIE &&
                            (isc.Browser.isStrict && document.documentMode ==8) ||
                            document.documentMode > 8;

//> @classAttr Browser.isIE9 (boolean : ? : R)
// Returns true if we're running IE9, running as IE9
//<

isc.Browser.isIE9 = isc.Browser.isIE && isc.Browser.version>=9 && document.documentMode >= 9;

isc.Browser.isIE10 = isc.Browser.isIE && isc.Browser.version >= 10;

isc.Browser.isIE11 = isc.Browser.isIE && isc.Browser.version >= 11;

//> @classAttr  Browser.AIRVersion (string : ? : R)
// If this application running in the Adobe AIR environment, what version of AIR is
// running. Will be a string, like "1.0".
//<
isc.Browser.AIRVersion = (isc.Browser.isAIR ? navigator.userAgent.substring(navigator.userAgent.indexOf("AdobeAir/") + 9) : null);


//>    @classAttr    Browser.safariVersion (number : ? : R)
//        in Safari, what is is the reported version number

if (isc.Browser.isSafari) {

    if (isc.Browser.isAIR) {

        isc.Browser.safariVersion = 530;
    } else {
        if (navigator.userAgent.indexOf("Safari/") != -1) {
            isc.Browser.rawSafariVersion = navigator.userAgent.substring(
                        navigator.userAgent.indexOf("Safari/") + 7
            );
        } else if (navigator.userAgent.indexOf("AppleWebKit/") != -1) {
            isc.Browser.rawSafariVersion = navigator.userAgent.substring(
                        navigator.userAgent.indexOf("AppleWebKit/") + 12
            );

        } else {
            isc.Browser.rawSafariVersion = "530"
        }



        isc.Browser.safariVersion = (function () {
            var rawVersion = isc.Browser.rawSafariVersion,
                currentDot = rawVersion.indexOf(".");

            if (currentDot == -1) return parseInt(rawVersion);
            var version = rawVersion.substring(0,currentDot+1),
                nextDot;
            while (currentDot != -1) {
                // Check AFTER the dot
                currentDot += 1;
                nextDot = rawVersion.indexOf(".", currentDot);
                version += rawVersion.substring(currentDot,
                                                (nextDot == -1 ? rawVersion.length: nextDot));
                currentDot = nextDot;
            }
            return parseFloat(version);
        })();
    }
}

// -------------------------------------------------------------------
// Platform information
// -------------------------------------------------------------------

//>    @classAttr    Browser.isWin        (boolean : ? : R)
//        Is this a Windows computer ?
//<
isc.Browser.isWin = navigator.platform.toLowerCase().indexOf("win") > -1;
// NT 5.0 is Win2k, NT5.0.1 is Win2k SP1
isc.Browser.isWin2k = navigator.userAgent.match(/NT 5.01?/) != null;

//>    @classAttr    Browser.isMac        (boolean : ? : R)
//        Is this a Macintosh computer ?
//<
isc.Browser.isMac = navigator.platform.toLowerCase().indexOf("mac") > -1;

isc.Browser.isUnix = (!isc.Browser.isMac &&! isc.Browser.isWin);

//> @groupDef mobileDevelopment
// SmartClient supports building web applications that can be accessed by mobile devices that
// support modern web browsers, specifically:
// <ul>
// <li> Safari on iOS devices (iPad, iPhone, iPod Touch)
// <li> Android's default (WebKit-based) browser
// <li> Windows Phone 7 (future, for 'Mango' and up)
// <li> Blackberry devices that use a WebKit-based browser (future)
// </ul>
// Via "packaging" technologies such as Titanium and PhoneGap, a SmartClient web application
// can be packaged as an installable native application that can be delivered via the "App Store"
// for the target mobile platform.  Applications packaged in this way have access to phone-specific
// data and services such as contacts stored on the phone, or the ability to invoke the device's camera.
// <P>
// Both Titanium and PhoneGap are open source mobile development frameworks which provide access to the
// underlying native device APIs such as the accelerometer, geolocation, and UI. Both frameworks enable
// application development using only JavaScript, CSS and HTML. Additionally they provide development environments
// that work across a wide variety of devices.
// <P>
// PhoneGap has good support for native device APIs as noted +externalLink{http://www.phonegap.com/about/feature,here}.
// Titanium has similar support. There are differences between the two environments and how they
// expose their APIs, though both provide Xcode-compatible projects that can be compiled and run from the Xcode IDE.
// See +link{titaniumIntegration,Integration with Titanium} and +link{phonegapIntegration,Integration with PhoneGap}
// for more information.
// <P>
// <h3>Finger / touch events</h3>
// <P>
// Mobile and touch devices support "touch events" that correspond to finger actions on the
// screen.  By default, SmartClient simply sends touch events to UI components as normal mouse
// events.  Specifically:
// <ul>
// <li> a finger tap gesture will trigger mouseDown, mouseUp and click events
// <li> a touch-and-slide interaction will trigger drag and drop, firing the normal SmartClient
//      sequence of dragStart, dragMove, and dragStop
// <li> a touch-and-hold interaction will trigger a contextMenu event, and will trigger a hover
//      if no contextMenu is shown
// </ul>
// This means that most applications that are written initially to target desktop computers
// need little or no modification in order be able to run on tablet-sized devices (eg the
// iPad).  For handset-sized devices (phones, iPod touch), conditional logic may need to be
// added to make different use of the screen real estate.
// <P>
// <h3>Mobile look and feel</h3>
// <P>
// The "Mobile" skin should be used whenever mobile devices are detected.  This skin roughly
// mimics the appearance of the iOS default widgets wherever there is an iOS widget that
// corresponds closely to a given SmartClient widget.  It also makes extensive use of CSS3 to
// minimize the use of images while still providing an attractive look and feel.
// <P>
// In addition, this skin also changes the behavior of some SmartClient widgets to match the
// UI idioms common on mobile devices.  For example, the TabSet component switches to
// bottom-oriented tabs, which are flush together (no gaps).  If there are more than a certain
// number of tabs, a special "More" tab appears which lists other remaining tabs.  Among other
// examples, this is the behavior of the "iPad" application on iOS devices, and is an efficient
// use of minimal screen real estate which feels natural when used on a mobile device.
// <P>
// In order to detect whether to use the Mobile skin, because of the rapid proliferation of
// mobile devices, we recommend using server-side detection based on the User-Agent HTTP
// header, and using conditional logic (such as logic in a .jsp) to load the "Mobile" skin
// specifically for these devices.
// <P>
// <h3>Adapting to Screen Size and Orientation Change</h3>
// <P>
// Safari on the Apple iPod/iPhone supports explicitly configuring the viewport as detailed here:
// +externalLink{http://developer.apple.com/safari/library/documentation/AppleApplications/Reference/SafariWebContent/UsingtheViewport/UsingtheViewport.html}.
// Including these meta tags in your bootstrap HTML file will allow you to set
// a default "zoom level" - how many pixels show up on the screen in landscape or portrait
// mode as well as disabling the user's standard zoom interactions. We also have
// +link{Page.updateViewport(),an API} to configure the viewport programmatically at runtime.
// <P>
// Note that the +link{Page.getOrientation()} API may be used to determine the current
// orientation of the application, and +link{pageEvent,the page orientationChange event} will fire
// whenever the user rotates the screen allowing applications to directly respond to the user
// pivoting their device.
//
// @title Mobile Application Development
// @treeLocation Concepts
// @visibility external
//<


//> @groupDef titaniumIntegration
// Titanium provides an extensive Javascript API to access a native device's UI, phone, camera, geolocation, etc.
// Documentation, getting started, programming guides are +externalLink{http://developer.appcelerator.com/documentation,here}.
// Titanium provides a consistent API across devices including the ability to mix webviews with native controls.
// <P>
// The Titanium sample application provides an example of accessing a device's Contacts db using SmartClient.
// The application presents 2 tabs 'Customers' and 'Contacts' and allows the user to import Customer contacts into
// his/her contacts db resident on the device. Selecting a Customer's Contact address will show a map of the contact.
// Selecting a Customer's phone number will call the customer or prompt to import the contact into the user's
// contacts. The latter option is default behavior on the iPad. Calling the customer contact is default behavior for
// devices such as the iPhone or Android.
// <P>
// The Titanium Contact object holds the following properties:
// <ul>
// <li>URL</li>
// <li>address</li>
// <li>birthday</li>
// <li>created</li>
// <li>date</li>
// <li>department</li>
// <li>email</li>
// <li>firstName</li>
// <li>firstPhonetic</li>
// <li>fullName</li>
// <li>image</li>
// <li>instantMessage</li>
// <li>jobTitle</li>
// <li>kind</li>
// <li>lastName</li>
// <li>lastPhonetic</li>
// <li>middleName</li>
// <li>middlePhonetic</li>
// <li>modified</li>
// <li>nickname</li>
// <li>note</li>
// <li>organization</li>
// <li>phone</li>
// <li>prefix</li>
// <li>relatedNames</li>
// <li>suffix</li>
// </ul>
// <P>
// The following Titanium API's are used:
// <ul>
// <li>Titanium.App.addEventListener</li>
// <li>Titanium.App.fireEvent</li>
// <li>Titanium.Contacts.getAllPeople</li>
// <li>Titanium.Geolocation.forwardGeocoder</li>
// <li>Titanium.Map.STANDARD_TYPE,</li>
// <li>Titanium.Map.createView</li>
// <li>Titanium.UI.createTab</li>
// <li>Titanium.UI.createTabGroup</li>
// <li>Titanium.UI.createWebView</li>
// <li>Titanium.UI.createWindow</li>
// <li>Titanium.UI.setBackgroundColor</li>
// </ul>
// <P>
// The following SmartClient Components are used
// <ul>
// <li>isc.DataSource</li>
// <li>isc.ListGrid</li>
// </ul>
// <P>
// The following SmartClient Resources are bundled in the Titanium application
// <ul>
// <li>ISC_Containers.js</li>
// <li>ISC_Core.js</li>
// <li>ISC_DataBinding.js</li>
// <li>ISC_Foundation.js</li>
// <li>ISC_Grids.js</li>
// <li>load_skin.js</li>
// <li>skins/Mobile/images/black.gif</li>
// <li>skins/Mobile/images/blank.gif</li>
// <li>skins/Mobile/images/checked.png</li>
// <li>skins/Mobile/images/formula_menuItem.png</li>
// <li>skins/Mobile/images/grid.gif</li>
// <li>skins/Mobile/images/group_closed.gif</li>
// <li>skins/Mobile/images/group_opened.gif</li>
// <li>skins/Mobile/images/headerMenuButton_icon.gif</li>
// <li>skins/Mobile/images/loading.gif</li>
// <li>skins/Mobile/images/loadingSmall.gif</li>
// <li>skins/Mobile/images/opacity.png</li>
// <li>skins/Mobile/images/pinstripes.png</li>
// <li>skins/Mobile/images/row_collapsed.gif</li>
// <li>skins/Mobile/images/row_expanded.gif</li>
// <li>skins/Mobile/images/sort_ascending.gif</li>
// <li>skins/Mobile/images/sort_descending.gif</li>
// <li>skins/Mobile/skin_styles.css</li>
// </ul>
//
// @title Integration with Titanium
// @treeLocation Concepts/Mobile Application Development
// @visibility external
//<

//> @groupDef phonegapIntegration
// <P>
// PhoneGap documentation, quick start information, and programming guides are available at +externalLink{http://www.phonegap.com/,http://www.phonegap.com/}.
// <P>
// PhoneGap exposes a Contacts API which allows one to find, create and remove contacts from the device's contacts database.
// Unlike Titanium, which provides many native UI components, PhoneGap relies on 3rd party frameworks for
// UI components. Additionally, PhoneGap provides no transitions or other animation effects normally
// accessible in native applications.
// <P>
// In the following guide, the name "MyMobileApp" refers to a <!--<var class="smartclient">-->SmartClient<!--</var>--><!--<var class="smartgwt">-->Smart&nbsp;GWT<!--</var>-->
// mobile application. The instructions are intended to be general, and applicable to other apps by simply substituting the application name
// and the few other app-specific details.
//
// <h3>General Instructions</h3>
// For each target that PhoneGap supports, there is a special <code>www/</code> folder which contains
// the application JavaScript code and other assets. If the <code>www/</code> folder was created for you,
// the only file that is needed within is <code>cordova-x.x.x.js</code>. All other files can be deleted.
//
// <p>Copy your <!--<var class="smartclient">-->SmartClient<!--</var>--><!--<var class="smartgwt">-->compiled Smart&nbsp;GWT<!--</var>-->
// application into the <code>www/</code> folder. You will need to open the application's main HTML
// file in a text editor to make a few changes:
// <ul>
//   <li>Change the DOCTYPE to the HTML5 DOCTYPE: <code>&lt;!DOCTYPE html&gt;</code></li>
//   <li>Add a <code>&lt;script&gt;</code> tag to the <code>&lt;head&gt;</code> element to load <code>cordova-x.x.x.js</code>:
//       <pre>    &lt;script type="text/javascript" charset="UTF-8" language="JavaScript" src="cordova-x.x.x.js"&gt;&lt;/script&gt;</pre>
//
//       <p><b>NOTE:</b> There is a <code>cordova-x.x.x.js</code> for each target that PhoneGap
//       supports; they are different scripts. To set up a single codebase for multiple
//       targets, see the section titled <b>Multi-Target Codebase</b> below.</li>
//   <li>Ensure that the following <code>&lt;meta&gt;</code> tags are used, also in the <code>&lt;head&gt;</code> element:
//       <pre>    &lt;meta http-equiv="Content-Type" content="text/html; charset=UTF-8"&gt;
//    &lt;meta name="format-detection" content="telephone=no"&gt;
//    &lt;meta name="viewport" content="user-scalable=no, initial-scale=1, minimum-scale=1, maximum-scale=1, width=device-width"&gt;</pre></li>
// </ul>
//
// <p>After making those changes, you will need to defer starting the application until the
//    <code>+externalLink{http://docs.phonegap.com/en/edge/cordova_events_events.md.html#deviceready,deviceready}</code> event has fired,
//    particularly if your application invokes any PhoneGap API function.
//
//        <!--<var class="smartclient">-->In SmartClient, deferring the application can be accomplished by wrapping all application code within a 'deviceready' listener:
//        <pre class="sourcefile">&lt;script type="text/javascript" language="JavaScript"&gt;
//document.addEventListener("deviceready", function onDeviceReady() {
//    // application code goes here
//}, false);
//&lt;/script&gt;</pre><!--</var>-->
//
//        <!--<var class="smartgwt">-->To accomplish this in Smart&nbsp;GWT, it is helpful to use a utility class together with a bit of JavaScript.
//
// <p>The following utility class can be used to defer the <code>onModuleLoad</code> code until PhoneGap is ready:
//
// <pre class="sourcefile">package com.mycompany.client;
//
//import com.google.gwt.core.client.EntryPoint;
//
//public abstract class CordovaEntryPoint implements EntryPoint {
//
//    &#x40;Override
//    public final native void onModuleLoad() &#x2F;*-{
//        var self = this;
//        if ($wnd.isDeviceReady) self.&#x40;com.mycompany.client.CordovaEntryPoint::onDeviceReady()();
//        else {
//            var listener = $entry(function () {
//                $doc.removeEventListener("deviceready", listener, false);
//                self.&#x40;com.mycompany.client.CordovaEntryPoint::onDeviceReady()();
//            });
//            $doc.addEventListener("deviceready", listener, false);
//        }
//    }-*&#x2F;;
//
//    protected abstract void onDeviceReady();
//}</pre>
//
// <p>The <code>CordovaEntryPoint</code> class is used in conjunction with the following JavaScript,
//        which should be added before the closing <code>&lt/body&gt;</code> tag:
//
//     <pre class="sourcefile">&lt;script type="text/javascript" language="JavaScript"&gt;
//document.addEventListener("deviceready", function onDeviceReady() {
//    window.isDeviceReady = true;
//    document.removeEventListener("deviceready", arguments.callee, false);
//}, false);
//&lt;/script&gt;</pre><!--</var>-->
//
// <h3>iOS Targets (iPhone &amp; iPad)</h3>
// Beginning with PhoneGap / Cordova 2.0.0, special command-line tooling +externalLink{http://phonegap.com/2012/07/20/adobe-phonegap-2-0-released.md/,has been introduced}
// which replaces the custom Xcode project templates. To create a new project, the
// +externalLink{http://docs.phonegap.com/en/edge/guide_command-line_index.md.html#Command-Line%20Usage_ios,<code>create</code> program}
// located at <code>$PHONEGAP_SDK/lib/ios/bin/create</code> is used:
//
// <pre>$PHONEGAP_SDK/lib/ios/bin/create path/to/my_cordova_project com.MyCompany.ProjectName ProjectName</pre>
//
// <ol>
// <li>Open <b>Terminal</b> and run <code>$PHONEGAP_SDK/lib/ios/bin/create MyMobileApp-iOS com.mycompany.MyMobileApp MyMobileApp</code></li>
// <li>Within the newly-created <code>MyMobileApp-iOS/</code> folder, open the Xcode project <code>MyMobileApp.xcodeproj</code>.</li>
// <li>Follow the General Instructions above.</li>
// <li>In Xcode, using the scheme selector toolbar, set the Scheme to <b>MyMobileApp &gt; iPhone 6.0 Simulator</b> or some other simulator destination.
//     Then click the <b>Run</b> button. Xcode will start the iOS Simulator and run the app.</li>
// <li>When you are finished testing the application in the simulator, click the <b>Stop</b> button.</li>
// </ol>
//
// <p>It is helpful to pay attention to the output window when testing the app within iOS Simulator.
// The output window contains all logs to <code>+externalLink{https://developer.mozilla.org/en/DOM/console,window.console}</code> and messages from the Cordova
// framework itself. One common issue is <code>ERROR whitelist rejection: url='SOMEURL'</code>,
// which means that SOMEURL has not been added to <code>&lt;access origin="..."/&gt;</code> in <code>config.xml</code>.
// Refer to the +externalLink{http://docs.phonegap.com/en/edge/guide_whitelist_index.md.html#Domain%20Whitelist%20Guide,Domain Whitelist Guide}
// for more information.
//
// <p>You can make changes to your application and re-run it in the simulator without needing to close Xcode:
// <ol>
// <li>Stop the application if running.</li>
// <li>Select <b>Product -&gt; Clean</b></li>
// <li>Click the <b>Run</b> button.</li>
// </ol>
//
// <p>Once you have completely tested the application within the simulator, you should test the app on
// real hardware. Refer to Apple's +externalLink{https://developer.apple.com/library/ios/#documentation/Xcode/Conceptual/ios_development_workflow/00-About_the_iOS_Application_Development_Workflow/introduction.html,Tools Workflow Guide for iOS} for complete instructions on provisioning the app for testing devices, in particular, the section titled
// +externalLink{https://developer.apple.com/library/ios/#documentation/Xcode/Conceptual/ios_development_workflow/35-Distributing_Applications/distributing_applications.html#//apple_ref/doc/uid/TP40007959-CH10-SW4,Sending Your App to Testers}.
// Note that you will need to set the Scheme destination to <b>MyMobileApp &gt; iOS Device</b> for the <b>Product -&gt; Archive</b> menu option to be available.
// <!-- The previous note should help SC devs get past this common sticking point: http://stackoverflow.com/questions/3087089/xcode-build-and-archive-menu-item-disabled -->
//
// <h3>Android Targets</h3>
// To begin targeting Android devices, follow the instructions on the
// +externalLink{http://docs.phonegap.com/en/edge/guide_getting-started_android_index.md.html#Getting%20Started%20with%20Android,Getting Started with Android guide}.
// After creating the new Android app project, follow the General Instructions above.
//
// <p>It is helpful to monitor the LogCat in Eclipse to verify that your application is working correctly.
// Common errors include:
// <ul>
// <li><code>Application Error The protocol is not supported. (gap://ready)</code>
//     <p>This means that the incorrect <code>cordova-x.x.x.js</code> script is being used. You
//     must use the <code>cordova-x.x.x.js</code> for Android.<!-- http://community.phonegap.com/nitobi/topics/error_starting_app_on_android -->
//     </li>
// <li><code>Data exceeds UNCOMPRESS_DATA_MAX</code>
//     <p>There is a limit to the size of individual Android app assets, typically 1 Megabyte. This
//        error message means that one asset file exceeds this limit. You should see a popup alert
//        dialog containing the name of the problematic file, and then the app will crash.
//     <!--<var class="smartgwt">--><p>The "Data exceeds UNCOMPRESS_DATA_MAX" error can be seen if, for example, the Smart&nbsp;GWT application
//        was compiled in DETAILED or PRETTY mode.<!--</var>-->
//     </li>
// </ul>
//
// <h3>Multi-Target Codebase</h3>
// There is a <code>cordova-x.x.x.js</code> for each target that PhoneGap supports; they are
// different scripts. To target multiple platforms using a single codebase, it can be useful to
// employ a "script changer" to load the correct <code>cordova-x.x.x.js</code>:
//
// <!--<var class="smartclient">--><pre class="sourcefile">&lt;script type="text/javascript" language="JavaScript"&gt;var isomorphicDir="./";&lt;/script&gt;
//&lt;script type="text/javascript" charset="UTF-8" language="JavaScript" src="ISC_Core.js"&gt;&lt;/script&gt;
//&lt;script type="text/javascript" language="JavaScript"&gt;
//    var scriptName;
//    if (isc.Browser.isAndroid) {
//        scriptName = "cordova-2.3.0-android.js";
//    } else if (isc.Browser.isIPad || isc.Browser.isIPhone) {
//        scriptName = "cordova-2.3.0-iOS.js";
//    }
//    if (scriptName) document.write("&lt;script type='text/javascript' charset='UTF-8' " +
//                                   "language='JavaScript' src='" + encodeURI(scriptName) + "'&gt;&lt;" + "/script&gt;");
//&lt;/script&gt;</pre><!--</var>-->
// <!--<var class="smartgwt">--><pre class="sourcefile">&lt;script type="text/javascript" language="JavaScript"&gt;
//    var scriptName;
//    if (navigator.userAgent.indexOf("Android") &gt; -1) {
//        scriptName = "cordova-2.3.0-android.js";
//    } else if (navigator.userAgent.indexOf("iPhone") &gt; -1 || navigator.userAgent.indexOf("iPad") &gt; -1) {
//        scriptName = "cordova-2.3.0-iOS.js";
//    }
//    if (scriptName) document.write("&lt;script type='text/javascript' charset='UTF-8' " +
//                                   "language='JavaScript' src='" + encodeURI(scriptName) + "'&gt;&lt;" + "/script&gt;");
//&lt;/script&gt;</pre><!--</var>-->
//
// <h3>Samples</h3>
// <!--<var class="smartclient">-->
// <p>The SmartClient SDK package has a sample application called MyContacts which demonstrates how
// to work with the PhoneGap API in a SmartClient app. The main SmartClient code is located in
// <code>smartclientSDK/examples/phonegap/MyContacts</code>. An Xcode project used to package the app for iOS
// devices is located at <code>smartclientSDK/examples/phonegap/MyContacts-iOS</code>. An Eclipse project used
// to package the app for Android devices is located at <code>smartclientSDK/examples/phonegap/MyContacts-Android</code>.
//
// <p>This sample application utilizes the script changer technique to load the correct <code>cordova-x.x.x.js</code>.
// <!--</var>--><!--<var class="smartgwt">-->
// <p>The Smart&nbsp;GWT Google Code project has a sample application called +externalLink{http://code.google.com/p/smartgwt/source/browse/#svn%2Ftrunk%2Fsamples%2Fphonegap%2FMyContacts,MyContacts} which demonstrates how
// to work with the PhoneGap API in a Smart&nbsp;GWT app. The main Smart&nbsp;GWT code is located at
// <code>+externalLink{http://code.google.com/p/smartgwt/source/browse/#svn%2Ftrunk%2Fsamples%2Fphonegap%2FMyContacts,trunk/samples/phonegap/MyContacts}</code>. An Xcode project used to package the app for iOS
// devices is located at <code>+externalLink{http://code.google.com/p/smartgwt/source/browse/#svn%2Ftrunk%2Fsamples%2Fphonegap%2FMyContacts-iOS,trunk/samples/phonegap/MyContacts-iOS}</code>. An Eclipse project used
// to package the app for Android devices is located at <code>+externalLink{http://code.google.com/p/smartgwt/source/browse/#svn%2Ftrunk%2Fsamples%2Fphonegap%2FMyContacts-Android,trunk/samples/phonegap/MyContacts-Android}</code>.
//
// <p>This sample application utilizes the script changer technique to load the correct <code>cordova-x.x.x.js</code>.
// Additionally, GWT's +externalLink{http://developers.google.com/web-toolkit/doc/latest/DevGuideCodingBasicsOverlay,JavaScript overlay types}
// feature is used to easily wrap the PhoneGap Contacts API for use by the Smart&nbsp;GWT app.
// <!--</var>-->
//
// @title Integration with PhoneGap
// @treeLocation Concepts/Mobile Application Development
// @visibility external
//<

isc.Browser.isAndroid = navigator.userAgent.indexOf("Android") > -1;


isc.Browser.isRIM = isc.Browser.isBlackBerry =
    navigator.userAgent.indexOf("BlackBerry") > -1 || navigator.userAgent.indexOf("PlayBook") > -1;


isc.Browser.isMobileWebkit = (isc.Browser.isSafari && navigator.userAgent.indexOf(" Mobile/") > -1
    || isc.Browser.isAndroid
    || isc.Browser.isBlackBerry);

// intended for general mobile changes (performance, etc)
isc.Browser.isMobile = (isc.Browser.isMobileWebkit);

// browser has a touch interface (iPhone, iPad, Android device, etc)

isc.Browser.isTouch = (isc.Browser.isMobileWebkit);

// iPhone OS including iPad.  Search for iPad or iPhone.

isc.Browser.isIPhone = (isc.Browser.isMobileWebkit &&
                        (navigator.userAgent.indexOf("iPhone") > -1 ||
                         navigator.userAgent.indexOf("iPad") > -1));

// iPad.  Checks for "iPhone" OS + "iPad" in UA String.
isc.Browser.isIPad = (isc.Browser.isIPhone &&
                        navigator.userAgent.indexOf("iPad") > -1);

// tablet.  assumes isIPad for now, or non-mobile Android

isc.Browser.isTablet = (isc.Browser.isIPad) ||
                (isc.Browser.isRIM && navigator.userAgent.indexOf("Tablet") > -1) ||
                (isc.Browser.isAndroid && navigator.userAgent.indexOf("Mobile") == -1);

// specifically a handset-sized device, with an assumed screen width of 3-4 inches, implying
// the application will be working with only 300-400 pixels at typical DPI
isc.Browser.isHandset = (isc.Browser.isTouch && !isc.Browser.isTablet);

//> @classAttr  Browser.isBorderBox    (boolean : ? : R)
// Do divs render out with "border-box" sizing by default.
//<
// See comments in Canvas.adjustHandleSize() for a discussion of border-box vs content-box sizing

isc.Browser.isBorderBox = (isc.Browser.isIE && !isc.Browser.isStrict);

//>    @classAttr    Browser.lineFeed    (string : ? : RA)
//        Linefeed for this platform
//<
isc.Browser.lineFeed = (isc.Browser.isWin ? "\r\n" : "\r");

//>    @classAttr    Browser._supportsMethodTimeout    (string : ? : RA)
//        setTimeout() requires text string parameter in MacIE or IE 4
//<
isc.Browser._supportsMethodTimeout = false;//!(isc.Browser.isIE && (isc.Browser.isMac || isc.Browser.version == 4));

//>    @classAttr    Browser.isDOM (string : ? : RA)
//        Whether this is a DOM-compliant browser.  Indicates general compliance with DOM standards,
//      not perfect compliance.
//<
isc.Browser.isDOM = (isc.Browser.isMoz || isc.Browser.isOpera ||
                     isc.Browser.isSafari || (isc.Browser.isIE && isc.Browser.version >= 5));

//> @classAttr Browser.isSupported (boolean : varies by browser : R)
// Whether SmartClient supports the current browser.
// <P>
// Note that this flag will only be available on browsers that at least support basic
// JavaScript.
//
// @visibility external
//<
isc.Browser.isSupported = (
    // we support all versions of IE 5.5 and greater on Windows only
    (isc.Browser.isIE && isc.Browser.minorVersion >= 5.5 && isc.Browser.isWin) ||
    // Mozilla and Netscape 6, all platforms
    isc.Browser.isMoz ||
    isc.Browser.isOpera ||
    // Safari (only available on Mac)
    isc.Browser.isSafari ||
    isc.Browser.isAIR
);


isc.Browser.nativeMouseMoveOnCanvasScroll =
    !isc.Browser.isTouch && (isc.Browser.isSafari || isc.Browser.isChrome);

//> @classAttr Browser.seleniumPresent (boolean : varies : R)
// Whether current page has been loaded by Selenium RC/WebDriver.
//<
isc.Browser.seleniumPresent = (function () {
    var match = location.href.match(/[?&](?:sc_selenium)=([^&#]*)/);
    return match && match.length > 1 && "true" == match[1];
})();

//> @type Autotest
// @value Browser.SHOWCASE autotest is targeting SmartClient or SGWT showcases
isc.Browser.SHOWCASE = "showcase";
// @value Browser.RUNNER autotest is targeting TestRunner-based JS tests
isc.Browser.RUNNER = "runner";
//<

//> @classAttr Browser.autotest (Autotest : varies : R)
// The current mode of the autotest system (null if not in autotest mode)
//<
isc.Browser.autotest = (function () {
    var match = location.href.match(/[?&](?:autotest)=([^&#]*)/);
    return match && match.length > 1 ? match[1] : null;
})();

//>    @classAttr    Browser.allowsXSXHR    (boolean : ? : RA)
//    Traditionally, web browsers reject attempts to make an XmlHttpRequest of a server other than the origin
//  server. However, some more recent browsers allow cross-site XmlHttpRequests to be made, relying on the
//  server to accept or reject them depending on what the origin server is.
//<
isc.Browser.allowsXSXHR = (
    (isc.Browser.isFirefox && isc.Browser.firefoxMajorMinorNumber >= 3.5) ||
    // Chrome auto-updates to latest stable version every time you start it, and there is no option to prevent
    // this from happening, so there's no point in querying version
    (isc.Browser.isChrome) ||
    (isc.Browser.isSafari && isc.Browser.safariVersion >= 531)
);

//> @classAttr Browser.useCSSFilters (boolean : ? : R)
// Whether the current browser supports gradients and whether SmartClient is
// configured to use gradients (via the setting of window.isc_useGradientsPreIE9).
//<


var isc_useGradientsPreIE9 = window.isc_useGradientsPreIE9;
isc.Browser.useCSSFilters =
    !isc.Browser.isIE || isc.Browser.isIE9 || isc_useGradientsPreIE9 != false;

//> @classAttr Browser.isSGWT (boolean : ? : RA)
// Are we running in SGWT.
// This is set up by SmartGWT wrapper code in JsObject.init().
// Obviously only applies to internal SmartClient code since developer code for an SGWT app
// would be written in Java and there'd be no need to check this var!
// @visibility internal
//<

//> @classAttr Browser.useCSS3 (boolean : ? : R)
// Whether the current browser supports CSS3 and whether SmartClient is configured to use
// CSS3 features (via the setting of window.isc_css3Mode).
// <P>
// If isc_css3Mode is "on" then useCSS3 is set to true.  If isc_css3Mode is set to
// "supported", "partialSupport", or is unset, then useCSS3 is set to true only if the browser
// is a WebKit-based browser, Firefox, IE 9 in standards mode, or IE 10+.  If isc_css3Mode is set
// to "off" then useCSS3 is set to false.
//<
var isc_css3Mode = window.isc_css3Mode;
if (isc_css3Mode == "on") {
    isc.Browser.useCSS3 = true;
} else if (isc_css3Mode == "off") {
    isc.Browser.useCSS3 = false;
} else if (isc_css3Mode == "supported" ||
           isc_css3Mode == "partialSupport" ||
           isc_css3Mode === undefined)
{
    isc.Browser.useCSS3 = isc.Browser.isWebKit ||
                          isc.Browser.isFirefox ||
                          (isc.Browser.isIE && (isc.Browser.isIE9 || isc.Browser.version >= 10));
} else {
    isc.Browser.useCSS3 = false;
}

isc.Browser.useInsertAdjacentHTML = !!document.documentElement.insertAdjacentHTML;

// Test for availability of the Range.getBoundingClientRect() method which was added to
// CSSOM View as of the 04 August 2009 Working Draft.
// http://www.w3.org/TR/2009/WD-cssom-view-20090804/

isc.Browser.hasNativeGetRect = (!isc.Browser.isIE &&
                                (!isc.Browser.isSafari || !isc.Browser.isMac || isc.Browser.version >= 6) &&
                                !!document.createRange &&
                                !!(document.createRange().getBoundingClientRect));

isc.Browser.useClipDiv = (isc.Browser.isMoz || isc.Browser.isSafari || isc.Browser.isOpera);


isc.Browser._useNewSingleDivSizing = !(isc.Browser.isIE && isc.Browser.version < 10 && !isc.Browser.isIE9);

isc.Browser.useCreateContextualFragment = !!document.createRange && !!document.createRange().createContextualFragment;


isc.Browser.hasTextOverflowEllipsis = (!isc.Browser.isMoz || isc.Browser.version >= 7) &&
                                      (!isc.Browser.isOpera || isc.Browser.version >= 9);

// https://developer.mozilla.org/en-US/docs/CSS/text-overflow
isc.Browser._textOverflowPropertyName = (!isc.Browser.isOpera || isc.Browser.version >= 11 ? "text-overflow" : "-o-text-overflow");


isc.Browser._hasGetBCR = !isc.Browser.isSafari || isc.Browser.version >= 4;

// http://dom.spec.whatwg.org/#ranges
isc.Browser._hasDOMRanges = !!(window.getSelection && document.createRange && window.Range);



//--------------------------------------------------------------------------------------------------
// partial addProperties support
//--------------------------------------------------------------------------------------------------
// define addProperties(), but don't redefine it if FileLoader was loaded after ISC
// Note: copied partially from Object.js
if (isc.addProperties == null) {
    isc.addGlobal("addProperties", function (destination, source) {
        for (var propName in source)
            destination[propName] = source[propName];
        return destination;
    });
}

isc.addGlobal("evalSA", function (expression) {
    //!OBFUSCATEOK
    if (isc.eval) isc.eval(expression);
    else eval(expression);
});

isc.addGlobal("defineStandaloneClass", function (className, classObj) {
    if (isc[className]) return;  // don't redefine

    isc.addGlobal(className, classObj);
    isc.addProperties(classObj, {
        _saClassName: className,

        fireSimpleCallback : function (callback) {
            callback.method.apply(callback.target ? callback.target : window,
                                  callback.args ? callback.args : []);
        },

        // Logging - log to a special array that gets dumped into the the DevConsole logs by
        // Log.js.  Timestamps will be accurate.  If you're not loading Core, you can use
        // getLogs() to get the logs.
        logMessage : function (priority, message, category) {
            if (isc.Log) {
                isc.Log.logMessage(priority, message, category);
                return;
            }
            if (!isc._preLog) isc._preLog = [];
            isc._preLog[isc._preLog.length] = {
                priority: priority,
                message: message,
                category: category,
                timestamp: new Date()
            };
        },


        // NOTE: log priorities copied from Log.js
        logWarn : function (message) {
            this.logMessage(3, message, this._saClassName);
        },
        logInfo : function (message) {
            this.logMessage(4, message, this._saClassName);
        },
        logDebug : function (message) {
            this.logMessage(5, message, this._saClassName);
        },
        // end logging

        //--------------------------------------------------------------------------------------------------
        // IsA support
        //--------------------------------------------------------------------------------------------------
        // Note: can't provide this as isc.isA because in Core.js we load Object before isA and Object
        // has conditional logic that uses isA
        //
        // Also, ClassFactory.makeIsAFunc() expect isA to always be a function, so don't stick
        // an isA object literal on here or it will crash
        isAString : function (object) {
            if (object == null) return false;
            if (object.constructor && object.constructor.__nativeType != null) {
                return object.constructor.__nativeType == 4;
            }
            return typeof object == "string";
        }

    });

    // alias
    classObj.isAn = classObj.isA;

    return classObj;
});



isc.defineStandaloneClass("SA_Page", {

_isLoaded : false,
_pageLoadCallbacks: [],

isLoaded : function () {
    return this._isLoaded;
},

onLoad : function (callback, target, args) {
    this._pageLoadCallbacks.push({
        method: callback,
        target: target,
        args: args
    });

    if (!this._registeredOnload) {
        this._registeredOnload = true;
        // HACK: Opera: addEventListener("load") fires seemingly on every externally loaded
        // file in Opera.  But Opera emulates IE's attachEvent(), and fires load normally.
        if ((isc.Browser.isIE && isc.Browser.version < 11) || isc.Browser.isOpera) {
            window.attachEvent("onload", function () { isc.SA_Page._firePageLoadCallbacks(); });
        } else {
            window.addEventListener("load", function () { isc.SA_Page._firePageLoadCallbacks(); }, true);
        }
    }
},

_firePageLoadCallbacks : function () {
    // Moz/FF has a bug: if you register a page onload event, but navigate away from the page
    // before the page finishes loading, the onload event may fire on the page that you
    // navigated away to - even if it's a completely different site.  This typically results in
    // a JS error.
    //
    // Also - this can be fored from EventHandler.handeLoad(), so trap double call.
    if (!window.isc || this._isLoaded) return;

    // flag page as loaded
    this._isLoaded = true;

    // process all callbacks
    for (var i = 0; i < this._pageLoadCallbacks.length; i++) {
        var callback = this._pageLoadCallbacks[i];
        this.fireSimpleCallback(callback);
    }
    delete this._pageLoadCallbacks;
}

});

isc.SA_Page.onLoad(function () { this._isLoaded = true; }, isc.SA_Page);
isc.defineStandaloneClass("SA_XMLHttp",{
_readyStateChangeCallback:function(){
    var xmlHttpRequest=arguments.callee.xmlHttpRequest;
    if(!xmlHttpRequest)return;
    if(xmlHttpRequest.readyState!=4)return;
    arguments.callee.xmlHttpRequest=null;
    var callback=arguments.callee.callback;
    if(callback)isc.SA_XMLHttp._fireCallback(callback,xmlHttpRequest);
},
_fireCallback:function(callback,xmlHttpRequest){
    var callbackArgs=[xmlHttpRequest];
    if(callback.args)callback.args=callback.args.concat(callbackArgs);
    else callback.args=callbackArgs;
    this.fireSimpleCallback(callback);
},
get:function(URL,callback){
    var xmlHttpRequest=this.createXMLHttpRequest();
    if(!xmlHttpRequest){
        this.logWarn("XMLHttpRequest not available - can't fetch url: "+URL);
        return;
    }
    xmlHttpRequest.open("GET",URL,true);
    if(isc.Browser.isIE){
        var readyCallback=this._readyStateChangeCallback;
        readyCallback.callback=callback;
        readyCallback.xmlHttpRequest=xmlHttpRequest;
        xmlHttpRequest.onreadystatechange=readyCallback;
    }else{
        xmlHttpRequest.onreadystatechange=function(){
            if(xmlHttpRequest.readyState!=4)return;
            isc.SA_XMLHttp._fireCallback(callback,xmlHttpRequest);
        }
    }
    xmlHttpRequest.send(null);
    return xmlHttpRequest;
},
xmlHttpConstructors:["MSXML2.XMLHTTP","Microsoft.XMLHTTP","MSXML.XMLHTTP","MSXML3.XMLHTTP"],
createXMLHttpRequest:function(){
    if(isc.Browser.isIE){
        var xmlHttpRequest;
        if(isc.preferNativeXMLHttpRequest){
            xmlHttpRequest=this.getNativeRequest();
            if(!xmlHttpRequest)xmlHttpRequest=this.getActiveXRequest();
        }else{
            xmlHttpRequest=this.getActiveXRequest();
            if(!xmlHttpRequest)xmlHttpRequest=this.getNativeRequest();
        }
        if(!xmlHttpRequest)this.logWarn("Couldn't create XMLHttpRequest");
        return xmlHttpRequest;
    }else{
        return new XMLHttpRequest();
    }
},
getNativeRequest:function(){
   var xmlHttpRequest;
    if(isc.Browser.version>=7){
        this.logDebug("Using native XMLHttpRequest");
        xmlHttpRequest=new XMLHttpRequest();
    }
    return xmlHttpRequest;
},
getActiveXRequest:function(){
    var xmlHttpRequest;
    if(!this._xmlHttpConstructor){
        for(var i=0;i<this.xmlHttpConstructors.length;i++){
            try{
                var cons=this.xmlHttpConstructors[i];
                xmlHttpRequest=new ActiveXObject(cons);
                if(xmlHttpRequest){
                    this._xmlHttpConstructor=cons;
                    break;
                }
            }catch(e){}
        }
    }else{
        xmlHttpRequest=new ActiveXObject(this._xmlHttpConstructor);
    }
    if(xmlHttpRequest)this.logDebug("Using ActiveX XMLHttpRequest via constructor: "+this._xmlHttpConstructor);
    return xmlHttpRequest;
}
});
if(!window.isc_maxCSSLoaders)window.isc_maxCSSLoaders=20;
isc.defineStandaloneClass("FileLoader",{
_timeStamp:new Date().getTime(),
disableCaching:false,
versionParamName:"isc_version",
addVersionToLoadTags:true,
modulesDir:"system/modules/",
cssPollFrequency:50,
cssLoadTimeout:2000,
cssWarnTimeout:1000,
nextCSSLoader:0,
_obfuscation_global_identifier:null,
_imageQueue:[],
_fileQueue:[],
_fileConfig:{},
defaultModules:"Core,Foundation,Containers,Grids,Forms,DataBinding",
defaultSkin:"standard",
getIsomorphicDir:function(){
    return window.isomorphicDir?window.isomorphicDir:"../isomorphic/";
},
cacheISC:function(skin,modules,onload){
    this.cacheModules(modules?modules:this.defaultModules);
    this.cacheSkin(skin,onload);
},
cacheSkin:function(skin,onload){
    var skinDir=this._getSkinDir(skin);
    this.cacheFile(skinDir+"load_skin.js");
    this.cacheFile(skinDir+"skin_styles.css",onload);
},
loadISC:function(skin,modules,onload){
    this.loadModules(modules?modules:this.defaultModules);
    this.loadSkin(skin,onload);
},
loadSkin:function(skin,onload){
    var skinDir=this._getSkinDir(skin);
    if(!this._loadedSkins)this._loadedSkins=[];
    this._loadedSkins[this._loadedSkins.length]=skinDir+"skin_styles.css";
    this.loadFile(skinDir+"skin_styles.css");
    this.loadFile(skinDir+"load_skin.js",onload);
},
_getSkinDir:function(skin){
    if(!skin)skin=this.defaultSkin;
    var skinDir;
    if(skin.indexOf("/")!=-1){
        skinDir=skin;
    }else{
        skinDir=this.getIsomorphicDir()+"skins/"+skin+"/";
    }
    if(skinDir.charAt(skinDir.length-1)!="/")skinDir+="/";
    return skinDir;
},
loadJSFile:function(URLs,onload){
    this._queueFiles(URLs,onload,"js",{defer:true});
},
loadModule:function(modules,onload){
    this._queueFiles(modules,onload,"js",{defer:true,isModule:true});
},
cacheFile:function(URLs,onload,type){
    this._queueFiles(URLs,onload,type,{cacheOnly:true});
},
cacheModule:function(modules,onload){
    if(isc.Browser.isMoz&&isc.Browser.geckoVersion<20051107){
        modules=this._canonicalizeList(modules);
        for(var i=0;i<modules.length;i++){
            isc["module_"+modules[i]]=1;
        }
        this.loadModules(modules,onload);
        return;
    }
   this._queueFiles(modules,onload,"js",{cacheOnly:true,isModule:true});
},
loadCSSFile:function(URLs,onload){
    this._queueFiles(URLs,onload,"css",{defer:true});
},
loadFile:function(URLs,onload,type){
    this._queueFiles(URLs,onload,type,{defer:true});
},
_fileExtensionRegexp:/(.*)\.(.*)/,
defaultImageStates:"Down,Over,Disabled",
cacheImgStates:function(baseURLs,states,onload){
    var URLs=this.addURLSuffix(baseURLs,states!=null?states:this.defaultImageStates);
    this.cacheFiles(URLs,onload,"image")
},
cacheStretchImgStates:function(baseURLs,states,pieces,onload){
    if(pieces==null)pieces="start,stretch,end";
    var URLs=this.addURLSuffix(baseURLs,pieces);
    var stateURLs=this.addURLSuffix(baseURLs,states!=null?states:this.defaultImageStates);
    URLs=URLs.concat(this.addURLSuffix(stateURLs,pieces));
    this.cacheFiles(URLs,onload,"image");
},
defaultEdges:"TL,T,TR,L,R,BL,B,BR",
defaultEdgeColors:"",
cacheEdgeImages:function(baseURLs,showCenter,edges,colors,onload){
    baseURLs=this._canonicalizeList(baseURLs);
    if(edges==null)edges=this.defaultEdges;
    edges=this._canonicalizeList(edges);
    if(showCenter)edges[edges.length]="center";
    if(colors==null)colors=this.defaultEdgeColors;
    var URLs=baseURLs;
    if(colors.length)URLs=this.addURLSuffix(URLs,colors);
    URLs=this.addURLSuffix(URLs,edges);
    this.cacheFiles(URLs,onload,"image");
},
defaultBaseShadowImage:"ds.png",
cacheShadows:function(baseDir,depths,baseShadowImage,onload){
    depths=this._canonicalizeList(depths);
    if(baseShadowImage==null)baseShadowImage=this.defaultBaseShadowImage;
    var regexpResult=this._fileExtensionRegexp.exec(baseShadowImage);
    if(!regexpResult){
        this.logWarn("Couldn't split baseShadowImage '"+baseShadowImage
                   +"' into basePath and extension - file will not be cached.");
        return;
    }
    var baseName=regexpResult[1];
    var extension=regexpResult[2];
    if(baseDir.charAt(baseDir.length-1)!="/")baseDir=baseDir+"/";
    var underscore="_";
    this.cacheFile(baseDir+baseName+underscore+"center."+extension,onload,"image");
    for(var i=0;i<depths.length;i++)
        this.cacheEdgeImages(baseDir+baseName+depths[i]+"."+extension,false,null,null,onload);
},
addURLSuffix:function(baseURLs,suffixes){
    baseURLs=this._canonicalizeList(baseURLs);
    suffixes=this._canonicalizeList(suffixes);
    var results=[];
    for(var i=0;i<baseURLs.length;i++){
        var baseURL=baseURLs[i];
        var queryIndex=baseURL.indexOf("?");
        var queryPart="";
        if(queryIndex!=-1){
            baseURL=baseURL.substring(0,queryIndex);
            queryPart=baseURL.substring(queryIndex,baseURL.length);
        }
        var regexpResult=this._fileExtensionRegexp.exec(baseURL);
        if(!regexpResult){
            this.logWarn("Couldn't split baseURL '"+baseURL
                       +"' into basePath and extension - file will not be cached.");
            continue;
        }
        var baseName=regexpResult[1];
        var extension=regexpResult[2];
        for(var j=0;j<suffixes.length;j++){
            results[results.length]=baseName+"_"+suffixes[j]+"."+extension+queryPart;
        }
    }
    return results;
},
_canonicalizeList:function(list){
    var obfuscation_local_identifier;
    if(!list)return[];
    if(this.isAString(list))list=list.split(",");
    var result=[];
    for(var i=0;i<list.length;i++){
        var item=list[i];
        result[i]=item.replace(/\s+/g,"");
    }
    return result;
},
moduleIsLoaded:function(modules){
    if(modules==null)return true;
    if(this.isAString(modules))modules=[modules];
    for(var i=0;i<modules.length;i++){
        var module=modules[i];
        if(module==null)continue;
        if(module.indexOf("ISC_")==0)module=module.substring(4);
        if(isc["module_"+module]==null)return false;
    }
    return true;
},
_queueFiles:function(URLs,onload,type,config){

    URLs=this._canonicalizeList(URLs);
    var queuedFiles=false,lastQueued;
    for(var i=0;i<URLs.length;i++){
        var URL=URLs[i];
        if(config.isModule){
            if(!config.cacheOnly){
                var module=URL;
                if(isc._optionalModules[module]&&isc._optionalModules[module].isFeature)continue;
                if(this.moduleIsLoaded(module)){
                    this.logWarn("Suppressed duplicate load of module: "+module);
                    continue;
                }
                if(isc._optionalModules[module]&&isc._optionalModules[module].serverOnly)continue;
            }
            if(URL.indexOf("ISC_")!=0&&URL.indexOf("/")==-1)URL="ISC_"+URL;
            if(URL.indexOf("/")==-1)URL=this.getIsomorphicDir()+this.modulesDir+URL+".js";
        }
        if(this.disableCaching&&!config.cacheOnly){
            URL+=(URL.indexOf("?")!=-1?"&":"?")+"ts="+(new Date().getTime());
        }
        if(this.addVersionToLoadTags&&
                (config.isModule||URL.indexOf(".css")!=-1))
        {
            var version=isc.versionNumber;
            if(version.indexOf("${")==0)version="dev";
            URL+=(URL.indexOf("?")!=-1?"&":"?")+this.versionParamName+"="+version+".js";
        }
        var fileID=URL+"_"+this._timeStamp+"_"+new Date().getTime();
        var fileConfig=this._fileConfig[fileID]={
            fileID:fileID,
            URL:URL,
            type:type
        }
        if(config)for(var key in config)fileConfig[key]=config[key];
        if(fileConfig.type==null){
            var file=URL;
            var queryIndex=file.indexOf("?");
            if(queryIndex!=-1)file=file.substring(0,queryIndex);
            if(file.match(/\.js$/i))fileConfig.type="js";
            else if(file.match(/\.css$/i))fileConfig.type="css";
            else if(file.match(/\.(gif|png|tiff|tif|bmp|dib|ief|jpe|jpeg|jpg|pbm|pct|pgm|pic|pict|ico)$/i))
               fileConfig.type="image";
            if(fileConfig.type==null){
                this.logWarn("Unable to autodetect file type for URL: "+URL
                           +" please specify it explicitly in your call to"
                           +" isc.FileLoader.cacheFile()/isc.FileLoader.loadFile()."
                           +" Ignoring this file.");
                delete this._fileConfig[fileID];
                return;
            }
        }
        if(fileConfig.type=="image"){
            queuedFiles=true;
            lastQueued=fileConfig;
            this._imageQueue.push(fileID);
        }else{
            if(isc.Browser.isMoz&&isc.Browser.geckoVersion<20051107
                &&fileConfig.cacheOnly&&!config.isModule)
            {
                delete this._fileConfig[fileID];
                continue;
            }else{
                this.logInfo("queueing URL: "+fileConfig.URL+", type: "+fileConfig.type
                           +", onload: "+fileConfig.onload);
                this._fileQueue.push(fileID);
                queuedFiles=true;
                lastQueued=fileConfig;
            }
        }
    }
    if(queuedFiles&&onload)lastQueued.onload=onload;
    if(!queuedFiles&&onload){
        if(this.isAString(onload))isc.evalSA(onload);
        else onload();
        return;
    }
    this._doLoadFiles();
},
_cacheImages:function(){
    var html="";
    while(this._imageQueue.length){
        var fileID=this._imageQueue.shift();
        var URL=this._fileConfig[fileID].URL;
        var callback="if(window.isc)isc.FileLoader.fileLoaded(\""+fileID+"\")";
        html+="<IMG SRC='"+URL+"' onload='"+callback+"' onerror='"+callback+"' onabort='"+callback
             +(isc.Browser.isOpera?"' STYLE=visibility:hidden;position:absolute;top:-1000px'>"
                                    :"' STYLE='display:none'>");
    }
    this._insertHTML(html);
},
_doLoadFiles:function(){
    if(!isc.SA_Page.isLoaded())return;
    this._inDoLoadFiles=true;
    if(this._fileQueue.length){
        if(this._loading_file){
            return;
        }
        var fileID=this._fileQueue.shift();
        var fileConfig=this._fileConfig[fileID];
        var URL=fileConfig.URL;
        this._loading_file=true;
        if(fileConfig.defer){
            this._loadFile(fileID);
        }else{
            this._cacheFile(fileID);
        }
    }else{
        this._cacheImages();
    }
    this._inDoLoadFiles=false;
},
_loadFile:function(fileID){
    var fileConfig=this._fileConfig[fileID];
    var URL=fileConfig.URL;
    var type=fileConfig.type;
    if(type=="js"){
        if(isc.Browser.isOpera){
            this._addScriptElement(URL,function(){
                isc.FileLoader.fileLoaded(fileID);
            });
        }else if(isc.Browser.isMoz&&isc.Browser.geckoVersion<20051107){
            this._insertHTML("<SCRIPT SRC='"+URL+"'></SCRIPT><SCRIPT>if(window.isc)isc.FileLoader.fileLoaded('"
                             +fileID+"')</SCRIPT>");
        }else{
            isc.SA_XMLHttp.get(URL,{method:this.fileLoaded,target:this,args:[fileID]});
        }
    }else if(type=="css"){
        fileConfig.cssIndex=isc.Browser.isSafari?this.nextCSSLoader:document.styleSheets.length;
        fileConfig.cssLoadStart=new Date().getTime();
        if(isc.Browser.isSafari){
            if(this.nextCSSLoader>window.isc_maxCSSLoaders){
                this.logWarn("maxCSSLoaders ("+window.isc_maxCSSLoaders+") exceeded - can't load "
                             +fileConfig.URL+" set isc_maxCSSLoaders to a larger number.");
                this.fileLoaded(fileID);
                return;
            }
            this._getCSSLoader().href=URL;
        }else{
            this._addLinkElement(URL);
        }
        this.startCSSPollTimer(fileID,0);
    }
},
startCSSPollTimer:function(fileID,delay){
    window.setTimeout("isc.FileLoader.pollForCSSLoaded('"+fileID+"')",delay)
},
pollForCSSLoaded:function(fileID){
    var fileConfig=this._fileConfig[fileID];
    var ss=document.styleSheets[fileConfig.cssIndex];
    var loaded=false;
    if(ss==null){
        this.logWarn("Can't find cssRule for URL: "+fileConfig.URL+" at index: "+fileConfig.cssIndex);
    }else{
        if(isc.Browser.isIE){
            if(ss.rules!=null&&ss.rules.length>0)loaded=true;
        }else if(isc.Browser.isOpera){
            if(ss.cssRules!=null&&ss.cssRules.length>0)loaded=true;
        }else{
            try{
                if(ss.cssRules!=null&&ss.cssRules.length>0)loaded=true;
            }catch(e){
                if(isc.Browser.isMoz&&
                    (document.domain!=location.hostname||
                     (fileConfig.URL.startsWith("http")&&fileConfig.URL.indexOf(location.hostname)==-1)))
                {
                    loaded=true;
                }
            }
        }
    }
    if(!loaded){
        var ts=new Date().getTime();
        if(ts>fileConfig.cssLoadStart+this.cssWarnTimeout&&!fileConfig.warnedAboutCSSTimeout){
            this.logWarn("CSS file "+fileConfig.URL+" taking longer than "+this.cssWarnTimeout
                         +" to load - may indicate a bad URL");
            fileConfig.warnedAboutCSSTimeout=true;
        }
        if(ts>fileConfig.cssLoadStart+this.cssLoadTimeout){
            this.logWarn("cssLoadTimeout of: "+this.cssLoadTimeout+" exceeded for: "
                         +fileConfig.URL+" - assuming loaded, firing onload handler.");
            loaded=true;
        }
    }
    if(loaded){
        this.fileLoaded(fileID);
    }else{
        this.startCSSPollTimer(fileID,this.cssPollFrequency);
    }
},
_cacheFile:function(fileID){
    var fileConfig=this._fileConfig[fileID];
    var URL=fileConfig.URL;
    if(isc.Browser.isOpera){
        this._addScriptElement(URL,function(){
            isc.FileLoader.fileLoaded(fileID);
        },"text/html");
    }else if(isc.Browser.isIE||isc.Browser.isSafari||
        (isc.Browser.isMoz&&isc.Browser.geckoVersion>=20051107))
    {
        isc.SA_XMLHttp.get(URL,{method:this.fileLoaded,target:this,args:[fileID]});
    }else if(isc.Browser.isMoz){
        var iframe=this._getIFRAME();
        this._lastFileID=fileID;
        iframe.src=URL;
    }
},
fileLoaded:function(fileID,fileContents,ignoreThisArg,delayed){
    if(!window.isc)return;
    if(fileContents!=null&&fileContents.responseText)
        fileContents=fileContents.responseText;
    if(!fileID){
        fileID=this._lastFileID;
        delete this._lastFileID;
    }
    var fileConfig=this._fileConfig[fileID];
    if(!fileConfig){
        return;
    }
    if(fileConfig.defer&&fileConfig.type=="js"&&fileContents){
        fileConfig.fileContents=fileContents;
        window.setTimeout("isc.FileLoader.delayedEval('"+fileID+"')",0);
    }else{
        this._completeLoad(fileID);
    }
    if(fileConfig.type!="image"){
        this._loading_file=false;
    }
    if(this._inDoLoadFiles){
        window.setTimeout("isc.FileLoader._doLoadFiles()",0);
    }else this._doLoadFiles();
},
delayedEval:function(fileID){

    var fileConfig=this._fileConfig[fileID];
    var fileContents=fileConfig.fileContents;
    if(isc.Browser.isSafari){
        window.setTimeout([fileContents,";isc.FileLoader._completeLoad('",fileID,"')"].join(""),0);
        return;
    }else if(isc.Browser.isIE&&isc.Browser.version<11){
        window.execScript(fileContents,"javascript");
    }else{
        if(isc.Class&&isc.Class.evaluate){
            isc.Class.evaluate(fileContents,null,true);
        }else{
            window.eval(fileContents);
        }
    }
    this._completeLoad(fileID);
},
_completeLoad:function(fileID){

    var fileConfig=this._fileConfig[fileID];
    this._checkISCInit();
    if(fileConfig.onload){
        if(this.isAString(fileConfig.onload))isc.evalSA(fileConfig.onload);
        else fileConfig.onload(fileConfig);
    }
    delete this._fileConfig[fileID];
},
_getIFRAME:function(){
    if(!this._iframe){
        this._insertHTML("<IFRAME STYLE='position:absolute;visibility:hidden;top:-1000px'"
                        +" onload='if(window.isc)isc.FileLoader.fileLoaded()'"
                        +" NAME='isc_fileLoader_iframe' ID='isc_fileLoader_iframe'></IFRAME>");
        this._iframe=document.getElementById("isc_fileLoader_iframe");
    }
    return this._iframe;
},
_insertHTML:function(html){
    if(!this._anchorElement)this._anchorElement=document.getElementsByTagName("body")[0];
    var anchor=this._anchorElement;
    if(isc.Browser.useInsertAdjacentHTML){
        anchor.insertAdjacentHTML('beforeEnd',html);
    }else{
        var range=anchor.ownerDocument.createRange();
        range.setStartBefore(anchor);
        var parsedHTML=range.createContextualFragment(html);
        anchor.appendChild(parsedHTML);
    }
},
_addLinkElement:function(href,onload){
    var e=document.createElement("link");
    e.rel="stylesheet";
    e.type="text/css";
    e.href=href;
    if(onload)e.onload=onload;
    document.getElementsByTagName("body")[0].appendChild(e);
},
_addScriptElement:function(src,onload,type){
    if(!type)type="text/javascript";
    var e=document.createElement("script");
    e.type=type
    e.src=src;
    if(onload)e.onload=onload;
    document.getElementsByTagName("body")[0].appendChild(e);
},
_waitingOnModules:function(){
    for(var i=0;i<this._fileQueue.length;i++){
        var fileID=this._fileQueue[i];
        var fileConfig=this._fileConfig[fileID];
        if(fileConfig.isModule)return true;
    }
    return false;
},
_checkISCInit:function(){
    if(isc.Page&&!isc.Page.isLoaded()){
        isc.Page.finishedLoading();
    }
},
_pageLoad:function(){
    this.logInfo("FileLoader initialized");
    setTimeout("isc.FileLoader._doLoadFiles()",0);
},
_getCSSLoader:function(num){
    if(num==null)num=this.nextCSSLoader++;
    return document.getElementById("isc_fl_css_loader"+num);
},
throbberStyle:"throbber",
throbberTextStyle:"throbberText",
throbberImgSrc:"[SKIN]loading.gif",
throbberImgWidth:48,
throbberImgHeight:48,
throbberWidth:270,
throbberHeight:60,
showThrobber:function(message,style,image,width,height){
    this.hideThrobber();
    style=style||this.throbberTextStyle;
    image=image||this.throbberImgSrc;
    width=width||this.throbberImgWidth;
    height=height||this.throbberImgHeight;
    var throbber=this._throbber=document.createElement("DIV");
    throbber.className=this.throbberStyle;
    throbber.style.position="absolute";
    throbber.style.left="50%";
    throbber.style.top="50%";
    throbber.style.width=this.throbberWidth+"px";
    throbber.style.height=this.throbberHeight+"px";
    throbber.style.marginLeft=-(this.throbberWidth/2)+"px";
    throbber.style.marginTop=-(this.throbberHeight/2)+"px";
    throbber.style.zIndex=1000000000;
    var table=document.createElement("TABLE"),
        tbody=document.createElement("TBODY"),
        row=document.createElement("TR")
    ;
    table.height="100%";
    table.width="100%";
    var cell=document.createElement("TD"),
        img=document.createElement("IMG")
    ;
    if(image&&image.indexOf("[SKIN]")==0){
        image=this._getSkinDir()+"images/"+image.substring(6);
    }
    img.src=image;
    img.height=height;
    cell.appendChild(img);
    row.appendChild(cell);
    if(message){
        var text=document.createTextNode(message);
        cell=document.createElement("TD");
        cell.className=style;
        cell.appendChild(text);
        row.appendChild(cell);
    }
    tbody.appendChild(row);
    table.appendChild(tbody);
    throbber.appendChild(table);
    document.getElementsByTagName("body").item(0).appendChild(throbber);
},
hideThrobber:function(){
    if(this._throbber){
        document.getElementsByTagName("body").item(0).removeChild(this._throbber);
        this._throbber=null;
    }
}
});
isc.addGlobal("FL",isc.FileLoader);
isc.A=isc.FileLoader;
isc.A.loadJSFiles=isc.FileLoader.loadJSFile;
isc.A.loadModules=isc.FileLoader.loadModule;
isc.A.cacheFiles=isc.FileLoader.cacheFile;
isc.A.cacheModules=isc.FileLoader.cacheModule;
isc.A.loadCSSFiles=isc.FileLoader.loadCSSFile;
isc.A.loadFiles=isc.FileLoader.loadFile
;

if(isc.Browser.isSafari){
    var s="";
    for(var i=0;i<window.isc_maxCSSLoaders;i++){
        s+="<LINK id='isc_fl_css_loader"+i+"' name='isc_fl_css_loader"+i+"' REL='stylesheet' TYPE='text/css'>";
    }
    document.write(s);
}
isc.SA_Page.onLoad(isc.FileLoader._pageLoad,isc.FileLoader);
isc._debugModules = (isc._debugModules != null ? isc._debugModules : []);isc._debugModules.push('FileLoader');isc.checkForDebugAndNonDebugModules();isc._moduleEnd=isc._FileLoader_end=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc.Log&&isc.Log.logIsInfoEnabled('loadTime'))isc.Log.logInfo('FileLoader module init time: ' + (isc._moduleEnd-isc._moduleStart) + 'ms','loadTime');delete isc.definingFramework;}else{if(window.isc && isc.Log && isc.Log.logWarn)isc.Log.logWarn("Duplicate load of module 'FileLoader'.");}

/*

  SmartClient Ajax RIA system
  Version v9.0p_2013-08-08/PowerEdition Deployment (2013-08-08)

  Copyright 2000 and beyond Isomorphic Software, Inc. All rights reserved.
  "SmartClient" is a trademark of Isomorphic Software, Inc.

  LICENSE NOTICE
     INSTALLATION OR USE OF THIS SOFTWARE INDICATES YOUR ACCEPTANCE OF
     ISOMORPHIC SOFTWARE LICENSE TERMS. If you have received this file
     without an accompanying Isomorphic Software license file, please
     contact licensing@isomorphic.com for details. Unauthorized copying and
     use of this software is a violation of international copyright law.

  DEVELOPMENT ONLY - DO NOT DEPLOY
     This software is provided for evaluation, training, and development
     purposes only. It may include supplementary components that are not
     licensed for deployment. The separate DEPLOY package for this release
     contains SmartClient components that are licensed for deployment.

  PROPRIETARY & PROTECTED MATERIAL
     This software contains proprietary materials that are protected by
     contract and intellectual property law. You are expressly prohibited
     from attempting to reverse engineer this software or modify this
     software for human readability.

  CONTACT ISOMORPHIC
     For more information regarding license rights and restrictions, or to
     report possible license violations, please contact Isomorphic Software
     by email (licensing@isomorphic.com) or web (www.isomorphic.com).

*/

