import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const reviewService = {
  async getAllReviews() {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
    return data || [];
  },

  async addReview(reviewText: string, tone: string, sentiment: string, issues: string[], reply: string) {
    const { data, error } = await supabase
      .from('reviews')
      .insert([
        {
          review_text: reviewText,
          tone,
          sentiment,
          issues,
          reply,
        },
      ])
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error saving review:', error);
      return null;
    }
    return data;
  },

  async deleteReview(id: string) {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting review:', error);
      return false;
    }
    return true;
  },

  async updateReview(id: string, reply: string) {
    const { error } = await supabase
      .from('reviews')
      .update({ reply })
      .eq('id', id);

    if (error) {
      console.error('Error updating review:', error);
      return false;
    }
    return true;
  },
};
