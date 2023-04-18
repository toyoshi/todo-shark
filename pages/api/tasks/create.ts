
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from "../../../lib/supabaseClient";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { title, estimated_time, status, user_id } = req.body;

  if (!title || !estimated_time || !status || !user_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
/*
  const token = req.headers.token as string;

  const { data: session, error: sessionError } = await supabase.auth.api.getUser(token);

  if (sessionError) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
*/
  const { data, error } = await supabase
    .from('tasks')
    .insert([{ title, estimated_time, status, user_id: user_id }])
    .single();

  if (error) {
    return res.status(500).json({ error: error });
  }

  res.status(200).json(data);
};
