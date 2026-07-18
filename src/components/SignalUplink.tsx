import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, ValidationError } from '@formspree/react';
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
  // Formspree: pass your form ID here
  const [fsState, fsHandleSubmit] = useForm('meeygojd');

  // local email state to keep the existing UX (placeholder, live edit)
  const [email, setEmail] = useState('');
  // local validation error (client-side pattern)
  const [localError, setLocalError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // client-side validate first (gives faster feedback)
    if (!EMAIL_PATTERN.test(email)) {
      setLocalError('INVALID FREQUENCY. RE-ENTER TO PROCEED.');
      return;
    }
    setLocalError(null);

    // forward the event to Formspree's handleSubmit which reads inputs by name
    // fsHandleSubmit will update fsState.submitting and fsState.succeeded
    return fsHandleSubmit(e);
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
            {fsState.succeeded ? (
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
                    }}
                    disabled={fsState.submitting}
                    aria-invalid={!!localError || (fsState.errors && fsState.errors.length > 0)}
                  />
                  <motion.button
                    type="submit"
                    className="signal-submit"
                    disabled={fsState.submitting}
                    whileHover={{
                      borderColor: 'rgba(212, 165, 116, 0.8)',
                      boxShadow: '0 0 20px rgba(212, 165, 116, 0.3)',
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {fsState.submitting ? 'TRANSMITTING...' : '◆ REQUEST ACCESS'}
                  </motion.button>
                </div>

                {/* client-side message first */}
                {localError && <p className="signal-error">{localError}</p>}

                {/* Formspree ValidationError will render field-level errors returned by Formspree */}
                <ValidationError prefix="EMAIL" field="email" errors={fsState.errors} />

                {/* If Formspree returns a non-field error, show a generic message */}
                {fsState.errors && fsState.errors.length > 0 && fsState.errors.some(e => !e.field) && (
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
