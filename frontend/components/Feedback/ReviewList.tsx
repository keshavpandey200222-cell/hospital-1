import React, { useEffect, useState } from 'react';
import { Star, MessageCircle, Calendar } from 'lucide-react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  patient: {
    user: {
      email: string;
    }
  }
}

interface ReviewListProps {
  doctorId: number;
}

const ReviewList: React.FC<ReviewListProps> = ({ doctorId }) => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/feedback/doctor/${doctorId}`);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) fetchReviews();
  }, [doctorId]);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="glass-card h-32 w-full opacity-50" />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="glass-card p-12 text-center border-dashed border-2 dark:border-white/10 border-slate-300 bg-slate-500/5">
        <MessageCircle className="w-16 h-16 mx-auto mb-4 text-emerald-500/50" />
        <p className="text-xl font-bold theme-text-primary">No reviews yet.</p>
        <p className="text-sm theme-text-muted mt-2 font-medium">Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
      {reviews.map((review) => (
        <div key={review.id} className="glass-card p-6 group hover:border-emerald-500/30 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-1.5 p-2 bg-slate-500/5 rounded-lg border border-slate-500/10">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    review.rating >= star ? 'fill-yellow-400 text-yellow-500' : 'theme-text-muted opacity-20'
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs theme-text-muted font-bold uppercase tracking-widest bg-slate-500/5 px-2 py-1 rounded">
              <Calendar className="w-3 h-3" />
              {new Date(review.createdAt).toLocaleDateString()}
            </div>
          </div>
          <p className="text-sm font-bold mb-2 theme-text-primary flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-[10px] text-emerald-500 uppercase">
              {review.patient.user.email[0]}
            </span>
            {review.patient.user.email.split('@')[0]}
          </p>
          <p className="text-sm theme-text-muted font-medium italic leading-relaxed bg-slate-500/5 p-3 rounded-lg border border-slate-500/5">
            &ldquo;{review.comment}&rdquo;
          </p>
        </div>
      ))}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${loading ? 'transparent' : (reviews.length > 0 ? 'rgba(0, 0, 0, 0.05)' : 'transparent')};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.4);
        }
      `}</style>
    </div>
  );
};

export default ReviewList;
