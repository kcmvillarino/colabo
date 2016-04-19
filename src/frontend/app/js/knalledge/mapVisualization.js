(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

/**
@classdesc Deals with visualization of the KnAllEdge map. It hes few specialized classes responsible for different type of map visualizations
@class MapVisualization
@memberof knalledge
*/

var MapVisualization =  knalledge.MapVisualization = function(){
};

MapVisualization.prototype.construct = function(dom, mapStructure, collaboPluginsService, configTransitions, configTree, configNodes, configEdges, rimaService, notifyService, mapPlugins, knalledgeMapViewService, upperAPI){
	this.dom = dom;
	this.mapStructure = mapStructure;
	this.previousSelectedNode = null;
	this.collaboPluginsService = collaboPluginsService;

	this.configTransitions = configTransitions;
	this.configTree = configTree;
	this.configNodes = configNodes;
	this.configEdges = configEdges;
	this.editingNodeHtml = null;
	// size of visualizing DOM element
	this.mapSize = null;
	// scales used for transformation of knalledge from informational to visual domain
	this.scales = null;
	this.rimaService = rimaService;
	this.notifyService = notifyService;
	this.mapPlugins = mapPlugins;
	this.knalledgeMapViewService = knalledgeMapViewService;
	this.injector = null;
	this.mapInteraction = null;
	this.upperAPI = upperAPI;
	this.halo = null;
};

MapVisualization.prototype.init = function(mapLayout, mapSize, injector){
	var that = this;

	this.mapSize = mapSize;
	this.scales = this.setScales();

	this.mapLayout = mapLayout;

	this.injector = injector;
	this.mapInteraction = this.injector.get("mapInteraction");

	this.dom.divMap = this.dom.parentDom.append("div")
		.attr("class", "div_map");

	if(this.configNodes.html.show){
		this.dom.divMapHtml = this.dom.divMap.append("div")
			.attr("class", "div_map_html")
			.append("div")
				.attr("class", "html_content");
	}

	this.dom.divMapSvg = this.dom.divMap.append("div")
		.attr("class", "div_map_svg");

	this.dom.svg = this.dom.divMapSvg
		.append("svg")
			.append("g")
				.attr("class", "svg_content");

	this._initHalo();
};

MapVisualization.prototype._initHalo = function(){
	var that = this;

	this.halo = (interaction && interaction.Halo) ? new interaction.Halo() : null;

	if(this.halo){
		var haloOptions = {
			exclusive: true,
			createAt: "sibling"
		};

		this.halo.init(haloOptions, function(event){
			var d = d3.select(event.source).data();
			if( Object.prototype.toString.call( d ) === '[object Array]' ) {
				d = d[0];
			}

			switch(event.action){
			case "toggle":
				that.halo.destroy();

				// window.alert("Showing params");
				// this.selectedView = null;
				that.mapInteraction.toggleNode();

				break;
			case "addNode":
				that.halo.destroy();

				// window.alert("Showing analysis");
				// this.selectedView = null;
				that.mapInteraction.addNode();

				break;
			case "deleteNode":
				that.halo.destroy();

				// window.alert("Showing analysis");
				// this.selectedView = null;
				that.mapInteraction.deleteNode();

				break;

			case "editNode":
				that.halo.destroy();

				// window.alert("Showing analysis");
				// this.selectedView = null;
				that.mapInteraction.setEditing();

				break;
			}
		});
	}
};

MapVisualization.prototype.updateName = function(nodeView){
	var nodeSpan = nodeView.select("span");
	var newName = nodeSpan.text();
	if(newName === ""){
		newName = "name...";
		nodeSpan.text(newName);
	}
	var d = nodeView.datum();
	this.mapStructure.updateName(d, newName);
};

MapVisualization.prototype.updateNodeDimensions = function(){
	if(!this.configNodes.html.show) return;
	// var that = this;

	this.dom.divMapHtml.selectAll("div.node_html").each(function(d) {
		// Get centroid(this.d)
		d.width = parseInt(d3.select(this).style("width"));
		d.height = parseInt(d3.select(this).style("height"));
		// d3.select(this).style("top", function(d) {
		// 	return "" + that.mapLayout.getHtmlNodePosition(d) + "px";
		// })
	});
};

MapVisualization.prototype.getDom = function(){
	return this.dom;
};

MapVisualization.prototype.getAllNodesHtml = function(){
	var result = this.dom.divMapHtml ? this.dom.divMapHtml.selectAll("div.node_html") : null;
	return result;
};

// Returns view representation (dom) from datum d
MapVisualization.prototype.getDomFromDatum = function(d) {
	var htmlNodes = this.getAllNodesHtml();
	if(!htmlNodes) return null;
	var dom = htmlNodes
		.data([d], function(d){return d.id;});
	if(dom.size() != 1) return null;
	else return dom;
};

MapVisualization.prototype.setDomSize = function(maxX, maxY){
	if(typeof maxX == 'undefined') maxX = 5000;
	if(typeof maxY == 'undefined') maxY = 5000;

	if(maxX < this.mapSize[0]){
		maxX = this.mapSize[0];
	}
	if(maxY < this.mapSize[1]){
		maxY = this.mapSize[1];
	}

	this.dom.divMap
		.style("width", maxX)
		.style("height", maxY);
	if(this.dom.divMapHtml){
		this.dom.divMapHtml
			.style("width", maxX)
			.style("height", maxY);
	}
	// TODO: fix to avoid use of selector
	if(this.dom.divMapSvg){
		this.dom.divMapSvg.select("svg")
			.style("width", maxX)
			.style("height", maxY);
	}
};

MapVisualization.prototype.setScales = function(){
	// var that = this;

	var scales = {
		x: null,
		y: null,
		width: null,
		height: null
	};

	// var maxIntensity = d3.max(dataset, function(d) { return d.y; });
	// var minIntensity = d3.min(dataset, function(d) { return d.y; });

	if(false){
		var scale = d3.scale.linear()
			.domain([0, 1])
			.range([0, 1]);
		scales.x = scale;
		scales.y = scale;
		scales.width = scale;
		scales.height = scale;
	}else{
		var maxX = this.mapSize[0];
		var maxY = this.mapSize[1];

		var scaling = 1;

		scales.x = d3.scale.linear()
			.domain([0, maxY])
			.range([this.configTree.margin.top, this.configTree.margin.top+maxY]);
		scales.y = d3.scale.linear()
			.domain([0, maxX])
			.range([this.configTree.margin.left, this.configTree.margin.left+maxX]);

		scales.x = d3.scale.linear()
			.domain([0, 1])
			.range([0, scaling]);
		scales.y = d3.scale.linear()
			.domain([0, 1])
			.range([0, scaling]);

		scales.width = d3.scale.linear()
			.domain([0, maxX])
			.range([this.configTree.margin.left, this.configTree.margin.left+maxX]);
		scales.height = d3.scale.linear()
			.domain([0, maxY])
			.range([this.configTree.margin.top, this.configTree.margin.top+maxY]);

		scales.width = d3.scale.linear()
			.domain([0, 1])
			.range([0, scaling]);
		scales.height = d3.scale.linear()
			.domain([0, 1])
			.range([0, scaling]);
	}
	return scales;
};

/**
 * Visualizes node selection
 * @function nodeSelected
 * @memberof knalledge.MapVisualization
 * @param  {*} d - data that is associated with node
 * @return {knalledge.MapVisualization}
 */
MapVisualization.prototype.nodeSelected = function(d) {
	if(this.previousSelectedNode !== d){
		this.previousSelectedNode = d;

		var nodesHtmlSelected = this.getDomFromDatum(d);

		// unselect all nodes
		var nodesHtml = this.getAllNodesHtml();
		if(nodesHtml){
			nodesHtml.classed({
				"node_selected": false,
				"node_unselected": true
			});
		}

		if(nodesHtmlSelected){
			nodesHtmlSelected.classed({
				"node_selected": true,
				"node_unselected": false
			});
		}

		// TODO: it might be too early, it should be after update?
		if(nodesHtmlSelected) this.positionToDatum(d);
	}

	this.nodeFocus(d);

	return this;
};

/**
 * Updates Visualization of the selected node
 * @function nodeSelectionUpdate
 * @memberof knalledge.MapVisualization
 * @param  {*} d - data that is associated with node
 * @return {knalledge.MapVisualization}
 */
MapVisualization.prototype.nodeSelectionUpdate = function(d) {
	var nodesHtmlSelected = this.getDomFromDatum(d);

	// TODO: update halo

	return this;
};

/**
 * Updates Visualization of the selected node
 * @function nodeFocus
 * @memberof knalledge.MapVisualization
 * @param  {*} d - data that is associated with node
 * @return {knalledge.MapVisualization}
 */
MapVisualization.prototype.nodeFocus = function(d) {
	var nodesHtmlSelected = this.getDomFromDatum(d);

	// halo
	if(this.halo && nodesHtmlSelected){
		var haloOptions = {
			icons: [
				{
					position: "e",
					iconClass: "fa-plus-circle",
					action: "addNode"
				},
				{
					position: "n",
					iconClass: "fa-folder-open",
					action: "toggle"
				},
				{
					position: "s",
					iconClass: "fa-pencil",
					action: "editNode"
				},
				{
					position: "w",
					iconClass: "fa-minus-circle",
					action: "deleteNode"
				}
			]
		};
		this.halo.create(nodesHtmlSelected.node(), haloOptions);
	}

	return this;
};

MapVisualization.prototype.nodeUnselected = function(d) {
	var nodesHtmlSelected = this.getDomFromDatum(d);

	// unselect all nodes
	var nodesHtml = this.getAllNodesHtml();
	if(nodesHtml){
		nodesHtml.classed({
			"node_selected": false,
			"node_unselected": true
		});
	}

	// halo
	if(this.halo){
		this.halo.destroy();
	}

	this.previousSelectedNode = null;
};

/*
	positions map to specific 'datum'
*/
MapVisualization.prototype.positionToDatum = function(datum) {
	// TODO: Add support for scales
	var y = datum.x - this.dom.parentDom.node().getBoundingClientRect().height/2;
	var x = datum.y - this.dom.parentDom.node().getBoundingClientRect().width/2;
	var divMapNative = this.dom.divMap.node();
	var divMapJQ = $(divMapNative);
	divMapJQ = $('.knalledge_map_container');
	// console.log("divMapJQ.scrollLeft(): %s, divMapJQ.scrollTop(): %s", divMapJQ.scrollLeft(), divMapJQ.scrollTop());

	// https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollLeft
	// http://www.w3schools.com/jquery/css_scrolltop.asp
	// https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
	// http://stackoverflow.com/questions/4897947/jquery-scrolling-inside-a-div-scrollto
	// https://api.jquery.com/scrollTop/
	// https://api.jquery.com/scrollleft/

	// 	// https://github.com/tweenjs/tween.js/blob/master/docs/user_guide.md
	var position = { x:divMapJQ.scrollLeft(), y:divMapJQ.scrollTop()};
	var target = { x:x, y:y};
	var tween = new TWEEN.Tween(position).to(target, 500);
	tween.easing(TWEEN.Easing.Exponential.InOut);
	tween.onUpdate(function(){
		divMapJQ.scrollLeft(position.x);
		divMapJQ.scrollTop(position.y);
	});

	var animatePositioning = function() {
		requestAnimationFrame(animatePositioning);
		TWEEN.update();
	};

	animatePositioning();

	// TWEEN.remove(tween);
	// this.shapeView.animations.transition.push(tween);

	console.log("[GameView.rotateShape] starting pushing = %s", tween);
	tween.start();

	// d3.transition().duration(2000)
	// 	.ease("linear").each(function(){
	// d3.selectAll(".foo").transition() .style("opacity",0)
	// .remove(); })
};

}()); // end of 'use strict';
