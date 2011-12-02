$(document).ready(function() {
	module("Testing leaderboard when the provided input is undefined/null/false not the documented type", {
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
				title : undefined,
				width : -300,
				height : -250,
				topPlayers : -3,
				data : this.data,
				pointsField : "score",
				pointsFunction : undefined,
				labelFunction : function(item/*object*/, place /*integer*/) {
					return place + ":" + item.name;
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

	test("Testing the title when undefined is provided as a value", function() {
		var value = $("#" + this.containerId + " .leaderboard-title").html();
		equal(value, "Default Leaderboard Title", "We expect title to be " + "<em>Default Leaderboard Title</em>");
	});
	test("Testing if the width and height are correct when negative values are provided", function() {
		var width = $("#" + this.containerId).width(), height = $("#" + this.containerId).height();
		equal(width, Math.abs(this.options.width), "We expect width to be " + Math.abs(this.options.width));
		equal(height, Math.abs(this.options.height), "We expect height to be " + Math.abs(this.options.height));
	});
	test("Testing leaderboard when changing the width and height option dynamically with negative values", function() {
		var newWidthValue = -550, newHeightValue = -550;

		this.leaderboard.leaderboard("option", "width", newWidthValue);
		this.leaderboard.leaderboard("option", "height", newHeightValue);
		var currentWidth = $("#" + this.containerId).width(), currentHeight = $("#" + this.containerId).height();
		equal(currentWidth, -1 * newWidthValue, "We expect width to be " + currentWidth);
		equal(currentHeight, -1 * newHeightValue, "We expect height to be " + currentHeight);
	});
	test("Testing if displaying correctly top players count when negative value is provided and there is no data", function() {
		var displayedElementsCount = $("#" + this.containerId).children(".leaderboard-ranklist").children().length;
		equal(displayedElementsCount, Math.abs(this.options.topPlayers), "We expected displayed rankings to be " + Math.abs(this.options.topPlayers));
	});
});
