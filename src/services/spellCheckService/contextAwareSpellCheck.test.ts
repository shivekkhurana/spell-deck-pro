import { describe, expect, it } from 'vitest';

import { contextAwareSpellCheck } from '@/services/spellCheckService/contextAwareSpellCheck';

describe('contextAwareSpellCheck', () => {
  it('should return early after browser spell check if no errors found', async () => {
    // Use text that likely has no errors (common words)
    // Note: Actual result depends on browser dictionary, so we just check structure
    const result = await contextAwareSpellCheck(
      'Context about medical terms',
      'the quick brown'
    );
    expect(result).toHaveProperty('stage');
    expect(result).toHaveProperty('hasErrors');
    expect(result).toHaveProperty('errors');
    // If browser spell check finds no errors, it should return early
    if (!result.hasErrors) {
      expect(result.stage).toBe('browser');
      expect(result.errors).toEqual([]);
    }
  });

  it('should return proper structure', async () => {
    const result = await contextAwareSpellCheck('Context', 'test');
    expect(result).toHaveProperty('stage');
    expect(result).toHaveProperty('hasErrors');
    expect(result).toHaveProperty('errors');
    expect(['browser', 'ai', 'none']).toContain(result.stage);
    expect(typeof result.hasErrors).toBe('boolean');
    expect(Array.isArray(result.errors)).toBe(true);
  });

  it('should handle empty note content', async () => {
    const result = await contextAwareSpellCheck('Context', '');
    expect(result.stage).toBe('browser');
    expect(result.hasErrors).toBe(false);
    expect(result.errors).toEqual([]);
  });

  it('should handle system prompt parameter', async () => {
    const systemPrompt = 'Medical context: hemoglobin, hematocrit';
    const result = await contextAwareSpellCheck(systemPrompt, 'test');
    expect(result).toHaveProperty('stage');
    expect(result).toHaveProperty('hasErrors');
    expect(result).toHaveProperty('errors');
  });
});

// Context-Aware Test Cases (10 Examples from plan)
// These are integration tests that would require actual AI API calls
// For now, we document the expected behavior

