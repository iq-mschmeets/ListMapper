import React from "react";
import ReactDOM from "react-dom";

function compare(a, b) {
	if (a.label < b.label) return -1;
	if (a.label > b.label) return 1;
	return 0;
}
class SelectableListItem extends React.Component {
	constructor(props) {
		super(props);

		this.onDragStart = this.onDragStart.bind(this);
		this.onDragEnd = this.onDragEnd.bind(this);
		this.toggleSelection = this.toggleSelection.bind(this);
	}
	onDragEnd(evt) {
		console.log("onDragEnd ");
	}
	onDragStart(evt) {
		console.log("onDragStart ", this.props);
		evt.persist();

		//evt.dataTransfer.setData("text/plain", this.props.row.toString());
		evt.dataTransfer.setData(
			"text/plain",
			JSON.stringify({
				item: this.props.item
			})
		);
		evt.dataTransfer.dropEffect = "move";
	}
	toggleSelection(evt) {
		if (this.props.hasOwnProperty("onSelect")) {
			this.props.onSelect(this.props.item);
		}
	}
	render() {
		return (
			<li
				key={this.props.item.value}
				data-value={this.props.item.value}
				draggable="true"
				onClick={this.toggleSelection}
				tabIndex="0"
				onDragStart={this.onDragStart}
				onDragEnd={this.onDragEnd}
				className={this.props.selected ? "selected-item" : "selectable-item"}
			>
				{this.props.item.label}
			</li>
		);
	}
}
class SelectableList extends React.Component {
	constructor(props) {
		super(props);
		this.toggleSelection = this.toggleSelection.bind(this);
		this.onDragEnter = this.onDragEnter.bind(this);
		this.onDragOver = this.onDragOver.bind(this);
		this.onDragLeave = this.onDragLeave.bind(this);
		this.onDrop = this.onDrop.bind(this);
		this.state = { items: this.props.items };
	}
	toggleSelection(evt) {
		let id = evt.value;
		let result = this.state.items.findIndex(function(item) {
			return item.value == id;
		});

		let newItems = this.state.items.slice();
		newItems[result].selected = !newItems[result].selected;

		if (this.props.onSelect) {
			this.props.onSelect(newItems[result]);
		}

		this.setState({ items: newItems });
	}
	componentWillReceiveProps(newProps) {
		this.setState({ items: newProps.items });
	}
	render() {
		const _this = this;
		const lStyle = {
			height: "100%",
			minHeight: 300,
			maxHeight: 600,
			width: "100%",
			border: "1px solid rgb(220,220,220)",
			overflowY: "auto"
		};

		return (
			<ul
				className="list-unstyled"
				style={lStyle}
				onDragEnter={_this.onDragEnter}
				onDragOver={_this.onDragOver}
				onDrop={_this.onDrop}
				onDragLeave={_this.onDragLeave}
			>
				{this.state.items.map(function(item) {
					return (
						<SelectableListItem
							key={item.value}
							item={item}
							selected={item.selected}
							onSelect={_this.toggleSelection}
						/>
					);
				})}
			</ul>
		);
	}
	onDragEnter(evt) {
		if (this.props.droppable) {
			evt.preventDefault();
			console.log("onDragEnter ", evt, evt.currentTarget);
		}
	}
	onDragOver(evt) {
		if (this.props.droppable) {
			evt.preventDefault();
			evt.dataTransfer.dropEffect = "move";
			this.setState({ dragState: "dragging" });
		}
	}

	// onDragEnd(evt) {
	// 	console.log("onDragEnd ", evt, evt.currentTarget);
	// 	this.setState({ dragState: null });
	// }
	onDragLeave(evt) {
		if (this.props.droppable) {
			evt.preventDefault();
			this.setState({ dragState: null });
		}
	}
	onDrop(evt) {
		if (this.props.droppable) {
			evt.preventDefault();
			evt.dataTransfer.dropEffect = "move";
			let data = JSON.parse(evt.dataTransfer.getData("text/plain"));
			let action = {
				action: "LIST_ITEM_DROP",
				data: data
			};
			console.log("onDrop ", action);
			// this.createLink(action);
			if (this.props.dispatcher) {
				this.props.dispatcher.trigger("LIST_ITEM_DROP", action);
			}
			if (this.props.hasOwnProperty("onDrop")) {
				this.props.onDrop(action);
			}
			this.setState({ dragState: null });
		}
	}
}

