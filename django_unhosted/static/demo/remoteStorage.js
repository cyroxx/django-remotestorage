(function(){function n(n,r,i){e[n]=i;var s=n.substring(0,n.lastIndexOf("/")+1);t[n]=[];for(var o=0;o<r.length;o++)r[o].substring(0,2)=="./"&&(r[o]=r[o].substring(2)),t[n].push(s+r[o])}function r(n){if(n=="require")return function(){};var i=t[n],s={};for(var o=0;o<i.length;o++)s[i[o]]=r(i[o]);var u=[];for(var o=0;o<i.length;o++)u.push(s[i[o]]);return e[n].apply({},u)}var e={},t={};n("lib/platform",[],function(){function e(e){var t=!1,n;e.timeout&&(n=window.setTimeout(function(){t=!0,e.error("timeout")},e.timeout));var r=new XMLHttpRequest;e.method||(e.method="GET"),r.open(e.method,e.url,!0);if(e.headers)for(var i in e.headers)r.setRequestHeader(i,e.headers[i]);r.onreadystatechange=function(){r.readyState==4&&!t&&(n&&window.clearTimeout(n),r.status==200||r.status==201||r.status==204?e.success(r.responseText):e.error(r.status))},typeof e.data=="string"?r.send(e.data):r.send()}function t(e){var t=new XDomainRequest;t.timeout=e.timeout||3e3,t.open(e.method,e.url),t.onload=function(){t.status==200||t.status==201||t.status==204?e.success(xhr.responseText):e.error(xhr.status)},t.onerror=function(){err("unknown error")},t.ontimeout=function(){err(timeout)},e.data?t.send(e.data):t.send()}function n(e){var t=require("http"),n=require("https"),r=require("url");e.method||(e.method="GET"),e.data||(e.data=null);var i=r.parse(e.url),s={method:e.method,host:i.hostname,path:i.path,port:i.port?port:i.protocol=="https:"?443:80,headers:e.headers},o,u,a=i.protocol=="https:"?n:t,f=a.request(s,function(t){var n="";t.setEncoding("utf8"),t.on("data",function(e){n+=e}),t.on("end",function(){o&&clearTimeout(o),u||(t.statusCode==200||t.statusCode==201||t.statusCode==204?e.success(n):e.error(t.statusCode))})});f.on("error",function(t){e.error(t.message)}),e.timeout&&(o=setTimeout(function(){e.error("timeout"),u=!0},e.timeout)),e.data?f.end(e.data):f.end()}function r(e,t){var n=(new DOMParser).parseFromString(e,"text/xml"),r=n.getElementsByTagName("Link"),i={Link:[]};for(var s=0;s<r.length;s++){var o={};for(var u=0;u<r[s].attributes.length;u++)o[r[s].attributes[u].name]=r[s].attributes[u].value;o.rel&&i.Link.push({"@":o})}t(null,i)}function i(e,t){var n=require("xml2js");(new n.Parser).parseString(e,t)}function s(){return[]}function o(){return location.hash.length?location.hash.substring(1).split("&"):[]}return typeof window=="undefined"?{ajax:n,parseXml:i,getFragmentParams:s}:window.XDomainRequest?{ajax:t,parseXml:r,getFragmentParams:o}:{ajax:e,parseXml:r,getFragmentParams:o}}),n("lib/couch",["./platform"],function(e){function n(e){if(!t){try{t=JSON.parse(localStorage.getItem("_shadowCouchRev"))}catch(n){}t||(t={})}return t[e]}function r(e,n){if(!t)try{t=JSON.parse(localStorage.getItem("_shadowCouchRev"))}catch(r){}t||(t={}),t[e]=n,localStorage.setItem("_shadowCouchRev",JSON.stringify(t))}function i(t,n,r,i,s){var o={url:n,method:t,error:function(e){e==404?s(null,undefined):s(e,null)},success:function(e){s(null,e)},timeout:3e3};i&&(o.headers={Authorization:"Bearer "+i}),o.fields={withCredentials:"true"},t!="GET"&&(o.data=r),e.ajax(o)}function s(e,t,n){i("GET",e,null,t,function(t,i){if(t)n(t,i);else{var s;try{s=JSON.parse(i)}catch(o){}s&&s._rev?(r(e,s._rev),n(null,s.value)):typeof i=="undefined"?n(null,undefined):n("unparsable data from couch")}})}function o(e,t,s,o){var u=n(e),a={value:t};u&&(a._rev=u),i("PUT",e,JSON.stringify(a),s,function(n,u){if(n)n==409?i("GET",e,null,s,function(n,u){if(n)o("after 409, got a "+n);else{var f;try{f=JSON.parse(u)._rev}catch(l){}f?(a={value:t,_rev:f},r(e,f),i("PUT",e,JSON.stringify(a),s,function(e,t){e?o("after 409, second attempt got "+e):o(null)})):o("after 409, got unparseable JSON")}}):o(n);else{var a;try{a=JSON.parse(u)}catch(f){}a&&a.rev&&r(e,a.rev),o(null)}})}function u(e,t,s){var o=n(e);i("DELETE",e+(o?"?rev="+o:""),null,t,function(n,o){n==409?i("GET",e,null,t,function(n,o){if(n)s("after 409, got a "+n);else{var u;try{u=JSON.parse(o)._rev}catch(a){}u?(r(e,u),i("DELETE",e+"?rev="+u,null,t,function(t,n){t?s("after 409, second attempt got "+t):(r(e,undefined),s(null))})):s("after 409, got unparseable JSON")}}):(n||r(e,undefined),s(n))})}var t=null;return{get:s,put:o,"delete":u}}),n("lib/dav",["./platform"],function(e){function t(t,n,r,i,s,o){var u={url:n,method:t,error:function(e){e==404?s(null,undefined):s(e,null)},success:function(e){s(null,e)},timeout:3e3};u.headers={Authorization:"Bearer "+decodeURIComponent(i),"Content-Type":"text/plain;charset=UTF-8"},u.fields={withCredentials:"true"},t!="GET"&&(u.data=r),e.ajax(u)}function n(e,n,r){t("GET",e,null,n,r)}function r(e,n,r,i){t("PUT",e,n,r,i)}function i(e,n,r){t("DELETE",e,null,n,r)}return{get:n,put:r,"delete":i}}),n("lib/webfinger",["./platform"],function(e){function t(e,t){var n=e.toLowerCase().split("@");n.length<2?t("That is not a user address. There is no @-sign in it"):n.length>2?t("That is not a user address. There is more than one @-sign in it"):/^[\.0-9a-z\-\_]+$/.test(n[0])?/^[\.0-9a-z\-]+$/.test(n[1])?t(null,["https://"+n[1]+"/.well-known/host-meta","http://"+n[1]+"/.well-known/host-meta"]):t('That is not a user address. There are non-dotalphanumeric symbols after the @-sign: "'+n[1]+'"'):t('That is not a user address. There are non-dotalphanumeric symbols before the @-sign: "'+n[0]+'"')}function n(t,s,o){var u=t.shift();u?e.ajax({url:u,success:function(e){i(e,function(i,u){i?r(e,function(e,r){e?n(t,s,o):o(null,r)}):o(null,u)})},error:function(e){n(t,s,o)},timeout:s}):o("could not fetch xrd")}function r(t,n){e.parseXml(t,function(e,t){if(e)n(e);else if(t&&t.Link){var r={};if(t.Link&&t.Link["@"])t.Link["@"].rel&&(r[t.Link["@"].rel]=t.Link["@"]);else for(var i=0;i<t.Link.length;i++)t.Link[i]["@"]&&t.Link[i]["@"].rel&&(r[t.Link[i]["@"].rel]=t.Link[i]["@"]);n(null,r)}else n("found valid xml but with no Link elements in there")})}function i(e,t){var n;try{n=JSON.parse(e)}catch(r){t("not valid JSON");return}var i={};for(var s=0;s<n.links.length;s++)n.links[s].rel&&(i[n.links[s].rel]=n.links[s]);t(null,i)}function s(e,r,i){t(e,function(t,s){t?i(t):n(s,r.timeout,function(t,s){if(t)i("could not fetch host-meta for "+e);else if(s.lrdd&&s.lrdd.template){var o=s.lrdd.template.split("{uri}"),u=[o.join("acct:"+e),o.join(e)];n(u,r.timeout,function(t,n){if(t)i("could not fetch lrdd for "+e);else if(n.remoteStorage&&n.remoteStorage.auth&&n.remoteStorage.api&&n.remoteStorage.template){var r={};if(n["remoteStorage"]["api"]=="simple")r.type="https://www.w3.org/community/unhosted/wiki/remotestorage-2011.10#simple";else if(n["remoteStorage"]["api"]=="WebDAV")r.type="https://www.w3.org/community/unhosted/wiki/remotestorage-2011.10#webdav";else{if(n["remoteStorage"]["api"]!="CouchDB"){i("api not recognized");return}r.type="https://www.w3.org/community/unhosted/wiki/remotestorage-2011.10#couchdb"}var s=n.remoteStorage.template.split("{category}");s[0].substring(s[0].length-1)=="/"?r.href=s[0].substring(0,s[0].length-1):r.href=s[0],r.properties={"access-methods":["http://oauth.net/core/1.0/parameters/auth-header"],"auth-methods":["http://oauth.net/discovery/1.0/consumer-identity/static"],"http://oauth.net/core/1.0/endpoint/request":n.remoteStorage.auth},s.length==2&&s[1]!="/"&&(r.properties.legacySuffix=s[1]),i(null,r)}else n.remotestorage&&n.remotestorage.href&&n.remotestorage.type&&n.remotestorage.properties&&n.remotestorage.properties["http://oauth.net/core/1.0/endpoint/request"]?i(null,n.remotestorage):i("could not extract storageInfo from lrdd")})}else i("could not extract lrdd template from host-meta")})})}return{getStorageInfo:s}}),n("remoteStorage",["require","./lib/platform","./lib/couch","./lib/dav","./lib/webfinger"],function(e,t,n,r,i){var s=function(e,t,n){return{href:e,type:t,properties:n}},o=function(e,t){typeof e!="string"?t("user address should be a string"):i.getStorageInfo(e,{timeout:3e3},function(e,n){e?t("Failed!"):t(e,s(n.href,n.type,n.properties))})},u=function(e,t,n){if(e.type=="https://www.w3.org/community/rww/wiki/read-write-web-00#simple")scopesStr=t.join(" ");else{var r=[];for(var i=0;i<t.length;i++)r.push(t[i].split(":")[0].split("/")[0]);scopesStr=r.join(",")}var s;if(n.substring(0,"https://".length)=="https://")s=n.substring("https://".length);else{if(n.substring(0,"http://".length)!="http://")throw new Error("redirectUri does not start with https:// or http://");s=n.substring("http://".length)}var o=s.split(":")[0].split("/")[0],u=["redirect_uri="+encodeURIComponent(n),"scope="+encodeURIComponent(scopesStr),"response_type=token","client_id="+encodeURIComponent(o)],a=e.properties["http://oauth.net/core/1.0/endpoint/request"];return a+(a.indexOf("?")===-1?"?":"&")+u.join("&")},a=function(e,t){t(e==="pds-remotestorage-00#couchdb"?n:r)},f=function(e,t,n){var r=((t.length?t+"/":"")+n).split("/"),i=r.splice(1).join("_");return e.href+"/"+r[0]+(e.properties.legacySuffix?e.properties.legacySuffix:"")+"/"+(i[0]=="_"?"u":"")+i},l=function(e,t,n){return{get:function(r,i){typeof r!="string"?i('argument "key" should be a string'):a(e.type,function(s){s.get(f(e,t,r),n,i)})},put:function(r,i,s){typeof r!="string"?s('argument "key" should be a string'):typeof i!="string"?s('argument "value" should be a string'):a(e.type,function(o){o.put(f(e,t,r),i,n,s)})},"delete":function(r,i){typeof r!="string"?i('argument "key" should be a string'):a(e.type,function(s){s["delete"](f(e,t,r),n,i)})}}},c=function(){var e=t.getFragmentParams();for(var n=0;n<e.length;n++)if(e[n].substring(0,"access_token=".length)=="access_token=")return e[n].substring("access_token=".length);return null};return{getStorageInfo:o,createStorageInfo:s,createOAuthAddress:u,createClient:l,receiveToken:c}}),remoteStorage=r("remoteStorage")})()