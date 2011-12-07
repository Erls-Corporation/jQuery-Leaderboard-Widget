$(document).ready(function() {
	var dataProvider = [];
	var self = this;

	$.ajax({
		url : "./data.json",
		dataType : "json",
		method : "get",
		async : false,
		success : function(data) {
			self.dataProvider = data.information;
		},
		error : function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus + ' ' + errorThrown);
		}
	});

	module("Testing Local Leaderboard View with provided filterFunction", {
		setup : function() {
			console.log(self.dataProvider);
			this.containerId = "leaderboardContainer";
			this.data = self.dataProvider;
			this.options = {
				data : this.data,
				labelFunction : function(item, place) {
					return place + ":" + item.name;
				},
				pointsFunction : function(item1, item2) {
					var a = item1.books.length, b = item2.books.length;
					return (((a < b) ? +1 : (a > b) ? -1 : 0));
				},
				localTo : {
					filterFunction : function(constantItem, item) {
						console.log(constantItem, item);
						for(var i = 0, len = item.books.length; i < len; ++i) {
							if(item.books[i].title === "Gamification By Design") {
								return true;
							}
						}
						return false;
					},
					uniqueField : "name",
					fieldValue : "Dimitar Karamanchev",
					interval : 3,
					paint : true

				}
			};
			$("body").append($(document.createElement("div")).attr("id", this.containerId));
			this.leaderboard = $("#" + this.containerId).leaderboard(this.options);
		}
	});

	test("Testing if data is filtered correctly", function() {
		var displayedElements = $("#" + this.containerId).children(".leaderboard-ranklist").children();
		//ok(displayedElements.length > 0);
	});
})