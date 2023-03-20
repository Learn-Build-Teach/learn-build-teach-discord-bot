import { DiscussionQuestion } from '../types/types';
import { supabase } from '../utils/supabase';
export const DISCUSSION_QUESTION_TABLE_NAME = 'DiscussionQuestion';

export const getUnaskedQuestion = async () => {
  const { data, error } = await supabase
    .from(DISCUSSION_QUESTION_TABLE_NAME)
    .select()
    .order('createdAt', { ascending: false })
    .eq('asked', false)
    .limit(1);

  if (error) {
    throw error;
  }

  return data[0] as DiscussionQuestion;
};

export const markQuestionAsAsked = async (id: string) => {
  const { error } = await supabase
    .from(DISCUSSION_QUESTION_TABLE_NAME)
    .update({ asked: true })
    .eq('id', id);
  if (error) {
    throw error;
  }
};
