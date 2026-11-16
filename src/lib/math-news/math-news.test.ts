import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mathNewsStories } from "./data";

describe("Math News editorial catalog", () => {
  it("meets the reviewed audience coverage target", () => {
    assert.equal(mathNewsStories.length, 20);
    assert.deepEqual(
      Object.fromEntries(
        ["K-2", "grades-3-5", "grades-6-8", "grades-9-12", "college-adults"].map(
          (audience) => [
            audience,
            mathNewsStories.filter((story) => story.audience === audience).length,
          ],
        ),
      ),
      {
        "K-2": 2,
        "grades-3-5": 5,
        "grades-6-8": 5,
        "grades-9-12": 5,
        "college-adults": 3,
      },
    );
  });

  it("has unique stories and original publisher URLs", () => {
    assert.equal(new Set(mathNewsStories.map((story) => story.id)).size, 20);
    const canonicalUrls = mathNewsStories.map((story) => {
      const url = new URL(story.sourceUrl);
      url.hash = "";
      for (const key of [...url.searchParams.keys()]) {
        if (key.startsWith("utm_")) url.searchParams.delete(key);
      }
      return url.href;
    });
    assert.ok(canonicalUrls.every((url) => url.startsWith("https://")));
    assert.equal(new Set(canonicalUrls).size, 20);
  });

  it("records publication precision, review dates, and original summaries", () => {
    for (const story of mathNewsStories) {
      assert.match(story.publishedOn, /^\d{4}(?:-\d{2}(?:-\d{2})?)?$/);
      assert.match(story.reviewedOn, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(story.publisher.trim());
      assert.ok(story.title.trim());
      assert.ok(story.summary.trim());
      assert.ok(story.summary.trim().endsWith("."));
      assert.ok(story.summary.match(/[.!?](?=\s|$)/g)?.length);
      assert.ok(
        [4, 5].includes(story.summary.match(/[.!?](?=\s|$)/g)?.length ?? 0),
        `${story.id} summary must have four or five sentences`,
      );
    }
  });
});
