import { Metadata } from "next";
import ShowcaseRegisterClient from "../../../components/character/ShowcaseRegisterClient";

export const metadata: Metadata = {
  title: "아바타 등록 - SHOWCASE",
  description: "대표 캐릭터를 등록하고 자랑해보세요",
};

export default function ShowcaseRegisterPage() {
  return <ShowcaseRegisterClient />;
}
