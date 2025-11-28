// src/services/supabase.ts

// Export a dummy client to prevent crashes
export const supabase = null;

export const reviewService = {
  // GET REVIEWS
  async getAllReviews() {
    try {
      const saved = localStorage.getItem('review_history');
      const data = saved ? JSON.parse(saved) : [];
      return { data: data, error: null };
    } catch (e) {
      return { data: [], error: null };
    }
  },

  // CREATE REVIEW
  async createReview(reviewData: any) {
    try {
      const saved = localStorage.getItem('review_history');
      const currentList = saved ? JSON.parse(saved) : [];

      const newItem = {
        ...reviewData,
        id: Date.now(),
        created_at: new Date().toISOString()
      };

      const newList = [newItem, ...currentList];
      localStorage.setItem('review_history', JSON.stringify(newList));
      
      return { data: newItem, error: null };
    } catch (e) {
      console.error(e);
      return { data: null, error: "Failed to save" };
    }
  }
};