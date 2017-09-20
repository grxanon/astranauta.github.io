

function parsesize (size) {
	if (size === "T") size = "Tiny";
	if (size === "S") size = "Small";
	if (size === "M") size = "Medium";
	if (size === "L") size = "Large";
	if (size === "H") size = "Huge";
	if (size === "G") size = "Gargantuan";
	return size;
}

function parseschool (school) {
	if (school === "A") return "abjuration";
	if (school === "EV") return "evocation";
	if (school === "EN") return "enchantment";
	if (school === "I") return "illusion";
	if (school === "D") return "divination";
	if (school === "N") return "necromancy";
	if (school === "T") return "transmutation";
	if (school === "C") return "conjuration";
	return "";
}

function parsespelllevel (level) {
	if (isNaN (level)) return "";
	if (level === "0") return "cantrip";
	if (level === "2") return level+"nd";
	if (level === "3") return level+"rd";
	if (level === "1") return level+"st";
	return level+"th";
}

const SRC_PHB = "PHB";
const SRC_EEPC = "EEPC";
const SRC_SCAG = "SCAG";
const SRC_UAMystic = "UAMystic";
const SRC_UAStarterSpells = "UAStarterSpells";
const SRC_UAModern = "UAModern";
const SRC_UATOBM = "UATOBM";
const SRC_BOLS_3PP = "BoLS 3pp";
const SRC_DM01_3PP = "DM-01 3pp";
const SRC_DM02_3PP = "DM-02 3pp";
const SRC_DM03_3PP = "DM-03 3pp";
const SRC_DM04_3PP = "DM-04 3pp";
const SRC_DM05_3PP = "DM-05 3pp";
const SRC_DM06_3PP = "DM-06 3pp";
const SRC_DM07_3PP = "DM-07 3pp";
const SRC_DM08_3PP = "DM-08 3pp";
const SRC_DM09_3PP = "DM-09 3pp";
const SRC_DM10_3PP = "DM-10 3pp";
const SRC_DM11_3PP = "DM-11 3pp";
const SRC_DM12_3PP = "DM-12 3pp";
const SRC_DM13_3PP = "DM-13 3pp";
function parsesource (source) {
	if (source === SRC_PHB) source = "Player's Handbook";
	if (source === SRC_EEPC) source = "Elemental Evil Player's Companion";
	if (source === SRC_SCAG) source = "Sword Coast Adventurer's Guide";
	if (source === SRC_UAMystic) source = "Unearthed Arcana: The Mystic Class";
	if (source === SRC_UAStarterSpells) source = "Unearthed Arcana: Starter Spells";
	if (source === SRC_UAModern) source = "Unearthed Arcana: Modern Magic";
	if (source === SRC_UATOBM) source = "Unearthed Arcana: That Old Black Magic";
	if (source === SRC_BOLS_3PP) source = "Book of Lost Spells (3pp)";
	if (source === SRC_DM01_3PP) source = "Deep Magic #01: Clockwork (3pp)";
	if (source === SRC_DM02_3PP) source = "Deep Magic #02: Rune Magic (3pp)";
	if (source === SRC_DM03_3PP) source = "Deep Magic #03: Void Magic (3pp)";
	if (source === SRC_DM04_3PP) source = "Deep Magic #04: Illumination Magic (3pp)";
	if (source === SRC_DM05_3PP) source = "Deep Magic #05: Ley Lines (3pp)";
	if (source === SRC_DM06_3PP) source = "Deep Magic #06: Angelic Seals (3pp)";
	if (source === SRC_DM07_3PP) source = "Deep Magic #07: Chaos Magic (3pp)";
	if (source === SRC_DM08_3PP) source = "Deep Magic #08: Battle Magic (3pp)";
	if (source === SRC_DM09_3PP) source = "Deep Magic #09: Ring Magic (3pp)";
	if (source === SRC_DM10_3PP) source = "Deep Magic #10: Shadow Magic (3pp)";
	if (source === SRC_DM11_3PP) source = "Deep Magic #11: Elven High Magic (3pp)";
	if (source === SRC_DM12_3PP) source = "Deep Magic #12: Blood and Doom (3pp)";
	if (source === SRC_DM13_3PP) source = "Deep Magic #13: Dragon Magic (3pp)";
	return source;
}
function abbreviateSource(source) {
    if (source === SRC_PHB) source = "PHB";
    if (source === SRC_EEPC) source = "EEPC";
    if (source === SRC_SCAG) source = "SCAG";
    if (source === SRC_UAMystic) source = "UAM";
    if (source === SRC_UAStarterSpells) source = "UASS";
    if (source === SRC_UAModern) source = "UAMM";
    if (source === SRC_UATOBM) source = "UAOBM";
    if (source === SRC_BOLS_3PP) source = "BLS";
	if (source === SRC_DM01_3PP) source = "DM01";
	if (source === SRC_DM02_3PP) source = "DM02";
	if (source === SRC_DM03_3PP) source = "DM03";
	if (source === SRC_DM04_3PP) source = "DM04";
	if (source === SRC_DM05_3PP) source = "DM05";
	if (source === SRC_DM06_3PP) source = "DM06";
	if (source === SRC_DM07_3PP) source = "DM07";
	if (source === SRC_DM08_3PP) source = "DM08";
	if (source === SRC_DM09_3PP) source = "DM09";
	if (source === SRC_DM10_3PP) source = "DM10";
	if (source === SRC_DM11_3PP) source = "DM11";
	if (source === SRC_DM12_3PP) source = "DM12";
	if (source === SRC_DM13_3PP) source = "DM13";
    return source;
}

