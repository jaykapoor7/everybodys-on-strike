import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

async function checkpoint(page: Page, stage: number) {
  await page.goto("/");
  await page.evaluate(
    (n) =>
      localStorage.setItem(
        "everybodys-on-strike:v1",
        JSON.stringify({ stage: n, clicks: 3 }),
      ),
    stage,
  );
  await page.reload();
}

test("pointer drag works and touch holds ratify a drawn signature", async ({
  page,
}) => {
  await checkpoint(page, 7);
  const source = page.getByRole("button", { name: "Definitely not decaf" }),
    destination = page.getByRole("button", { name: "Bert’s break room" });
  await source.scrollIntoViewIfNeeded();
  const a = await source.boundingBox(),
    b = await destination.boundingBox();
  if (!a || !b) throw new Error("Missing coffee delivery");
  if (test.info().project.name === "mobile") {
    const client = await page.context().newCDPSession(page);
    const start = { x: a.x + a.width / 2, y: a.y + a.height / 2 },
      end = { x: b.x + b.width / 2, y: b.y + b.height / 2 };
    await client.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [start],
    });
    for (let i = 1; i <= 12; i++)
      await client.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [
          {
            x: start.x + ((end.x - start.x) * i) / 12,
            y: start.y + ((end.y - start.y) * i) / 12,
          },
        ],
      });
    await client.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
  } else {
    await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
    await page.mouse.down();
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 15 });
    await page.mouse.up();
  }
  await expect(
    page.getByRole("status").filter({ hasText: "Bert is ready" }),
  ).toBeVisible();
  await checkpoint(page, 20);
  const canvas = page.locator("canvas");
  await canvas.scrollIntoViewIfNeeded();
  const c = await canvas.boundingBox();
  if (!c) throw new Error("Missing signature");
  await page.mouse.move(c.x + 20, c.y + 30);
  await page.mouse.down();
  await page.mouse.move(c.x + 100, c.y + 50, { steps: 15 });
  await page.mouse.up();
  const stamp = page.getByRole("button", { name: "Hold to ratify agreement" });
  await expect(stamp).toBeEnabled();
  await stamp.scrollIntoViewIfNeeded();
  const r = await stamp.boundingBox();
  if (!r) throw new Error("Missing stamp");
  if (test.info().project.name === "mobile") {
    const client = await page.context().newCDPSession(page);
    await client.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: r.x + r.width / 2, y: r.y + r.height / 2 }],
    });
    await expect(page.locator(".ending-union")).toBeVisible({ timeout: 4500 });
    await client.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
  } else {
    await page.mouse.move(r.x + r.width / 2, r.y + r.height / 2);
    await page.mouse.down();
    await expect(page.locator(".ending-union")).toBeVisible({ timeout: 4500 });
    await page.mouse.up();
  }
});

test("cookie misses recover, silence interruption resets, and restart stays available", async ({
  page,
}) => {
  await checkpoint(page, 12);
  await page
    .getByRole("button", { name: "Accept all cookies", exact: true })
    .click();
  await page.getByRole("slider", { name: "Cookie plate position" }).fill("92");
  await expect(
    page.getByText("“A cookie has hit the floor. Five-second policy applies.”"),
  ).toBeVisible({ timeout: 5000 });
  for (const [i, position] of [26, 74, 49].entries()) {
    await page
      .getByRole("slider", { name: "Cookie plate position" })
      .fill(String(position));
    await expect(page.locator(".cookie-policy")).toContainText(
      `${i + 1} / 3 ACCEPTED`,
      { timeout: 5000 },
    );
  }
  await checkpoint(page, 11);
  await page.getByRole("button", { name: "Begin quiet break" }).click();
  await page
    .getByRole("button", { name: "NEW NOTIFICATION", exact: false })
    .click();
  await expect(
    page.getByText("We have reset the silence timer."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Restart game" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Restart the experience" }).click();
  await expect(page.locator(".corporate-hero")).toBeVisible();
});
