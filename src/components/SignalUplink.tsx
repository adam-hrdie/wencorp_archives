import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SignalUplink.css';

interface SignalUplinkProps {
  onBack: () => void;
}

const BENEFITS = [
  { label: 'EVENTS', detail: 'FIELD BROADCAST SCHEDULES' },
  { label: 'MEDIA', detail: 'ARCHIVE FOOTAGE + PHOTOGRAPHY' },
  { label: 'FREE DOWNLOADS', detail: 'UNRELEASED TRANSMISSIONS' },
  { label: 'RADIO SHOWS', detail: 'LIVE FEED ACCESS' },
  { label: 'AND MORE', detail: 'CLASSIFICATION PENDING' },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignalUplink({ onBack }: SignalUplinkProps) {
  // Use a plain fetch-based submission so the project builds without @formspree/react
  // The Formspree form id can be provided with REACT_APP_FORMSPREE_ID in the environment
  const FORMSPREE_ID = process.env.REACT_APP_FORMSPREE_ID || 'meeygojd';
  const FORMSPREE_ENDPOINT = `https://formspree.io/f/${FORMSPREE_ID}`;

  // local email state to keep the existing UX (placeholder, live edit)
  const [email, setEmail] = useState('');
  // client-side message first
  const [localError, setLocalError] = useState<string | null>(null);

  // replacement for the Formspree hook state
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [errors, setErrors] = useState<Array<{ field?: string; message: string }>>([]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // client-side validate first (gives faster feedback)
    if (!EMAIL_PATTERN.test(email)) {
      setLocalError('INVALID FREQUENCY. RE-ENTER TO PROCEED.');
      return;
    }
    setLocalError(null);
    setErrors([]);

    setSubmitting(true);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSucceeded(true);
        return;
      }

      // try to parse formspree-style error payloads
      let payload: any = null;
      try {
        payload = await res.json();
      } catch (err) {
        // ignore JSON parse errors
      }

      // Formspree v2 often returns { errors: [{ message, field? }] }
      if (payload && Array.isArray(payload.errors)) {
        const mapped = payload.errors.map((er: any) => ({ field: er.field, message: er.message || 'TRANSMISSION FAILED.' }));
        setErrors(mapped);
      } else {
        // generic fallback
        setErrors([{ message: 'TRANSMISSION FAILED. RETRY LATER.' }]);
      }
    } catch (err) {
      setErrors([{ message: 'TRANSMISSION FAILED. RETRY LATER.' }]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="signal-page">
      <div className="signal-backdrop" />

      <motion.button
        onClick={onBack}
        className="signal-return"
        whileHover={{
          borderColor: 'rgba(212, 165, 116, 0.8)',
          boxShadow: '0 0 15px rgba(212, 165, 116, 0.3)',
        }}
        whileTap={{ scale: 0.95 }}
      >
        ← RETURN
      </motion.button>

      <div className="signal-content">
        <motion.div
          className="signal-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <div className="signal-eyebrow">SEC: LEVEL_5_CLEARANCE // OPT-IN</div>
          <h1 className="signal-title">JOIN THE NETWORK</h1>
          <motion.p
            className="signal-subtitle"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            FOR THE CONTINUITY OF SIGNAL
          </motion.p>
        </motion.div>

        <motion.div
          className="signal-benefits"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          {BENEFITS.map((benefit, index) => (
            <motion.div
              key={benefit.label}
              className="benefit-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
            >
              <span className="benefit-diamond">◆</span>
              <span className="benefit-label">{benefit.label}</span>
              <span className="benefit-detail">{benefit.detail}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="signal-form-container"
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <AnimatePresence mode="wait">
            {succeeded ? (
              <motion.div
                key="success"
                className="signal-success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <span className="success-diamond">◆</span>
                <p className="success-text">
                  ACCESS GRANTED
                  <br />
                  YOU ARE NOW SUBSCRIBED TO THE NETWORK.
                  <br />
                  STAND BY FOR TRANSMISSIONS.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                className="signal-form"
                onSubmit={onSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <label className="signal-label" htmlFor="signal-email">
                  TRANSMISSION FREQUENCY (EMAIL)
                </label>
                <div className="signal-input-row">
                  <input
                    id="signal-email"
                    name="email"
                    type="email"
                    className="signal-input"
                    placeholder="you@frequency.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (localError) setLocalError(null);
                      if (errors.length) setErrors([]);
                    }}
                    disabled={submitting}
                    aria-invalid={!!localError || errors.length > 0}
                  />
                  <motion.button
                    type="submit"
                    className="signal-submit"
                    disabled={submitting}
                    whileHover={{
                      borderColor: 'rgba(212, 165, 116, 0.8)',
                      boxShadow: '0 0 20px rgba(212, 165, 116, 0.3)',
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {submitting ? 'TRANSMITTING...' : '◆ REQUEST ACCESS'}
                  </motion.button>
                </div>

                {/* client-side message first */}
                {localError && <p className="signal-error">{localError}</p>}

                {/* field-level errors returned by the endpoint */}
                {errors.filter(e => e.field === 'email').map((e, i) => (
                  <p key={`email-err-${i}`} className="signal-error">{e.message}</p>
                ))}

                {/* If the endpoint returns a non-field error, show a generic message */}
                {errors.length > 0 && errors.some(e => !e.field) && (
                  <p className="signal-error">TRANSMISSION FAILED. RETRY LATER.</p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
