$(document).ready(function() {
	module("Local Leaderboard UI When interval is not going pass 0 or max players number", {
		setup : function() {
			this.containerId = "leaderboardContainer";

			this.data = [{
				name : "Player1",
				score : 1
			}, {
				name : "Player2",
				score : 2
			}, {
				name : "Player3",
				score : 3
			}, {
				name : "Player4",
				score : 4
			}, {
				name : "Player5",
				score : 5
			}, {
				name : "Player6",
				score : 6
			}, {
				name : "Player7",
				score : 10
			}];

			this.options = {
				title : "Testing the Leaderboar",
				width : 300,
				height : 250,
				data : this.data,
				pointsField : "score",
				labelFunction : function(item/*object*/, place /*integer*/) {
					return place + ":" + item.name;
				},
				localTo : {
					uniqueField : "name",
					fieldValue : "Player4",
					interval : 2,
					paint : true
				}
			}

			// create an element for the leaderboard
			$("body").append($(document.createElement("div")).attr("id", this.containerId));
			this.leaderboard = $("#" + this.containerId).leaderboard(this.options);
		},
		teardown : function() {
			console.log("tearing down");
			$("#" + this.containerId).leaderboard("destroy");
		}
	});

	test("Testing if the title is Correct when localTo is provided", function() {
		var value = $("#" + this.containerId + " .leaderboard-title").html();
		equal(value, this.options.title, "We expect title to be " + this.options.title);
	});
	test("Testing if displaying correctly the players count with localTo scenario", function() {
		var displayedElementsCount = $("#" + this.containerId).children(".leaderboard-ranklist").children().length;
		var expectedCount = this.options.localTo.interval * 2 + 1;
		equal(displayedElementsCount, expectedCount, "We expected displayed rankings with localTo scenario to be " + expectedCount)
	});
	test("Testing if ranklist items are displayed in correct order", function() {
		var displayedElements = $("#" + this.containerId).children(".leaderboard-ranklist").children();
		var expectedData = [{
			name : "Player2",
			score : 2,
			rank : 6
		}, {
			name : "Player3",
			score : 3,
			rank : 5
		}, {
			name : "Player4",
			score : 4,
			rank : 4
		}, {
			name : "Player5",
			score : 5,
			rank : 3
		}, {
			name : "Player6",
			score : 6,
			rank : 2
		}].reverse();
		for(var i = 0, len = displayedElements.length; i < len; ++i) {
			var item = $(displayedElements[i]).html();
			equal(item, this.options.labelFunction(expectedData[i], expectedData[i].rank), "Item with rank " + (i + 1) + " should be equal to " + item);
		}
	});
});
