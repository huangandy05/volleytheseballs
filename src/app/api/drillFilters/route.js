import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

export async function GET() {
  const notion = new Client({
    auth: process.env.NOTION_API_KEY,
  });

  try {
    const categories = new Set();
    const tags = new Set();

    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
    });

    response.results.forEach((result) => {
      result.properties.Category.multi_select.forEach((category) => {
        categories.add(category.name);
      });

      result.properties.Tags.multi_select.forEach((tag) => {
        tags.add(tag.name);
      });
    });

    return NextResponse.json({
      levels: ["beginner", "intermediate", "advanced"],
      categories: Array.from(categories).sort(),
      tags: Array.from(tags).sort(),
    });
  } catch (error) {
    return NextResponse.json(error);
  }
}
