(function() {
  var Point, fillInNulls, getGuides, getVirtualIndent, mergeCropped, statesAboveVisible, statesBelowVisible, statesInvisible, supportingIndents, toG, toGuides, uniq,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Point = require('atom').Point;

  toG = function(indents, begin, depth, cursorRows) {
    var gs, isActive, isStack, ptr, r, ref;
    ptr = begin;
    isActive = false;
    isStack = false;
    gs = [];
    while (ptr < indents.length && depth <= indents[ptr]) {
      if (depth < indents[ptr]) {
        r = toG(indents, ptr, depth + 1, cursorRows);
        if ((ref = r.guides[0]) != null ? ref.stack : void 0) {
          isStack = true;
        }
        Array.prototype.push.apply(gs, r.guides);
        ptr = r.ptr;
      } else {
        if (indexOf.call(cursorRows, ptr) >= 0) {
          isActive = true;
          isStack = true;
        }
        ptr++;
      }
    }
    if (depth !== 0) {
      gs.unshift({
        length: ptr - begin,
        point: new Point(begin, depth - 1),
        active: isActive,
        stack: isStack
      });
    }
    return {
      guides: gs,
      ptr: ptr
    };
  };

  fillInNulls = function(indents) {
    var res;
    res = indents.reduceRight(function(acc, cur) {
      if (cur === null) {
        acc.r.unshift(acc.i);
        return {
          r: acc.r,
          i: acc.i
        };
      } else {
        acc.r.unshift(cur);
        return {
          r: acc.r,
          i: cur
        };
      }
    }, {
      r: [],
      i: 0
    });
    return res.r;
  };

  toGuides = function(indents, cursorRows) {
    var ind;
    ind = fillInNulls(indents.map(function(i) {
      if (i === null) {
        return null;
      } else {
        return Math.floor(i);
      }
    }));
    return toG(ind, 0, 0, cursorRows).guides;
  };

  getVirtualIndent = function(getIndentFn, row, lastRow) {
    var i, ind, j, ref, ref1;
    for (i = j = ref = row, ref1 = lastRow; ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
      ind = getIndentFn(i);
      if (ind != null) {
        return ind;
      }
    }
    return 0;
  };

  uniq = function(values) {
    var j, last, len, newVals, v;
    newVals = [];
    last = null;
    for (j = 0, len = values.length; j < len; j++) {
      v = values[j];
      if (newVals.length === 0 || last !== v) {
        newVals.push(v);
      }
      last = v;
    }
    return newVals;
  };

  mergeCropped = function(guides, above, below, height) {
    guides.forEach(function(g) {
      var ref, ref1, ref2, ref3;
      if (g.point.row === 0) {
        if (ref = g.point.column, indexOf.call(above.active, ref) >= 0) {
          g.active = true;
        }
        if (ref1 = g.point.column, indexOf.call(above.stack, ref1) >= 0) {
          g.stack = true;
        }
      }
      if (height < g.point.row + g.length) {
        if (ref2 = g.point.column, indexOf.call(below.active, ref2) >= 0) {
          g.active = true;
        }
        if (ref3 = g.point.column, indexOf.call(below.stack, ref3) >= 0) {
          return g.stack = true;
        }
      }
    });
    return guides;
  };

  supportingIndents = function(visibleLast, lastRow, getIndentFn) {
    var count, indent, indents;
    if (getIndentFn(visibleLast) != null) {
      return [];
    }
    indents = [];
    count = visibleLast + 1;
    while (count <= lastRow) {
      indent = getIndentFn(count);
      indents.push(indent);
      if (indent != null) {
        break;
      }
      count++;
    }
    return indents;
  };

  getGuides = function(visibleFrom, visibleTo, lastRow, cursorRows, getIndentFn) {
    var above, below, guides, j, results, support, visibleIndents, visibleLast;
    visibleLast = Math.min(visibleTo, lastRow);
    visibleIndents = (function() {
      results = [];
      for (var j = visibleFrom; visibleFrom <= visibleLast ? j <= visibleLast : j >= visibleLast; visibleFrom <= visibleLast ? j++ : j--){ results.push(j); }
      return results;
    }).apply(this).map(getIndentFn);
    support = supportingIndents(visibleLast, lastRow, getIndentFn);
    guides = toGuides(visibleIndents.concat(support), cursorRows.map(function(c) {
      return c - visibleFrom;
    }));
    above = statesAboveVisible(cursorRows, visibleFrom - 1, getIndentFn, lastRow);
    below = statesBelowVisible(cursorRows, visibleLast + 1, getIndentFn, lastRow);
    return mergeCropped(guides, above, below, visibleLast - visibleFrom);
  };

  statesInvisible = function(cursorRows, start, getIndentFn, lastRow, isAbove) {
    var active, cursors, i, ind, j, k, l, len, m, minIndent, ref, ref1, results, results1, results2, stack, vind;
    if ((isAbove ? start < 0 : lastRow < start)) {
      return {
        stack: [],
        active: []
      };
    }
    cursors = isAbove ? uniq(cursorRows.filter(function(r) {
      return r <= start;
    }).sort(), true).reverse() : uniq(cursorRows.filter(function(r) {
      return start <= r;
    }).sort(), true);
    active = [];
    stack = [];
    minIndent = Number.MAX_VALUE;
    ref = (isAbove ? (function() {
      results = [];
      for (var k = start; start <= 0 ? k <= 0 : k >= 0; start <= 0 ? k++ : k--){ results.push(k); }
      return results;
    }).apply(this) : (function() {
      results1 = [];
      for (var l = start; start <= lastRow ? l <= lastRow : l >= lastRow; start <= lastRow ? l++ : l--){ results1.push(l); }
      return results1;
    }).apply(this));
    for (j = 0, len = ref.length; j < len; j++) {
      i = ref[j];
      ind = getIndentFn(i);
      if (ind != null) {
        minIndent = Math.min(minIndent, ind);
      }
      if (cursors.length === 0 || minIndent === 0) {
        break;
      }
      if (cursors[0] === i) {
        cursors.shift();
        vind = getVirtualIndent(getIndentFn, i, lastRow);
        minIndent = Math.min(minIndent, vind);
        if (vind === minIndent) {
          active.push(vind - 1);
        }
        if (stack.length === 0) {
          stack = (function() {
            results2 = [];
            for (var m = 0, ref1 = minIndent - 1; 0 <= ref1 ? m <= ref1 : m >= ref1; 0 <= ref1 ? m++ : m--){ results2.push(m); }
            return results2;
          }).apply(this);
        }
      }
    }
    return {
      stack: uniq(stack.sort()),
      active: uniq(active.sort())
    };
  };

  statesAboveVisible = function(cursorRows, start, getIndentFn, lastRow) {
    return statesInvisible(cursorRows, start, getIndentFn, lastRow, true);
  };

  statesBelowVisible = function(cursorRows, start, getIndentFn, lastRow) {
    return statesInvisible(cursorRows, start, getIndentFn, lastRow, false);
  };

  module.exports = {
    toGuides: toGuides,
    getGuides: getGuides,
    uniq: uniq,
    statesAboveVisible: statesAboveVisible,
    statesBelowVisible: statesBelowVisible
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXZpcmFqcy8uYXRvbS9wYWNrYWdlcy9pbmRlbnQtZ3VpZGUtaW1wcm92ZWQvbGliL2d1aWRlcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDhKQUFBO0lBQUE7O0VBQUMsUUFBUyxPQUFBLENBQVEsTUFBUjs7RUFFVixHQUFBLEdBQU0sU0FBQyxPQUFELEVBQVUsS0FBVixFQUFpQixLQUFqQixFQUF3QixVQUF4QjtBQUNKLFFBQUE7SUFBQSxHQUFBLEdBQU07SUFDTixRQUFBLEdBQVc7SUFDWCxPQUFBLEdBQVU7SUFFVixFQUFBLEdBQUs7QUFDTCxXQUFNLEdBQUEsR0FBTSxPQUFPLENBQUMsTUFBZCxJQUF3QixLQUFBLElBQVMsT0FBUSxDQUFBLEdBQUEsQ0FBL0M7TUFDRSxJQUFHLEtBQUEsR0FBUSxPQUFRLENBQUEsR0FBQSxDQUFuQjtRQUNFLENBQUEsR0FBSSxHQUFBLENBQUksT0FBSixFQUFhLEdBQWIsRUFBa0IsS0FBQSxHQUFRLENBQTFCLEVBQTZCLFVBQTdCO1FBQ0oscUNBQWMsQ0FBRSxjQUFoQjtVQUNFLE9BQUEsR0FBVSxLQURaOztRQUVBLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQXJCLENBQTJCLEVBQTNCLEVBQStCLENBQUMsQ0FBQyxNQUFqQztRQUNBLEdBQUEsR0FBTSxDQUFDLENBQUMsSUFMVjtPQUFBLE1BQUE7UUFPRSxJQUFHLGFBQU8sVUFBUCxFQUFBLEdBQUEsTUFBSDtVQUNFLFFBQUEsR0FBVztVQUNYLE9BQUEsR0FBVSxLQUZaOztRQUdBLEdBQUEsR0FWRjs7SUFERjtJQVlBLElBQU8sS0FBQSxLQUFTLENBQWhCO01BQ0UsRUFBRSxDQUFDLE9BQUgsQ0FDRTtRQUFBLE1BQUEsRUFBUSxHQUFBLEdBQU0sS0FBZDtRQUNBLEtBQUEsRUFBTyxJQUFJLEtBQUosQ0FBVSxLQUFWLEVBQWlCLEtBQUEsR0FBUSxDQUF6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Q0FBQyxHQUFMLENBQVMsU0FBVCxFQUFvQixJQUFwQjtRQUNaLElBQXlCLElBQUEsS0FBUSxTQUFqQztVQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVksSUFBQSxHQUFPLENBQW5CLEVBQUE7O1FBQ0EsSUFBOEIsS0FBSyxDQUFDLE1BQU4sS0FBZ0IsQ0FBOUM7VUFBQSxLQUFBLEdBQVE7Ozs7eUJBQVI7U0FMRjs7QUFKRjtXQVVBO01BQUEsS0FBQSxFQUFPLElBQUEsQ0FBSyxLQUFLLENBQUMsSUFBTixDQUFBLENBQUwsQ0FBUDtNQUNBLE1BQUEsRUFBUSxJQUFBLENBQUssTUFBTSxDQUFDLElBQVAsQ0FBQSxDQUFMLENBRFI7O0VBdkJnQjs7RUEwQmxCLGtCQUFBLEdBQXFCLFNBQUMsVUFBRCxFQUFhLEtBQWIsRUFBb0IsV0FBcEIsRUFBaUMsT0FBakM7V0FDbkIsZUFBQSxDQUFnQixVQUFoQixFQUE0QixLQUE1QixFQUFtQyxXQUFuQyxFQUFnRCxPQUFoRCxFQUF5RCxJQUF6RDtFQURtQjs7RUFHckIsa0JBQUEsR0FBcUIsU0FBQyxVQUFELEVBQWEsS0FBYixFQUFvQixXQUFwQixFQUFpQyxPQUFqQztXQUNuQixlQUFBLENBQWdCLFVBQWhCLEVBQTRCLEtBQTVCLEVBQW1DLFdBQW5DLEVBQWdELE9BQWhELEVBQXlELEtBQXpEO0VBRG1COztFQUdyQixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsUUFBQSxFQUFVLFFBQVY7SUFDQSxTQUFBLEVBQVcsU0FEWDtJQUVBLElBQUEsRUFBTSxJQUZOO0lBR0Esa0JBQUEsRUFBb0Isa0JBSHBCO0lBSUEsa0JBQUEsRUFBb0Isa0JBSnBCOztBQXJJRiIsInNvdXJjZXNDb250ZW50IjpbIntQb2ludH0gPSByZXF1aXJlICdhdG9tJ1xuXG50b0cgPSAoaW5kZW50cywgYmVnaW4sIGRlcHRoLCBjdXJzb3JSb3dzKSAtPlxuICBwdHIgPSBiZWdpblxuICBpc0FjdGl2ZSA9IGZhbHNlXG4gIGlzU3RhY2sgPSBmYWxzZVxuXG4gIGdzID0gW11cbiAgd2hpbGUgcHRyIDwgaW5kZW50cy5sZW5ndGggJiYgZGVwdGggPD0gaW5kZW50c1twdHJdXG4gICAgaWYgZGVwdGggPCBpbmRlbnRzW3B0cl1cbiAgICAgIHIgPSB0b0coaW5kZW50cywgcHRyLCBkZXB0aCArIDEsIGN1cnNvclJvd3MpXG4gICAgICBpZiByLmd1aWRlc1swXT8uc3RhY2tcbiAgICAgICAgaXNTdGFjayA9IHRydWVcbiAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KGdzLCByLmd1aWRlcylcbiAgICAgIHB0ciA9IHIucHRyXG4gICAgZWxzZVxuICAgICAgaWYgcHRyIGluIGN1cnNvclJvd3NcbiAgICAgICAgaXNBY3RpdmUgPSB0cnVlXG4gICAgICAgIGlzU3RhY2sgPSB0cnVlXG4gICAgICBwdHIrK1xuICB1bmxlc3MgZGVwdGggaXMgMFxuICAgIGdzLnVuc2hpZnRcbiAgICAgIGxlbmd0aDogcHRyIC0gYmVnaW5cbiAgICAgIHBvaW50OiBuZXcgUG9pbnQoYmVnaW4sIGRlcHRoIC0gMSlcbiAgICAgIGFjdGl2ZTogaXNBY3RpdmVcbiAgICAgIHN0YWNrOiBpc1N0YWNrXG4gIGd1aWRlczogZ3NcbiAgcHRyOiBwdHJcblxuZmlsbEluTnVsbHMgPSAoaW5kZW50cykgLT5cbiAgcmVzID0gaW5kZW50cy5yZWR1Y2VSaWdodChcbiAgICAoYWNjLCBjdXIpIC0+XG4gICAgICBpZiBjdXIgaXMgbnVsbFxuICAgICAgICBhY2Muci51bnNoaWZ0KGFjYy5pKVxuXG4gICAgICAgIHI6IGFjYy5yXG4gICAgICAgIGk6IGFjYy5pXG4gICAgICBlbHNlXG4gICAgICAgIGFjYy5yLnVuc2hpZnQoY3VyKVxuXG4gICAgICAgIHI6IGFjYy5yXG4gICAgICAgIGk6IGN1clxuICAgIHI6IFtdXG4gICAgaTogMClcbiAgcmVzLnJcblxudG9HdWlkZXMgPSAoaW5kZW50cywgY3Vyc29yUm93cykgLT5cbiAgaW5kID0gZmlsbEluTnVsbHMgaW5kZW50cy5tYXAgKGkpIC0+IGlmIGkgaXMgbnVsbCB0aGVuIG51bGwgZWxzZSBNYXRoLmZsb29yKGkpXG4gIHRvRyhpbmQsIDAsIDAsIGN1cnNvclJvd3MpLmd1aWRlc1xuXG5nZXRWaXJ0dWFsSW5kZW50ID0gKGdldEluZGVudEZuLCByb3csIGxhc3RSb3cpIC0+XG4gIGZvciBpIGluIFtyb3cuLmxhc3RSb3ddXG4gICAgaW5kID0gZ2V0SW5kZW50Rm4oaSlcbiAgICByZXR1cm4gaW5kIGlmIGluZD9cbiAgMFxuXG51bmlxID0gKHZhbHVlcykgLT5cbiAgbmV3VmFscyA9IFtdXG4gIGxhc3QgPSBudWxsXG4gIGZvciB2IGluIHZhbHVlc1xuICAgIGlmIG5ld1ZhbHMubGVuZ3RoIGlzIDAgb3IgbGFzdCBpc250IHZcbiAgICAgIG5ld1ZhbHMucHVzaCh2KVxuICAgIGxhc3QgPSB2XG4gIG5ld1ZhbHNcblxubWVyZ2VDcm9wcGVkID0gKGd1aWRlcywgYWJvdmUsIGJlbG93LCBoZWlnaHQpIC0+XG4gIGd1aWRlcy5mb3JFYWNoIChnKSAtPlxuICAgIGlmIGcucG9pbnQucm93IGlzIDBcbiAgICAgIGlmIGcucG9pbnQuY29sdW1uIGluIGFib3ZlLmFjdGl2ZVxuICAgICAgICBnLmFjdGl2ZSA9IHRydWVcbiAgICAgIGlmIGcucG9pbnQuY29sdW1uIGluIGFib3ZlLnN0YWNrXG4gICAgICAgIGcuc3RhY2sgPSB0cnVlXG4gICAgaWYgaGVpZ2h0IDwgZy5wb2ludC5yb3cgKyBnLmxlbmd0aFxuICAgICAgaWYgZy5wb2ludC5jb2x1bW4gaW4gYmVsb3cuYWN0aXZlXG4gICAgICAgIGcuYWN0aXZlID0gdHJ1ZVxuICAgICAgaWYgZy5wb2ludC5jb2x1bW4gaW4gYmVsb3cuc3RhY2tcbiAgICAgICAgZy5zdGFjayA9IHRydWVcbiAgZ3VpZGVzXG5cbnN1cHBvcnRpbmdJbmRlbnRzID0gKHZpc2libGVMYXN0LCBsYXN0Um93LCBnZXRJbmRlbnRGbikgLT5cbiAgcmV0dXJuIFtdIGlmIGdldEluZGVudEZuKHZpc2libGVMYXN0KT9cbiAgaW5kZW50cyA9IFtdXG4gIGNvdW50ID0gdmlzaWJsZUxhc3QgKyAxXG4gIHdoaWxlIGNvdW50IDw9IGxhc3RSb3dcbiAgICBpbmRlbnQgPSBnZXRJbmRlbnRGbihjb3VudClcbiAgICBpbmRlbnRzLnB1c2goaW5kZW50KVxuICAgIGJyZWFrIGlmIGluZGVudD9cbiAgICBjb3VudCsrXG4gIGluZGVudHNcblxuZ2V0R3VpZGVzID0gKHZpc2libGVGcm9tLCB2aXNpYmxlVG8sIGxhc3RSb3csIGN1cnNvclJvd3MsIGdldEluZGVudEZuKSAtPlxuICB2aXNpYmxlTGFzdCA9IE1hdGgubWluKHZpc2libGVUbywgbGFzdFJvdylcbiAgdmlzaWJsZUluZGVudHMgPSBbdmlzaWJsZUZyb20uLnZpc2libGVMYXN0XS5tYXAgZ2V0SW5kZW50Rm5cbiAgc3VwcG9ydCA9IHN1cHBvcnRpbmdJbmRlbnRzKHZpc2libGVMYXN0LCBsYXN0Um93LCBnZXRJbmRlbnRGbilcbiAgZ3VpZGVzID0gdG9HdWlkZXMoXG4gICAgdmlzaWJsZUluZGVudHMuY29uY2F0KHN1cHBvcnQpLCBjdXJzb3JSb3dzLm1hcCgoYykgLT4gYyAtIHZpc2libGVGcm9tKSlcbiAgYWJvdmUgPSBzdGF0ZXNBYm92ZVZpc2libGUoY3Vyc29yUm93cywgdmlzaWJsZUZyb20gLSAxLCBnZXRJbmRlbnRGbiwgbGFzdFJvdylcbiAgYmVsb3cgPSBzdGF0ZXNCZWxvd1Zpc2libGUoY3Vyc29yUm93cywgdmlzaWJsZUxhc3QgKyAxLCBnZXRJbmRlbnRGbiwgbGFzdFJvdylcbiAgbWVyZ2VDcm9wcGVkKGd1aWRlcywgYWJvdmUsIGJlbG93LCB2aXNpYmxlTGFzdCAtIHZpc2libGVGcm9tKVxuXG5zdGF0ZXNJbnZpc2libGUgPSAoY3Vyc29yUm93cywgc3RhcnQsIGdldEluZGVudEZuLCBsYXN0Um93LCBpc0Fib3ZlKSAtPlxuICBpZiAoaWYgaXNBYm92ZSB0aGVuIHN0YXJ0IDwgMCBlbHNlIGxhc3RSb3cgPCBzdGFydClcbiAgICByZXR1cm4ge1xuICAgICAgc3RhY2s6IFtdXG4gICAgICBhY3RpdmU6IFtdXG4gICAgfVxuICBjdXJzb3JzID0gaWYgaXNBYm92ZVxuICAgIHVuaXEoY3Vyc29yUm93cy5maWx0ZXIoKHIpIC0+IHIgPD0gc3RhcnQpLnNvcnQoKSwgdHJ1ZSkucmV2ZXJzZSgpXG4gIGVsc2VcbiAgICB1bmlxKGN1cnNvclJvd3MuZmlsdGVyKChyKSAtPiBzdGFydCA8PSByKS5zb3J0KCksIHRydWUpXG4gIGFjdGl2ZSA9IFtdXG4gIHN0YWNrID0gW11cbiAgbWluSW5kZW50ID0gTnVtYmVyLk1BWF9WQUxVRVxuICBmb3IgaSBpbiAoaWYgaXNBYm92ZSB0aGVuIFtzdGFydC4uMF0gZWxzZSBbc3RhcnQuLmxhc3RSb3ddKVxuICAgIGluZCA9IGdldEluZGVudEZuKGkpXG4gICAgbWluSW5kZW50ID0gTWF0aC5taW4obWluSW5kZW50LCBpbmQpIGlmIGluZD9cbiAgICBicmVhayBpZiBjdXJzb3JzLmxlbmd0aCBpcyAwIG9yIG1pbkluZGVudCBpcyAwXG4gICAgaWYgY3Vyc29yc1swXSBpcyBpXG4gICAgICBjdXJzb3JzLnNoaWZ0KClcbiAgICAgIHZpbmQgPSBnZXRWaXJ0dWFsSW5kZW50KGdldEluZGVudEZuLCBpLCBsYXN0Um93KVxuICAgICAgbWluSW5kZW50ID0gTWF0aC5taW4obWluSW5kZW50LCB2aW5kKVxuICAgICAgYWN0aXZlLnB1c2godmluZCAtIDEpIGlmIHZpbmQgaXMgbWluSW5kZW50XG4gICAgICBzdGFjayA9IFswLi5taW5JbmRlbnQgLSAxXSBpZiBzdGFjay5sZW5ndGggaXMgMFxuICBzdGFjazogdW5pcShzdGFjay5zb3J0KCkpXG4gIGFjdGl2ZTogdW5pcShhY3RpdmUuc29ydCgpKVxuXG5zdGF0ZXNBYm92ZVZpc2libGUgPSAoY3Vyc29yUm93cywgc3RhcnQsIGdldEluZGVudEZuLCBsYXN0Um93KSAtPlxuICBzdGF0ZXNJbnZpc2libGUoY3Vyc29yUm93cywgc3RhcnQsIGdldEluZGVudEZuLCBsYXN0Um93LCB0cnVlKVxuXG5zdGF0ZXNCZWxvd1Zpc2libGUgPSAoY3Vyc29yUm93cywgc3RhcnQsIGdldEluZGVudEZuLCBsYXN0Um93KSAtPlxuICBzdGF0ZXNJbnZpc2libGUoY3Vyc29yUm93cywgc3RhcnQsIGdldEluZGVudEZuLCBsYXN0Um93LCBmYWxzZSlcblxubW9kdWxlLmV4cG9ydHMgPVxuICB0b0d1aWRlczogdG9HdWlkZXNcbiAgZ2V0R3VpZGVzOiBnZXRHdWlkZXNcbiAgdW5pcTogdW5pcVxuICBzdGF0ZXNBYm92ZVZpc2libGU6IHN0YXRlc0Fib3ZlVmlzaWJsZVxuICBzdGF0ZXNCZWxvd1Zpc2libGU6IHN0YXRlc0JlbG93VmlzaWJsZVxuIl19
