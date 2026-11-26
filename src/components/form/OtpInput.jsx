/**
 * One box per digit for verification codes.
 *
 * - Typing moves to the next box; Backspace clears and moves back; arrow keys move between boxes.
 * - Pasting the code (in any box) fills every box. So does a phone's one-time-code autofill.
 * - Digits only. Phones show the number keypad.
 * - When the value is cleared (e.g. after a wrong code), focus goes back to the first box.
 *
 * Usage:
 *   <OtpInput length={6} value={code} onChange={setCode} onComplete={submit} invalid={!!error} />
 */
import { useEffect, useRef } from 'react';

const onlyDigits = (text) => text.replace(/\D/g, '');

const OtpInput = ({ length = 6, value, onChange, onComplete, invalid = false, disabled = false, autoFocus = true }) => {
  const inputs = useRef([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? '');

  const focusBox = (index) => {
    const box = inputs.current[Math.max(0, Math.min(index, length - 1))];
    box?.focus();
    box?.select();
  };

  // Focus the first box on load, and again whenever the code is cleared.
  useEffect(() => {
    if (autoFocus && value === '') focusBox(0);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Sets the code (digits only, no gaps) and submits when every box is filled. */
  const update = (next) => {
    const code = next.slice(0, length);
    onChange(code);
    if (code.length === length) onComplete?.(code);
  };

  /**
   * Writes digits starting at box `index` (typing, paste and autofill all go through here).
   * Typing into an empty box further along still fills the first empty box, so there are never gaps.
   */
  const fillFrom = (index, text) => {
    const incoming = onlyDigits(text);
    if (!incoming) return;
    const start = Math.min(index, value.length);
    focusBox(start + incoming.length); // move first, so onComplete can move focus somewhere else
    update(value.slice(0, start) + incoming + value.slice(start + incoming.length));
  };

  const handleChange = (index, event) => {
    const typed = event.target.value;
    // A phone's autofill can drop the whole code into one box.
    if (onlyDigits(typed).length > 1) fillFrom(0, typed);
    else fillFrom(index, typed.slice(-1));
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace') {
      event.preventDefault();
      if (digits[index]) {
        onChange(value.slice(0, index) + value.slice(index + 1)); // clear this box
      } else if (index > 0) {
        onChange(value.slice(0, index - 1) + value.slice(index)); // empty box: clear the one before
        focusBox(index - 1);
      }
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusBox(index - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusBox(index + 1);
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    fillFrom(0, event.clipboardData.getData('text'));
  };

  return (
    <div className="otp-input" role="group" aria-label={`${length}-digit code`}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputs.current[index] = el)}
          className={`otp-box ${digit ? 'is-filled' : ''} ${invalid ? 'is-invalid' : ''}`}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={index === 0 ? length : 1} // the first box accepts a full autofilled code
          value={digit}
          disabled={disabled}
          aria-label={`Digit ${index + 1} of ${length}`}
          aria-invalid={invalid}
          onChange={(event) => handleChange(index, event)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          onFocus={(event) => event.target.select()}
        />
      ))}
    </div>
  );
};

export default OtpInput;