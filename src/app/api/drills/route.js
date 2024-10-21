import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

export async function GET() {
  const notion = new Client({
    auth: process.env.NOTION_API_KEY,
  });

  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
    });

    const drills = [];

    response.results.forEach((result) => {
      const categories = [];
      const tags = [];

      result.properties.Category.multi_select.forEach((category) => {
        categories.push(category.name);
      });
      result.properties.Tags.multi_select.forEach((tag) => {
        tags.push(tag.name);
      });

      drills.push({
        id: result.id,
        name: result.properties.Name.title[0].plain_text,
        description: result.properties.Description.rich_text[0].text.content,
        category: categories,
        level: result.properties.Level.select.name,
        set_up: result.properties.Set_up.rich_text[0].text.content,
        instructions: result.properties.Instructions.rich_text[0].text.content,
        variations: result.properties.Variations.rich_text[0].text.content,
        tags: tags,
        minimum_people: result.properties.Minimum_people?.number,
        image_address:
          result.properties.Image_address.rich_text[0]?.text.content,
      });
    });

    return NextResponse.json(drills);
  } catch (error) {
    return NextResponse.json(error);
  }
}
