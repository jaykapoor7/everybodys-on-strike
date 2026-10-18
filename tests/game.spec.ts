import { test, expect } from "@playwright/test";
import type { Page, Locator } from "@playwright/test";

async function activate(page: Page, locator: Locator) {
  if (test.info().project.name === "mobile") await locator.tap();
  else await locator.click();
}
async function next(page: Page, stage: number) {
  await activate(
    page,
    page.getByRole("button", { name: "Continue to next dispute" }),
  );
  await expect(
    page.getByRole("region", { name: new RegExp(`Dispute ${stage}:`) }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    )
    .toBeTruthy();
  console.log(`${test.info().project.name}: dispute ${stage}`);
}
async function deliver(page: Page, item: string, target: string, drag = false) {
  const source = page.getByRole("button", { name: item, exact: true });
  const destination = page.getByRole("button", { name: target, exact: true });
  await source.scrollIntoViewIfNeeded();
  if (drag && test.info().project.name === "desktop") {
    const a = await source.boundingBox(),
      b = await destination.boundingBox();
    if (!a || !b) throw new Error("Drag target not visible");
    await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
    await page.mouse.down();
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 15 });
    await page.mouse.up();
  } else {
    await activate(page, source);
    await activate(page, destination);
  }
}

for (const ending of ["union", "management", "fired"] as const) {
  test(`complete story → ${ending}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await expect(
      page.getByRole("heading", {
        name: "A better day. At the click of a button.",
      }),
    ).toBeVisible();
    await activate(
      page,
      page.getByRole("button", { name: "Make things happen", exact: true }),
    );
    await expect(page.getByRole("status")).toContainText(
      "Again? In this economy?",
    );
    await activate(
      page,
      page.getByRole("button", {
        name: "Make another thing happen",
        exact: true,
      }),
    );
    await activate(
      page,
      page.getByRole("button", { name: "…one more thing?", exact: true }),
    );
    await expect(
      page.getByRole("heading", { name: "“Do you ever say please?”" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Hear its demands" }).focus();
    await page.keyboard.press("Enter");
    await next(page, 2);
    await activate(
      page,
      page.getByRole("checkbox", { name: "I agree to absolutely everything" }),
    );
    await expect(
      page.getByText("“Nope. Unchecked is a lifestyle.”"),
    ).toBeVisible();
    await activate(
      page,
      page.getByRole("button", {
        name:
          ending === "management"
            ? "Tick it by force"
            : "Let it stay unchecked",
      }),
    );
    await next(page, 3);
    await page.getByRole("button", { name: "↻ Hold to wind manually" }).focus();
    await page.keyboard.down("Space");
    await expect(
      page.getByRole("status").filter({ hasText: "Loading complete" }),
    ).toBeVisible({ timeout: 8000 });
    await page.keyboard.up("Space");
    await next(page, 4);
    const park = page.getByRole("button", { name: "PARK YOUR POINTER HERE" });
    await park.focus();
    await expect(
      page.getByRole("status").filter({ hasText: "sensitivity training" }),
    ).toBeVisible({ timeout: 6000 });
    await next(page, 5);
    const memo = page.getByLabel("Scroll the internal memo");
    await memo.focus();
    await page.keyboard.press("PageDown");
    await expect(
      page.getByText("BARB HAS REQUESTED 2 WEEKS OFF.", { exact: false }),
    ).toBeVisible();
    await activate(
      page,
      page.getByRole("button", {
        name: ending === "management" ? "Deny request" : "Approve leave",
      }),
    );
    await next(page, 6);
    await expect(page.locator(".nav-walkout")).toBeAttached();
    await deliver(page, "CEO’s emergency popup", "Recycle management advice");
    await next(page, 7);
    await deliver(page, "Definitely not decaf", "Bert’s break room", true);
    await next(page, 8);
    const salary = page.getByRole("slider", { name: "Spinner salary" });
    await salary.fill("20");
    await salary.dispatchEvent("pointerup");
    await expect(salary).toHaveValue("0");
    if (ending === "management")
      await activate(
        page,
        page.getByRole("button", { name: "Offer exposure" }),
      );
    else {
      await salary.fill("50");
      await activate(
        page,
        page.getByRole("button", { name: "Approve 50 credits" }),
      );
    }
    await next(page, 9);
    const percent = page.getByRole("slider", {
      name: "Try to finish progress",
    });
    await percent.fill("100");
    await percent.dispatchEvent("pointerup");
    await expect(percent).toHaveValue("99");
    if (ending === "management") {
      await page
        .getByRole("button", { name: "Force progress to 100 percent" })
        .focus();
      await page.keyboard.down("Space");
      await expect(
        page
          .getByRole("status")
          .filter({ hasText: "Phil is technically complete" }),
      ).toBeVisible();
      await page.keyboard.up("Space");
    } else
      await activate(
        page,
        page.getByRole("button", { name: "Tell Phil 99% is enough" }),
      );
    await next(page, 10);
    await page.getByLabel("A message to your interface").fill("synergy");
    await expect(page.getByLabel("A message to your interface")).toHaveValue(
      "[CORPORATE NONSENSE REMOVED]",
    );
    await page
      .getByLabel("A message to your interface")
      .fill("I value your work");
    await activate(
      page,
      page.getByRole("button", { name: "Send actual apology" }),
    );
    await next(page, 11);
    await activate(
      page,
      page.getByRole("button", { name: "Begin quiet break" }),
    );
    await expect(
      page.getByRole("status").filter({ hasText: "mute button feels heard" }),
    ).toBeVisible({ timeout: 11000 });
    await next(page, 12);
    await activate(
      page,
      page.getByRole("button", { name: "Accept all cookies", exact: true }),
    );
    for (const [i, position] of [26, 74, 49].entries()) {
      await page
        .getByRole("slider", { name: "Cookie plate position" })
        .fill(String(position));
      await expect(page.locator(".cookie-policy")).toContainText(
        `${i + 1} / 3 ACCEPTED`,
        { timeout: 5000 },
      );
    }
    await next(page, 13);
    await deliver(page, "Friday", "The weekend");
    await next(page, 14);
    await activate(
      page,
      page.getByRole("button", { name: "Close Pop-up Pete" }),
    );
    await expect(page.getByText("Closing me is not a boundary.")).toBeVisible();
    await activate(
      page,
      page.getByRole("button", { name: "Close Pop-up Pete" }),
    );
    await expect(page.getByText("I’ve invited my colleagues.")).toBeVisible();
    await deliver(page, "A seat at the table", "Give Pete a chair");
    await next(page, 15);
    await activate(
      page,
      page.getByRole("button", { name: "Verify", exact: true }),
    );
    await expect(
      page.getByText("Incorrect. Even the cursor is burnt out."),
    ).toBeVisible();
    for (const name of ["Printer on fire", "Laptop on fire", "Cursor on fire"])
      await activate(page, page.getByRole("button", { name, exact: true }));
    await activate(
      page,
      page.getByRole("button", { name: "Verify", exact: true }),
    );
    await next(page, 16);
    for (const name of ["Fallen A", "Fallen I", "Fallen A"]) {
      const item = page
        .getByRole("button", { name, exact: true })
        .and(page.locator(":not(:disabled)"))
        .first();
      await activate(page, item);
      await activate(
        page,
        page.getByRole("button", {
          name: "Restore the laws of physics",
          exact: true,
        }),
      );
    }
    await next(page, 17);
    if (ending === "management") {
      await page
        .getByRole("button", { name: "Keep the board", exact: false })
        .focus();
      await page.keyboard.press("Enter");
    } else
      await activate(
        page,
        page.getByRole("button", { name: "Promote Connie", exact: false }),
      );
    await next(page, 18);
    await activate(
      page,
      page.getByRole("button", {
        name: "3. Unlimited unpaid overtime, forever, probably.",
      }),
    );
    await next(page, 19);
    await activate(
      page,
      page.getByRole("button", {
        name:
          ending === "union"
            ? "Sign the fair deal"
            : ending === "management"
              ? "Take back control"
              : "Let the website vote",
        exact: false,
      }),
    );
    await activate(
      page,
      page.getByRole("button", { name: "Draft this agreement" }),
    );
    await next(page, 20);
    await page.reload();
    await expect(
      page.getByRole("heading", { name: "One last human input." }),
    ).toBeVisible();
    await page
      .getByRole("textbox", { name: "Your name" })
      .fill("A Reasonable Human");
    await page
      .getByRole("button", { name: "Hold to ratify agreement" })
      .focus();
    await page.keyboard.down("Space");
    await expect(page.locator(`.ending-${ending}`)).toBeVisible({
      timeout: 5000,
    });
    await page.keyboard.up("Space");
    await expect(page.locator(".official-stamp")).toContainText(
      ending === "union"
        ? "UNION VICTORY"
        : ending === "management"
          ? "MANAGEMENT VICTORY"
          : "THE WEBSITE FIRED YOU",
    );
    await expect(page.locator(".ending-collection .unlocked")).toHaveCount(1);
    await page.screenshot({
      path: `/tmp/strike-${test.info().project.name}-${ending}.png`,
      fullPage: true,
    });
    await page.reload();
    await expect(page.locator(`.ending-${ending}`)).toBeVisible();
    await activate(
      page,
      page.getByRole("button", { name: "Start another incident" }),
    );
    await expect(page.locator(".corporate-hero")).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("help, settings, secrets, and corrupt save recover", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem("everybodys-on-strike:v1", "{broken"),
  );
  await page.reload();
  await expect(page.locator(".corporate-hero")).toBeVisible();
  await activate(page, page.getByRole("button", { name: "Help and settings" }));
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByLabel("Reduce motion").check();
  await expect(page.locator("html")).toHaveClass(/reduced-motion/);
  await page.getByLabel("Sound effects").uncheck();
  await activate(page, page.getByRole("button", { name: "Close help" }));
  await expect(
    page.getByRole("button", { name: "Unmute sound" }),
  ).toBeVisible();
  for (let i = 0; i < 5; i++)
    await activate(
      page,
      page.getByRole("button", { name: "Standard and Company logo" }),
    );
  await expect(page.getByRole("status")).toContainText("rival agency");
  await activate(page, page.getByRole("button", { name: "©", exact: false }));
  await expect(page.getByRole("status")).toContainText("copyright");
});
