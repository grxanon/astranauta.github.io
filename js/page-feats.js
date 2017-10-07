function asc_sort(a, b){
	return ($(b).text()) < ($(a).text()) ? 1 : -1;
}

function dec_sort(a, b){
	return ($(b).text()) > ($(a).text()) ? 1 : -1;
}

var tabledefault = "";

window.onload = function load() {
	const NONE = "None";
	tabledefault = $("#stats").html();
	var featlist = featdata.compendium.feat;

	for (var i = 0; i < featlist.length; i++) {
		var curfeat = featlist[i];
		var name = curfeat.name;
		let attbText = utils_getAttributeText(curfeat.ability);
		if (!attbText) attbText = NONE;
		let prereqText = utils_makePrerequisite(curfeat.prerequisite, true);
		if (!prereqText) prereqText = NONE;
		const CLS_COL_1 = "name col-xs-3 col-xs-3-8";
		const CLS_COL_2 = "source col-xs-1 col-xs-1-7";
		const CLS_COL_3 = "ability " + (attbText === NONE ? "list-entry-none " : "") + "col-xs-3 col-xs-3-5";
		const CLS_COL_4 = "prerequisite " + (prereqText === NONE ? "list-entry-none " : "") + "col-xs-3";
		$("ul.feats").append("<li id='"+i+"' data-link='"+encodeURI(name).toLowerCase()+"' title='"+name+"'><span class='" + CLS_COL_1 + "'>"+name+"</span> <span class='" + CLS_COL_2 + "' title='"+curfeat.source+"'>"+parse_abbreviateSource(curfeat.source)+"</span> <span class='" + CLS_COL_3 + "'>" + attbText + "</span><span class='" + CLS_COL_4 + "'>" + prereqText + "</span></li>");

		if (!$("select.sourcefilter:contains(\""+parse_sourceToFull(curfeat.source)+"\")").length) {
			$("select.sourcefilter").append("<option value='"+parse_abbreviateSource(curfeat.source)+"'>"+parse_sourceToFull(curfeat.source)+"</option>");
		}

		// PREREQUISITE FILTER
		// let prereqList = utils_makePrerequisite(curfeat.prerequisite, false, true);
		// let prereqAbvList = utils_makePrerequisite(curfeat.prerequisite, true, true);
		// if (prereqList.length === prereqAbvList.length) {
		// 	for (let j = 0; j < prereqList.length; ++j) {
		// 		if (!$("select.prerequisitefilter:contains(\""+prereqList[j].uppercaseFirst()+"\")").length) {
		// 			$("select.prerequisitefilter").append("<option value='"+prereqAbvList[j]+"'>"+prereqList[j].uppercaseFirst()+"</option>");
		// 		}
		// 	}
		// } else {
		// 	console.log("prerequisite list and shorthand prerequisite list had different lengths!")
		// }
	}

	$("select.sourcefilter option").sort(asc_sort).appendTo('select.sourcefilter');
	$("select.sourcefilter").val("All");

	var options = {
		valueNames: ['name', 'source', 'ability', 'prerequisite'],
		listClass: "feats"
	};

	var featslist = new List("listcontainer", options);
	featslist.sort ("name");

	$("form#filtertools select").change(function(){
		let sourcefilter = $("select.sourcefilter").val();
		let bonusfilter = $("select.bonusfilter").val();

		featslist.filter(function(item) {
			let rightsource = sourcefilter === "All" || item.values().source.indexOf(sourcefilter) !== -1;
			let rightbonuses = bonusfilter === "All" || item.values().ability.indexOf(bonusfilter) !== -1 || item.values().ability.toLowerCase().indexOf("choose any") !== -1;
			if (rightsource && rightbonuses) return true;
			return false;
		});
	});

	$("ul.list li").mousedown(function(e) {
		if (e.which === 2) {
			console.log("#"+$(this).attr("data-link"))
			window.open("#"+$(this).attr("data-link"), "_blank").focus();
			e.preventDefault();
			e.stopPropagation();
			return;
		}
	});

	$("ul.list li").click(function(e) {
		window.location = "#"+$(this).attr("data-link");
	});

	if (window.location.hash.length) {
		window.onhashchange();
	} else $("ul.list li:eq(0)").click();

	// reset button
	$("button#reset").click(function() {
		$("#filtertools select").val("All");
		$("#search").val("");
		featslist.search("");
		featslist.filter();
		featslist.sort("name");
		featslist.update();
	})

}

function loadhash (id) {
	$("#stats").html(tabledefault);
	var featlist = featdata.compendium.feat;
	var curfeat = featlist[id];

	var name = curfeat.name;
	$("th#name").html(name);

	$("td#prerequisite").html("")
	var prerequisite = utils_makePrerequisite(curfeat.prerequisite);
	if (prerequisite) $("td#prerequisite").html("Prerequisite: "+prerequisite);

	$("tr.text").remove();

	addAttributeItem(curfeat.ability, curfeat.text);

	$("tr#text").after("<tr class='text'><td colspan='6'>"+utils_combineText(curfeat.text, "p")+"</td></tr>");

	function addAttributeItem(abilityObj, textArray) {
		if (abilityObj === undefined) return;
		for (let i = 0; i < textArray.length; ++i) { // insert the new list item at the head of the first list we find list; flag with "hasabilityitem" so we don't do it more than once
			if (textArray[i].islist === "YES" && textArray[i].hasabilityitem !== "YES") {
				textArray[i].hasabilityitem = "YES";
                textArray[i].items.unshift(abilityObjToListItem())
            }
		}

        function abilityObjToListItem() {
        	let listItem = {};
            listItem.text = attChooseText(abilityObj);
			return listItem;

			function attChooseText() {
				const TO_MAX_OF_TWENTY = ", to a maximum of 20.";
				if (abilityObj.choose === undefined) {
                    let abbArr = [];
                    for (let att in abilityObj) {
                        if(!abilityObj.hasOwnProperty(att)) continue;
                        abbArr.push("Increase your " + parse_attAbvToFull(att) + " score by " + abilityObj[att] + TO_MAX_OF_TWENTY);
                    }
                    return abbArr.join(" ");
				} else {
                    let abbArr = [];
					for (let i = 0; i < abilityObj.choose.length; ++i) {
                        if (abilityObj.choose[i].from.length === 6) {
                        	if (abilityObj.choose[i].textreference === "YES") { // only used in "Resilient"
								abbArr.push("Increase the chosen ability score by " + abilityObj.choose[i].amount + TO_MAX_OF_TWENTY);
							} else {
								abbArr.push("Increase one ability score of your choice by " + abilityObj.choose[i].amount + TO_MAX_OF_TWENTY);
							}
                        } else {
                        	let from = abilityObj.choose[i].from;
                        	let amount = abilityObj.choose[i].amount;
                        	let abbChoices = [];
                        	for (let j = 0; j < from.length; ++j) {
                                abbChoices.push(parse_attAbvToFull(from[j]));
							}
							let abbChoicesText = utils_joinPhraseArray(abbChoices, ", ", " or ");
                            abbArr.push("Increase your " + abbChoicesText + " by " + amount + TO_MAX_OF_TWENTY)
						}
					}
                    return abbArr.join(" ");
				}
			}
		}
    }
};
