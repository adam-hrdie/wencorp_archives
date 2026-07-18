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

type Status = 'idle' | 'submitting' | 'success' | 'error';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignalUplink({ onBack }: SignalUplinkProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_PATTERN.test(email)) {
      setStatus('error');
      return;
    }

    setStatus('submitting');

    // TODO: wire to a real mailing list provider (Mailchimp / ConvertKit / Substack API).
    // This is a placeholder that simulates a successful subscription.
    setTimeout(() => {
      setStatus('success');
    }, 900);
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
            {status === 'success' ? (
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
                onSubmit={handleSubmit}
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
                    type="email"
                    className="signal-input"
                    placeholder="you@frequency.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === 'error') setStatus('idle');
                    }}
                    disabled={status === 'submitting'}
                  />
                  <motion.button
                    type="submit"
                    className="signal-submit"
                    disabled={status === 'submitting'}
                    whileHover={{
                      borderColor: 'rgba(212, 165, 116, 0.8)',
                      boxShadow: '0 0 20px rgba(212, 165, 116, 0.3)',
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {status === 'submitting' ? 'TRANSMITTING...' : '◆ REQUEST ACCESS'}
                  </motion.button>
                </div>
                {status === 'error' && (
                  <p className="signal-error">INVALID FREQUENCY. RE-ENTER TO PROCEED.</p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
