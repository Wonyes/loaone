import { createSupabaseServer } from "@/lib/supabase/server/server";
import { NextRequest, NextResponse } from "next/server";
import { ShowcaseUpsertRequest } from "@/types/showcase";

// GET: 내 showcase 목록 조회
export async function GET() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ showcases: [] });
  }

  const { data, error } = await supabase
    .from("avatar_showcase")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Showcase fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch showcases" }, { status: 500 });
  }

  return NextResponse.json({ showcases: data || [] });
}

// 캐릭터 이미지를 다운로드하여 Supabase Storage에 업로드 (스냅샷 보존)
async function uploadCharacterImage(
  supabase: Awaited<ReturnType<typeof createSupabaseServer>>,
  imageUrl: string,
  userId: string,
  characterName: string
): Promise<string | null> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return null;

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get("content-type") || "image/png";
    const ext = contentType.includes("jpeg") || contentType.includes("jpg") ? "jpg" : "png";
    const fileName = `${userId}/${characterName}_${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("showcase-images")
      .upload(fileName, buffer, {
        contentType,
        upsert: false,
      });

    if (uploadError) {
      console.error("Image upload error:", uploadError);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from("showcase-images")
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error("Image upload failed:", err);
    return null;
  }
}

// POST: 새 showcase 등록
export async function POST(request: NextRequest) {
  try {
    const body: ShowcaseUpsertRequest = await request.json();
    const { character_name, server_name, class_name, item_level, character_image, description, avatar_items } = body;

    if (!character_name) {
      return NextResponse.json(
        { error: "Character name required" },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServer();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 디스코드 정보 추출
    const discordName =
      user.user_metadata?.custom_claims?.global_name ||
      user.user_metadata?.full_name ||
      null;
    const discordAvatar = user.user_metadata?.avatar_url || null;

    // 캐릭터 이미지를 Storage에 업로드하여 스냅샷 보존
    let savedImageUrl: string | null = null;
    if (character_image) {
      savedImageUrl = await uploadCharacterImage(
        supabase,
        character_image,
        user.id,
        character_name
      );
      // Storage 업로드 실패 시 원본 URL 폴백
      if (!savedImageUrl) {
        savedImageUrl = character_image;
      }
    }

    const { data, error } = await supabase
      .from("avatar_showcase")
      .insert({
        user_id: user.id,
        character_name,
        server_name: server_name || null,
        class_name: class_name || null,
        item_level: item_level || null,
        character_image: savedImageUrl,
        description: description || null,
        discord_name: discordName,
        discord_avatar: discordAvatar,
        avatar_items: avatar_items || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Showcase insert error:", error);
      return NextResponse.json(
        { error: "Failed to save showcase" },
        { status: 500 }
      );
    }

    return NextResponse.json({ showcase: data });
  } catch (error) {
    console.error("Showcase error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
