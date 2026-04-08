import React, { useState } from 'react';
import { Star, Send, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

interface FeedbackFormProps {
  doctorId: number;
  patientId: number;
  onSuccess?: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ doctorId, patientId, onSuccess }) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:8080/api/feedback', {
        patientId,
        doctorId,
        rating,
        comment
      });
      setIsSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="glass-card p-8 text-center animate-scale-in">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2 theme-text-primary">Thank You!</h3>
        <p className="theme-text-muted font-medium">Your feedback helps us improve our services.</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 w-full max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-6 theme-text-primary text-center px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">{t('feedback')}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center">
          <label className="text-sm theme-text-muted font-bold mb-2 uppercase tracking-wide">{t('rating')}</label>
          <div className="flex gap-2 p-4 bg-slate-500/5 rounded-2xl border border-slate-500/10">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-transform active:scale-90"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                <Star
                  className={`w-10 h-10 transition-colors ${
                    (hover || rating) >= star
                      ? 'fill-yellow-400 text-yellow-500'
                      : 'theme-text-muted opacity-20'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm theme-text-muted font-bold mb-2 block uppercase tracking-wide">{t('comment')}</label>
          <textarea
            className="w-full h-32 glass-panel p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none theme-text-primary font-medium dark:bg-black/20 bg-white"
            placeholder="Tell us about your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="w-full py-4 bg-emerald-500 text-slate-950 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
          ) : (
            <>
              <Send className="w-5 h-5" />
              {t('submit')}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
