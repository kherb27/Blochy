function linspace(a, b, n) {
    if (typeof n === 'undefined') {
        n = Math.max(Math.round(b - a) + 1, 1);
    }
    if (n < 2) {
      return n === 1 ? [a] : [];
    }
    var i,ret = Array(n);
    n--;
    for (i = n;i >= 0;i--) {
      ret[i] = (i * b + (n - i) * a) / n;
    }
    return ret;
  }

function meshgrid(a,b) {
    var n1 = a.length;
    var n2 = b.length;
    var arr1 = Array(n1);
    var arr2 = Array(n1);
    for (var i = 0; i < n2; i++) {
        arr1[i] = a;
    }
    for (var i = 0; i < n2; i++) {
        arr2[i] = Array(n1).fill(b[i]);
    }

    return [arr1,arr2];
}

// Print a 2D array
function print2d(arr) {
    var arrText='';
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr[i].length; j++) {
            arrText+=arr[i][j]+' ';
        }
        console.log(arrText);
        arrText='';
    }
}

// Basic assertion function
function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}

// Function for combining plotly arrays
function combine(a1,a2) {
    assert(a1.length === a2.length, "input arrays have different length");
    var new_arr = [];
    for (var i = 0; i < a1.length; i++) {
        if (!(a1[i] === null)) {
            new_arr.push(a1[i]);
        }
        else if (!(a2[i] === null)) {
            new_arr.push(a2[i]);
        }
    }    
    return new_arr;
}