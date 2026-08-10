import { useState, useEffect } from 'react';
import api from '../../lib/api';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import {
  Sun, Sunset, Moon as MoonIcon, Star, Calendar,
  PlusCircle, Utensils, MessageSquare, Leaf,
  SmilePlus, Meh, Frown, Smile,
} from 'lucide-react';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const DAY_NAMES = { MONDAY: 'Monday', TUESDAY: 'Tuesday', WEDNESDAY: 'Wednesday', THURSDAY: 'Thursday', FRIDAY: 'Friday', SATURDAY: 'Saturday', SUNDAY: 'Sunday' };
const MEAL_ICONS = { BREAKFAST: Sun, LUNCH: Sunset, DINNER: MoonIcon };

const RATINGS = [
  { value: 1, label: 'Poor', icon: Frown, color: 'text-red-400' },
  { value: 2, label: 'Fair', icon: Meh, color: 'text-orange-400' },
  { value: 3, label: 'Average', icon: Meh, color: 'text-amber-400' },
  { value: 4, label: 'Good', icon: Smile, color: 'text-green-400' },
  { value: 5, label: 'Excellent', icon: SmilePlus, color: 'text-emerald-400' },
];

export default function MessPage() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [ratingSuccess, setRatingSuccess] = useState(false);
  const [ratingSummary, setRatingSummary] = useState([]);
  const [viewMode, setViewMode] = useState('today');

  useEffect(() => {
    Promise.all([
      api.get('/mess/menu'),
      api.get('/mess/ratings/summary'),
    ])
      .then(([menuRes, summaryRes]) => {
        setMenu(menuRes.data);
        setRatingSummary(summaryRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const todayIdx = new Date().getDay();
  const today = DAYS[todayIdx === 0 ? 6 : todayIdx - 1]; // JS: 0=Sun, we want Mon-indexed
  const currentHour = new Date().getHours();
  const currentMeal = currentHour < 10 ? 'BREAKFAST' : currentHour < 15 ? 'LUNCH' : 'DINNER';

  const todayMenu = menu.filter((m) => m.dayOfWeek === today);
  const avgRating = ratingSummary.length > 0
    ? (ratingSummary.reduce((sum, r) => sum + (r.averageRating || 0), 0) / ratingSummary.length).toFixed(1)
    : '0.0';

  const handleRateSubmit = async () => {
    if (!selectedRating) return;
    setRatingSubmitting(true);
    try {
      await api.post('/mess/ratings', {
        mealType: currentMeal,
        rating: selectedRating,
        comment: ratingComment,
      });
      setRatingSuccess(true);
      setSelectedRating(0);
      setRatingComment('');
      setTimeout(() => setRatingSuccess(false), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setRatingSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-slide-up">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Utensils size={16} className="text-primary-400" />
            <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">Live Mess Status</span>
          </div>
          <h1 className="text-3xl font-bold text-heading">Today's Mess Menu</h1>
          <p className="text-sub mt-1">
            Manage your weekly meal plans, provide feedback on food quality,
            and notify the warden if you'll be skipping a meal.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            icon={Calendar}
            onClick={() => setViewMode(viewMode === 'today' ? 'week' : 'today')}
          >
            {viewMode === 'today' ? 'Week View' : 'Today View'}
          </Button>
          <Button icon={PlusCircle}>
            Request Guest Coupon
          </Button>
        </div>
      </div>

      {viewMode === 'today' ? (
        /* Today View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {/* Rate Today's Meal */}
            <GlassCard className="animate-slide-up stagger-1">
              {ratingSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                  ✅ Rating submitted successfully!
                </div>
              )}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Star size={18} className="text-amber-400" />
                  <h3 className="text-lg font-bold text-heading">
                    Rate Today's {currentMeal.charAt(0) + currentMeal.slice(1).toLowerCase()}
                  </h3>
                </div>
                <span className="text-xs text-muted">
                  {currentMeal.charAt(0) + currentMeal.slice(1).toLowerCase()} ends in ~45m
                </span>
              </div>

              <div className="flex gap-3 mb-4">
                {RATINGS.map((r) => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.value}
                      onClick={() => setSelectedRating(r.value)}
                      className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-xl transition-all
                        ${selectedRating === r.value
                          ? 'bg-primary-600/15 border border-primary-500/30'
                          : 'glass-card hover:!bg-white/6'
                        }`}
                    >
                      <Icon size={28} className={selectedRating === r.value ? r.color : 'text-surface-300'} />
                      <span className={`text-xs font-medium ${selectedRating === r.value ? 'text-heading' : 'text-muted'}`}>
                        {r.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a comment about the taste, hygiene or service..."
                  className="glass-input px-4 py-2.5 text-sm flex-1"
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                />
                <Button
                  variant="ghost"
                  onClick={handleRateSubmit}
                  loading={ratingSubmitting}
                  disabled={!selectedRating}
                  className="!text-primary-400"
                >
                  Submit Feedback
                </Button>
              </div>
            </GlassCard>

            {/* Day Menu Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-up stagger-2">
              {[today, DAYS[(DAYS.indexOf(today) + 1) % 7]].map((day, dayIdx) => {
                const dayMenu = menu.filter((m) => m.dayOfWeek === day);
                const isToday = day === today;
                return (
                  <GlassCard key={day} className={`!p-0 overflow-hidden ${isToday ? '!border-primary-500/20' : ''}`}>
                    {/* Day header with gradient */}
                    <div className={`p-4 ${isToday ? 'bg-gradient-to-r from-primary-700/40 to-primary-800/20' : 'bg-white/3'}`}>
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-bold text-heading">{DAY_NAMES[day]}</h4>
                        {isToday && <span className="badge badge-info text-[0.6rem]">TODAY</span>}
                      </div>
                      <p className="text-xs text-muted mt-0.5">
                        {isToday ? 'Vegetarian Special' : 'Regular Menu'}
                      </p>
                    </div>
                    <div className="p-4 space-y-3">
                      {['BREAKFAST', 'LUNCH', 'DINNER'].map((meal) => {
                        const item = dayMenu.find((m) => m.mealType === meal);
                        const Icon = MEAL_ICONS[meal];
                        const isLive = isToday && meal === currentMeal;
                        return (
                          <div key={meal} className="flex gap-3">
                            <Icon size={14} className={isLive ? 'text-primary-400 mt-0.5' : 'text-surface-300 mt-0.5'} />
                            <div>
                              <p className={`text-xs font-semibold uppercase tracking-wider mb-0.5 ${
                                isLive ? 'text-primary-400' : 'text-muted'
                              }`}>
                                {meal} {isLive && '(LIVE)'}
                              </p>
                              <p className="text-sm text-sub leading-relaxed">
                                {item?.items || 'Not available'}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-5">
            {/* Skip Meal */}
            <GlassCard className="animate-slide-up stagger-2">
              <div className="flex items-center gap-2 mb-1">
                <Utensils size={16} className="text-surface-300" />
                <h3 className="text-base font-bold text-heading">Skip a Meal</h3>
              </div>
              <p className="text-xs text-muted mb-4">
                Help us reduce food wastage. Notify if you won't be eating.
              </p>
              {['Lunch Today', 'Dinner Today', 'Breakfast Tomorrow'].map((meal, i) => (
                <div key={meal} className="flex items-center justify-between py-3 border-b divider last:border-0">
                  <div className="flex items-center gap-3">
                    {[Sun, Sunset, MoonIcon][i] && (() => {
                      const MealIcon = [Sun, Sunset, Sun][i];
                      return <MealIcon size={16} className="text-surface-300" />;
                    })()}
                    <span className="text-sm font-medium text-heading">{meal}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-9 h-5 bg-surface-500/30 rounded-full peer peer-checked:bg-primary-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                  </label>
                </div>
              ))}
              <Button variant="ghost" className="w-full mt-3 !text-primary-400">
                Update Attendance
              </Button>
            </GlassCard>

            {/* Community Poll */}
            <GlassCard className="animate-slide-up stagger-3">
              <h3 className="text-base font-bold text-heading mb-1">Community Poll</h3>
              <p className="text-xs text-muted mb-4">Next Week's Sunday Special?</p>
              {[
                { name: 'Hyderabadi Biryani', pct: 64 },
                { name: 'Paneer Makhani Feast', pct: 22 },
                { name: 'Italian Pasta Night', pct: 14 },
              ].map((option) => (
                <div key={option.name} className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-heading">{option.name}</span>
                    <span className="text-sm font-bold text-heading">{option.pct}%</span>
                  </div>
                  <div className="w-full bg-surface-600/30 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${option.pct > 50 ? 'bg-primary-600' : option.pct > 20 ? 'bg-primary-500/60' : 'bg-red-500/50'}`}
                      style={{ width: `${option.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </GlassCard>

            {/* Impact Tracker */}
            <div className="rounded-2xl p-5 bg-gradient-to-br from-primary-700 to-primary-900 animate-slide-up stagger-4">
              <Leaf size={24} className="text-primary-300 mb-2" />
              <h4 className="text-lg font-bold text-white mb-1">Impact Tracker</h4>
              <p className="text-sm text-primary-200 mb-3">
                By skipping 12 meals this month, you saved 4.2kg of food waste.
              </p>
              <p className="text-2xl font-bold text-white">Level 4 Eco-Student</p>
            </div>
          </div>
        </div>
      ) : (
        /* Week View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-slide-up">
          {DAYS.map((day) => {
            const dayMenu = menu.filter((m) => m.dayOfWeek === day);
            const isToday = day === today;
            return (
              <GlassCard key={day} className={`${isToday ? '!border-primary-500/20 animate-pulse-glow' : ''}`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-heading">{DAY_NAMES[day]}</h4>
                  {isToday && <span className="badge badge-info text-[0.6rem]">TODAY</span>}
                </div>
                {['BREAKFAST', 'LUNCH', 'DINNER'].map((meal) => {
                  const item = dayMenu.find((m) => m.mealType === meal);
                  const Icon = MEAL_ICONS[meal];
                  return (
                    <div key={meal} className="mb-2.5 last:mb-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Icon size={12} className="text-muted" />
                        <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted">{meal}</span>
                      </div>
                      <p className="text-xs text-sub leading-relaxed pl-4">
                        {item?.items || 'N/A'}
                      </p>
                    </div>
                  );
                })}
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