describe('Context-Aware Spell Check Test Cases', () => {
  describe('Test Case 1: Healthcare - Hemoglobin', () => {
    const slideContent = `Title: Blood Analysis Results
Content: The patient's hemoglobin levels were measured at 14.2 g/dL.
We need to monitor hematocrit and check for any signs of anemia.`;

    it('should have correct structure for misspelled medical terms', async () => {
      const note =
        'The hemogloben levels are concerning and we should check the hemotocrit.';
      const result = await contextAwareSpellCheck(slideContent, note);
      // Structure should be correct
      expect(result).toHaveProperty('stage');
      expect(result).toHaveProperty('hasErrors');
      expect(result).toHaveProperty('errors');
      // Note: Actual error detection requires AI integration
    });

    it('should handle correct medical terms with context', async () => {
      const note =
        'The hemoglobin levels are concerning and we should check the hematocrit.';
      const result = await contextAwareSpellCheck(slideContent, note);
      expect(result).toHaveProperty('stage');
      expect(result).toHaveProperty('hasErrors');
      expect(result).toHaveProperty('errors');
    });
  });

  describe('Test Case 2: Healthcare - Dyspnea', () => {
    const slideContent = `Title: Respiratory Assessment
Content: Patient presents with dyspnea and tachypnea.
We'll need to perform auscultation and check oxygen saturation.`;

    it('should process misspelled term', async () => {
      const note =
        "The patient is experiencing dispnea and tachypnea, so we'll do auscultation.";
      const result = await contextAwareSpellCheck(slideContent, note);
      expect(result).toHaveProperty('errors');
    });

    it('should process correct term with context', async () => {
      const note =
        "The patient is experiencing dyspnea and tachypnea, so we'll do auscultation.";
      const result = await contextAwareSpellCheck(slideContent, note);
      expect(result).toHaveProperty('errors');
    });
  });

  describe('Test Case 3: Accounting - Amortization', () => {
    const slideContent = `Title: Financial Statements Q3
Content: We need to calculate amortization for the new equipment.
The depreciation schedule shows a 5-year straight-line method.`;

    it('should process misspelled accounting terms', async () => {
      const note =
        'We need to account for amoritization and deprecation in our financials.';
      const result = await contextAwareSpellCheck(slideContent, note);
      expect(result).toHaveProperty('errors');
    });

    it('should process correct accounting terms with context', async () => {
      const note =
        'We need to account for amortization and depreciation in our financials.';
      const result = await contextAwareSpellCheck(slideContent, note);
      expect(result).toHaveProperty('errors');
    });
  });

  describe('Test Case 4: Accounting - Accrual', () => {
    const slideContent = `Title: Accrual Accounting Principles
Content: We use accrual basis accounting. All revenue is recognized
when earned, not when cash is received. Accounts receivable must be tracked.`;

    it('should process misspelled terms', async () => {
      const note =
        'We use acrual basis accounting and track accounts recievable.';
      const result = await contextAwareSpellCheck(slideContent, note);
      expect(result).toHaveProperty('errors');
    });

    it('should process correct terms with context', async () => {
      const note =
        'We use accrual basis accounting and track accounts receivable.';
      const result = await contextAwareSpellCheck(slideContent, note);
      expect(result).toHaveProperty('errors');
    });
  });

  describe('Test Case 5: Finance - Liquidity', () => {
    const slideContent = `Title: Portfolio Liquidity Analysis
Content: Our portfolio has strong liquidity ratios. We maintain
adequate cash reserves and monitor our leverage carefully.`;

    it('should process misspelled finance terms', async () => {
      const note =
        'We need to improve our liquity ratios and reduce our levrage.';
      const result = await contextAwareSpellCheck(slideContent, note);
      expect(result).toHaveProperty('errors');
    });

    it('should process correct finance terms with context', async () => {
      const note =
        'We need to improve our liquidity ratios and reduce our leverage.';
      const result = await contextAwareSpellCheck(slideContent, note);
      expect(result).toHaveProperty('errors');
    });
  });

  describe('Test Case 6: Finance - Derivative', () => {
    const slideContent = `Title: Derivatives Trading Strategy
Content: We use derivatives to hedge against market volatility.
Our options portfolio includes calls and puts with various strike prices.`;

    it('should process misspelled terms', async () => {
      const note =
        'We use derivitives to hedge and our options portfolo includes calls.';
      const result = await contextAwareSpellCheck(slideContent, note);
      expect(result).toHaveProperty('errors');
    });

    it('should process correct terms with context', async () => {
      const note =
        'We use derivatives to hedge and our options portfolio includes calls.';
      const result = await contextAwareSpellCheck(slideContent, note);
      expect(result).toHaveProperty('errors');
    });
  });

  describe('Test Case 7: Manufacturing - Tolerance', () => {
    const slideContent = `Title: Quality Control Specifications
Content: The parts must meet tight tolerances. We use calipers
to measure dimensions and ensure all components are within spec.`;

    it('should process misspelled term', async () => {
      const note =
        'The parts need to meet tight tolorances and we use calipers to measure.';
      const result = await contextAwareSpellCheck(slideContent, note);
      expect(result).toHaveProperty('errors');
    });

    it('should process correct term with context', async () => {
      const note =
        'The parts need to meet tight tolerances and we use calipers to measure.';
      const result = await contextAwareSpellCheck(slideContent, note);
      expect(result).toHaveProperty('errors');
    });
  });

  describe('Test Case 8: Manufacturing - CNC', () => {
    const slideContent = `Title: CNC Machining Process
Content: Our CNC machines use G-code programming. We've reduced
cycle time by 20% through optimization of feed rates and spindle speeds.`;

    it('should process misspelled term', async () => {
      const note =
        "Our CNC machines use G-code and we've optimized feed rates and spindel speeds.";
      const result = await contextAwareSpellCheck(slideContent, note);
      expect(result).toHaveProperty('errors');
    });

    it('should process correct term with context', async () => {
      const note =
        "Our CNC machines use G-code and we've optimized feed rates and spindle speeds.";
      const result = await contextAwareSpellCheck(slideContent, note);
      expect(result).toHaveProperty('errors');
    });
  });

  describe('Test Case 9: Marketing - Segmentation', () => {
    const slideContent = `Title: Customer Segmentation Strategy
Content: We've identified three key segments: millennials, Gen Z,
and baby boomers. Our personas help us target each demographic effectively.`;

    it('should process misspelled terms', async () => {
      const note =
        "We've identified key segements and created personas for each demografic.";
      const result = await contextAwareSpellCheck(slideContent, note);
      expect(result).toHaveProperty('errors');
    });

    it('should process correct terms with context', async () => {
      const note =
        "We've identified key segments and created personas for each demographic.";
      const result = await contextAwareSpellCheck(slideContent, note);
      expect(result).toHaveProperty('errors');
    });
  });

  describe('Test Case 10: Marketing - ROI and CTR', () => {
    const slideContent = `Title: Digital Marketing Performance
Content: Our ROI has improved by 35%. The CTR on our email campaigns
is 4.2%, and our conversion rate optimization efforts are paying off.`;

    it('should process misspelled term', async () => {
      const note =
        'Our ROI improved and the CTR on our email campains is great.';
      const result = await contextAwareSpellCheck(slideContent, note);
      expect(result).toHaveProperty('errors');
    });

    it('should process correct terms with context', async () => {
      const note =
        'Our ROI improved and the CTR on our email campaigns is great.';
      const result = await contextAwareSpellCheck(slideContent, note);
      expect(result).toHaveProperty('errors');
    });
  });
});
