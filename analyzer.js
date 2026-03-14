const patterns = require('./patterns');

function analyzeText(text) {
  if (!text) return { flagged: false, reason: null, patterns_matched: [] };

  const matchedPatterns = [];
  let reason = null;

  // Check simple regexes
  if (patterns.ssn.test(text)) matchedPatterns.push('ssn');
  if (patterns.creditCard.test(text)) matchedPatterns.push('credit-card');
  if (patterns.passport.test(text)) matchedPatterns.push('passport');
  if (patterns.iban.test(text)) matchedPatterns.push('iban');

  // Context-aware Email
  if (patterns.email.test(text)) {
    const lowerText = text.toLowerCase();
    if (patterns.keywords.contact.some(kw => lowerText.includes(kw))) {
      matchedPatterns.push('email');
    }
  }

  // Context-aware Phone
  if (patterns.phone.test(text)) {
    const lowerText = text.toLowerCase();
    if (patterns.keywords.contact.some(kw => lowerText.includes(kw))) {
      matchedPatterns.push('phone');
    }
  }

  // Israeli ID (TZ) with context
  if (patterns.israeliId.test(text)) {
    const lowerText = text.toLowerCase();
    if (patterns.keywords.id.some(kw => lowerText.includes(kw))) {
      matchedPatterns.push('israeli-id');
    }
  }

  // Address
  const lowerText = text.toLowerCase();
  if (patterns.keywords.address.some(kw => lowerText.includes(kw))) {
    matchedPatterns.push('address');
  }

  // Date of Birth
  if (patterns.keywords.dob.some(kw => lowerText.includes(kw))) {
    matchedPatterns.push('dob');
  }

  const flagged = matchedPatterns.length > 0;
  if (flagged) {
    reason = `Detected: ${matchedPatterns.join(', ')}`;
  }

  return { flagged, reason, patterns_matched: matchedPatterns };
}

module.exports = { analyzeText };
