QUnit.test( "getQueryParam returns the value of a query parameter", function( assert ) {
    // Mock window.location.search
    var originalSearch = window.location.search;
    window.location.search = "?goal=BULKING&foo=bar";

    assert.strictEqual(getQueryParam('goal'), 'BULKING');
    assert.strictEqual(getQueryParam('foo'), 'bar');
    assert.strictEqual(getQueryParam('nonexistent'), null);

    // Restore original window.location.search
    window.location.search = originalSearch;
});

QUnit.test( "calculateBMR calculates BMR correctly for a male with goal BULKING", function( assert ) {
    // Mock input values
    document.getElementById = function(id) {
        return { value: id === 'goal' ? 'BULKING' : 180 };
    };

    calculateBMR();

    assert.ok(document.getElementById('result').innerHTML.includes('Estimated BMR (Adjusted for Goal):'));
});