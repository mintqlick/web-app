// /api/upload-screenshot.js
import { createClient } from '@/utils/supabase/client';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parsing error:', err);
      return res.status(400).json({ error: 'Error parsing form data' });
    }

    const giver_id = fields.giver_id;
    const file = files.screenshot;

    if (!file || !giver_id) {
      return res.status(400).json({ error: 'Missing screenshot or giver_id' });
    }

    const supabase = createClient();

    const fileStream = fs.createReadStream(file.filepath);
    const filename = `${giver_id}-${Date.now()}-${file.originalFilename}`;

    // Upload image to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('screenshots')
      .upload(filename, fileStream, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return res.status(500).json({ error: 'Failed to upload screenshot' });
    }

    // Get the public URL of the image
    const { data: publicURLData } = supabase.storage
      .from('screenshots')
      .getPublicUrl(filename);

    const image_url = publicURLData.publicUrl;

    // Save image_url to the merge_givers table
    const { error: dbUpdateError } = await supabase
      .from('merge_givers')
      .update({ image_url })
      .eq('id', giver_id);

    if (dbUpdateError) {
      console.error('DB update error:', dbUpdateError);
      return res.status(500).json({ error: 'Failed to update giver image URL' });
    }

    return res.status(200).json({ success: true, giver_id });
  });
}
