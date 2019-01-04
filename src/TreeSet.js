"use strict";
/**
 * Created by acastillo on 9/3/16.
 * Maintains an ordered set.
 * compatator is a comparator function.
 * collection is an optional array to populate the set.
 */

export default class TreeSet {
	constructor(compatator, collection) {
		this.length = 0;
		this.elements = [];
		if (compatator) {
			this.compatator = compatator;
		} else {
			this.compatator = function(a, b) {
				return a - b;
			};
		}
		if (collection) {
			for (var i = 0; i < collection.length; i++) {
				this.add(collection[i]);
			}
		}
	}

	_copy(collection) {
		var rval = new TreeSet(this.compatator);
		rval.elements = collection.concat();
		return rval;
	}

	toArray() {
		return this.elements.concat();
	}

	/**Applies callback function for each member of TreeSet returns "this" */
	forEach(callback) {
		for (var i = 0; i < this.elements.length; i++) {
			callback(this.elements[i], i);
		}
		return this;
	}

	/** Returns an array processed by the callback function. */
	map(callback) {
		var rval = [];
		for (var i = 0; i < this.elements.length; i++) {
			rval.push(callback(this.elements[i], i));
		}
		return rval;
	}

	/** Returns a new TreeSet including values in array argument. */
	concat(arr) {
		for (var i = 0; i < arr.length; i++) {
			this.add(arr[i]);
		}
		return this._copy(this.elements);
	}
	/** Returns an array of the elements for which predicate argument
	 * returns true.
	 */
	filter(predicate) {
		var rval = [];
		for (var i = 0; i < this.elements.length; i++) {
			if (predicate(this.elements[i], i)) {
				rval.push(this.elements[i]);
			}
		}
		return this._copy(rval);
	}
	/** Returns index of the element for which predicate returns true. */
	findIndex(predicate) {
		for (var i = 0; i < this.elements.length; i++) {
			if (predicate(this.elements[i], i)) {
				return i;
			}
		}
		return -1;
	}

	size() {
		return this.elements.length;
	}

	last() {
		return this.elements[this.length - 1];
	}

	first() {
		return this.elements[0];
	}

	isEmpty() {
		return this.size() === 0;
	}

	pollLast() {
		if (this.length > 0) {
			this.length--;
			return this.elements.splice(this.length, 1);
		}
		return null;
	}

	pollFirst() {
		if (this.length > 0) {
			this.length--;
			return this.elements.splice(0, 1);
		}
		return null;
	}

	has(element) {
		return this.binarySearch(element) < 0 ? false : true;
	}

	remove(element) {
		let index = this.binarySearch(element);
		if (index >= 0) {
			this.elements.splice(index, 1);
			this.length--;
		}
	}

	add(element) {
		let index = this.binarySearch(element);
		if (index < 0) {
			index = -index - 1;
		}
		this.elements.splice(index, 0, element);
		this.length++;
	}

	/**
	 * Performs a binary search of value in array
	 * @param {number[]} array - Array in which value will be searched. It must be sorted.
	 * @param {number} value - Value to search in array
	 * @return {number} If value is found, returns its index in array. Otherwise, returns a negative number indicating where the value should be inserted: -(index + 1)
	 */
	binarySearch(value) {
		var low = 0;
		var high = this.elements.length - 1;

		while (low <= high) {
			var mid = (low + high) >>> 1;
			var midValue = this.elements[mid];
			var cmp = this.compatator(midValue, value);
			if (cmp < 0) {
				low = mid + 1;
			} else if (cmp > 0) {
				high = mid - 1;
			} else {
				return mid;
			}
		}

		return -(low + 1);
	}
}