class ButtonBar extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		const barStyle = {
			width: "20%",
			display: "flex",
			flexDirection: "column",
			justifyContent: "center"
		};
		return (
			<div style={barStyle} className="list-mapper-button-bar">
				<button
					className="btn btn-lg btn-default"
					onClick={this.props.moveSelectedSourceToTarget}
				>
					<span className="glyphicon glyphicon-chevron-left" />{" "}
				</button>
				<button
					className="btn btn-lg  btn-default"
					onClick={this.props.moveSelectedTargetToSource}
				>
					<span className="glyphicon glyphicon-chevron-right" />{" "}
				</button>
				<button
					className="btn btn-lg  btn-default"
					onClick={this.props.moveAllToTarget}
				>
					<span className="glyphicon glyphicon-backward" />{" "}
				</button>
				<button
					className="btn btn-lg  btn-default"
					onClick={this.props.moveAllToSource}
				>
					<span className="glyphicon glyphicon-forward" />{" "}
				</button>
			</div>
		);
	}
}

export default class ListMapper extends React.Component {
	constructor(props) {
		super(props);

		this.selectedSources = [];
		this.selectedTargets = [];

		this.state = {
			selectedItems: props.data.targetList.sort(compare),
			selectableItems: props.data.sourceList.sort(compare)
		};
		this.moveSelectedFromSourceToTarget = this.moveSelectedFromSourceToTarget.bind(
			this
		);
		this.moveSelectedFromTargetToSource = this.moveSelectedFromTargetToSource.bind(
			this
		);
		this.sourceSelect = this.sourceSelect.bind(this);
		this.targetSelect = this.targetSelect.bind(this);
		this.moveToTarget = this.moveToTarget.bind(this);
		this.moveAllToTarget = this.moveAllToTarget.bind(this);
		this.moveAllToSource = this.moveAllToSource.bind(this);
	}
	moveAllToTarget() {
		this.setState({
			selectedItems: this.state.selectedItems
				.concat(this.state.selectableItems)
				.sort(compare),
			selectableItems: []
		});
	}
	moveAllToSource() {
		this.setState({
			selectableItems: this.state.selectedItems
				.concat(this.state.selectableItems)
				.sort(compare),
			selectedItems: []
		});
	}
	moveSelectedFromSourceToTarget() {
		console.log("moveSelecteFromSourToTarg ", this.selectedSources);
		let sources = this.selectedSources;
		let newSource = this.state.selectableItems.filter(function(item) {
			return sources.findIndex(function(source) {
				return source.value === item.value;
			}) >= 0
				? false
				: true;
		});

		let newTarget = this.state.selectedItems.concat(this.selectedSources);
		console.log("moveSelectedFromSourceToTarget ", newTarget, newSource);
		newSource.forEach(function(item) {
			item.selected = false;
		});

		newTarget.forEach(function(item) {
			item.selected = false;
		});
		this.selectedTargets = [];
		this.selectedSources = [];

		this.setState({
			selectedItems: newTarget.sort(compare),
			selectableItems: newSource.sort(compare)
		});
	}
	moveSelectedFromTargetToSource() {
		let targets = this.selectedTargets;
		let newTarget = this.state.selectedItems.filter(function(item) {
			return targets.findIndex(function(target) {
				return target.value === item.value;
			}) >= 0
				? false
				: true;
		});

		let newSource = this.state.selectableItems.concat(this.selectedTargets);

		newSource.forEach(function(item) {
			item.selected = false;
		});

		newTarget.forEach(function(item) {
			item.selected = false;
		});

		this.selectedTargets = [];
		this.selectedSources = [];

		this.setState({
			selectedItems: newTarget.sort(compare),
			selectableItems: newSource.sort(compare)
		});
	}
	sourceSelect(obj) {
		this.selectedSources = this.selectedSources.concat([obj]);
	}
	targetSelect(obj) {
		this.selectedTargets = this.selectedTargets.concat([obj]);
	}
	moveToTarget(evt) {
		console.log("onDrop==>moveToTarget ", evt);
		this.selectedSources.push(evt.data.item);
		this.moveSelectedFromSourceToTarget();
	}
	componentWillReceiveProps(newProps) {}
	render() {
		const containerStyle = {
			width: "100%",
			display: "flex",
			flexWrap: "wrap",
			justifyContent: "space-between",
			alignItems: "stretch"
		};
		return (
			<div style={containerStyle} className="list-mapper">
				<div style={{ width: "38%" }}>
					<h4>Linked</h4>
					<SelectableList
						items={this.state.selectedItems}
						onSelect={this.targetSelect}
						droppable={true}
						onDrop={this.moveToTarget}
					/>
				</div>
				<ButtonBar
					moveSelectedSourceToTarget={this.moveSelectedFromSourceToTarget}
					moveSelectedTargetToSource={this.moveSelectedFromTargetToSource}
					moveAllToTarget={this.moveAllToTarget}
					moveAllToSource={this.moveAllToSource}
				/>
				<div style={{ width: "38%" }}>
					<h4>Not Linked</h4>
					<SelectableList
						items={this.state.selectableItems}
						onSelect={this.sourceSelect}
						droppable={false}
					/>
				</div>
			</div>
		);
	}
}
