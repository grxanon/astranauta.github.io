function parsesource (src) {
	let source = src;
	if (source === "Player's Handbook") source = "PHB";
	if (source === "Curse of Strahd") source = "CoS";
	if (source === "Sword Coast Adventurer's Guide") source = "SCAG";
	if (source === "Unearthed Arcana") source = "UA";
	if (source === "Plane Shift Innistrad") source = "PSI";
	if (source === "Plane Shift Amonkhet") source = "PSA";
	if (source === "Tomb of Annihilation") source = "ToA";
	return source;
}

var tabledefault = "";

window.onload = function load () {
	tabledefault = $("#stats").html();
	var bglist = backgrounddata.compendium.background;

	for (var i = 0; i < bglist.length; i++) {
		var curbg = bglist[i];
		var name = curbg.name;
		$("ul.backgrounds").append("<li><a id='"+i+"' href='#"+encodeURI(name).toLowerCase()+"' title='"+name+"'><span class='name col-xs-9'>"+name.replace("Variant ","")+"</span> <span class='source col-xs-3' title='"+curbg.source+"'>"+parsesource(curbg.source)+"</span></a></li>");

		if (!$("select.sourcefilter:contains(\""+curbg.source+"\")").length) {
			$("select.sourcefilter").append("<option value='"+parsesource(curbg.source)+"'>"+curbg.source+"</option>");
		}
	}

	$("select.sourcefilter option").sort(asc_sort).appendTo('select.sourcefilter');
	$("select.sourcefilter").val("All");

	const list = search({
		valueNames: ['name', 'source'],
		listClass: "backgrounds"
	})

	$("form#filtertools select").change(function(){
		var sourcefilter = $("select.sourcefilter").val();

		list.filter(function(item) {
			if (sourcefilter === "All" || item.values().source.indexOf(sourcefilter) !== -1) return true;
			return false;
		});
	});


	if (window.location.hash.length) {
		window.onhashchange();
	} else $("#listcontainer a").get(0).click();
}

function loadhash (id) {
	$("#stats").html(tabledefault);
	var bglist = backgrounddata.compendium.background;
	var curbg = bglist[id];

	var name = curbg.name;
	$("th#name").html(name);

	var traitlist = curbg.trait;
	$("tr.trait").remove();
	for (var n = traitlist.length-1; n >= 0; n--) {
		var traitname = traitlist[n].name;

		var texthtml = "";
		let headerText = "<span class='name'>"+traitname+".</span> ";

		texthtml += utils_combineText(traitlist[n].text, "p", headerText);

		var subtraitlist = traitlist[n].subtrait;
		if (subtraitlist !== undefined) {
			var k = 0;
			var subtrait;

			for (var j = 0; j < subtraitlist.length; j++) {
				texthtml = texthtml + "<p class='subtrait'>";
				subtrait = subtraitlist[j];
				texthtml = texthtml + "<span class='name'>"+subtrait.name+".</span> ";
				for (k = 0; k < subtrait.text.length; k++) {
					if (!subtrait.text[k]) continue;
					if (k === 0) {
						texthtml = texthtml + "<span>" + subtrait.text[k] + "</span>";
					} else {
						texthtml = texthtml + "<p class='subtrait'>" + subtrait.text[k] + "</p>";
					}
				}
				texthtml = texthtml + "</p>";
			}
		}

		$("tr#traits").after("<tr class='trait'><td colspan='6'>"+texthtml+"</td></tr>");
	}

}
