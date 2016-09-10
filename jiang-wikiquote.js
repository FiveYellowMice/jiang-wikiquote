(function(stuff) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", stuff);
	} else {
		stuff();
	}
})(function() {
	var apiRequest = new XMLHttpRequest();
	apiRequest.open("GET", "https://zh.wikiquote.org/w/api.php?format=json&action=query&prop=extracts&titles=%E6%B1%9F%E6%B3%BD%E6%B0%91&origin=*", true);
	apiRequest.setRequestHeader( 'Api-User-Agent', 'jiang-wikiquote/0.1 (https://github.com/FiveYellowMice/jiang-wikiquote)' );
	apiRequest.onload = function() {
		if (apiRequest.status >= 200 && apiRequest.status < 400) {
			requestSucceed(JSON.parse(apiRequest.responseText));
		} else {
			throw new Error("API request failed.\n" + apiRequest.responseText);
		}
	}
	apiRequest.onerror = function() {
		throw new Error("API request failed.");
	}
	apiRequest.send();
	
	function requestSucceed(apiResponse) {
		var pageHtml = apiResponse.query.pages[Object.keys(apiResponse.query.pages)[0]].extract;
		var parsedHtml = document.implementation.createHTMLDocument("");
		parsedHtml.documentElement.innerHTML = pageHtml;
		var sentences = Array.apply(null, parsedHtml.querySelectorAll("li, dd")).map(function(x) {
			return x.innerText;
		});
		var jiangSentences = [];
		var parenthesisRegex = /(?:\(.*\)|（.*）)/g;
		sentences.forEach(function(s) {
			if (/^.{1,5}(?:\:|：)/.test(s)) {
				var p = s.match(/^(.{1,5})(?:\:|：)/)[1];
				if (["江", "答"].indexOf(p) !== -1) {
					jiangSentences.push(s.substr(p.length + 1).replace(parenthesisRegex, ""));
				}
			} else if (/^(?:\(|（).*(?:\)|）)$/.test(s)) {
				// Filtered.
			} else {
				jiangSentences.push(s.replace(parenthesisRegex, ""));
			}
		});
		
		Array.apply(null, document.getElementsByClassName("jiang-quote")).forEach(function(e) {
			var randomNumber = Math.floor(Math.random() * jiangSentences.length);
			var randomQuote = jiangSentences[randomNumber];
			e.innerText = randomQuote;
		});
	}
});
