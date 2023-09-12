import type { NextApiRequest, NextApiResponse } from "next";
import { createSupabase } from "@contacts/helpers/supabase";
const supabase = createSupabase(process.env.NEXT_PUBLIC_ANON_KEY!);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (
    req.method !== "POST" ||
    typeof req.body.col === "undefined" ||
    typeof req.body.row === "undefined" ||
    typeof req.body.value === "undefined"
  ) {
    res.status(400).json({ valid: false });
    return;
  }
  const { data, error } = await supabase
    .from("values")
    .upsert(
      {
        column: req.body.col,
        row: req.body.row,
        value: req.body.value,
      },
      {
        onConflict: "row,column",
      }
    )
    .select();

  res.status(200).json({ valid: true });
}
