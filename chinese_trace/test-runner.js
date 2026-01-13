
const resultsDiv = document.getElementById('results');
let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
    if (condition) {
        resultsDiv.innerHTML += `<p style="color: green;">PASS: ${message}</p>`;
        testsPassed++;
    } else {
        resultsDiv.innerHTML += `<p style="color: red;">FAIL: ${message}</p>`;
        testsFailed++;
    }
}

// Mock jsPDF
const mockPdf = {
    internal: {
        pageSize: {
            getWidth: () => 210,
            getHeight: () => 297,
        }
    },
    setFont: () => {},
    setDrawColor: () => {},
    rect: () => {},
    setFontSize: () => {},
    setTextColor: () => {},
    text: () => {},
    addImage: () => {},
    addPage: () => {},
    save: () => {
        assert(true, "pdf.save() was called");
    },
};

window.jspdf = {
    jsPDF: function() {
        return mockPdf;
    }
};

// Load trace.js and run tests
const script = document.createElement('script');
script.src = 'resources/trace.js';
document.body.appendChild(script);

script.onload = () => {
    resultsDiv.innerHTML += '<h2>Tests for trace.js</h2>';

    // Test 1: updateFontStatus
    try {
        updateFontStatus();
        assert(true, "updateFontStatus() ran without error");
    } catch (e) {
        assert(false, `updateFontStatus() threw an error: ${e.message}`);
    }

    // Test 2: updateCharacterStatus
    try {
        updateCharacterStatus();
        assert(true, "updateCharacterStatus() ran without error");
    } catch (e) {
        assert(false, `updateCharacterStatus() threw an error: ${e.message}`);
    }

    // Test 3: drawPage
    try {
        const doc = new window.jspdf.jsPDF();
        drawPage(doc, ['你', '好']);
        assert(true, "drawPage() ran without error");
    } catch (e) {
        assert(false, `drawPage() threw an error: ${e.message}`);
    }

    // Test 4: generate-pdf button click
    try {
        document.getElementById('generate-pdf').click();
    } catch (e) {
        assert(false, `generate-pdf click threw an error: ${e.message}`);
    }

    resultsDiv.innerHTML += `<h3>Test Summary</h3>`;
    resultsDiv.innerHTML += `<p>Passed: ${testsPassed}</p>`;
    resultsDiv.innerHTML += `<p>Failed: ${testsFailed}</p>`;

};
