"use client";

import { ShowcaseWithStats } from "@/types/showcase";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ShowcaseLikeButton from "./ShowcaseLikeButton";
import Link from "next/link";
import { Card } from "../common";

interface ShowcaseCardProps {
  showcase: ShowcaseWithStats;
}

export default function ShowcaseCard({ showcase }: ShowcaseCardProps) {
  const characterImage = showcase.character_image;

  return (
    <Card className="group relative overflow-hidden rounded-2xl transition-all before:rounded-2xl">
      <Link href={`/showcase/${showcase.id}`}>
        <div className="relative h-[280px] overflow-hidden bg-[#15181D]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,#1e1b4b_0%,transparent_60%)] opacity-50" />

          {characterImage ? (
            <img
              src={characterImage}
              alt={showcase.character_name}
              className="relative z-10 h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
              style={{
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, black 10%, black 80%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, black 10%, black 80%, transparent 100%)",
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="h-8 w-8 animate-pulse rounded-full bg-white/10" />
            </div>
          )}

          <div className="absolute top-3 right-3 z-20">
            <ShowcaseLikeButton
              showcaseId={showcase.id}
              showcaseUserId={showcase.user_id}
              likeCount={showcase.like_count}
              isLiked={showcase.is_liked || false}
            />
          </div>

          <div className="absolute right-0 bottom-0 left-0 z-20 bg-gradient-to-t from-[#0c0d12] to-transparent p-4 pt-12">
            <p className="text-lg font-black text-white">
              {showcase.character_name}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{showcase.server_name}</span>
              {showcase.class_name && (
                <>
                  <span className="text-white/20">·</span>
                  <span className="text-purple-400">{showcase.class_name}</span>
                </>
              )}
              {showcase.item_level && (
                <>
                  <span className="text-white/20">·</span>
                  <span className="text-amber-400">{showcase.item_level}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>

      <div className="space-y-3 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border border-white/10">
            {showcase.discord_avatar ? (
              <AvatarImage
                src={showcase.discord_avatar}
                alt={showcase.discord_name || ""}
              />
            ) : (
              <AvatarFallback className="bg-indigo-600 text-xs font-bold text-white">
                {showcase.discord_name?.charAt(0)?.toUpperCase() || "?"}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <p className="text-sm font-bold text-white">
              {showcase.discord_name || "Unknown"}
            </p>
            <p className="text-[10px] text-gray-500">
              {new Date(showcase.created_at).toLocaleDateString("ko-KR")}
            </p>
          </div>
        </div>

        {showcase.description && (
          <p className="line-clamp-2 text-xs leading-relaxed text-gray-400">
            "{showcase.description}"
          </p>
        )}
      </div>
    </Card>
  );
}
