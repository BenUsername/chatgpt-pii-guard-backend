const { analyzeText } = require('./analyzer');

const testCases = [
  { text: "My SSN is 123-45-6789", expectedFlagged: true, expectedPatterns: ['ssn'] },
  { text: "Call me at 555-010-9999", expectedFlagged: false, expectedPatterns: [] }, // No context
  { text: "My phone number is 555-010-9999", expectedFlagged: true, expectedPatterns: ['phone'] },
  { text: "I live at 123 Main St", expectedFlagged: true, expectedPatterns: ['address'] },
  { text: "test@example.com", expectedFlagged: false, expectedPatterns: [] }, // No context
  { text: "Contact me at my email is john@doe.com", expectedFlagged: true, expectedPatterns: ['email'] },
  { text: "My card number is 4111 1111 1111 1111", expectedFlagged: true, expectedPatterns: ['credit-card'] },
  { text: "Born on 01/01/1990", expectedFlagged: true, expectedPatterns: ['dob'] },
  { text: "My TZ is 123456789", expectedFlagged: true, expectedPatterns: ['israeli-id'] },
  { text: "Hello, how are you?", expectedFlagged: false, expectedPatterns: [] }
];

console.log("Running PII pattern tests...");
let passed = 0;

testCases.forEach((tc, i) => {
  const result = analyzeText(tc.text);
  const matchedAll = tc.expectedPatterns.every(p => result.patterns_matched.includes(p)) && 
                     tc.expectedPatterns.length === result.patterns_matched.length;
  
  if (result.flagged === tc.expectedFlagged && matchedAll) {
    passed++;
    // console.log(`✓ Test ${i + 1} passed`);
  } else {
    console.log(`✗ Test ${i + 1} failed: "${tc.text}"`);
    console.log(`  Expected: flagged=${tc.expectedFlagged}, patterns=[${tc.expectedPatterns}]`);
    console.log(`  Actual:   flagged=${result.flagged}, patterns=[${result.patterns_matched}]`);
  }
});

console.log(`\nTests passed: ${passed}/${testCases.length}`);
if (passed === testCases.length) {
  console.log("All tests passed! 🎉");
} else {
  process.exit(1);
}