const SELF_RANGE_OFFSET = -4;
const FEET_PER_MILE = 5280;
const ALL_RANGES = -2; // used in spells.html where the filter is defined
const SELF_RANGE = -1;
const TOUCH_RANGE = 0;
const SIGHT_RANGE = 900000000;
const UNLIMITED_RANGE = 900000001;
const SPECIAL_RANGE = 1000000000;
const VARIABLE_RANGE = 1000000001;
const UNKNOWN_RANGE = 1000000002;
const DISTANCE_REGEX = /(\d+) feet|(1) foot/; // eg "120 feet" or "1 foot"
const SELF_AREA_RADIUS_REGEX = /self \((\d+)-foot radius\)/; // eg "Self (10-foot radius)"
const SELF_AREA_SPHERE_REGEX = /self \((\d+)-foot-radius sphere\)/; // eg "Self (10-foot-radius sphere)"
const SELF_AREA_CUBE_REGEX = /self \((\d+)-foot cube\)/; // eg "Self (10-foot-radius sphere)"
const SELF_AREA_HEMISPHERE_REGEX = /self \((\d+)-foot-radius hemisphere\)/; // eg "Self (10-foot-radius hemisphere)"
const SELF_AREA_LINE_REGEX = /self \((\d+)-foot line\)/; // eg "Self (10-foot line)"
const SELF_AREA_CONE_REGEX = /self \((\d+)-foot cone\)/; // eg "Self (10-foot cone)"
const MILE_DISTANCE_REGEX = /(\d+) miles|(1) mile/; // eg "500 miles" or "1 mile"
const MILE_SELF_AREA_REGEX = /self \((\d+)-mile .*\)/; // eg "Self (5-mile radius)"
function normaliserange(range) {
	range = range.toLowerCase();
    if (range === "self") return SELF_RANGE;
    if (range === "touch") return TOUCH_RANGE;
    if (range === "sight") return SIGHT_RANGE;
    if (range === "unlimited") return UNLIMITED_RANGE;
    if (range === "special") return SPECIAL_RANGE;
    if (range === "varies") return VARIABLE_RANGE;

    var out = "";
    var matchesDistance = DISTANCE_REGEX.exec(range.trim());
    if (matchesDistance) {
        out = matchesDistance[1] === undefined ? matchesDistance[2] : matchesDistance[1];
        return parseInt(out);
    }

    var matchesSelfAreaRadius = SELF_AREA_RADIUS_REGEX.exec(range.trim());
    if (matchesSelfAreaRadius) {
        return parseInt(matchesSelfAreaRadius[1]) + 3;
    }

    var matchesSelfAreaSphere = SELF_AREA_SPHERE_REGEX.exec(range.trim());
    if (matchesSelfAreaSphere) {
        return parseInt(matchesSelfAreaSphere[1]) + 4;
    }

    var matchesSelfAreaCube = SELF_AREA_CUBE_REGEX.exec(range.trim());
    if (matchesSelfAreaCube) {
        return parseInt(matchesSelfAreaCube[1]) + 5;
    }

    var matchesSelfAreaHemisphere = SELF_AREA_HEMISPHERE_REGEX.exec(range.trim());
    if (matchesSelfAreaHemisphere) {
        return parseInt(matchesSelfAreaHemisphere[1]) + 6;
    }

    var matchesSelfAreaLine = SELF_AREA_LINE_REGEX.exec(range.trim());
    if (matchesSelfAreaLine) {
        return parseInt(matchesSelfAreaLine[1]) + 7;
    }

    var matchesSelfAreaCone = SELF_AREA_CONE_REGEX.exec(range.trim());
    if (matchesSelfAreaCone) {
        return parseInt(matchesSelfAreaCone[1]) + SELF_RANGE_OFFSET;
    }

    var matchesMileDistance = MILE_DISTANCE_REGEX.exec(range.trim());
    if (matchesMileDistance) {
    	out = matchesMileDistance[1] === undefined ? matchesMileDistance[2] : matchesMileDistance[1];
        return parseInt(out) * FEET_PER_MILE;
    }

    var matchesSelfMileArea = MILE_SELF_AREA_REGEX.exec(range.trim());
    if (matchesSelfMileArea) {
        return (parseInt(matchesSelfMileArea[1]) * FEET_PER_MILE) - 7;
    }

    console.log("failed to find range for: " + range);
    return UNKNOWN_RANGE;
}

