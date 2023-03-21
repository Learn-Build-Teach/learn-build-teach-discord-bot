import { DiscussionQuestion, DiscussionQuestionInsert } from '../types/types';
import { supabase } from '../utils/supabase';
export const DISCUSSION_QUESTION_TABLE_NAME = 'DiscussionQuestion';

export const getUnaskedQuestion = async () => {
  const { data, error: idsError } = await supabase
    .from(DISCUSSION_QUESTION_TABLE_NAME)
    .select('id')
    .eq('asked', false);

  if (idsError || !data) {
    throw idsError;
  }

  const ids = data.map((d) => d.id);
  const random = Math.floor(Math.random() * ids.length);
  const randomId = ids[random];
  const { data: questions, error } = await supabase
    .from(DISCUSSION_QUESTION_TABLE_NAME)
    .select()
    .eq('id', randomId);

  if (error) {
    throw error;
  }
  return questions[0] as DiscussionQuestion;
};

export const saveDiscussionQuestions = async (
  questions: DiscussionQuestionInsert[]
) => {
  const { error } = await supabase
    .from(DISCUSSION_QUESTION_TABLE_NAME)
    .insert(questions);
  if (error) {
    throw error;
  }
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