function asc_sort(a, b){
    return ($(b).text()) < ($(a).text()) ? 1 : -1;
}

function asc_sort_range(a, b){
    return (parseInt(b.value)) < parseInt((a.value)) ? 1 : -1;
}

function dec_sort(a, b){
    return ($(b).text()) > ($(a).text()) ? 1 : -1;
}

window.onload = loadspells;

function loadspells() {
	tabledefault = $("#stats").html();

	var spelllist = spelldata.compendium.spell;

		for (var i = 0; i < spelllist.length; i++) {
			var curspell = spelllist[i];
			var name = curspell.name;
			if (curspell.level[0] === "P") name += " (Psionics)";

			var leveltext = parsespelllevel(curspell.level);
			// if (parseInt(curspell.level) > 0) leveltext += " level"
			if (curspell.ritual === "YES") leveltext += " (ritual)";

			var schooltext = parseschool(curspell.school);
			if (!schooltext) {
				if (curspell.level[1] === "D") {
					schooltext = curspell.classes.split(/Mystic \(/g)[1].split(")")[0];
					schooltext += " Discipline";
					leveltext = "Discipline";
				} else if (curspell.level[1] === "T") {
					schooltext = "Psionic Talent";
					leveltext = "Talent";
				} else if (curspell.school == "VM") {
					schooltext = "Void Magic";
				}
			}

			var source = "PHB";
			if (curspell.source) {
				source = curspell.source;
			} else {
				curspell.source = "PHB";
			}

			if (!curspell.range) {
                curspell.range = "Varies";
			}

            var toadd = "<li class='row' id='"+i+"' data-link='"+encodeURIComponent(name).toLowerCase().replace("'","%27")+"' data-name='"+encodeURIComponent(name).replace("'","%27")+"'><span class='name col-xs-3 col-xs-3-7'>"+name+"</span> <span class='source col-xs-1' title=\""+parsesource(source)+"\">"+abbreviateSource(source)+"</span> <span class='level col-xs-1 col-xs-1-7'>"+leveltext+"</span> <span class='school col-xs-2 col-xs-2-5'>"+schooltext+"</span> <span class='classes' style='display: none'>"+curspell.classes+"</span> <span class='range col-xs-3 col-xs-3-1'>"+curspell.range+"</span>";
             if (curspell.level[0] === "P" && curspell.level[1] === "D") { // if it's a psionic discipline, make an invisible search field with all the modes associated
                var textlist = curspell.text;

                var psisearch = "";
                for (var j = 0; j < textlist.length; ++j) {
                    var regex = /^((.* )\(.*psi.*?\)|Bestial Transformation)\./g;
                    var matches = regex.exec(textlist[j]);

                    if (matches) {
                        var cleanedpsi = matches[1].trim();
                        if (cleanedpsi.indexOf("(") != -1) {
                            cleanedpsi = cleanedpsi.substring(0, cleanedpsi.indexOf("("));
                        }
                        psisearch += '"' + cleanedpsi.trim() + '" '
                    }
                }

                toadd = toadd + "<span class='disciplinesearch' style='display: none'>"+psisearch+"</span>";
             }
             toadd = toadd + "</li>";
			$("ul.spells").append(toadd);

			if (!$("select.levelfilter:contains('"+parsespelllevel(curspell.level)+"')").length) {
				$("select.levelfilter").append("<option value='"+curspell.level+"'>"+parsespelllevel(curspell.level)+"</option>");
			}

			if (!$("select.schoolfilter:contains('"+parseschool (curspell.school)+"')").length) {
				$("select.schoolfilter").append("<option value='"+parseschool (curspell.school)+"'>"+parseschool (curspell.school)+"</option>");
			}

			if (!$("select.sourcefilter:contains(\""+parsesource(source)+"\")").length) {
				$("select.sourcefilter").append("<option value='"+source+"'>"+parsesource(source)+"</option>");
			}

			var classlist = curspell.classes.split(",");
			for (var a = 0; a < classlist.length; a++) {
				if (classlist[a][0] === " ") classlist[a] = classlist[a].replace(/^\s+|\s+$/g, "")
				if (!$("select.classfilter option[value='"+classlist[a]+"']").length) {
					$("select.classfilter").append("<option title=\""+classlist[a]+"\" value='"+classlist[a]+"'>"+classlist[a]+"</option>")
				}
			}

			// TODO range filter
            if (!$("select.rangefilter:contains(\""+curspell.range+"\")").length) {
                $("select.rangefilter").append("<option value='"+normaliserange(curspell.range)+"'>"+curspell.range+"</option>");
            }
		}

		$("select.levelfilter option").sort(asc_sort).appendTo('select.levelfilter');
		$("select.levelfilter option[value=1]").before($("select.levelfilter option[value=All]"));
		$("select.levelfilter option[value=1]").before($("select.levelfilter option[value=0]"));
		$("select.levelfilter").val("All");

		$("select.schoolfilter option").sort(asc_sort).appendTo('select.schoolfilter');
		$("select.schoolfilter").val("All");

		$("select.classfilter option").sort(asc_sort).appendTo('select.classfilter');
		$("select.classfilter").val("All");

		$("select.sourcefilter option").sort(asc_sort).appendTo('select.sourcefilter');
		$("select.sourcefilter").val("All");

   		$("select.rangefilter option").sort(asc_sort_range).appendTo('select.rangefilter');
   		$("select.rangefilter").val(ALL_RANGES.toString());

		var options = {
			valueNames: ['name', 'source', 'level', 'school', 'classes', 'disciplinesearch', 'range'],
			listClass: "spells"
		};

		var spellslist = new List("listcontainer", options);
		spellslist.sort ("name");

		$("ul.list li").mousedown(function(e) {
			if (e.which === 2) {
				console.log("#"+$(this).attr("data-link").toLowerCase())
				window.open("#"+$(this).attr("data-link").toLowerCase(), "_blank").focus();
				e.preventDefault();
				e.stopPropagation();
				return;
			}
		});

		$("ul.list li").click(function(e) {
			window.location = "#"+$(this).attr("data-link").toLowerCase();
		});

		if (window.location.hash.length) {
			$("ul.list li[data-link='"+window.location.hash.split("#")[1].toLowerCase()+"']:eq(0)").click();
		} else $("ul.list li:eq(0)").click();

		$("form#filtertools select").change(function(){
			var levelfilter = $("select.levelfilter").val();
			if (levelfilter !== "All") {

				if (levelfilter[0] !== "d" && levelfilter[0] !== "t") {
					levelfilter = parsespelllevel (levelfilter);
					if (levelfilter !== "cantrip") {
						levelfilter = levelfilter + " level"
					} else levelfilter = "cantrip";
					if ($(".ritualfilter").val() === "Rituals") levelfilter = levelfilter + " (ritual)"
				}
			} else if ($(".ritualfilter").val() === "Rituals") levelfilter = "(ritual)"

			var schoolfilter = $("select.schoolfilter").val();
			var classfilter = $("select.classfilter").val();
			var sourcefilter = $("select.sourcefilter").val();
			var thirdpartyfilter = $("select.3ppfilter").val();
			var rangefilter = parseInt($("select.rangefilter").val());

			spellslist.filter(function(item) {
				var rightlevel = false;
				var rightschool = false;
				var rightclass = false;
				var rightsource = false;
				var rightparty = false;
				var rightrange = false;

				if (levelfilter === "All" || item.values().level.indexOf(levelfilter) !== -1) rightlevel = true;
				if (schoolfilter === "All" || item.values().school === schoolfilter) rightschool = true;
				var classes = item.values().classes.split(", ");
				for (var c = 0; c < classes.length; c++) {
					if (classes[c] === classfilter) rightclass = true;
				}
				if (classfilter === "All") rightclass = true;
				if (sourcefilter === "All" || item.values().source === sourcefilter) rightsource = true;
				if (thirdpartyfilter === "All") rightparty = true;
				if (thirdpartyfilter === "None" && item.values().source.indexOf("3pp") === -1) rightparty = true;
				if (thirdpartyfilter === "Only" && item.values().source.indexOf("3pp") !== -1) rightparty = true;
                if (rangefilter === ALL_RANGES || normaliserange(item.values().range) === rangefilter) rightrange = true;
				if (rightlevel && rightschool && rightclass && rightsource && rightparty && rightrange) return true;
				return false;
			});
		});

		$("#filtertools small").click(function() {
			$("#search").val("psionics");
			spellslist.search("psionics");
		})

		$("#filtertools button.sort").on("click", function() {
			if ($(this).attr("sortby") === "asc") {
				$(this).attr("sortby", "desc");
			} else $(this).attr("sortby", "asc");
			spellslist.sort($(this).data("sort"), { order: $(this).attr("sortby"), sortFunction: sortspells });
		});

			// reset button
			$("button#reset").click(function() {
				$("#filtertools select").val("All");
				$(".rangefilter").val(-2);
				$("#search").val("");
				spellslist.search("");
				spellslist.filter();
				spellslist.sort("name");
				spellslist.update();
			})
}

function sortspells(a, b, o) {
	if (o.valueName === "name") {
		return ((b._values.name.toLowerCase()) > (a._values.name.toLowerCase())) ? 1 : -1;
	}

	if (o.valueName === "school") {
		return ((b._values.school.toLowerCase()) > (a._values.school.toLowerCase())) ? 1 : -1;
	}


	if (o.valueName === "level") {
		var alevel = a._values.level.replace(" ", "").replace("cantrip", "0")[0];
		var blevel = b._values.level.replace(" ", "").replace("cantrip", "0")[0];
		if (alevel === "D") alevel = "10";
		if (blevel === "D") blevel = "10";
		if (alevel === "T") alevel = "11";
		if (blevel === "T") blevel = "11";
		return (parseInt(blevel) > parseInt(alevel)) ? 1 : -1;
	}

    if (o.valueName === "range") {
        return (normaliserange(b._values.range.toLowerCase()) > normaliserange(a._values.range)) ? 1 : -1;
    }

	return 0;

}

function usespell (id) {
    $("#stats").html(tabledefault);
    var spelllist = spelldata.compendium.spell;
    var curspell = spelllist[id];

    $("th#name").html("<span title=\""+parsesource(curspell.source)+"\" class='source source"+curspell.source+"'>"+curspell.source+"</span> "+curspell.name);

    // $("th#name").html(curspell.name);

    if (curspell.level[0] !== "P") {
        $("td span#school").html(parseschool(curspell.school));
        if (curspell.level === "0") {
            $("td span#school").css('textTransform', 'capitalize');
            $("td span#level").css('textTransform', 'lowercase!important');
            $("td span#level").html(" cantrip").detach().appendTo("td span#school");
        } else {
            $("td span#school").css('textTransform', 'lowercase');
            $("td span#level").html(parsespelllevel (curspell.level)+"-level");
        }

        if (curspell.ritual === "YES") {
            $("td span#ritual").show();
        } else $("td span#ritual").hide();

        $("td#components span").html(curspell.components);
        $("td#range span").html(curspell.range);
        $("td#castingtime span").html(curspell.time);
        $("td#duration span").html(curspell.duration);
    } else {
        var psitype = "";
        if (curspell.level[1] === "D") {
            psitype = curspell.classes.split(/Mystic \(/g)[1].split(")")[0];
            psitype += " Discipline";
        } else if (curspell.level[1] === "T") {
            psitype = "Psionic Talent";
        }
        $("td#levelschoolritual").html(psitype);
        $("td#castingtime").html("");
        $("td#range").html("");
        $("td#components").html("");
        $("td#duration").html("");
    }

    $("tr.text").remove();
    var textlist = curspell.text;
    var texthtml = "";

    if (textlist[0].length === 1) {
        texthtml = "<p>"+textlist+"</p>";
    } else for (var i = 0; i < textlist.length; i++) {
        if (!textlist[i]) continue;
        if (curspell.level[0] !== "P") {
            texthtml = texthtml + "<p>"+textlist[i].replace("At Higher Levels: ", "<strong>At Higher Levels:</strong> ") + "</p>";
        } else {
            texthtml = texthtml + "<p>"+textlist[i].replace(/^.*(\(.*psi.*?\)|Psychic Focus|Bestial Transformation)\./g,"<strong>$&</strong>")+"</p>";
        }
    }
    $("tr#text").after("<tr class='text'><td colspan='6' class='text"+i+"'>"+texthtml+"</td></tr>");

    $("td#classes span").html(curspell.classes);

    return;
}